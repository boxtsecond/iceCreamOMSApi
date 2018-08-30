/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

const botservices = require('../services');
const util = botservices.get("util");
const PaymentService = botservices.get("PaymentService");
const OrderService = botservices.get("OrderService");
const GoodsService = botservices.get("GoodsService");
const UserExpService = botservices.get("UserExpService");
const models = require('../models');
const Joi = util.Joi;
const _ = require('lodash');
const _aliPay = require('../lib/payment/aliPay');
const _wechatPay = require('../lib/payment/wechatPay');
const AliPay = new _aliPay(models.paymentModel.AliPayInit(util.config.aliPay));
const WechatPay = new _wechatPay(models.paymentModel.WechatPayInit(util.config.wechatPay));


class Payment {

  aliPayNotify(data) {
    console.log('------ AliPay Notify ------', data.body);
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          sign_type: Joi.string().required(),
          app_id: Joi.string().required().valid(AliPay.aliPaySignObj.app_id),
          trade_no: Joi.string().required(),
          out_trade_no: Joi.string().required(),
          sign: Joi.string().required(),
          version: Joi.string().required(),
          charset: Joi.string().required(),
          notify_time: Joi.number().required(),
          notify_type: Joi.string().required(),
          notify_id: Joi.string().required(),
          ctime: Joi.number().required(),
        });
        let requireData = new models.paymentModel.AliPaySignError(data.body);
        return util.schemaValidator(schema,requireData).then((res)=>{
          if(res) return Promise.reject([4000, 'params valid error', {}]);
          else return {requireData: requireData, params: data.body};
        });
      })
      .then(resData => {
        return OrderService.getOrderByNo(Number(String(resData.params.out_trade_no).substring(0,3)), resData.params.out_trade_no)
          .then(order => {
            if(!order || order.payment_type != 1 || order.is_pay == 1 || order.order_status == 4 || order.refund_status == 2) {
              return Promise.reject('success');
            }
            else {
              resData.order = order;
              return resData;
            }
          });
      })
      .then(result => {
        return AliPay.validSign(result.params)
          .then(si => {
            if(si) {
              result.params.uid = result.order.uid;
              return PaymentService.saveAliPayNotify(new models.paymentModel.AliPayOrder(result.params))
                .then(() => {
                  return data.res.send('success');
                })
                .then(() => {return result;});
            }
            else {
              return PaymentService.saveAliPayError(result.requireData)
                .then(() => {
                  return Promise.reject([4602, 'sign error', {}]);
                });
            }
          });
      })
      .then(resData => {
        if(resData.order && resData.order.pay_price == resData.params.total_amount && (resData.params.trade_status == 'TRADE_SUCCESS' || resData.params.trade_status == 'TRADE_FINISHED')) {
          let updateOrderParams = new models.orderModel.GetOrderParams({pay_time: util.eutil.getTimeSeconds(), mtime: util.eutil.getTimeSeconds(), payment_type: 1, order_status: 4, is_pay: 1, pay_price: resData.params.total_amount});
          let insert = resData.params.trade_status == 'TRADE_SUCCESS' ? true : false;
          return OrderService.updateOrderByNotifyWithKUE(resData.params.out_trade_no, updateOrderParams, _.assign(resData.order, updateOrderParams), insert)
            .then(() => {
              return Promise.all([
                resData.order.exp_price > 0 ? UserExpService.updateRedisUserExp(resData.order.sid, resData.order.uid, resData.order.exp_price) : null,
                insert ? GoodsService.updateRedisGoodsStatistics(resData.order.sid, resData.order.report_type, resData.order.change_price) : null,
                insert ? GoodsService.updateRedisGoodsBill(resData.order.sid, resData.order.goods_id, util.eutil.dateFormat(util.eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), resData.order.pay_price, resData.order.goods_count) : null
              ]);
            })
            .catch(err => {
            util.log.error('--------- AliPay Notify Update Order Error ---------');
            util.log.error(err);
            // return this.aliPayRefund(order);
          });
        }
        else {
          return PaymentService.saveAliPayError(resData.requireData)
            .then(() => {
              util.log.error('--------- AliPay Price Error ---------');
              // if(resData.order.pay_price) return this.aliPayRefund(resData.order);
            });
        }
      })
      .catch(res => {
        if (util.eutil.isArray(res) || res == 'success') {
          util.log.error(res);
          return data.res.send(res);
        }
        else util.log.error(res);
      });
  }

  aliPayRefund(data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.number().required(), data.order_no).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          return res;
        });
      })
      .then(() => {
        if(data.pay_price) return data;
        else return OrderService.getOrderByNo(data.sid||1, data.order_no);
      })
      .then(order => {
        if(!order) return Promise.reject([4512, "Can't find order", {}]);
        else if(order.refund_status == 2 || order.order_status == 8) return Promise.reject([4607, 'order is refund already', {}]);
        else {
          let aliPaySignObj = new models.paymentModel.AliPayRefundSign(AliPay.aliPaySignObj, order);
          return AliPay.getEncodeStr(aliPaySignObj).then(signStr => {return {order: order, signStr: signStr};});
        }
      })
      .then(data => {
        return AliPay.refund(data.signStr)
          .then(res => {
            return PaymentService.saveAliPayRefund(new models.paymentModel.AliPayRefundOrder(res.resData, data.order.uid)).then(() => {
              if(res && res.sign) return {resData: res.resData, order: data.order};
              else return Promise.reject([4602, 'sign error', {error: res.resData}]);
            });
          });
      })
      .then(data => {
        let updateOrderParams = new models.orderModel.GetOrderParams({refund_status: 2, order_status: 8, mtime: util.eutil.getTimeSeconds()});
        let updateOrderDetailParams = new models.orderModel.GetOrderDetailParams(updateOrderParams);
        return OrderService.updateOrder(data.resData.out_trade_no, _.assign(data.order, updateOrderParams), updateOrderParams, updateOrderDetailParams);
      })
      .then(() => {
        return Promise.resolve([2000, 'success', {}]);
      })
      .catch(res => {
        util.log.error(res);
        if(!data.pay_price){
          if (util.eutil.isArray(res)) return Promise.resolve(res);
          else return Promise.reject(res);
        }
      });
  }

  aliPayQuery(order_no, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(), order_no).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          return res;
        });
      })
      .then(res => {
        return OrderService.getOrderByNo(Number(String(order_no).substring(0,3)), order_no).then(order => {
          if(!order) return Promise.reject([4512, "Can't find order", {}]);
          else return order;
        });
      })
      .then(order => {
        let aliPaySignObj = new models.paymentModel.AliPayQuerySign(AliPay.aliPaySignObj, order);
        return AliPay.getEncodeStr(aliPaySignObj);
      })
      .then(signStr => {
        // request alipay for query
        return AliPay.query(signStr)
          .then(res => {
            if(res && res.query) return res.resData;
            else return Promise.reject([4605, 'aliPay servers error', {error: res.resData}]);
          });
      })
      .then(resData => {
        return Promise.resolve([2000, 'success', {order: resData}]);
      })
      .catch(res => {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }

  wechatPayNotify(data) {
    console.log('------ WechatPay Notify ------', data.body);
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          return_code: Joi.string().required(),
          appid: Joi.string().required().valid(WechatPay.wechatPaySignObj.appid),
          mch_id: Joi.string().required().valid(WechatPay.wechatPaySignObj.mch_id),
          nonce_str: Joi.string().max(32).required(),
          sign: Joi.string().required(),
          result_code: Joi.string().required(),
          openid: Joi.string().required(),
          trade_type: Joi.string().required(),
          bank_type: Joi.string().required(),
          cash_fee: Joi.number().required(),
          transaction_id: Joi.string().required(),
          out_trade_no: Joi.string().required(),
          total_fee: Joi.number().required(),
          time_end: Joi.number().required(),
          ctime: Joi.number().required()
        });
        let requireData = new models.paymentModel.WechatPaySignError(data.body);
        return util.schemaValidator(schema,requireData).then((res)=>{
          if(res) return Promise.reject([4000, 'params valid error', {}]);
          else return {requireData: requireData, params: data.body};
        });
      })
      .then(resData => {
        return OrderService.getOrderByNo(Number(String(resData.params.out_trade_no).substring(0,3)), resData.params.out_trade_no)
          .then(order => {
            if(!order || order.payment_type != 2 || order.is_pay == 1 || order.order_status == 4 || order.refund_status == 2) {
              return Promise.reject({return_code: 'SUCCESS', return_msg: 'OK'});
            }
            else {
              resData.order = order;
              return resData;
            }
          });
      })
      .then(result => {
        return WechatPay.validSign(result.params)
          .then(si => {
            if(si) {
              result.params.uid = result.order.uid;
              return PaymentService.saveWechatPayNotify(new models.paymentModel.WechatPayOrder(_.merge(result.requireData, result.params)))
                .then(() => {return data.res.send(WechatPay.bulidXml({return_code: 'SUCCESS', return_msg: 'OK'}));})
                .then(() => {return result;});
            }
            else {
              // return PaymentService.saveWechatPayError(result.requireData).then(() => {return Promise.reject([4604, 'sign error', {}]);});
              return Promise.reject([4604, 'sign error', {}]);
            }
          });
      })
      .then(resData => {
        if(resData.order && resData.order.pay_price == resData.params.total_fee/100 && resData.params.result_code == 'SUCCESS') {
          let updateOrderParams = new models.orderModel.GetOrderParams({pay_time: util.eutil.getTimeSeconds(), mtime: util.eutil.getTimeSeconds(), payment_type: 2, order_status: 4, is_pay: 1});
          let insert = resData.params.result_code == 'SUCCESS' ? true : false;
          return OrderService.updateOrderByNotifyWithKUE(resData.params.out_trade_no, updateOrderParams, _.assign(resData.order, updateOrderParams), insert)
            .then(() => {
              return Promise.all([
                resData.order.exp_price > 0 ? UserExpService.updateRedisUserExp(resData.order.sid, resData.order.uid, resData.order.exp_price) : null,
                insert ? GoodsService.updateRedisGoodsStatistics(resData.order.sid, resData.order.report_type, resData.order.change_price) : null,
                insert ? GoodsService.updateRedisGoodsBill(resData.order.sid, resData.order.goods_id, util.eutil.dateFormat(util.eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), resData.order.pay_price, resData.order.goods_count) : null
              ]);
            }).catch(err => {
              util.log.error('--------- WechatPay Notify Update Order Error ---------');
              util.log.error(err);
              // return this.wechatRefund(order);
            });
        }
        else {
          util.log.error('--------- WechatPay Price Error ---------');
          // if(resData.order.pay_price) return this.wechatRefund(resData.order);
        }
      })
      .catch(res => {
        if (util.eutil.isArray(res) || res.return_code) {
          util.log.error(res);
          return data.res.send(WechatPay.bulidXml({return_code: 'SUCCESS', return_msg: 'OK'}));
        }
        else util.log.error(res);
      });
  }

  wechatRefund(data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(), data.order_no).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          return res;
        });
      })
      .then(() => {
        if(data.pay_price) return data;
        else return OrderService.getOrderByNo(Number(String(data.order_no).substring(0,3)), data.order_no);
      })
      .then(order => {
        if(!order) return Promise.reject([4512, "Can't find order", {}]);
        else if(order.refund_status == 2 || order.order_status == 8) return Promise.reject([4607, 'order is refund already', {}]);
        else {
          let wechatPaySignObj = new models.paymentModel.WechatPayRefundSign(WechatPay.wechatPaySignObj, order);
          wechatPaySignObj.nonce_str = WechatPay.getNoceStr(32);
          return WechatPay.getSign(wechatPaySignObj)
            .then(sign => {
              wechatPaySignObj.sign = sign;
              return WechatPay.refund(wechatPaySignObj).then(res => {
                return {res, order};
              });
            });
        }
      })
      .then(({res, order}) => {
        return PaymentService.saveWechatPayRefund(new models.paymentModel.WechatPayRefundOrder(res.resData, order.uid)).then(() => {
          if (res && res.sign) return {resData: res.resData, order};
          else return Promise.reject([4602, 'sign error', {error: res.resData}]);
        });
      })
      .then(data => {
        // update order information
        let updateOrderParams = new models.orderModel.GetOrderParams({refund_status: 2, order_status: 8, mtime: util.eutil.getTimeSeconds()});
        let updateOrderDetailParams = new models.orderModel.GetOrderDetailParams(updateOrderParams);
        return OrderService.updateOrder(data.resData.out_trade_no, _.assign(data.order, updateOrderParams), updateOrderParams, updateOrderDetailParams);
      })
      .then(() => {
        return Promise.resolve([2000, 'success', {}]);
      })
      .catch(res => {
        util.log.error(res);
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }

  wechatPayQuery(order_no, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(), order_no).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          return res;
        });
      })
      .then(res => {
        return OrderService.getOrderByNo(Number(String(order_no).substring(0,3)), order_no).then(order => {
          if(!order) return Promise.reject([4512, "Can't find order", {}]);
          else return order;
        });
      })
      .then(order => {
        let wechatPaySignObj = new models.paymentModel.WechatPayQuerySign(WechatPay.wechatPaySignObj, order);
        wechatPaySignObj.nonce_str = WechatPay.getNoceStr(32);
        return WechatPay.getSign(wechatPaySignObj)
          .then(sign => {
            wechatPaySignObj.sign = sign;
            return WechatPay.query(wechatPaySignObj);
          });
      })
      .then(res => {
        if(res && res.query) return Promise.resolve([2000, 'success', {order: res.resData}]);
        else return Promise.reject([4606, 'query error', {error: res.resData}]);
      })
      .catch(res => {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }
}

module.exports = new Payment();
