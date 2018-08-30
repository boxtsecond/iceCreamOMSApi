/*
 * @Author: dongyuxuan 
 * @Date: 2017-10-23 17:55:45 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-10-27 15:56:57
 */
'use strict';

var jwt = require('jwt-simple');
var base64 = require('base-64');
var app=require('../app');
var server=app.server;
var controllers= app.controllers;

var UserTagOBJ = server.datasources.db.define('UserTagOBJ', {
  name: { type: String, require: true, default:"黑", description: "" }
}, {
  description: '',
  idInjection: false, strict: false
});

module.exports = function(UserTag) {

  UserTag.save = controllers.UserTag.save;
  UserTag.beforeRemote('save', controllers.Token.verify_userStarToken);
  UserTag.remoteMethod('save', {
    description: '【需要版主用户token】添加标签 [已完成]',
    http: { path: '/', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'UserTagOBJ', description: '添加标签', http: { source: 'body' } },    
    ]
  });
  UserTag.upsert = controllers.UserTag.upsert;
  UserTag.beforeRemote('upsert', controllers.Token.verify_userStarToken);
  UserTag.remoteMethod('upsert', {
    description: '【需要版主用户token】添加或编辑标签 [已完成]',
    http: { path: '/:id', verb: 'put' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'UserTagOBJ', description: '标签对象（id以外都包括）', http: { source: 'body' } }, 
      { arg: 'id', type: 'number', description: '标签id', http: { source: 'path' } },    
    ]
  });
};