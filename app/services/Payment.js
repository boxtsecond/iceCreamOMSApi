/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

const models = require('../models');
const _aliPay = require('../lib/payment/aliPay');
const _wechatPay = require('../lib/payment/wechatPay');
const util = require('../util');
const AliPay = new _aliPay(models.paymentModel.AliPayInit(util.config.aliPay));
const WechatPay = new _wechatPay(models.paymentModel.WechatPayInit(util.config.wechatPay));

class Payment {
  constructor(app) {
    this.mysqlAliPayModel = app.get("mysqlAliPayModel");
    this.mysqlWechatPayModel = app.get("mysqlWechatPayModel");
  }

  saveAliPayNotify(order) {
    return this.mysqlAliPayModel.save(order);
  }

  saveAliPayError(order) {
    return this.mysqlAliPayModel.saveError(order);
  }

  saveAliPayRefund(order) {
    return this.mysqlAliPayModel.refund(order);
  }

  saveWechatPayNotify(order) {
    return this.mysqlWechatPayModel.save(order);
  }

  saveWechatPayError(order) {
    return this.mysqlWechatPayModel.saveError(order);
  }
  
  saveWechatPayRefund(order) {
    return this.mysqlWechatPayModel.refund(order);
  }

  getAliPaySignStr(order) {
    let aliPaySignObj = new models.paymentModel.AliPayPaymentSign(AliPay.aliPaySignObj, order);
    return AliPay.getEncodeStr(aliPaySignObj)
      .then(str => {return str;});
  }

  getWechatPaySign(order) {
    let wechatPaySignObj = new models.paymentModel.WechatPayPaymentSign(WechatPay.wechatPaySignObj, order);
    wechatPaySignObj.nonce_str = WechatPay.getNoceStr(32);
    return WechatPay.getSign(wechatPaySignObj)
      .then(sign => {
        wechatPaySignObj.sign = sign;
        return WechatPay.getPrePayId(wechatPaySignObj);
      })
      .then(res => {
        if(res && !res.err) return new models.paymentModel.WechatPayPrepayid(res.data, WechatPay.wechatPaySignObj);
        else return Promise.reject([4603, 'wechatPay error', {error: res.errMsg}]);
      })
      .then(prepay => {
        prepay.noncestr = WechatPay.getNoceStr(32);
        return WechatPay.getSign(prepay).then(sign => {prepay.sign = sign; return prepay;});
      });
  }
}

module.exports = Payment;
