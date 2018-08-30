/**
 * Created by Bo on 2017/12/6.
 */

'use strict';

const eutil = require('eutil');
const util = require('../../util');

class mysqlUserExpModel {
  constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
    this.userExpTable = 'user_exp';
  }
  
  getUserExp (sid, uid) {
    return this.rclient(this.userExpTable).select().where({sid, uid}).limit(1)
      .then(exp => {
        if(exp && exp.length) return exp[0].exp.toString();
        else return null;
      });
  }
  
  setUserExp (userExp) {
    return this.wclient(this.userExpTable).insert(userExp);
  }
  
  updateUserExp (sid, uid, exp, trx) {
    if(trx) return trx.raw('update ?? set exp = exp + ?, mtime = ? where `sid` = ? and `uid` = ? limit 1', [this.userExpTable, exp, eutil.getTimeSeconds(), sid, uid]);
    else return this.wclient(this.userExpTable).increment('exp', exp).where({sid, uid}).limit(1);
  }
}

module.exports = mysqlUserExpModel;
