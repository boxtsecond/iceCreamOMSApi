/**
 * Created by Bo on 2017/11/10.
 */

'use strict';
// 快速登录
var botservices=require('../services');
const models = require('../models');
const OrderService = botservices.get("OrderService");
const WalletService = botservices.get("WalletService");
const GoodsService=botservices.get("GoodsService");
const DigitalService=botservices.get("DigitalService");
const upload=botservices.get("upload");
const util=botservices.get("util");
const Joi=util.Joi;
const _=require('lodash');
const ursa = require('ursa');
const fs = require('fs');
const path = require('path');
const ICOrderPrivateKey = fs.readFileSync(path.join(__dirname, "../../app/IC_order_private_key.pem")).toString();

class Order {

  testCreateUnified (data) {
    return Promise.resolve()
      .then(() => {
        return OrderService.createUnified(data.orderType, data.goods_sn, data.is_digital|| 0, data);
      })
      .then(order => {return Promise.resolve([2000, 'success', new models.orderModel.OrderDetailResFilter(order)]);})
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

  getOrderDetail(sid, order_no, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(),order_no).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return OrderService.getOrderDetail(order_no, sid||1, data._uid);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {order: order || {}}]);})
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

  getOrderListDetail(data) {
    return Promise.resolve()
      .then(() => {
        return OrderService.getOrderListDetail(data.sid||1, data._uid, data.lastTime, data.count || 10, data.sort);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {order}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

  createOrder (data) {
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          _uid: Joi.number(),
          sid: Joi.number(),
          access_token: Joi.string().empty(''),
          goods_sn: Joi.string().required(),
          address: Joi.string().empty(''),
          goods_count: Joi.number().required(),
          is_digital: Joi.number().min(0).max(1).required(),
          usekue: Joi.boolean()
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        let privateKey = ursa.createPrivateKey(ICOrderPrivateKey);
        let goods_sn_decrypt;
        try {
          goods_sn_decrypt = privateKey.decrypt(data.goods_sn, 'base64', 'utf8', ursa.RSA_PKCS1_PADDING);
        }catch (err) {
          goods_sn_decrypt = '';
        }
        goods_sn_decrypt = goods_sn_decrypt.split('&');
        if(goods_sn_decrypt.length != 4 ||goods_sn_decrypt[0] != util.config.appKey || goods_sn_decrypt[1] != data._uid) {
          return Promise.reject([4000, 'goods_sn Encrypt error', {}]);
        }else return goods_sn_decrypt[3];
      })
      .then(goods_sn => {
        data.usekue = data.usekue || util.config.kue.use;
        return OrderService.createUnified('goods', new Buffer(goods_sn, 'base64').toString(), data.is_digital,data);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {order: new models.orderModel.OrderResFilter(order)}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  getOrderByType(sid, order_no, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(),order_no).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return OrderService.getOrderByType(order_no, sid, data._uid, 2);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {order: order || {}}]);})
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  getOrderTypeList (data) {
    return Promise.resolve()
      .then(() => {
        return OrderService.getOrderTypeList(2, data.sid || 1, data._uid, data.lastTime, data.count || 10, data.sort);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {order}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  updateOrderAddress (sid, order_no, data) {
    return Promise.resolve()
      .then(() => {
        return util.schemaValidator(Joi.string().required(),order_no).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        let addressInfo = new models.orderModel.OrderAddressFilter(data.address);
        if (addressInfo.address && addressInfo.phone > 0 && addressInfo.district) {
          return addressInfo;
        } else return Promise.reject([4000, 'address form error', {address: '用户名,手机号码,省|市|区,街道等具体信息 or 用户名,手机号码,直辖市|区,街道等具体信息'}]);
      })
      .then((addressInfo) => {
        return OrderService.getOrder(order_no, sid, data._uid).then(order => {
          if(order) {
            if(order.report_type != 2) return Promise.reject([4519, 'order type can not be update', {report_type: order.report_type}]);
            if(order.is_receipt || order.order_status > 1) return Promise.reject([4517, 'goods is shipping', {}]);
            return {order: _.assign(order, addressInfo), addressInfo: addressInfo};
          } else return Promise.reject([4512, 'can not find order', {order_no}]);
        });
      })
      .then(data => {
        return OrderService.updateOrderAddress(data.order, data.addressInfo);
      })
      .then(order => {
        return Promise.resolve([2000, 'success', {}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  deleteOrder (data) {
    return Promise.resolve()
      .then(() => {
        return OrderService.deleteOrderByOSS(data.orderList, data.isRefund, data._uid);
      })
      .then((res) => {
        if(res && res.length) return Promise.reject(res);
        return Promise.resolve([2000, 'success', {}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  updateOrderByFile (fileName) {
    return Promise.resolve()
      .then(() => {
        let field = ['order_no','express_company','express_no'];
        let fileExt = path.extname(fileName);
        if(fileExt !== '.csv' && fileExt !== '.txt' && fileExt !== '.xlsx') return Promise.reject([5005, 'Not support on file types, please use .csv or .txt or .xlsx file', {}]);
        return upload.readFileByLine(fileName, 100, OrderService['updateOrderByFile'].bind(OrderService), models.orderModel.UpdateOrderDeliver, field, true, -3, false).catch(err => {
          if(err.func) return Promise.reject([500, err.msg, {}]);
          if(err.notExists) return Promise.reject([5001, err.msg, {}]);
          if(err.field) return Promise.reject([5006, err.msg, {}]);
          return Promise.reject(err);
        });
      })
      .then(count => {
        return Promise.resolve([2000, 'success', {count}]);
      })
      .catch(res => {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
}

module.exports = new Order();
