/**
 * Created by Bo on 2017/12/6.
 */

'use strict';

const models = require('../../models');

class redisUserExpModel {
  constructor(wclient, rclient) {
    this.wclient = wclient;
    this.rclient = rclient;
    this.userExpKey = 'userExp'; //+ :sid:uid
  }
  
  updateUserExp (sid, uid, exp, set) {
    if(!set) return this.wclient.incrbyfloat(`${this.userExpKey}:${sid}:${uid}`, exp);
    else return this.wclient.set(`${this.userExpKey}:${sid}:${uid}`, exp);
  }
  
  getUserExp (sid, uid) {
    return this.rclient.get(`${this.userExpKey}:${sid}:${uid}`);
  }
  
}

module.exports = redisUserExpModel;
