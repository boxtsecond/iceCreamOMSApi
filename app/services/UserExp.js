/**
 * Created by Bo on 2017/12/6.
 */

'use strict';
const models = require('../models');
const _ = require('lodash');
const eutil = require('eutil');

class UserExp {
  constructor(app, util) {
    this.mysqlUserExpModel = app.get("mysqlUserExpModel");
    this.redisUserExpModel = app.get("redisUserExpModel");
    this.log = util.log;
  }
  
  setUserExp (sid, uid) {
    return this.mysqlUserExpModel.setUserExp(new models.userExpModel.UserExp({sid, uid}))
      .then(() => {
        return this.redisUserExpModel.updateUserExp(sid, uid, 0, true);
      });
  }
  
  getUserExp (sid, uid) {
    return this.redisUserExpModel.getUserExp(sid, uid)
      .then(exp => {
        if(exp || exp == 0) return exp.toString();
        else return this.mysqlUserExpModel.getUserExp(sid, uid)
          .then(ue => {
            if(ue) return this.redisUserExpModel.updateUserExp(sid, uid, ue, true).then(() => {return ue;});
            else return null;
          });
      })
      .then(userExp => {
        if(userExp) return Number(userExp);
        else return this.setUserExp (sid, uid).then(() => {return 0;});
      });
  }
  
  // only mysql
  updateUserExp (sid, uid, exp, trx) {
    return this.mysqlUserExpModel.updateUserExp(sid, uid, exp, trx);
  }
  
  updateRedisUserExp (sid, uid, exp) {
    return this.redisUserExpModel.updateUserExp(sid, uid, exp)
      .then(upExp => {
        if(Number(upExp).toFixed(2) != Number(exp).toFixed(2)) return upExp;
        else {
          return this.mysqlUserExpModel.getUserExp(sid, uid).then(userExp => {
            if(userExp) return this.redisUserExpModel.updateUserExp(sid, uid, userExp);
            else return this.mysqlUserExpModel.setUserExp(new models.userExpModel.UserExp({sid, uid}));
          });
        }
      });
  }
}

module.exports = UserExp;

