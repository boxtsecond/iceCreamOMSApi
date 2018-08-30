'use strict';
var uuid = require('uuid/v1');
var _ = require('lodash');


class redisUserModel{
  constructor(wclient,rclient){
    this.wclient=wclient;
    this.rclient=rclient;
    this.configGagRuleKey = 'config_gag_rule_ttl';
    this.gagUser = 'gag_user:'; // + userId
  }
  // add 新元素 返回 1， 重复返回 0
  addNicknameSet (nickname) {
    return this.wclient.sadd('usernickname', nickname);
  }
  delNicknameSet (nickname) {
    return this.wclient.srem('usernickname', nickname);
  }
  existNicknameSet (nickname) {
    return this.wclient.sismember('usernickname', nickname);
  }

  // existPhoneSet (itucode,phone) {
  //   return this.rclient.sismember('userphone',itucode+phone);
  // }

  getUserById(id) {
		return this.rclient.hget('user', id)
			.then(res => {
				if (res) return JSON.parse(res);
				else return null;
			});
  }
  setUserAuthRegister (user, userAuth, userRegister) {
    return this.setUser(user)
      .then(() => this.setUserAuth(userAuth))
      .then(() => this.setUserRegister(userRegister))
      .then(() => Promise.resolve({user, userAuth, userRegister}));
  }
  setUser (user) {
    return this.wclient.hset('user', user.id, JSON.stringify(user));
  }
  setUserInfo (user) {
    return this.wclient.hset('userinfo', user.id, JSON.stringify(user));
  }
  getUserInfo (id) {
    return this.rclient.hget('userinfo', id)
      .then(res => {
        if (res) return JSON.parse(res);
        else return null;
      });
  }
  existsUserFromUid (uid) {
    return this.rclient.hexists('user',uid);
  }
  existsUserInfoFromUid(uid){
    let _self = this;
    return _self.rclient.hexists('userinfo', uid).then((exists)=>{
         if(exists)  return exists;
         else   return _self.existsUserFromUid(uid);
    });
  }


  // 进入手动同步队列
  pushToUserSyncList(phonenumber) {
    let _that = this;
    return new Promise(function (resolve, reject) {
      _that.client.lpush(['users_sync_list', phonenumber],
        function (err, result) {
          if (err) {
            return resolve();
          }
          return resolve(phonenumber);
        }
      );
    });
  }

  // 写入token
  createtoken(uid){
    let token = uuid().replace(/[-]/g,'');
    //console.log('用户',uid,'生成token',token);
    let _that = this;
    return new Promise(function(resolve, reject){
      _that.client.hmset('tokens',
        [token, uid],
        function(err, result){
          if (err){
            // logger.error('保存验证码失败',err);
            return reject(err);
          }
          return resolve(token);
        }
      );
    });
  }
  getConfigGagRule () {
    return this.rclient.get(this.configGagRuleKey).then(result => {
      let configGagRule = parseInt(result);
      let defaultRule = 7200;
      if (!isNaN(configGagRule)) return configGagRule;
      else return this.rclient.set(this.configGagRuleKey, defaultRule).then(result => defaultRule);
    });
  }
  setGagUser (ttl,userId) {
    return this.wclient.setex(this.gagUser + userId, ttl, 2);
  }
  getGagUser (userId) {
    return this.rclient.get(this.gagUser + userId);
  }
  delGagUser (userId) {
    return this.wclient.del(this.gagUser + userId);
  }
}
module.exports = redisUserModel;
