/**
 * Created by Bo on 2017/11/13.
 */

'use strict';
// 快速登录
var botservices=require('../services');
const models = require('../models');
const WalletService = botservices.get("WalletService");
const util=botservices.get("util");
const Joi=util.Joi;
var _=require('lodash');

class Wallet {
  
  /**
   * 获取某一类钱包
   * @param uid 用户Id
   */
  getWallet (data) {
    return Promise.resolve()
      .then(() => {
        return WalletService.get(data._uid, data.type || 1)
          .then(w => {
            if(w) {
              return WalletService.getIncrRedisBalance(data._uid, data.type || 1)
                .then(balance => {
                  // if(!balance || w.balance != balance) {
                  //   return WalletService.updateIncrRedisBalance(data._uid, balance || w.balance, data.type || 1, true)
                  //     .then(b => {
                  //       w.balance = Number(b).toFixed(2);
                  //       WalletService.updateRedisBalance(data._uid, w.balance, data.type || 1);
                  //       return new models.walletModel.WalletResFilter(w);
                  //     });
                  // }
                  // else return new models.walletModel.WalletResFilter(w);
                  balance = balance ? balance.toString() : (balance == 0 ? '0' : null);
                  w.balance = balance || w.balance;
                  return new models.walletModel.WalletResFilter(w);
                });
            }
            else {
              let nw = new models.walletModel.Wallet(data);
              return WalletService.set(nw).then(() => {return new models.walletModel.WalletResFilter(nw);});
            }
          });
      })
      .then(wallet => {
        return Promise.resolve([2000, 'success', {wallet}]);
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
   * 获取全部钱包
   * @param uid 用户Id
   */
  getAllWallet (data) {
    return Promise.resolve()
      .then(() => {
        return WalletService.getAll(data._uid)
          .then(w => {
            if(w && w.length) return w;
            else {
              let nw = new models.walletModel.Wallet(data);
              return WalletService.set(nw).then(() => {return [nw];});
            }
          });
      })
      .then(wallet => {
        return Promise.resolve([2000, 'success', {wallet}]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  updateWalletBalance (uid, balance, data) {
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          uid: Joi.number().required(),
          balance: Joi.number().required()
        });
        return util.schemaValidator(schema,{uid, balance}).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return WalletService.updateIncrRedisBalance(uid, balance, data.type || 1);
      })
      .then(b => {
        if(!b) return WalletService.set(new models.walletModel.Wallet({uid, balance, type: data.type||1}));
        else {
          return WalletService.updateBalance(uid, data.type || 1, balance).then(() => {
            return WalletService.updateRedisBalance(uid, Number(b).toFixed(2), data.type || 1);
          });
        }
      })
      .then(() => {
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
  
}

module.exports = new Wallet();
