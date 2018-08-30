/*
 * @Author: dongyuxuan
 * @Date: 2017-11-07 18:03:41
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2018-01-31 11:52:21
 */
'use strict';

const models = require('../models');

class Goods {
  constructor(app, util) {
    this.mysqlGoodsModel = app.get("mysqlGoodsModel");
    this.redisGoodsModel = app.get("redisGoodsModel");
    // this.localGoodsModel = app.get("localGoodsModel");
    this.log = util.log;
    this.eutil = util.eutil;
    this.initRedisGoods();
  }
  
  // grpc服务
  save(goods, discoverGoodsList) {
    return Promise.resolve()
      .then(() => {
        try {
          goods = new models.goodsModel.goods(goods);
          if (!discoverGoodsList) discoverGoodsList = [];
          if (!(discoverGoodsList instanceof Array)) discoverGoodsList = [discoverGoodsList];
          return Promise.map(discoverGoodsList, item => {
            item.goods_sn = goods.goods_sn;
            let discoverGoods = new models.goodsModel.discoverGoods(item);
            return this.redisGoodsModel.incrScore(discoverGoods.discover_displayid, discoverGoods.sid)
              .then(score => Object.assign(discoverGoods, {score}));
          }).then(discoverGoodsList => ({goods, discoverGoodsList}));
        } catch (err) {
          return Promise.reject(err);
        }
      })
      // 先init redisGoodsNum，再save；防止在initGoodsNum前商品被下单；
      // 如果save失败，清理之前init的goodsNum，节省redis内存
      .then(data => {
        return this.redisGoodsModel.initRedisGoodsNum(data.goods).then(res => data);
      })
      .then(({goods, discoverGoodsList}) => {
        return this.mysqlGoodsModel.save(goods, discoverGoodsList)
          .then(({goods, discoverGoodsList, err}) => {
            if (err) {
              throw err;
            }
            return this.redisGoodsModel.save(goods, discoverGoodsList)
              .then(res => goods);
          })
          .catch(err => {
            this.log.error('商品添加失败', err);
            return this.redisGoodsModel.delRedisGoodsNum(goods.goods_sn)
              .then(() => Promise.reject(err));
          });
      });
      // .then(res => {
      //   // 清空本地缓存
      //   if (discoverGoodsList && discoverGoodsList.length) {
      //     discoverGoodsList.forEach(item => {
      //       this.localGoodsModel.publishClearGoodsList(item.discover_displayid, item.sid);
      //     });
      //   }
      //   return res;
      // });
  }
  
  // grpc服务 商品关联发现展示
  addDiscoverGoods(discoverGoods, onsale_time) {
    discoverGoods = new models.goodsModel.discoverGoods(discoverGoods);
    return this.redisGoodsModel.incrScore(discoverGoods.discover_displayid, discoverGoods.sid).then(score => {
      discoverGoods.score = score;
      return this.mysqlGoodsModel.addDiscoverGoods(discoverGoods)
        .then(discoverGoods => {
          return this.redisGoodsModel.addDiscoverGoods(discoverGoods, onsale_time);
        });
        // .then(res => this.localGoodsModel.publishClearGoodsList(discoverGoods.discover_displayid, discoverGoods.sid));
    });
  }
  // grpc服务 添加 频道关联发现展示
  addDiscoverGoodsWithChannelId (goods, discoverGoods) {
    if (!goods.channel_id) throw new Error('goods need param channel_id');
    if (goods.channel_id == -1) throw new Error('invalid channel_id');
    if (goods.type !== 2) throw new Error('type‘s value must be 2');
    return this.mysqlGoodsModel.find({
      fields: ['id', 'goods_sn'],
      where: {channel_id: goods.channel_id},
      limit: 1
    })
    .then(goodsList => {
      if (goodsList && goodsList.length) return goodsList[0];
      return this.save(goods);
    })
    .then(goods => {
      discoverGoods.goodsid = goods.id;
      discoverGoods.goods_sn = goods.goods_sn;
      return this.addDiscoverGoods(Object.assign(discoverGoods, {
        goodsid: goods.id,
        goods_sn: goods.goods_sn
      }), goods.onsale_time);
    });
  }
  /**
   * grpc服务 修改 频道关联发现展示 (暂时不需要，目前修改发现下的关联，只能输入 goods的id)
   * @param {Number} [updateAttributes.channel_id]
   * @param {String} [updateAttributes.type]
   * @param {Number} [discoverGoodsIndex.discover_displayid]
   * @param {Number} [discoverGoodsIndex.sid]
   * @param {String} [discoverGoodsIndex.goods_sn] 修改商品关联发现记录 的 原goods_sn
   */
  updateDiscoverGoodsWithChannelId (goods, discoverGoods) {
    if (!goods.channel_id) throw new Error('goods need param channel_id');
    if (goods.channel_id == -1) throw new Error('invalid channel_id');
    if (goods.type !== 2) throw new Error('type‘s value must be 2');
    return this.mysqlGoodsModel.find({
      fields: ['id', 'goods_sn'],
      where: {channel_id: goods.channel_id},
      limit: 1
    })
    .then(goodsList => {
      if (goodsList && goodsList.length) return goodsList[0];
      return this.save(goods);
    })
    .then(goods => {
      // discoverGoods.goodsid = goods.id;
      // discoverGoods.goods_sn = goods.goods_sn;
      // return this.addDiscoverGoods(Object.assign(discoverGoods, {
      //   goodsid: goods.id,
      //   goods_sn: goods.goods_sn
      // }));
      let updateAttributes = {goodsid: goods.id, goods_sn: goods.goods_sn};
      return this.updateDiscoverGoods(updateAttributes, discoverGoods);
    });
  }
  /**
   * grpc服务 修改商品关联发现展示
   * @param {Number} [updateAttributes.goodsid]
   * @param {String} [updateAttributes.goods_sn]
   * @param {Number} [discoverGoodsIndex.discover_displayid]
   * @param {Number} [discoverGoodsIndex.sid]
   * @param {String} [discoverGoodsIndex.goods_sn] 修改商品关联发现记录 的 原goods_sn
   */
  updateDiscoverGoods (updateAttributes, discoverGoodsIndex) {
    updateAttributes = new models.goodsModel.updateDiscoverGoodsAttributes(updateAttributes);
    discoverGoodsIndex = new models.goodsModel.discoverGoodsIndex(discoverGoodsIndex);
    if (Object.keys(updateAttributes).length <= 1) return null;//没有要修改的属性
    return this.mysqlGoodsModel.updateDiscoverGoods(updateAttributes, discoverGoodsIndex).then(mysqlResult => {
      if (mysqlResult !== 1) return null;
      return this.redisGoodsModel.updateDiscoverGoods(updateAttributes, discoverGoodsIndex)
        .then(redisResult => mysqlResult);
    });
  }
  
  // grpc服务 删除 发现展示和商品的关联
  remDiscoverGoods({discover_displayid, sid, goods_sn}) {
    return this.mysqlGoodsModel.remDiscoverGoods({discover_displayid, sid, goods_sn}).then(discoverGoods => {
      return this.redisGoodsModel.remDiscoverGoods({discover_displayid, sid, goods_sn});
        // .then(res => this.localGoodsModel.publishClearGoodsList(discover_displayid, sid));
    });
  }
  /**
   * grpc服务 修改商品的排序分值
   * @param {Array} [{goodsid, score}, {}]
   */
  updateGoodsScores (discover_displayid, sid, goodsSnAndScoreList) {
    if (!(goodsSnAndScoreList instanceof Array)) goodsSnAndScoreList = [goodsSnAndScoreList];
    return this.mysqlGoodsModel.updateGoodsScores(discover_displayid, sid, goodsSnAndScoreList)
      .then(res => this.redisGoodsModel.updateGoodsScores(discover_displayid, sid, goodsSnAndScoreList));
      // .then(res => this.localGoodsModel.publishClearGoodsList(discover_displayid, sid));
  }
  
  delById(goodsid) {
    return this.mysqlGoodsModel.listDiscoversByGoodsId(goodsid).then(discoverGoodsList => {
      return this.mysqlGoodsModel.delById(goodsid).then(res => {
        return this.redisGoodsModel.delById(goodsid, discoverGoodsList);
      });
    });
  }
  
  // grpc服务
  updateGoodsAttributes(updateGoodsAttributes, goodsid) {
    return this.findById(goodsid).then(oldGoods => {
      return this.updateGoodsByOld(oldGoods, updateGoodsAttributes, goodsid);
    });
  }
  
  updateGoodsAttributesByGoodsSn (updateGoodsAttributes, goods_sn) {
    return this.findByGoodsSn(goods_sn).then(oldGoods => {
      if(oldGoods) return this.updateGoodsByOld(oldGoods, updateGoodsAttributes, oldGoods.id);
    });
  }
  
  updateGoodsByOld(oldGoods, updateGoodsAttributes, goodsid) {
    if (!goodsid) throw new Error('goodsid不可为空');
    return Promise.resolve()
      .then(() => {
        updateGoodsAttributes = new models.goodsModel.updateGoodsAttributes(updateGoodsAttributes);
        let newGoods = Object.assign({}, oldGoods, updateGoodsAttributes);
        if (updateGoodsAttributes.hasOwnProperty('goods_num')) {
          let updateCount = updateGoodsAttributes.goods_num - oldGoods.goods_num;
          if (isNaN(updateCount)) throw new Error(`invaild goods_num:${updateGoodsAttributes.goods_num}`);
          return this.redisGoodsModel.updateRedisGoodsNumWithResultCheck(oldGoods.goods_sn, updateCount)
            .then(({success, count}) => {
              if (!success) throw new Error(`余量不足，目前余量：${count}`);
              return newGoods;
            });
        }
        return newGoods;
      })
      .then(newGoods => {
        return this.redisGoodsModel.save(newGoods);
      })
      .then(redisResult => {
        // 同步更新mysql
        return this.mysqlGoodsModel.updateById(updateGoodsAttributes, goodsid)
          .then(res => oldGoods);
      });
      // .then(res => {
      //   // 清空本地缓存
      //   this.localGoodsModel.publishClearAllGoodsList();
      //   return res;
      // });
  }
  
  findById(goodsid) {
    return this.redisGoodsModel.getById(goodsid)
      .then(redisResult => {
        if (redisResult) return redisResult;
        return this.mysqlGoodsModel.findById(goodsid)
          .then(mysqlResult => {
            if (!mysqlResult) return {};
            // 异步写回 redis
            this.redisGoodsModel.save(mysqlResult)
              .catch(err => this.log.error('goodsService-findById:redis写回失败', err));
            return mysqlResult;
          });
      })
      .then(goods => {
        if (!goods) return goods;
        return this.getRedisGoodsNum(goods.goods_sn).then(res => {
          if (!res) return goods;
          let {sell_num, goods_num} = res;
          if (sell_num) goods.sell_num = sell_num;
          if (goods_num) goods.goods_num = goods_num;
          return goods;
        });
      });
  }
  
  findByGoodsSn(goodsSn) {
    return this.redisGoodsModel.getByGoodsSn(goodsSn)
      .then(redisResult => {
        if (redisResult) return redisResult;
        return this.mysqlGoodsModel.findByGoodsSn(goodsSn)
          .then(mysqlResult => {
            if (!mysqlResult) return null;
            // 异步写回 redis
            this.redisGoodsModel.save(mysqlResult)
              .catch(err => this.log.error('goodsService-findByGoodsSn:redis写回失败', err));
            return mysqlResult;
          });
      })
      .then(goods => {
        if (!goods) return goods;
        return this.getRedisGoodsNum(goods.goods_sn).then(res => {
          // if (!res.sell_num || !res.goods_num) return goods;
          let {sell_num, goods_num} = res;
          if (sell_num) goods.sell_num = sell_num;
          if (goods_num) goods.goods_num = goods_num;
          return goods;
        });
      });
  }
  
  listByDiscoverId(discoverId, sid, lastGoods_sn, lastScore, count) {
    // 余量、销量更新时， 本地缓存没有维护，暂时撤掉本地缓存
    // if (lastGoods_sn == 0 && lastScore == 0) {
    //   let goodsList = this.localGoodsModel.getGoodsList(discoverId, sid);
    //   if (goodsList && goodsList.length >= count) return Promise.resolve(goodsList.slice(0, count));
    //   this.log.info('from redis, localcache goods.length:', goodsList && goodsList.length);
    // }
    return this.redisGoodsModel.listGoodsIdsByDiscoverIdAndSid(discoverId, sid, lastGoods_sn, lastScore, count)
      .then(redisResult => {
        if (!redisResult || !redisResult.length) return [];
        return Promise.map(redisResult, item => { //redis 没有对应goods_sn,从mysql中取
          return this.findByGoodsSn(item.goods_sn).then(goods => {
            if (goods) return {
              score: item.score,
              goods: goods
            };
            else return {goods: null, score: null};
          });
        });
      })
      .then(goodsList => {
        if (goodsList && goodsList.length) return goodsList;
        // 翻页时 redis取不到数据，直接返回空数组
        if (lastGoods_sn && lastGoods_sn != '0') return [];
        // 第一页，redis取不到数据，从mysql中取所有数据异步写回redis并返回第一页数据
        return this.mysqlGoodsModel.listByDiscoverId(discoverId, sid, 30)  // 目前每一类商品最多存30个
          .then(mysqlResult => {
            if (!mysqlResult) return [];
            return Promise.map(mysqlResult, mysqlResultItem => {
              let discoverGoods = mysqlResultItem.discoverGoods;
              let goods = mysqlResultItem.goods;
              // 异步写回 redis
              this.redisGoodsModel.save(goods, discoverGoods)
                .catch(err => this.log.error('goodsService-listByDiscoverId:redis写回失败', err));
              return {
                score: discoverGoods.score,
                goods: goods
              };
            }).then(goodsList => goodsList.slice(0, count));
          });
      });
      // .then(goodsList => {
      //   // 写入本地缓存
      //   if (lastGoods_sn == 0 && lastScore == 0) this.localGoodsModel.publishUpdateGoodsList(discoverId, sid, goodsList);
      //   return goodsList;
      // });
  }
  
  updateGoodsCount(goods_sn, count, trx) {
    return this.mysqlGoodsModel.updateGoodsCount(goods_sn, count, trx);
  }
  
  getGoodsLimit(sid, uid, goods_sn) {
    return this.redisGoodsModel.getGoodsLimitCount(sid, uid, goods_sn)
      .then(count => {
        if (count) return count;
        else return this.mysqlGoodsModel.getGoodsLimitCount(sid, uid, goods_sn)
          .then(ct => {
            if (ct) return ct;
            else return null;
          });
      });
  }
  
  //only mysql
  updateGoodsLimit(sid, uid, goods_sn, updateCount, trx) {
    return this.mysqlGoodsModel.updateGoodsLimit(sid, uid, goods_sn, updateCount, trx);
  }
  
  //only redis
  setGoodsLimit(sid, uid, goods_sn, count) {
    return this.redisGoodsModel.setGoodsLimit(sid, uid, goods_sn, count);
  }
  
  //only redis
  updateRedisGoodsLimit(sid, uid, goods_sn, updateCount) {
    return this.redisGoodsModel.updateGoodsLimit(sid, uid, goods_sn, updateCount)
      .then(count => {
        if (count == updateCount) {
          return this.mysqlGoodsModel.getGoodsLimitCount(sid, uid, goods_sn).then(cn => {
            if(cn != 0) return this.redisGoodsModel.updateGoodsLimit(sid, uid, goods_sn, Number(cn));
            else return count;
          });
        } else return count;
      });
  }
  
  getGoodsLimitCount(sid, uid, goods_sn) {
    return this.redisGoodsModel.getGoodsLimitCount(sid, uid, goods_sn)
      .then(count => {
        if (count) return Number(count);
        else return this.mysqlGoodsModel.getGoodsLimitCount(sid, uid, goods_sn)
          .then(c => {
            if (c) return Number(c);
            else return 0;
          });
      });
  }
  
  getGoodsTypeByGoodsSn(goods_sn) {
    return this.redisGoodsModel.getGoodsTypeByGoodsSn(goods_sn)
      .then(type => {
        if (type) return type;
        else return this.mysqlGoodsModel.findByGoodsSn(goods_sn)
          .then(c => {
            if (!c) return null;
            else {
              this.redisGoodsModel.setGoodsTypeByGoodsSn(goods_sn, c.type);
              return c.type;
            }
          });
      });
  }
  
  //only redis ---> sell_num and goods_num
  updateRedisGoodsNum(goods_sn, count) {
    return this.redisGoodsModel.updateRedisGoodsNum(goods_sn, -1*count)
      .then(goods_num => {
        if (goods_num == -1*count) {
          return this.redisGoodsModel.getRedisSellNum(goods_sn)
            .then(sell_num => {
              if(sell_num && sell_num > 0) return {goods_num: goods_num.toString()};
              else return this.mysqlGoodsModel.findByGoodsSn(goods_sn).then(goods => {
                return {goods: goods && goods.status == 1 ? goods : false};
              });
            });
        }
        else return {goods_num: goods_num.toString()};
      })
      .then(data => {
        if (!data.goods && !data.goods_num) return false;
        else if (!data.goods && data.goods_num) return this.redisGoodsModel.updateRedisSellNum(goods_sn, count).then(() => {
          return data.goods_num - 0;
        });
        else return Promise.all([
            this.redisGoodsModel.updateRedisGoodsNum(goods_sn, Number(data.goods.goods_num)),
            this.redisGoodsModel.updateRedisSellNum(goods_sn, Number(data.goods.sell_num)+Number(count))
          ]).then((num) => {
            return num[0];
          });
      });
  }
  
  getRedisGoodsNum(goods_sn) {
    return this.redisGoodsModel.getRedisGoodsNum(goods_sn).then(goods_num => {
      return this.redisGoodsModel.getRedisSellNum(goods_sn).then(sell_num => {
        return {sell_num, goods_num};
      });
    });
  }
  
  /**
   * 检查商品是否允许被购买，并且分类
   */
  filterGoodsAndClassify(goods) {
    return Promise.resolve()
      .then(() => {
        let now = this.eutil.getTimeSeconds();
        if(goods.status != 1 || !goods.is_sale) return {err: [4512, 'Can not find workable goods', {}]};
        //上下架时间
        if (goods.onsale_time - now > 0 || goods.offsale_time - now < 0) return {err: [4521, 'out of the sale time', {onsale_time: goods.onsale_time, offsale_time: goods.offsale_time}]};
  
        //活动时间
        if(goods.onactivities_time && goods.offactivities_time) {
          if(goods.onactivities_time - now > 0 || goods.offactivities_time - now < 0) return {err: [4521, 'out of the activity time', {onactivities_time: goods.onactivities_time, offactivities_time: goods.offactivities_time}]};
        }
        //抢购时间
        if (goods.onflashsale_time && goods.offflashsale_time) {
          if (goods.onflashsale_time - now > 0 || goods.offflashsale_time - now < 0) return {
            err: [4521, 'out of the dispaly flash time', {
              onflashsale_time: goods.onflashsale_time,
              offflashsale_time: goods.offflashsale_time
            }]
          };
        }
  
        let buylimit = goods.buylimit == -1 ? false : goods.buylimit;
        if (!goods.is_digital || (goods.type == 2 && goods.is_digital)) {
          return {goodsType: 'Mall', needAddress: (goods.type == 2 && goods.is_digital) ? 0 : 1,
            limit: {buylimit, goods_num: goods.goods_num}};
        } else return {goodsType: 'Digital', limit: {buylimit, goods_num: goods.goods_num}};
      });
  }
  
  //检查商品是否够用 sid, uid, goods_sn, updateCount
  checkGoodsCount(sid, uid, goods_sn, updateCount, limit) {
    return Promise.resolve()
      .then(() => {
        if (updateCount - limit.goods_num > 0) return {err: [4514, 'Goods is not enough', {goods_num: limit.goods_num}]};
        else if (limit.buylimit && updateCount - limit.buylimit > 0) return {err: [4520, 'Goods limit count is not enough', {buylimit: limit.buylimit}]};
        else if(limit.buylimit) {
          return this.updateRedisGoodsLimit(sid, uid, goods_sn, updateCount)
            .then(c => {
              if (c - limit.buylimit > 0) {
                return this.redisGoodsModel.updateGoodsLimit(sid, uid, goods_sn, -1 * updateCount)
                  .then(() => {
                    return {err: [4520, 'Goods limit count is not enough', {buylimit: limit.buylimit}]};
                  });
              }else return {err: false};
            });
        }else return {err: false};
      })
      .then(result => {
        if(result.err) return result;
        else {
          return this.updateRedisGoodsNum(goods_sn, updateCount).then(goodsNum => {
            if(!goodsNum && goodsNum != 0) return this.redisGoodsModel.updateRedisGoodsNum(goods_sn, updateCount)
              .then(() => {
                return {err: [4512, 'Can not find workable goods', {}]};
              });
            if (goodsNum < 0) {
              return Promise.all([
                limit.buylimit ? this.redisGoodsModel.updateGoodsLimit(sid, uid, goods_sn, -1 * updateCount):null,
                this.updateRedisGoodsNum(goods_sn, -1 * updateCount)
              ]).then(() => {
                return {err: [4514, 'Goods is not enough', {goods_num: limit.goods_num}]};
              });
            }
            else return goodsNum;
          });
        }
      });
  }
  
  // only redis
  updateRedisGoodsStatistics (sid, report_type, pay_price, minus) {
    return this.redisGoodsModel.updateGoodsStatistics(sid, report_type, pay_price, minus);
  }
  
  updateRedisGoodsBill (sid, goods_sn, date, pay_price, sell_num) {
    return Promise.all([
      this.redisGoodsModel.updateGoodsBillNum(sid, goods_sn, date, sell_num),
      this.redisGoodsModel.updateGoodsBillPrice (sid, goods_sn, date, pay_price)
    ]).then(data => {
      if(data[0] == sell_num || Number(data[1]).toFixed(2) == Number(pay_price).toFixed(2)) {
        return this.mysqlGoodsModel.getGoodsBill(sid, goods_sn, this.eutil.dateFormat(this.eutil.dateGetBeforeDay(null, 1), 'yyyyMM'))
          .then(sqlBill => {
            if(!sqlBill) return data;
            else return Promise.all([
              this.redisGoodsModel.updateGoodsBillNum(sid, goods_sn, date, sqlBill.sell_num),
              this.redisGoodsModel.updateGoodsBillPrice (sid, goods_sn, date, sqlBill.total_sell_price)
            ]);
          });
      }
    });
  }
  
  getAllGoodsNum () {
    return this.redisGoodsModel.getAllGoodsNum();
  }
  
  getGoodsStatistics (sidArr) {
    return this.redisGoodsModel.getGoodsStatistics(sidArr);
  }
  
  updateGoodsStatistics (sid, report_type, obj) {
    return this.mysqlGoodsModel.updateGoodsStatistics(sid, report_type, obj);
  }
  
  getRedisGoodsBill (date, sidArr) {
    return this.redisGoodsModel.getGoodsBill(date, sidArr);
  }
  
  getMysqlGoodsBill (sid, goods_sn, y_month) {
    return this.mysqlGoodsModel.getGoodsBill(sid, goods_sn, y_month);
  }
  
  upsertGoodsBill (goodsbill) {
    return this.mysqlGoodsModel.upsertGoodsBill(goodsbill);
  }
  
  getRealGoodsNumForOSS (goodsidArr) {
    if(!this.eutil.isArray(goodsidArr)) return false;
    else return this.redisGoodsModel.hmgetGoodsNum(goodsidArr);
  }
  
  // schedule job sync it up to mysql, only mysql
  updateMysqlGoodsNums (goods_sn, goods_num, sell_num) {
    return this.mysqlGoodsModel.updateGoodsByGoodsSn(goods_sn, goods_num, sell_num);
  }
  
  initRedisGoods () {
    return this.listByDiscoverId(0, 1, 0, 0,100)
      .then(list => {
        return Promise.map(list, l => {
          return this.getRedisGoodsNum(l.goods.goods_sn).then(num => {
            if(!num.sell_num || !num.goods_num) {
              return this.updateRedisGoodsNum(l.goods.goods_sn, 0);
            }
          });
        });
      });
  }
  
  getUpdateTipsNumByDiscoverId(sid, discoverId, ctime) {
    return this.redisGoodsModel.getUpdateTipsNumByDiscoverId(sid, discoverId, ctime)
      .then(obj => {
        if(obj) return obj;
        else return this.getUpdateTipsNumByDiscoverIdAndSetRedis(sid, discoverId, ctime);
      });
  }
  
  getUpdateTipsNumByDiscoverIdAndSetRedis(sid, discoverId, ctime) {
    return this.mysqlGoodsModel.getUpdateTipsByDiscoverIdAndCtime(sid, discoverId, ctime).then(goodsArr => {
      if (!goodsArr || !goodsArr.length) return false;
      else return Promise.map(goodsArr, (goods) => {
        return this.redisGoodsModel.setGoodsUpdateTips(sid, goods.onsale_time, goods.discover_displayid, goods.goods_sn);
      }).then(() => {return {discoverId, num: goodsArr.length};});
    });
  }
  
  getGoodsLastctime(sid) {
    return this.redisGoodsModel.getGoodsLastctime(sid).then(ctime => {
      if(ctime && ctime > 0) return ctime;
      else return this.mysqlGoodsModel.getGoodsLastctime(sid).then(obj => {
        if(!ctime) return false;
        else return this.redisGoodsModel.setGoodsUpdateTips([{sid, discover_displayid: obj.discover_displayid, ctime: ctime.obj}]);
      });
    });
  }
  
  getUserGoodsTipsTime(sid, uid) {
    return this.redisGoodsModel.getUserGoodsTipsTime(sid, uid);
  }
  
  setUserGoodsTipsTime(sid, uid, discoverId) {
    return this.redisGoodsModel.setGoodsUpdateTipsForUser(sid, uid, discoverId);
  }
  
}

module.exports = Goods;
