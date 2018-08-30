'use strict';
var jwt = require('jwt-simple');
var base64 = require('base-64');
// 快速登录
var botservices=require('../services');
const TokenService=botservices.get("TokenService");

const util=botservices.get("util");
const authToken=require("../auth/Token");
const models = require('../models');
const Joi=util.Joi;
TokenService.init();

class Token {
  getToken(data){
    //去redis 中验证  appid  appsecret
      return Promise.resolve()
          .then(()=>{
          const schema = Joi.object().keys({
              appid: Joi.string().valid("591d94b5-dfa9-4216-a597-c22464bdd309","00886","00852","00853").required(),
              appsecret: Joi.string().valid("98fe6629-1e25-408b-9db4-8cca1a8d02d3","00886","00852","00853").required()
            // appsecret: Joi.string().required()
          });
      return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });

    })
    .then(() => {
        return TokenService.getAPPkeys(data.appid,data.appsecret,TokenService.token_redisKey_Fans_guest).then((res)=>{
            if(res)  {
              return Promise.resolve([2000, "ok", authToken.encodeToken(data.appid)]);
            }
            else return Promise.reject([4001, "appid 非法", {}]);
        });

    })
    .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }
  // 验证来宾中间件
  verify_getToken(context, unused, next) {
     Promise.resolve().then(()=> {
        let token = util.getAccessToken(context.req);
         return token ;
  }).then((token)=>{
        return authToken.decodeToken(token);
    })

  .then((dtoken)=>{
      if(dtoken == -1) {
         context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
       return  null;
      }
     else if(dtoken && dtoken.appid ) {
           return TokenService.getAPPkeysExists(dtoken.appid,TokenService.token_redisKey_Fans_guest).then((res) => {
             if(res){
                if(dtoken.expiresIn>0){
                  context.req.body._ip="0.0.0.0";
                  if(context.req.ip){
                    context.req.body._ip=context.req.ip;
                    context.req.query._ip=context.req.ip;
                    context.req.params._ip=context.req.ip;
                  }
                  context.req.body._appid=dtoken.appid;
                  context.req.query._appid=dtoken.appid;
                  context.req.params._appid=dtoken.appid;
                  next();
                  return res;
                }else return Promise.reject([4401, "token 过期", {}]);

             }
             else return Promise.reject([4402, "appid 非法", {}]);
        });
       }else{
        context.res.json( {
            "code": 4400,
             "msg": "验证token失败",
            "result": {}
            });
        return null;
      }
    })
  .catch((err)=>{
      context.res.json( {
      "code": 4400,
      "msg": "验证token失败",
      "result": {}
    });
      return null;
  });
  }

  // 验证用户中间件
  verify_userToken(context, unused, next) {
    Promise.resolve().then(()=> {
      return util.getAccessToken(context.req);
  }).then((token)=>{
      return authToken.decodeuserToken(token);
  }).then((dtoken)=>{
      if(dtoken == -1) {
        context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
        return  null;
       }
     else if(dtoken && dtoken.uid) {
        if(dtoken.expiresIn>0){
          context.req.body._ip=null;
          context.req.body._ip="0.0.0.0";
          if(context.req.ip){
            context.req.body._ip=context.req.ip;
            context.req.query._ip=context.req.ip;
            context.req.params._ip=context.req.ip;
          }
          context.req.body._uid=dtoken.uid;
          context.req.query._uid=dtoken.uid;
          context.req.params._uid=dtoken.uid;
  
          next();
          return null;
          //  验证用户状态是否被拉黑
          // return TokenService.getUserInfoStatus(dtoken.uid).then((user_status)=>{
          //        if(user_status)  {
          //          if(user_status==3){
          //            return Promise.reject([2004, "用户被拉黑", {}]);
          //          }else   {
          //              next();
          //            return null;
          //          }
          //        }
          //        else  return Promise.reject([4404, "非法用户", {}]);
          // });
        }else return Promise.reject([4401, "token 过期", {}]);
      }else{
        context.res.json( {
        "code": 4400,
        "msg": "验证token失败",
        "result": {}
      });
    return null;
  }
  })
  .catch((err)=>{
      context.res.json( {
      "code": 4400,
      "msg": "验证token失败",
      "result": {}
    });
    return null;
  });
  }

  // 验证用户中间件
  verify_userToken_skipBlacklist(context, unused, next) {
    Promise.resolve().then(()=> {
      return util.getAccessToken(context.req);
    }).then((token)=>{
      return authToken.decodeuserToken(token);
    }).then((dtoken)=>{
      if(dtoken == -1) {
        context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
        return  null;
      }
      else    if(dtoken && dtoken.uid) {
        if(dtoken.expiresIn>0){
          context.req.body._ip=null;
          context.req.body._ip="0.0.0.0";
          if(context.req.ip){
            context.req.body._ip=context.req.ip;
            context.req.query._ip=context.req.ip;
            context.req.params._ip=context.req.ip;
          }
          context.req.body._uid=dtoken.uid;
          context.req.query._uid=dtoken.uid;
          context.req.params._uid=dtoken.uid;
           next();
           return null;
        }else return Promise.reject([4401, "token 过期", {}]);
      }else{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      }
    })
      .catch((err)=>{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      });
  }



  refreshgToken(data){
    return Promise.resolve()
        .then(()=>{
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          _appid: Joi.string().required(),
          access_token: Joi.string().empty(''),
          token: Joi.string().empty(''),
          authorization: Joi.string().empty(''),
          auth: Joi.string().empty('')
        });
    return util.schemaValidator(schema,data).then((res)=>{
        if(res) return Promise.reject([4000, res, {}]);
       else return res;
  });

  })
  .then(() => {
      return TokenService.getAPPkeys_refresh(data._appid,TokenService.token_redisKey_Fans_guest).then((res)=>{
        if(res)  {
          return Promise.resolve([2000, "ok", authToken.encodeToken(data.appid)]);

        }
        else return Promise.reject([4001, "appid 非法", {}]);
  });
  })
  .catch(function(res){
      if (util.eutil.isArray(res)) return Promise.resolve(res);
      else return Promise.reject(res);
    });
  }

  refreshuToken(data){
    return Promise.resolve()
        .then(()=>{
        const schema = Joi.object().options({ convert: false }).keys({
          _uid: Joi.number().required(),
          _ip: Joi.string().empty(''),
          access_token: Joi.string().empty(''),
          token: Joi.string().empty(''),
          authorization: Joi.string().empty(''),
          auth: Joi.string().empty('')
        });
    return util.schemaValidator(schema,data).then((res)=>{
        if(res) return Promise.reject([4000, res, {}]);
         else return res;
  });

  })
  .then(() => {
      return Promise.resolve([2000, "success",  authToken.encodeuserToken(data._uid)]);
  })
  .catch(function(res){
      if (util.eutil.isArray(res)) return Promise.resolve(res);
      else return Promise.reject(res);
    });
  }

  // 获取版主访问token
  getstarToken(data){
    return Promise.resolve()
      .then(()=>{
        const schema = Joi.object().options({ convert: false }).keys({
          appid: Joi.string().valid("50a5bc5d-7174-4d6e-b814-31939636a478","00886","00852","00853").required(),
          appsecret: Joi.string().valid("7cca8405-a4e1-460b-92c8-1316b28ae184","00886","00852","00853").required()
          // appsecret: Joi.string().required()
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return TokenService.getAPPkeys(data.appid,data.appsecret,TokenService.token_redisKey_Star_guest).then((res)=>{
          if(res)  {
            return Promise.resolve([2000, "ok", authToken.encode_guestToken(data.appid)]);
          }
          else return Promise.reject([4001, "appid 非法", {}]);
        });

      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }

  // 验证来并版主来宾中间件
  verify_star_guestToken(context, unused, next) {
    Promise.resolve().then(()=> {
      let token = util.getAccessToken(context.req);
      return token ;
    }).then((token)=>{
      return authToken.decode_guestToken(token);
    })
      .then((dtoken)=>{
        if(dtoken == -1) {
          context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
          return  null;
        }
        else if(dtoken && dtoken.appid ) {
          return TokenService.getAPPkeysExists(dtoken.appid,TokenService.token_redisKey_Star_guest).then((res) => {
            if(res){
              if(dtoken.expiresIn>0){
                context.req.body._ip="0.0.0.0";
                if(context.req.ip){
                  context.req.body._ip=context.req.ip;
                  context.req.query._ip=context.req.ip;
                  context.req.params._ip=context.req.ip;
                }
                context.req.body._appid=dtoken.appid;
                context.req.query._appid=dtoken.appid;
                context.req.params._appid=dtoken.appid;
                next();
                return res;
              }else return Promise.reject([4401, "token 过期", {}]);

            }
            else return Promise.reject([4402, "appid 非法", {}]);
          });
        }else{
          context.res.json( {
            "code": 4400,
            "msg": "验证token失败",
            "result": {}
          });
          return null;
        }
      })
      .catch((err)=>{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      });
  }
  // 刷新版主端来宾中间件
  refreshstarToken(data){
    return Promise.resolve()
      .then(()=>{
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          access_token: Joi.string().empty(''),
          token: Joi.string().empty(''),
          authorization: Joi.string().empty(''),
          auth: Joi.string().empty(''),
          _appid: Joi.string().required(),
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });

      })
      .then(() => {
        return TokenService.getAPPkeys_refresh(data._appid,TokenService.token_redisKey_Star_guest).then((res)=>{
          if(res)  {
            return Promise.resolve([2000, "ok", authToken.encodeToken(data.appid)]);
          }
          else return Promise.reject([4001, "appid 非法", {}]);
        });
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });
  }

  // 验证版主用户中间件
  verify_userStarToken(context, unused, next) {
    Promise.resolve().then(()=> {
      return util.getAccessToken(context.req);
    }).then((token)=>{
      return authToken.decodeStarToken(token);
    }).then((dtoken)=>{
      if(dtoken == -1) {
        context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
        return  null;
      }
      else    if(dtoken && dtoken.uid) {
        if(dtoken.expiresIn>0){
          context.req.body._ip=null;
          context.req.body._ip="0.0.0.0";
          if(context.req.ip){
            context.req.body._ip=context.req.ip;
            context.req.query._ip=context.req.ip;
            context.req.params._ip=context.req.ip;
          }
          context.req.body._uid=dtoken.uid;
          context.req.query._uid=dtoken.uid;
          context.req.params._uid=dtoken.uid;
          //  验证用户状态是否被拉黑
          return TokenService.getUserInfoStatus(dtoken.uid).then((user_status)=>{
            if(user_status)  {
              if(user_status==3){
                return Promise.reject([2004, "用户被拉黑", {}]);
              }else  {
                next();
                return null;
              }
            }
            else  return Promise.reject([4404, "非法用户", {}]);
          });
        }else return Promise.reject([4401, "token 过期", {}]);
      }else{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      }
    })
      .catch((err)=>{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      });
    // TokenService.verifyGetToken(token)
    //  验证guest token
    // console.log(context.req.body)
    //     next();
  }

  // 验证版主用户中间件
  verify_userStarToken_skipBlacklist(context, unused, next) {
    Promise.resolve().then(()=> {
      return util.getAccessToken(context.req);
    }).then((token)=>{
      return authToken.decodeStarToken(token);
    }).then((dtoken)=>{
      if(dtoken == -1) {
        context.res.json( {  "code": 4401,   "msg": "token 过期",  "result": {} });
        return  null;
      }
      else    if(dtoken && dtoken.uid) {
        if(dtoken.expiresIn>0){
          context.req.body._ip=null;
          context.req.body._ip="0.0.0.0";
          if(context.req.ip){
            context.req.body._ip=context.req.ip;
            context.req.query._ip=context.req.ip;
            context.req.params._ip=context.req.ip;
          }
          context.req.body._uid=dtoken.uid;
          context.req.query._uid=dtoken.uid;
          context.req.params._uid=dtoken.uid;
          //  验证用户状态是否被拉黑
          next();
          return null;
        }else return Promise.reject([4401, "token 过期", {}]);
      }else{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      }
    })
      .catch((err)=>{
        context.res.json( {
          "code": 4400,
          "msg": "验证token失败",
          "result": {}
        });
        return null;
      });
    // TokenService.verifyGetToken(token)
    //  验证guest token
    // console.log(context.req.body)
    //     next();
  }


  // 刷新 版主端来宾中间件
  refreshstaruToken(data){
    return Promise.resolve()
      .then(()=>{
        const schema = Joi.object().options({ convert: false }).keys({
          _uid: Joi.number().required(),
          _ip: Joi.string().empty(''),
          access_token: Joi.string().empty(''),
          token: Joi.string().empty(''),
          authorization: Joi.string().empty(''),
          auth: Joi.string().empty('')
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });

      })
      .then(() => {
        return Promise.resolve([2000, "success",  authToken.encodeStarToken(data._uid)]);
      })
      .catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else return Promise.reject(res);
      });{}
  }



}
module.exports=new Token();
