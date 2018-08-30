'use strict';

var jwt = require('jwt-simple');
var base64 = require('base-64');
var app=require('../app');
var server=app.server;
var controllers= app.controllers;
var guestTokenOBJ=server.datasources.db.define('guestTokenOBJ', {
  appid: {type:String,require:true,default:"591d94b5-dfa9-4216-a597-c22464bdd309",description:"appid"},
  appsecret: {type:String,require:true,default:"98fe6629-1e25-408b-9db4-8cca1a8d02d3",description:"appsecret"}
}, {
  idInjection: false, strict: false
});

var guestStarTokenOBJ=server.datasources.db.define('guestStarTokenOBJ', {
  appid: {type:String,require:true,default:"50a5bc5d-7174-4d6e-b814-31939636a478",description:"appid"},
  appsecret: {type:String,require:true,default:"7cca8405-a4e1-460b-92c8-1316b28ae184",description:"appsecret"}
}, {
  idInjection: false, strict: false
});

var refreshTokenOBJ=server.datasources.db.define('refreshTokenOBJ', {
  access_token: {type:String,require:true,default:"",description:"access_token"}
}, {
  idInjection: false, strict: false
});
// expires_in
// refresh_token
module.exports = function(APP) {
  APP.getToken =controllers.Token.getToken;
  APP.userToken =controllers.Token.userToken;
  APP.insideToken =controllers.Token.insideToken;
  APP.beforeRemote('refreshgToken', controllers.Token.verify_getToken);
  APP.beforeRemote('refreshuToken', controllers.Token.verify_userToken);
  APP.refreshgToken =controllers.Token.refreshgToken;
  APP.refreshuToken =controllers.Token.refreshuToken;

  APP.getstarToken =controllers.Token.getstarToken;
  APP.beforeRemote('refreshstarToken', controllers.Token.verify_star_guestToken);
  APP.refreshstarToken =controllers.Token.refreshstarToken;


  APP.beforeRemote('refreshstaruToken', controllers.Token.verify_userStarToken);
  APP.refreshstaruToken =controllers.Token.refreshstaruToken;
  APP.remoteMethod('getToken', {
    description: '粉丝端 guest token  来宾用户 [已完成]' ,
    http: { path: '/getToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 登录成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'guestTokenOBJ', default:"name", description: 'url ',required: true, http: { source: 'body' } },
    ]
  });

  APP.remoteMethod('refreshgToken', {
    description: ' 粉丝端 guest token 换新的token [已完成]' ,
    http: { path: '/refreshgToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'access_token', type: 'refreshTokenOBJ', default:"name", description: '',required: true ,http: { source: 'body' }},
    ]
  });

  APP.remoteMethod('refreshuToken', {
    description: ' 粉丝端用户token 换新的token [已完成]' ,
    http: { path: '/refreshuToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'access_token', type: 'refreshTokenOBJ', default:"name", description: '',required: true ,http: { source: 'body' }},
    ]
  });
  // APP.remoteMethod('insideToken', {
  //   description: ' 服务器内部通讯 token [未完成]' ,
  //   http: { path: '/insideToken', verb: 'post' },
  //   returns:[
  //     {arg: 'code', type: 'number', required: true ,
  //       description: '2000 登录成功 \n'
  //     },
  //     {arg: 'msg', type: 'string', required: true},
  //     {arg: 'result', type: 'array', required: true}
  //   ],
  //   accepts: [
  //     { arg: 'data', type: 'guestTokenOBJ', default:"name", description: 'url ',required: true, http: { source: 'body' } }
  //   ]
  // });



  APP.remoteMethod('getstarToken', {
    description: ' 版主端 guest token  来宾用户 [已完成]' ,
    http: { path: '/getstarToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 登录成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'guestStarTokenOBJ', default:"name", description: 'url ',required: true, http: { source: 'body' } },
    ]
  });
  APP.remoteMethod('refreshstarToken', {
    description: ' 版主端 guest token 换新的token [已完成]' ,
    http: { path: '/refreshstarToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'access_token', type: 'refreshTokenOBJ', default:"name", description: '',required: true ,http: { source: 'body' }},
    ]
  });
  APP.remoteMethod('refreshstaruToken', {
    description: ' 版主端 用户token 换新的token [已完成]' ,
    http: { path: '/refreshstaruToken', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 成功 \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'access_token', type: 'refreshTokenOBJ', default:"name", description: '',required: true ,http: { source: 'body' }},
    ]
  });

};
