/**
 * Created by Bo on 2017/11/17.
 */

'use strict';

const models = require('../models');
const eutil = require('eutil');

class Digital {
  constructor(app, util) {
    this.mysqlDigitalModel = app.get("mysqlDigitalModel");
    this.redisDigitalModel = app.get("redisDigitalModel");
    this.knex = app.get("mysqlMaster");
    this.log = util.log;
    //预加载，将没用过的digital预加载到redis ---> 具体个数配置在config文件中
    this.digitalRedisNum = util.config.digital.digitalRedisNum || 100;
    this.getLimitNum = util.config.digital.getLimitNum || 600;
    this.getLimitTime = util.config.digital.getLimitTime || 5;
    this.initDigitalRedis();
  }
  
  getByGoodsId(goods_id) {
    return this.redisDigitalModel.getByGoodsId(goods_id)
      .then(goods => {
        if (goods) return goods;
        else return this.mysqlDigitalModel.getByGoodsId(goods_id).then(goods => {
          if (goods) {
            this.redisDigitalModel.setByGoodsId(goods);
            return goods;
          } else return null;
        });
      });
  }
  
  getByGoodsSn(goods_sn) {
    return this.redisDigitalModel.getByGoodsSn(goods_sn)
      .then(goods => {
        if (goods) return goods;
        else return this.mysqlDigitalModel.getByGoodsSn(goods_sn).then(goods => {
          if (goods) {
            this.redisDigitalModel.setByGoodsSn(goods);
            return goods;
          } else return null;
        });
      });
  }
  
  updateDigitalOwner(goods_id, uid, trx) {
    return this.mysqlDigitalModel.updateDigitalOwner(goods_id, uid, trx);
  }
  
  // 启动预加载
  initDigitalRedis() {
    return this.knex.transaction(trx => {
      return this.mysqlDigitalModel.getInitUnusedDigital(this.digitalRedisNum, trx)
        .then(digitals => {
          if (JSON.stringify(digitals) == '{}') return false;
          else return this.redisDigitalModel.setListUnusedDigital(digitals, 1);
        });
    }).then(() => {
      return this.log.info('Init Unused Digital Card to Redis');
    });
  }
  
  //only redis
  getUnusedDigital(goods_id, num) {
    return this.redisDigitalModel.getUnusedDigital(goods_id, num)
      .then(digital => {
        if (!digital || digital.num) return digital;
        else if (digital.length == num) return {digital: digital};
        else {
          let disArr = digital.map(d => {return JSON.stringify(d)});
          if(disArr.length) return this.redisDigitalModel.setUnusedDigital(goods_id, disArr).then(() => {
            return {num: String(digital.length)};
          });
          else return {num: digital.length.toString()};
        }
      });
    // .then(digital => {
    //   if(!digital || !digital.length) return this.mysqlDigitalModel.getUnusedDigital(goods_id, num);
    //   else if(digital.length == num) return {digital: digital};
    //   else {
    //     return this.mysqlDigitalModel.getUnusedDigital(goods_id, num-digital.length)
    //       .then(ds => {
    //         if(!ds) return null;
    //         else if(ds.digital && !ds.num) return {digital: ds.digital.concat(digital)};
    //         else return {num: ds.num+digital.length};
    //       });
    //   }
    // }).then(dig => {
    //   if(dig && !dig.num) {
    //     return this.deleteUnusedDigital(goods_id, num)
    //       .then(() => {
    //         return dig;
    //       });
    //   }else return dig;
    // });
  }
  
  /*
   * 1. goods_id 限制调度次数 默认值 5s/次
   * 2. 限制查询次数 默认值 最多600次
   * 3. 获取需要从 Mysql 中获取的个数
   * 4. 从 Mysql 中获取未使用的虚拟卡
   * */
  setUnusedDigital(goods_id, num) {
    return this.getUnusedDigitalLimit(goods_id).then(allow => {
      if (!allow) return Promise.reject('Frequent SetUnusedDigital Operation');
      else return this.getDigitalFromMysqlNum(goods_id).then(getDiNum => {
        if (getDiNum) return true;
        else return Promise.reject('Get Digital Card from Mysql times is enough');
      });
    }).then(() => {
      return this.redisDigitalModel.getRedisUnusedDigitalNum(goods_id).then(hasNum => {
        let needNum = num;
        if (hasNum + num > this.digitalRedisNum) needNum = this.digitalRedisNum - hasNum;
        if (needNum <= 0) return Promise.reject('Digital Card Num is already enough');
        else return needNum;
      });
    }).then((n) => {
      return this.knex.transaction(trx => {
        return this.mysqlDigitalModel.getUnusedDigital(goods_id, n, trx)
          .then(result => {
            if (result && result.length) {
              if (result.length < n) this.log.warn(`${result.length} Digital card into redis but Mysql is not enough`);
              let digital = result.map(d => {return JSON.stringify(d);});
              return this.redisDigitalModel.setUnusedDigital(goods_id, digital);
            } else Promise.reject("Can't find digital card");
          });
      });
    }).catch(err => {
      if (eutil.isString(err)) return this.log.warn(err);
      else return this.log.error(err);
    });
  }
  
  //获取轮询查询次数,超过一定次数持久化轮询限制并重置查询次数为0 ---> 不再查询
  getDigitalFromMysqlNum(goods_id) {
    return this.redisDigitalModel.getDigitalFromMysqlNum(goods_id)
      .then(num => {
        if (num > this.getLimitNum) {
          return Promise.all([
            this.redisDigitalModel.persistUnusedDigitalLimit(goods_id),
            this.redisDigitalModel.delDigitalFromMysqlNum(goods_id)
          ]).then(() => {
            return null;
          });
        } else return num;
      });
  }
  
  getUnusedDigitalLimit(goods_id) {
    return this.redisDigitalModel.getRedisUnusedDigitalLimit(goods_id)
      .then(o => {
        return this.redisDigitalModel.setRedisUnusedDigitalLimit(goods_id, this.getLimitTime).then(() => {
          return o - 1 <= 0;
        });
      });
  }
  
  addDigitalCard(cardArr) {
    return this.mysqlDigitalModel.addDigitalCard(cardArr).then(() => {
      let goods_id = (cardArr[0] && cardArr[0].goods_id) || cardArr.goods_id;
      if (goods_id) return this.setUnusedDigital(goods_id, cardArr.length);
    });
  }
  
  addDigitalCardByOSS(cardArr) {
    return Promise.resolve()
      .then(() => {
        if (eutil.isObject(cardArr)) cardArr = [cardArr];
        if (!eutil.isArray(cardArr)) return Promise.reject([4000, 'params type error']);
        return Promise.map(cardArr, card => {
          if (card && card.goods_id || card.id) return new models.digitalModel.Digital(card);
        });
      })
      .then((digiArr) => {
        if (!digiArr.length) return Promise.reject([4000, 'params error']);
        else return this.addDigitalCard(digiArr).then(di => {
          let goods_id = (digiArr[0] && digiArr[0].goods_id) || digiArr.goods_id;
          return Promise.all([
            this.redisDigitalModel.delDigitalFromMysqlNum(goods_id),
            this.redisDigitalModel.delRedisUnusedDigitalLimit(goods_id)
          ]);
        });
      })
      .then((di) => {
        if(!di) return Promise.reject([5001, 'Can not find goods_id', {}]);
        return [2000, 'success', {}];
      })
      .catch(function (res) {
        if (eutil.isArray(res)) return res;
        else {
          // console.log(res);
          return [500, 'error', res];
        }
      });
  }
  
}

module.exports = Digital;
