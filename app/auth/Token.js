'use strict';
const models = require('../models');
const Promise=require("bluebird");
var jwt = require('jwt-simple');
const eutil=require("eutil");
const util=require("../util");
class Token {
  constructor(){
    this.util=util;
    this.config=this.util.config;
    this.tokenConfig=this.config.token;
    this.tokenTTl=30;
  }
  // 粉丝端来宾用户
  encodeToken(appid){
    let _self = this;
    let payload={appid:appid,
      // iat:eutil.getTimeSeconds(),
      exp:eutil.getTimeSeconds(eutil.dateAddSeconds(new Date(),_self.tokenConfig.guest.expiresIn))};
    return {
      token:jwt.encode(payload, _self.tokenConfig.guest.secret,_self.tokenConfig.guest.algorithm),
      expiresIn:_self.tokenConfig.guest.expiresIn-_self.tokenTTl
    };
  }

  decodeToken(payload) {
    let _self = this;
    return Promise.resolve().then(() => {
      let decode = jwt.decode(payload, _self.tokenConfig.guest.secret);
      return {
        appid: decode.appid,
        expiresIn: decode.exp - eutil.getTimeSeconds()
      };
    }).catch((err) => {
      if (err.message == "Token expired") return -1;
      else  return null;

    });
  }
  //粉丝端的 用户
  encodeuserToken(uid){
    let _self = this;
    let payload={uid:uid,
      // iat:eutil.getTimeSeconds(),
      exp:eutil.getTimeSeconds(eutil.dateAddSeconds(new Date(),_self.tokenConfig.user.expiresIn))};
    return {
      token:jwt.encode(payload, _self.tokenConfig.user.secret,_self.tokenConfig.user.algorithm),
      expiresIn:_self.tokenConfig.user.expiresIn-_self.tokenTTl
    };
  }
  decodeuserToken(payload){
    let _self = this;
    return Promise.resolve().then(()=>{
        let decode=jwt.decode(payload, _self.tokenConfig.user.secret);
    return {
      uid:decode.uid,
      expiresIn: decode.exp-eutil.getTimeSeconds()
    };
  }).catch((err)=>{
      if(err.message=="Token expired") return -1;
     else  return  null;
  });
  }

  // 粉丝端来宾用户
  encode_guestToken(appid){
    let _self = this;
    let payload={appid:appid,
      // iat:eutil.getTimeSeconds(),
      exp:eutil.getTimeSeconds(eutil.dateAddSeconds(new Date(),_self.tokenConfig.star_guest.expiresIn))};
    return {
      token:jwt.encode(payload, _self.tokenConfig.star_guest.secret,_self.tokenConfig.star_guest.algorithm),
      expiresIn:_self.tokenConfig.star_guest.expiresIn-_self.tokenTTl
    };
  }

  decode_guestToken(payload){
    let _self = this;
    return Promise.resolve().then(()=>{
      let decode=jwt.decode(payload, _self.tokenConfig.star_guest.secret);
      return {
        appid:decode.appid,
        expiresIn: decode.exp-eutil.getTimeSeconds()
      };
    }).catch((err)=>{
      if(err.message=="Token expired") return -1;
      else  return  null;
    });
  }

  // 粉丝端来宾用户
  // (appid){
  //   let _self = this;
  //   let payload={appid:appid,
  //     // iat:eutil.getTimeSeconds(),
  //     exp:eutil.getTimeSeconds(eutil.dateAddSeconds(new Date(),_self.tokenConfig.star_guest.expiresIn))};
  //   return {
  //     token:jwt.encode(payload, _self.tokenConfig.star_guest.secret,_self.tokenConfig.star_guest.algorithm),
  //     expiresIn:_self.tokenConfig.star_guest.expiresIn-_self.tokenTTl
  //   };
  // }
  //
  // (payload){
  //   let _self = this;
  //   return Promise.resolve().then(()=>{
  //     let decode=jwt.decode(payload, _self.tokenConfig.star_guest.secret);
  //     return {
  //       appid:decode.appid,
  //       expiresIn: decode.exp-eutil.getTimeSeconds()
  //     };
  //   }).catch((err)=>{
  //      console.log(err)
  //     if(err.message=="Token expired") return -1;
  //     else  return  null;
  //   });
  // }

  // 版主端用户
  encodeStarToken(appid){
    let _self = this;
    let payload={uid:appid,
      // iat:eutil.getTimeSeconds(),
      exp:eutil.getTimeSeconds(eutil.dateAddSeconds(new Date(),_self.tokenConfig.star_user.expiresIn))};
    return {
      token:jwt.encode(payload, _self.tokenConfig.star_user.secret,_self.tokenConfig.star_user.algorithm),
      expiresIn:_self.tokenConfig.star_user.expiresIn-_self.tokenTTl
    };
  }
  decodeStarToken(payload){
    let _self = this;
    return Promise.resolve().then(()=>{
      let decode=jwt.decode(payload, _self.tokenConfig.star_user.secret);
      return {
        uid:decode.uid,
        expiresIn: decode.exp-eutil.getTimeSeconds()
      };
    }).catch((err)=>{
      if(err.message=="Token expired") return -1;
      else  return  null;
    });
  }


  // encodeinsideToken(data){
  //   let _self = this;
  //   let payload={iat:new Date(),exp:eutil.dateAddSeconds(new Date(),_self.tokenConfig.inside.expiresIn)};
  //   return jwt.encode(payload, _self.tokenConfig.inside.secret,_self.tokenConfig.inside.algorithm);
  // }
  // decodeinsideToken(payload){
  //   let _self = this;
  //   let decode=jwt.decode(payload, _self.tokenConfig.inside.secret);
  //   return decode.exp-decode.iat;
  // }

  //  内部服务器 RPC 调用 token
  encodeInsideToken(appid){
    let _self = this;
    let payload={
      system:appid
    };
    return {
      token:jwt.encode(payload, _self.tokenConfig.inside.secret,_self.tokenConfig.inside.algorithm),
      expiresIn:_self.tokenConfig.inside.expiresIn-_self.tokenTTl
    };
  }
  decodeInsideToken(payload) {
    let _self = this;
    return Promise.resolve().then(()=>{
      let decode=jwt.decode(payload, _self.tokenConfig.inside.secret);
      return {
        system:decode.system
      };
    }).catch((err)=>{
      if(err.message=="Token expired") return -1;
      else  return  null;
    });
  }

}
module.exports =new Token();
