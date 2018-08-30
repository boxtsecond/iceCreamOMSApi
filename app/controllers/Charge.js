/**
 * Created by Bo on 2017/11/13.
 */

'use strict';
// 快速登录
var botservices=require('../services');
const models = require('../models');
const ChargeService = botservices.get("ChargeService");
const OrderService = botservices.get("OrderService");
const PaymentService = botservices.get("PaymentService");
const util=botservices.get("util");
const Joi=util.Joi;
const ursa = require('ursa');
const fs = require('fs');
const path = require('path');
const ICPublicKey = fs.readFileSync(path.join(__dirname, "../../app/IC_public_key.pem")).toString();

class Charge {

  /**
   * 获取充值金额
   */
  getCharge () {
    return Promise.resolve()
      .then(() => {
        return ChargeService.getByCategoryId(6)
          .then(charge => {
            if(charge && charge.length) return charge;
            else return [];
          });
      })
      .then(charge => {
        return Promise.resolve([2000, 'success', {charge}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }


  /**
   * 充值人民币
   * @param price 价格/CNY
   */
   chargeCNY (type, price, data) {
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          type: Joi.number().required().min(1).max(2),
          price: Joi.number().required()
        });
        return util.schemaValidator(schema,{price: price, type: type}).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return ChargeService.getCodeByCNYPrice(Number(price).toFixed(2))
          .then(code => {
            if(code) return code;
            else return Promise.reject([4501, "Can't find this Price", {price}]);
          });
      })
      .then(code => {
        data.type = type;
        return OrderService.createUnified('recharge', code, 1, data);
      })
      .then(order => {
        switch (type){
          case 1:
            return PaymentService.getAliPaySignStr(order);
            break;
          case 2:
            return PaymentService.getWechatPaySign(order)
              .then(params => {
                let publicKey = ursa.createPublicKey(ICPublicKey);
                return publicKey.encrypt(JSON.stringify(params), 'utf8', 'base64', ursa.RSA_PKCS1_PADDING);
              });
            break;
          default:
            return {};
            break;
        }
      })
      .then(signStr => {return Promise.resolve([2000, 'success', {signStr}]);})
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

}

module.exports = new Charge();

