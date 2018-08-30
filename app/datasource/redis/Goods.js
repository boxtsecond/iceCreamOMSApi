/*
 * @Author: dongyuxuan
 * @Date: 2017-10-30 18:28:11
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2018-01-15 11:46:55
 */
'use strict';

const models = require('../../models');
const eutil = require('eutil');

class redisGoodsModel {
  constructor(wclient, rclient) {
    this.wclient = wclient;
    this.rclient = rclient;
    this.valueTable = 'goods';// hash field：id，value：JSON字符串
    this.goodsSnTable = 'goods_sn';// hash field:goods_sn, value: JSON字符串
    this.discoverIndexTable = 'goods_discover_sort:'; // + sid + discoverId 发现索引表 value：goods_sn, score:score
    this.scoreIncrKey = 'discover_score:'; // + discoverId + sid 发现的分数自增键（排序用）
    this.goodsLimitTable = 'goods_limit';
    this.goodsTypeTable = 'goods_sn_type';
    this.goodsNumTable = 'goods_sn_goods_num';
    this.goodsSellNumTable = 'goods_sn_sell_num';
    this.goodsTotalSellPriceTable = 'goods_statistics:total_sell_price'; // + sid:report_type
    this.goodsTotalSellNumTable = 'goods_statistics:total_sell_num'; // + sid:report_type 购买次数
    this.goodsBillTable = 'goods_bill'; // + YYYYMMDD:sid:goods_sn
    this.goodsTipsTable = 'goods_tips'; // + :sid
  }
  
  getDiscoverIndexTable(discoverId, sid) {
    return this.discoverIndexTable + sid + ':' + discoverId;
  }
  
  getScoreIncrKey(discoverId, sid) {
    return this.scoreIncrKey + discoverId + ':' + sid;
  }
  
  incrScore(discoverId, sid) {
    return this.wclient.incr(this.getScoreIncrKey(discoverId, sid)).then(score => parseInt(score));
  }
  
  updateSort(sortName, score, value, action) {
    return (action
        ? this.wclient.zadd(sortName, score, value)
        : this.wclient.zrem(sortName, value)
    );
  }
  
  updateDiscoverIndexTable({discoverId, sid, goods_sn, action, score}) {
    return this.updateSort(this.getDiscoverIndexTable(discoverId, sid), score, goods_sn, action);
  }
  
  save(goods, discoverGoodsList) {
    if (!discoverGoodsList) discoverGoodsList = [];
    if (!(discoverGoodsList instanceof Array)) discoverGoodsList = [discoverGoodsList];
    return this.set(goods)
      .then(() => Promise.map(discoverGoodsList, discoverGoods => {
        return this.addDiscoverGoods(discoverGoods, goods.onsale_time);
      }))
      .then(res => goods);
  }
  
  delById(goodsid, discoverGoodsList) {
    return this.getById(goodsid).then(goods => {
      if (!goods) return false;
      goods.status = -1;
      return this.set(goods).then(() => Promise.map(discoverGoodsList, discoverGoods => {
        return this.remDiscoverGoods(discoverGoods);
      }))
        .then(res => goods);
    });
  }
  
  addDiscoverGoods(discoverGoods, onsale_time) {
    return this.updateDiscoverIndexTable({
      discoverId: discoverGoods.discover_displayid,
      sid: discoverGoods.sid,
      goods_sn: discoverGoods.goods_sn,
      action: true,
      score: discoverGoods.score
    }).then(() => {
      if(!onsale_time) return true;
      return this.setGoodsUpdateTips(discoverGoods.sid, onsale_time || discoverGoods.ctime, discoverGoods.discover_displayid, discoverGoods.goods_sn);
    });
  }
  
  remDiscoverGoods(discoverGoods) {
    return this.updateDiscoverIndexTable({
      discoverId: discoverGoods.discover_displayid,
      sid: discoverGoods.sid,
      goods_sn: discoverGoods.goods_sn,
      action: false
    }).then(() => {
      return this.delGoodsUpdateTips(discoverGoods.sid, discoverGoods.discover_displayid, discoverGoods.goods_sn);
    });
  }
  
  updateDiscoverGoods(updateAttributes, discoverGoodsIndex) {
    let sortName = this.getDiscoverIndexTable(discoverGoodsIndex.discover_displayid, discoverGoodsIndex.sid);
    return this.rclient.zscore(sortName, discoverGoodsIndex.goods_sn).then(score => {
      return this.wclient.pipeline()
        .zrem(sortName, discoverGoodsIndex.goods_sn)
        .zadd(sortName, score, updateAttributes.goods_sn)
        .exec();
    });
  }
  
  updateGoodsScores(discover_displayid, sid, goodsSnAndScoreList) {
    return Promise.map(goodsSnAndScoreList, goodsSnAndScore => {
      return this.addDiscoverGoods(Object.assign({discover_displayid, sid}, goodsSnAndScore), null);
    });
  }
  
  // 因为list中某一个goods_sn获取不到数据，需从mysql中获取，所以移到service层实现，
  // listByDiscoverIdAndSid (discoverId, sid, lastGoods_sn, lastScore, count) {
  //   return this.listGoodsIdsByDiscoverIdAndSid(discoverId, sid, lastGoods_sn, lastScore, count)
  //     .then(res => Promise.map(res, item => {return this.getByGoodsSn(item.goods_sn).then(goods => {
  //       if(goods) return Object.assign(item, {goods});
  //       });
  //     }))
  //     .then(res => {
  //       if (res && res.length) return res;
  //       else return [];
  //     });
  // }
  /**
   * 获取 商品信息 以及 商品在该discoverId的score
   * @param {*} discoverId
   * @param {*} sid
   * @param {*} lastGoods_sn
   * @param {*} lastScore
   * @param {*} count
   */
  listGoodsIdsByDiscoverIdAndSid(discoverId, sid, lastGoods_sn, lastScore, count) {
    let indexTable = this.getDiscoverIndexTable(discoverId, sid);
    return Promise.resolve().then(() => {
      if (lastGoods_sn == 0) return this.rclient.zrevrange(indexTable, 0, count - 1, 'WITHSCORES');
      return this.rclient.zrevrank(indexTable, lastGoods_sn)
        .then(lastRank => {
          if (lastRank || lastRank === 0) return this.rclient.zrevrange(indexTable, lastRank + 1, lastRank + count, 'WITHSCORES');
          return this.rclient.zrevrangebyscore(indexTable, '(' + lastScore, '+inf', 'WITHSCORES', 'LIMIT', 0, count);
        });
    }).then(res => res.reduce((result, item, index) => {
      // [value, score, value, score...] => [{value,score}, {value, score}]
      if (!(index % 2)) {
        result.push({
          goods_sn: item
        });
      } else {
        result[(index + 1) / 2 - 1].score = item;
      }
      return result;
    }, []));
  }
  
  set(goods) {
    if (!goods.id) return Promise.reject(new Error('goods need attibute id'));
    if (!goods.goods_sn) return Promise.reject(new Error('goods need attibute goods_sn'));
    return Promise.all([
      this.wclient.hset(this.valueTable, goods.id, JSON.stringify(goods)),
      this.wclient.hset(this.goodsSnTable, goods.goods_sn, JSON.stringify(goods)),
    ]);
  }
  
  getById(id) {
    return this.rclient.hget(this.valueTable, id)
      .then(res => {
        if (res) return JSON.parse(res);
        else return null;
      });
  }
  
  getByGoodsSn(goodsSn) {
    return this.rclient.hget(this.goodsSnTable, goodsSn)
      .then(res => {
        if (res) return JSON.parse(res);
        else return null;
      });
  }
  
  updateGoodsLimit(sid, uid, goods_sn, updateCount) {
    return this.wclient.hincrby(`${this.goodsLimitTable}:${sid}:${uid}`, goods_sn, updateCount);
  }
  
  setGoodsLimit(sid, uid, goods_sn, count) {
    return this.wclient.hset(`${this.goodsLimitTable}:${sid}:${uid}`, goods_sn, count);
  }
  
  getGoodsLimitCount(sid, uid, goods_sn) {
    return this.rclient.hget(`${this.goodsLimitTable}:${sid}:${uid}`, goods_sn)
      .then(count => {
        return count ? count.toString() : null;
      });
  }
  
  getGoodsTypeByGoodsSn(goods_sn) {
    return this.rclient.get(`${this.goodsTypeTable}:${goods_sn}`).then(goods => {
      if (goods) return JSON.parse(goods);
      else return null;
    });
  }
  
  setGoodsTypeByGoodsSn(goods_sn, goods) {
    return this.wclient.set(`${this.goodsTypeTable}:${goods_sn}`, JSON.stringify(goods));
  }
  
  updateRedisGoodsNumWithResultCheck(goods_sn, count) {
    return this.updateRedisGoodsNum(goods_sn, count)
      .then(result => {
        result = parseInt(result);
        if (result >= 0) return {success: true, count: result};
        return this.updateRedisGoodsNum(goods_sn, -count)
          .then(result => ({success: false, count: parseInt(result)}));
      });
  }
  
  updateRedisGoodsNum(goods_sn, count) {
    return this.wclient.hincrby(this.goodsNumTable, goods_sn, count);
  }
  
  updateRedisSellNum(goods_sn, count) {
    return this.wclient.hincrby(this.goodsSellNumTable, goods_sn, count);
  }
  
  existsRedisGoodsNum(goods_sn) {
    return this.rclient.hexists(this.goodsNumTable, goods_sn);
  }
  
  initRedisGoodsNum(goods) {
    if (!goods.goods_sn) throw new Error('goods need attibute goods_sn');
    if (!eutil.isNumber(goods.goods_num) || goods.goods_num < 0) throw new Error('goods goods_num must be a number & >=0');
    return this.existsRedisGoodsNum(goods.goods_sn).then(exists => {
      if (exists) return Promise.resolve(false);
      return this.updateRedisGoodsNum(goods.goods_sn, goods.goods_num).then(goods_num => true);
    });
  }
  
  delRedisGoodsNum(goods_sn) {
    return this.wclient.hdel(this.goodsNumTable, goods_sn);
  }
  
  getRedisGoodsNum(goods_sn) {
    return this.rclient.hget(this.goodsNumTable, goods_sn);
  }
  
  getRedisSellNum(goods_sn) {
    return this.rclient.hget(this.goodsSellNumTable, goods_sn);
  }
  
  updateGoodsStatistics(sid, report_type, pay_price, minus) {
    return this.wclient.hincrby(`${this.goodsTotalSellNumTable}:${sid}`, report_type, minus ? -1 : 1)
      .then(tatol_num => {
        if (pay_price != 0) {
          return this.wclient.hincrbyfloat(`${this.goodsTotalSellPriceTable}:${sid}`, report_type, pay_price);
        }
      });
  }
  
  updateGoodsBillPrice(sid, goods_sn, date, pay_price) {
    return this.wclient.hincrbyfloat(`${this.goodsBillTable}:total_price:${sid}:${date}`, goods_sn, pay_price);
  }
  
  updateGoodsBillNum(sid, goods_sn, date, sell_num) {
    return this.wclient.hincrby(`${this.goodsBillTable}:sell_num:${sid}:${date}`, goods_sn, sell_num);
  }
  
  getAllGoodsNum() {
    return this.rclient.hgetall(this.goodsNumTable)
      .then(goodsNum => {
        return this.rclient.hgetall(this.goodsSellNumTable).then(sellNum => {
          return {goodsNum, sellNum};
        });
      });
  }
  
  getGoodsStatistics(sidArr) {
    return Promise.all([
      this.getGoodsTotalSellNum(sidArr),
      this.getGoodsTotalSellPrice(sidArr)
    ]);
  }
  
  getGoodsTotalSellNum(sidArr) {
    return Promise.reduce(sidArr, (result, sid) => {
      return this.rclient.hgetall(`${this.goodsTotalSellNumTable}:${sid}`)
        .then(sell_num => {
          return Promise.map(Object.keys(sell_num), snum => {
            result[`${sid}_${snum}`] = sell_num[snum];
          });
        }).then(() => {
          return result;
        });
    }, {});
  }
  
  getGoodsTotalSellPrice(sidArr) {
    return Promise.reduce(sidArr, (result, sid) => {
      return this.rclient.hgetall(`${this.goodsTotalSellPriceTable}:${sid}`)
        .then(sell_price => {
          return Promise.map(Object.keys(sell_price), spr => {
            result[`${sid}_${spr}`] = sell_price[spr];
          });
        }).then(() => {
          return result;
        });
    }, {});
  }
  
  getGoodsBill(date, sidArr) {
    return Promise.reduce(sidArr, (result, sid) => {
      return this.rclient.hgetall(`${this.goodsBillTable}:sell_num:${sid}:${date}`)
        .then(sell_num => {
          return Promise.map(Object.keys(sell_num), snum => {
            result[snum] = sell_num[snum];
          });
        }).then(() => {
          return result;
        });
    }, {});
  }
  
  hmgetGoodsNum(goodsidArr) {
    return Promise.all([
      this.rclient.hmget(this.goodsNumTable, goodsidArr),
      this.rclient.hmget(this.goodsSellNumTable, goodsidArr)
    ]).then(num => {
      return Promise.reduce(goodsidArr, (result, goods, index) => {
        result[goods] = {};
        result[goods].goods_num = num[0][index];
        result[goods].sell_num = num[1][index];
        return result;
      }, {});
    });
  }
  
  getUpdateTipsNumByDiscoverId(sid, discoverId, ctime) {
    return this.rclient.zcount(`${this.goodsTipsTable}:${sid}:${discoverId}`, '(' + ctime, `${eutil.getTimeSeconds()}`).then(count => {
      if(count > 0) return {discoverId: discoverId, num: count};
      else return false;
    });
  }
  
  getUpdateTipsNumByRedisDiscoverIdArr(sid, uid, arr, resultArr) {
    let _resultArr = resultArr || [];
    console.log(_resultArr);
    if(arr && arr.length) {
      let paramsArr = arr.splice(0,2);
      return Promise.all([
        this.rclient.zcount(`${this.goodsTipsTable}:${sid}:${paramsArr[0]}`, '(' + paramsArr[1], '+inf'),
        this.setGoodsUpdateTipsForUser(sid, uid, paramsArr[0])
      ]).then(resArr => {
        if(resArr[0] > 0) _resultArr.push({discoverId: paramsArr[0], num: resArr[0]});
        return this.getUpdateTipsNumByRedisDiscoverIdArr(sid, uid, arr, _resultArr);
      });
    } else return _resultArr;
  }
  
  //Get the newest goods lastctime
  getGoodsLastctime(sid) {
    return this.rclient.zrevrange(`${this.goodsTipsTable}:${sid}`, 0, 1);
  }
  
  /**
   * 更新商品的创建时间
   * */
  setGoodsUpdateTips(sid, ctime, discoverId, goods_sn) {
    return this.wclient.zadd(`${this.goodsTipsTable}:${sid}:${discoverId}`, ctime, goods_sn);
  }
  
  /**
   * 删除商品的创建时间
   * */
  delGoodsUpdateTips(sid, discover_displayid, goods_sn) {
    return this.wclient.zrem(`${this.goodsTipsTable}:${sid}:${discover_displayid}`, goods_sn);
  }
  
  /**
   * 更新用户获取商品的时间
   * */
  setGoodsUpdateTipsForUser(sid, uid, discoverId) {
    return this.wclient.hset(`${this.goodsTipsTable}:${sid}:${uid}`, discoverId, eutil.getTimeSeconds());
  }
  
  getUserGoodsTipsTime(sid, uid) {
    return this.rclient.hgetall(`${this.goodsTipsTable}_user:${sid}:${uid}`);
  }
}

module.exports = redisGoodsModel;
