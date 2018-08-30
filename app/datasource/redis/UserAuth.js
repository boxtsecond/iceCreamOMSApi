'use strict';
var uuid = require('uuid/v1');
var _ = require('lodash');


class redisUserModel{
  constructor(wclient,rclient){
    this.wclient=wclient;
    this.rclient=rclient;
  }
  // 挪到 SMS.js
  // getUserAuthCodeTtl(itucode,phone){
  //   let key = "phone_"+itucode+phone;
  //   return  this.rclient.ttl(key);
  // }
  // setUserAuthCode(ttl,itucode,phone,code){
  //   let key = "phone_"+itucode+phone;
  //     return this.wclient.setex(key,ttl,code);
  // }
  //   getUserAuthCode(itucode,phone){
  //     let key =  'phone_'+itucode+phone;
  //     return this.rclient.get(key);
  //   }



  getUserAuth(userAuth) {
		return this.rclient.hget('auth:'+userAuth.identity_type, userAuth.identifier)
			.then(res => {
				if (res) {
           let result= JSON.parse(res);
           if(result.uid) return result;
           else return null;
        }
        else return null;
			});
  }
  getUserAuthUid(userAuth) {
    return this.rclient.hget('auth:'+userAuth.identity_type, userAuth.identifier)
        .then(res => {
        if (res) {
          let result= JSON.parse(res);
          if(result.uid) result.uid;
          else return null;
        }
        else return null;
      });
  }
  delUserAuth(identity) {
    return this.wclient.hdel('auth:'+identity.identity_type, identity.identifier);
  }


  setUserAuth (userAuth) {
    return this.wclient.hset('auth:'+userAuth.identity_type, userAuth.identifier, JSON.stringify(userAuth));
  }
}
module.exports = redisUserModel;
