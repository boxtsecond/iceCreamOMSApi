/*
 * @Author: dongyuxuan 
 * @Date: 2017-10-23 17:55:45 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2018-01-04 14:00:13
 */
'use strict';

var jwt = require('jwt-simple');
var base64 = require('base-64');
var app=require('../app');
var server=app.server;
var controllers= app.controllers;

var updateDiscoverDisplayScoreOBJ = server.datasources.db.define('updateDiscoverDisplayScoreOBJ', {
  sid: { type: Number, require: true, default: 1, description: "郑爽  1 杨幂 2", http: { source: 'body' } },
  idAndScoreList: [{ type: 'idAndScoreListOBJ', description: "" }],
}, {
    description: '',
    idInjection: false, strict: false
  });

  var idAndScoreListOBJ = server.datasources.db.define('idAndScoreListOBJ', {
    id: { type: Number, require: true, default: 2, description: "注意是id", http: { source: 'body' } },
    score: { type: Number, require: true, default: 1, description: "排序", http: { source: 'body' } },
  }, {
      description: '',
      idInjection: false, strict: false
    });


module.exports = function(Discover) {

  Discover.listBySid = controllers.Discover.listBySid;
  Discover.beforeRemote('listBySid', controllers.Token.verify_userToken);
  Discover.remoteMethod('listBySid', {
    description: '【需要粉丝用户token】根据小星空等级获取发现列表 [已完成]',
    http: { path: '/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number', description: '小星空等级id,郑爽  1 杨幂 2', http: { source: 'path' } },
    ]
  });
  Discover.listBySidWithStarToken = controllers.Discover.listBySid;
  Discover.beforeRemote('listBySidWithStarToken', controllers.Token.verify_userStarToken_skipBlacklist);
  Discover.remoteMethod('listBySidWithStarToken', {
    description: '【需要版主用户token】根据小星空等级获取发现列表 [已完成]',
    http: { path: '/Star/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number', description: '小星空等级id,郑爽  1 杨幂 2', http: { source: 'path' } },
    ]
  });

  Discover.updateDiscoverDisplayScore = controllers.Discover.updateDiscoverDisplayScore;
  Discover.remoteMethod('updateDiscoverDisplayScore', {
    description: '【需要版主token】修改发现排序 [已完成]',
    http: { path: '/updateDiscoverDisplayScore', verb: 'post' },
    returns: [
      {
        arg: 'code', type: 'number', required: true,
        description: '2000 success \n'
      },
      { arg: 'msg', type: 'string', required: true },
      { arg: 'result', type: 'array', required: true }
    ],
    accepts: [
      { arg: 'data', type: 'updateDiscoverDisplayScoreOBJ', description: 'url ', http: { source: 'body' } },
    ]
  });


};