'use strict';
// 快速登录
var botservices = require('../services');
const models = require('../models');
const goodsService = botservices.get("GoodsService");
const ChargeService = botservices.get("ChargeService");
const DiscoverService = botservices.get("DiscoverService");
const util = botservices.get("util");
const base64 = require('base-64');
const Joi = util.Joi;
const GrpcService = require('../lib/grpc/client');

class Goods {
  listByDiscoverIdAndSid(discoverId, sid, lastGoods_sn, lastScore, count, data) {
    return Promise.resolve()
      .then(() => {
        let data = {discoverId, sid, lastGoods_sn, lastScore, count};
        const schema = Joi.object().options({convert: false}).keys({
          discoverId: Joi.number().required(),
          sid: Joi.number().required(),
          lastGoods_sn: Joi.string().required(),
          lastScore: Joi.number().required(),
          count: Joi.number().min(1).required(),
        });
        return util.schemaValidator(schema, data).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        try {
          if (lastGoods_sn && lastGoods_sn != '0') lastGoods_sn = new Buffer(lastGoods_sn, 'base64').toString(); //base64.decode(lastGoods_sn);//last
        } catch (err) {
          return Promise.reject([4000, 'param lastGoods_sn invalid', err]);
        }
        return goodsService.listByDiscoverId(discoverId, sid, lastGoods_sn, lastScore, count);
        // .then(goodsList => goodsList.map(goods => new models.goodsModel.goodsResFilter(goods)));
      })
      .then(goodsList => {
        // if (discoverId !== 2) return goodsList;
        // 活动接入 舞台
        return Promise.map(goodsList, goodsAndScore => {
          if (!goodsAndScore || !goodsAndScore.goods || isNaN(goodsAndScore.score)) return goodsAndScore;
          let {goods, score} = goodsAndScore;
          if (!goods.channel_id || goods.channel_id == -1) return goodsAndScore;
          return GrpcService.grpcCRM([goods.channel_id], 'HeadlineService-getNewestHeadline')
            .then(headline => {
              if (!headline) return {
                goods: Object.assign(goods, {
                  channel_h_id: -1,
                  channel_h_data: '-1',
                  goods_detail: '-1',
                  goods_name: '-1'
                }),
                score: score
              };
              try {
                let oldHeadline = JSON.parse(goods.channel_h_data);
                if (oldHeadline.ctime === headline.ctime) return goodsAndScore;
              } catch (err) {
                // 头条数据JSON解析错误
              }
              let updateGoodsAttributes = {
                channel_h_id: headline.headlineId,
                channel_h_data: JSON.stringify(headline)
              };
              return goodsService.updateGoodsByOld(goods, updateGoodsAttributes, goods.id)
                .then(oldGoods => {
                  return {goods: Object.assign(goods, updateGoodsAttributes), score};
                });
            })
            .catch(err => {
              util.log.error('crm系统GRPC服务异常，舞台数据获取错误', err);
              return goodsAndScore;
            });
        });
        return goodsList;
      })
      .then(goodsList => {
        let now = util.eutil.getTimeSeconds();
        return Promise.reduce(goodsList, (result, goodsAndScore) => {
          if (!goodsAndScore || !goodsAndScore.goods || isNaN(goodsAndScore.score)) return result;
          if (goodsAndScore.goods.channel_id && goodsAndScore.goods.channel_id !== -1) {
            // 频道
            result.push(new models.goodsModel.goodsResFilter(goodsAndScore.goods, goodsAndScore.score));
            return result;
          } else {
            // 商品
            if (goodsAndScore.goods.is_sale && (goodsAndScore.goods.onsale_time - now > 0 || goodsAndScore.goods.offsale_time - now < 0)) return result;
            result.push(new models.goodsModel.goodsResFilter(goodsAndScore.goods, goodsAndScore.score));
            return result;
          }
        }, []).then(result => {
          return goodsService.setUserGoodsTipsTime(sid, data._uid, discoverId).then(() => {
            return [2000, 'success', {goodsList: result, nowTime: Date.now()}];
          });
        });
        // goodsList = goodsList.map(goodsAndScore => {
        //   if (!goodsAndScore || !goodsAndScore.goods || isNaN(goodsAndScore.score)) return null;
        //   if (goodsAndScore.goods.is_sale && (goodsAndScore.goods.onsale_time - now > 0 || goodsAndScore.goods.offsale_time - now < 0)) return null;
        //   return new models.goodsModel.goodsResFilter(goodsAndScore.goods, goodsAndScore.score);
        // });
        // return [2000, 'success', {goodsList, nowTime: Date.now()}];
      })
      .catch(function (res) {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  findByGoods_sn(goods_sn) {
    let data = {goods_sn};
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({convert: false}).keys({
          goods_sn: Joi.string().required()
        });
        return util.schemaValidator(schema, data).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        let goods_sn;
        try {
          goods_sn = base64.decode(data.goods_sn);
        } catch (err) {
          util.log.error(err);
          return Promise.reject([4000, '参数 goods_sn解析错误', {}]);
        }
        let now = util.eutil.getTimeSeconds();
        return goodsService.findByGoodsSn(goods_sn).then(goods => {
          if (!goods) return Promise.resolve([3002, '商品不存在，可能被删除', {}]);
          else if (goods.is_sale && (goods.onsale_time - now > 0 || goods.offsale_time - now < 0)) return Promise.resolve([3002, '商品已经被下架', {}]);
          else return Promise.resolve([2000, 'success', new models.goodsModel.goodsResFilter(goods)]);
        });
      })
      .catch(function (res) {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  // only minus
  getPriceByCode() {
    return Promise.resolve()
      .then(() => {
        return ChargeService.getByCategoryId(7, true)
          .then(charge => {
            if (charge) return charge;
            else return {};
          });
      })
      .then(rule => {
        return Promise.resolve([2000, 'success', {rule}]);
      })
      .catch(function (res) {
        util.log.error(res);
        return Promise.reject(res);
      });
  }
  
  /**
   * @creater: Bo
   * @name Get tips by update goods(商品上新提示)
   * @params { sid, lastctime, data }
   * @return { tips: [{num, discoverId}]}
   */
  getUpdateTips(sid, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.number().integer().positive().required(), sid).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return DiscoverService.listBySid(sid).then(discoverList => {
          if (!discoverList || !discoverList.length || !util.eutil.isArray(discoverList))
            return {reason: "Can't find discover list with sid = " + sid, discoverList: false};
          else return goodsService.getUserGoodsTipsTime(sid, data._uid).then(ctimeObj => {
            if (!ctimeObj || JSON.stringify(ctimeObj) == '{}')
              return {reason: "Can't find user's last view goods time", discoverList};
            else return {discoverList, ctimeObj};
          });
        });
      })
      .then(dataObj => {
        if (dataObj.reason) {
          if(dataObj.discoverList) return Promise.map(dataObj.discoverList, d => {
            return goodsService.setUserGoodsTipsTime(sid, data._uid, d.discoverid);
          }).then(() => {return {tips: [], reason: dataObj.reason};});
        } else return Promise.reduce(dataObj.discoverList, (result, d) => {
          return goodsService.getUpdateTipsNumByDiscoverId(sid, d.discoverid, dataObj.ctimeObj[d.discoverid] || 0).then(numObj => {
            if (numObj) result.push(numObj);
            return result;
          });
        }, []).then(tips => {
          return {tips};
        });
      })
      .then(tips => {
        return Promise.resolve([2000, 'success', tips]);
      })
      .catch(function (res) {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
}

module.exports = new Goods();
