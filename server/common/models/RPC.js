'use strict';
var app=require('../app');
var server=app.server;
var controllers= app.controllers;
var sendauthcodeOBJForRPC = server.datasources.db.define('sendauthcodeOBJForRPC', {
  itucode: { type: String, require: true, default: '86', description: "区号" },
  phone: { type: String, require: true, default: "12345678901", description: "手机号" },
  code: { type: String, require: true, default: "0000", description: "手机号验证码" }
}, {
    description: ' ',
    idInjection: false, strict: true
  });
var UserOBJ = server.datasources.db.define('UserOBJ', {
  id: {type: Number, require: true, default: 2, description: "1 安卓 2 ios" },
  phonetype: { type: String, require: true, default: "xiaomi6", description: "手机型号" },
  phonemodel: { type: Number, require: true, default: 2, description: "1 安卓 2 ios" },
  itucode: { type: String, require: true, default: '86', description: "区号" },
  phone: { type: String, require: true, default: "12345678901", description: "电话号码" },
  nickname: { type: String, require: true, default: "new_nickname", description: "修改昵称，不需要不要传" },
  avatar: { type: String, require: true, default: "1111111", description: "修改头像，不需要不要传" },
  smallavatar: { type: String, require: true, default: "1111111", description: "修改小头像，不需要不要传" },
  sex: { type: String, require: true, default: 3, description: "修改性别，不需要不要传" },
  birthday: { type: String, require: true, default: 1505532061, description: "修改生日（时间戳），不需要不要传" },
  professional: { type: String, require: true, default: "搬砖工", description: "修改职业，不需要不要传" },
  address: { type: String, require: true, default: "三途川910号", description: "修改地址，不需要不要传" }
}, {
    description: '',
    idInjection: false, strict: false
  }
);
var UserAuthOBJ = server.datasources.db.define('UserAuthOBJ', {
  uid: {type: Number, require: true, default: 2, description: "uid" },
  identity_type: {type: Number, require: true, default: 2, description: "1 手机号 2.3.4 第三方" },
  identifier: {type: Number, require: true, default: 2, description: "" },
  credential: {type: Number, require: true, default: 2, description: "密码" },
  is_sync: {type: Number, require: true, default: 0, description: "" }
}, {
    description: '',
    idInjection: false, strict: false
  }
);
var UserRegisterOBJ = server.datasources.db.define('UserRegisterOBJ', {
  register: {type: Number, require: true, default: 2, description: "register" },
  register_type: {type: Number, require: true, default: 2, description: "register_type" },
  status: {type: Number, require: true, default: 2, description: "status" },
  uid: {type: Number, require: true, default: 2, description: "uid" },
  id: {type: Number, require: true, default: 2, description: "id" },
}, {
    description: '',
    idInjection: false, strict: false
  }
);
var ImportUserObj = server.datasources.db.define('ImportUserObj', {
  user: {type: 'UserOBJ', require: true, default: 2, description: "register" },
  userAuth: {type: 'UserAuthOBJ', require: true, description: "register_type" },
  userRegister: {type: 'UserRegisterOBJ', require: true,  description: "status" }
}, {
    description: '',
    idInjection: false, strict: false
  }
);
// var updateUserInfoOBJ = server.datasources.db.define('updateUserInfoOBJ', {
//   nickname: { type: String, require: true, default: "new_nickname", description: "修改昵称，不需要不要传" },
//   avatar: { type: String, require: true, default: "1111111", description: "修改头像，不需要不要传" },
//   smallavatar: { type: String, require: true, default: "1111111", description: "修改小头像，不需要不要传" },
//   sex: { type: String, require: true, default: 3, description: "修改性别，不需要不要传" },
//   birthday: { type: String, require: true, default: 1505532061, description: "修改生日（时间戳），不需要不要传" },
//   professional: { type: String, require: true, default: "搬砖工", description: "修改职业，不需要不要传" },
//   address: { type: String, require: true, default: "三途川910号", description: "修改地址，不需要不要传" }
// }, {
//     description: '',
//     idInjection: false, strict: false
//   });

// var tokenInfoOBJ = server.datasources.db.define('tokenInfoOBJ', {
//   _uid: {type: Number, required: true, default: 0, description: "token中获取的uid"},
//   _ip: {type: Number, required: true, default: 0, description: "token中获取的uid"},
//   _appid: {type: Number, required: true, default: 0, description: "token中获取的uid"},
//   // _uid: {type: Number, required: true, default: 0, description: "token中获取的uid"},
// }, {
//     description: '',
//     idInjection: false, strict: false
//   });

module.exports = function(RPC) {

};

