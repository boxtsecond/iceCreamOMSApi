'use strict';
const models = require('../models');

class Token {
  constructor(app){
    this.mysqlAppKyesModel=app.get("mysqlAppKyesModel");
    this.redisUserAppKyesModel=app.get("redisUserAppKyesModel");
    // this.redisUserModel=app.get("redisUserModel");
    this.ttl=1800;
    this.token_redisKey_Fans_guest="appkeys";// 粉丝端redis appidkeys
    this.token_redisKey_Star_guest="appkeys_star";// 版主端redis appidkeys
  }
  init(){
    let _self = this;
    //加载粉丝端token
    this.mysqlAppKyesModel.getALLAPPKeysById(1).then((applist)=>{
       if(applist) {
        return  Promise.reduce(applist, function(_applist, item) {
              // console.log(item)
            _applist.push(item.appid);
            _applist.push(JSON.stringify({appsecret:item.appsecret,remark:item.remark}));
            return _applist;
         }, []).then(function(_applist) {
          return _self.redisUserAppKyesModel.setAppkeysList(_applist,_self.token_redisKey_Fans_guest);
         });
       }else return null;
    });
    // 加载版主端token
    this.mysqlAppKyesModel.getALLAPPKeysById(2).then((applist)=>{
      if(applist) {
        return  Promise.reduce(applist, function(_applist, item) {
          // console.log(item)
          _applist.push(item.appid);
          _applist.push(JSON.stringify({appsecret:item.appsecret,remark:item.remark}));
          return _applist;
        }, []).then(function(_applist) {
          return _self.redisUserAppKyesModel.setAppkeysList(_applist,_self.token_redisKey_Star_guest);
        });
      }else return null;
    });
  }
  getAPPkeys(appid,appsecret,key){
    return this.redisUserAppKyesModel.getAppkeys(appid,key).then((obj)=>{
        if(obj && obj.appsecret==appsecret) return obj;
          else  return null;
      });
  }
  getAPPkeys_refresh(appid,key){
    return this.redisUserAppKyesModel.getAppkeys(appid,key).then((obj)=>{
        if(obj) return obj;
       else  return null;
  });
  }
  getAPPkeysExists(appid,key){
    return this.redisUserAppKyesModel.getAppkeys(appid,key).then((obj)=>{
        if(obj) return true;
        else  return false;
  });
  }
  getUidExists(uid){
    return this.redisUserModel.existsUserInfoFromUid(uid);
  }
  getStarUidExists(uid){
    return this.redisUserModel.existsUserInfoFromUid(uid);
  }
  getUserInfoStatus(uid){
    return this.redisUserModel.getUserInfo(uid).then(user=>{
       if(user){
          return user.status;
       }
       else return null;
    });
  }
  verifyGetToken(token){
    // appid
     // return
  }
}
module.exports =Token;

//
//
//   module.exports = (app) => {
//   const {
//     redisUserModel,
//     redisUserAuthModel,
//     redisUserRegisterModel,
//     mysqlUserModel,
//     mysqlUserAuthModel,
//     mysqlUserRegisterModel
//   } = app.models;
//   // const eutil = app.get("Apiapp").util.eutil;
//
//   var service = {}
//   /**
//    * 登录 并 添加(更新) userRegister
//    * @param {dentity_type:Number, identifier: String, register: String, register_type: String}
//    */
//   // var model = {createUserRegisterModel}
//   service.login = (params) => {
//
//   }
//   /**
//    * 添加 user,userAuth,userRegister
//    */
//   service.register = (user, userAuth, userRegister) => {
//     return mysqlUserModel.addUserAuthRegister(user, userAuth, userRegister)
//       .catch(err => Promise.reject(new Error('mysql 写入错误')))
//       .then(res => redisUserModel.setUser(res.user)
//         .then(() => redisUserAuthModel.setUserAuth(res.userAuth))
//         .then(() => redisUserRegisterModel.setUserRegister(res.userRegister))
//         .then(() => Promise.resolve(res))
//       )
//       .catch(err => {
//         console.log(err)
//         return Promise.reject(new Error('redis 写入错误'))
//       })
//   }
//   /**
//    * @param {identity_type:Number, identifier: String}
//    */
//   service.getUserByAuth = (identity_type, identifier) => {
//     return service.getUserAuth(identity_type, identifier)
//       .then(res => {
//         if (!res.success) return res
//         else return service.getUserById(res.userAuth.uid)
//       }).catch(err => {
//         if (err instanceof Error) return Promise.reject(err)
//         else return Promise.resolve({success: false, user: null, msg: err})
//       })
//   }
//   /**
//    * @return Promise.then => {success: boolean, user: Object||null, msg:String||null}
//    */
//   service.getUserRegister = (userRegister) => {
//     return redisUserRegisterModel.getUserRegister(userRegister)
//       .then(res => {
//         if (res && res.id) return Promise.resolve({success: true, userRegister: res})
//         else return mysqlUserRegisterModel.getUserRegisters(userRegister)
//           .then(res => {
//             if (!res || !res.length) return Promise.resolve({success: false, msg: 'user_register: no available result'})
//             else return redisUserRegisterModel.setUserRegister(res[0])
//               .then(() => Promise.resolve({success: true, userRegister: res[0], msg: 'from mysql & redis insert success'}))
//               .catch(() => Promise.resolve({success: true, userRegister: res[0], msg: 'from mysql & redis insert success'}))
//           })
//       })
//   }
//   /**
//    * @param {identity_type:Number, identifier: String}
//    * @return Promise.then => {success: boolean, user: Object||null, msg:String||null}
//    */
//   service.getUserAuth = (identity_type, identifier) => {
//     var searchObj = {identity_type, identifier}
//     return redisUserAuthModel.getUserAuth(searchObj)
//       .then(res => {
//         if (res) return Promise.resolve({success: true, userAuth: res})
//         else return mysqlUserAuthModel.getUserAuthsByIdentity(searchObj)
//           .then(res => {
//             // if (res.length > 1) return new Error('同一验证只能有1条auth数据')
//             if (!res || !res.length) return Promise.resolve({success: false, msg: 'user_auth: no available result'})
//             else return redisUserAuthModel.setUserAuth(res[0])
//               .then(() => Promise.resolve({success: true, userAuth: res[0], msg: 'from mysql & redis insert success'}))
//               .catch(() => Promise.resolve({success: true, userAuth: res[0], msg: 'from mysql & redis insert success'}))
//           })
//       })
//   }
//   /**
//    * @return Promise.then => {success: boolean, user: Object||null, msg:String||null}
//    */
//   service.getUserById = (uid) => {
//     return redisUserModel.getUserById(uid)
//       .then(res => {
//         if (res) return Promise.resolve({success: true, user: res})
//         else return mysqlUserModel.getUserById(uid)
//           .then(res => {
//             if (!res || !res.length) return Promise.resolve({success: false, msg: 'user: no available result'})
//             else return redisUserModel.setUser(res[0])
//               .then(() => Promise.resolve({success: true, user: res[0], msg: 'from mysql & redis insert success'}))
//               .catch(() => Promise.resolve({success: true, user: res[0], msg: 'from mysql & redis insert failed'}))
//             })
//       })
//   }
//   /**
//    * @return Promise.then => object: userRegister
//    */
//   service.addUserRegister = (userRegister) => {
//     return mysqlUserRegisterModel.addUserRegister(userRegister)
//       .then(resUserRegister => redisUserRegisterModel.setUserRegister(resUserRegister)
//         .then(() => Promise.resolve(resUserRegister)))
//   }
//   /**
//    * @param object 完全覆盖redis中原值，mysql中参数包含的属性
//    * @return Promise.then => object: (userRegister === @param)
//    */
//   service.updateUserRegister = (userRegister, id) => {
//     return mysqlUserRegisterModel.updateUserRegister(userRegister, id)
//       .then(res => redisUserRegisterModel.setUserRegister(userRegister))
//       .then(() => Promise.resolve({success: true, userRegister}))
//   }
//   service.updateUser = (oldUser, updateUser) => {
//     var newUser = Object.assign(oldUser, updateUser)
//     return redisUserModel.setUser(newUser)
//       .then(res => {
//         return mysqlUserModel.updateUser(updateUser, oldUser.id)
//           .then(res => {
//             if (res) return Promise.resolve({success: true, user:newUser})
//             else return Promise.reject('user 添加失败')
//           })
//       })
//   }
//   /**
//    * @return Promise.then => Object: (success:boolean, userRegister:Object||null, msg:String||null)
//    */
//   service.putUserRegister = (userRegister) => {
//     return service.getUserRegister(userRegister)
//       .then(res => {
//         if (!res.success) return service.addUserRegister(userRegister)
//         else if (res.userRegister.register === userRegister.register) return {success: true, userRegister: userRegister}
//         else return service.updateUserRegister(userRegister, res.userRegister.id)
//       })
//   }
//   service.patchUser = (uid, updateUser) => {
//     return service.getUser(uid)
//       .then(res => service.updateUser(res.user, updateUser))
//       .catch(err => {
//         if (err instanceof Error) return Promise.reject(err)
//         else return Promise.resolve({success: false, user: null, msg: err})
//       })
//   }
//   return service
// };
