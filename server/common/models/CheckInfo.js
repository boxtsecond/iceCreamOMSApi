/*
 * @Author: dongyuxuan 
 * @Date: 2017-10-23 17:55:45 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-12-12 16:14:52
 */
'use strict';

var jwt = require('jwt-simple');
var base64 = require('base-64');
var app=require('../app');
var server=app.server;
var controllers= app.controllers;
var addCheckInfoOBJ = server.datasources.db.define('addCheckInfoOBJ', {
  check_time: { type: Number, require: true, description: "签到时间" },
  sid: { type: Number, default: 1, description: "1。郑爽" },
}, {
  description: '',
  idInjection: false, strict: false
});
module.exports = function(CheckInfo) {

  CheckInfo.checkIn = controllers.CheckInfo.checkIn;
  CheckInfo.beforeRemote('checkIn', controllers.Token.verify_userToken);
  CheckInfo.remoteMethod('checkIn', {
    description: '【需要粉丝用户token】粉丝签到 [未完成]',
    http: { path: '/checkIn/:sid', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number', default: 1, description: '小星空等级id,郑爽  1 杨幂 2', http: { source: 'path' } },
      { arg: 'data', type: "object", description: '', http: function (ctx) { return ctx.req.query; } },   
    ]
  });





  // CheckInfo.updateAttributes = controllers.CheckInfo.updateAttributes;
  // CheckInfo.beforeRemote('updateAttributes', controllers.Token.verify_userToken);
  // CheckInfo.remoteMethod('updateAttributes', {
  //   description: '【需要粉丝用户token】修改或添加 checkInfo [已完成]',
  //   http: { path: '/:id', verb: 'patch' },
  //   returns:[
  //     {arg: 'code', type: 'number', required: true ,
  //       description: '2000 success \n'
  //     },
  //     {arg: 'msg', type: 'string', required: true},
  //     {arg: 'result', type: 'array', required: true}
  //   ],
  //   accepts: [
  //     { arg: 'attributes', type: 'UpdateCheckInfoOBJ', description: 'updateData,{icon:""}', http: { source: 'body' } },
  //     { arg: 'id', type: 'number', description: 'checkInfoid', http: { source: 'path' } },
  //   ]
  // });
  // CheckInfo.find = controllers.CheckInfo.find;
  // CheckInfo.beforeRemote('find', controllers.Token.verify_userToken);
  // CheckInfo.remoteMethod('find', {
  //   description: '【需要粉丝用户token】查询checkInfo（只查mysql） [已完成]',
  //   http: { path: '/', verb: 'get' },
  //   returns:[
  //     {arg: 'code', type: 'number', required: true ,
  //       description: '2000 success \n'
  //     },
  //     {arg: 'msg', type: 'string', required: true},
  //     {arg: 'result', type: 'array', required: true}
  //   ],
  //   accepts: [
  //     { arg: 'fields', type: 'array', description: '返回字段，["id","goods_name",...]', http: {source: 'query'}},
  //     { arg: 'where', type: 'object', description: '查询条件,{"status":"2"}', http: {source: 'query'}},
  //     { arg: 'order', type: 'string', description: '排序条件,ctime DESC', http: {source: 'query'}},
  //     { arg: 'limit', type: 'number', description: '分页用,获取记录数', http: {source: 'query'}},
  //     { arg: 'skip', type: 'number', description: '分页用，跳过记录数', http: {source: 'query'}},
  //     { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},  
  //   ]
  // });
  // CheckInfo.listBySid = controllers.CheckInfo.listBySid;
  // CheckInfo.beforeRemote('listBySid', controllers.Token.verify_userToken);
  // CheckInfo.remoteMethod('listBySid', {
  //   description: '【需要粉丝用户token】根据小星空等级遍历checkInfo [已完成]',
  //   http: { path: '/sid/:sid', verb: 'get' },
  //   returns:[
  //     {arg: 'code', type: 'number', required: true ,
  //       description: '2000 success \n'
  //     },
  //     {arg: 'msg', type: 'string', required: true},
  //     {arg: 'result', type: 'array', required: true}
  //   ],
  //   accepts: [
  //     { arg: 'sid', type: 'number', description: '小星空等级id,郑爽  1 杨幂 2', http: { source: 'path' } },
  //     { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},  
  //   ]
  // });
  // CheckInfo.delById = controllers.CheckInfo.delById;
  // CheckInfo.beforeRemote('delById', controllers.Token.verify_userToken);
  // CheckInfo.remoteMethod('delById', {
  //   description: '【需要粉丝用户token】删除checkInfo [已完成]',
  //   http: { path: '/', verb: 'delete' },
  //   returns:[
  //     {arg: 'code', type: 'number', required: true ,
  //       description: '2000 success \n'
  //     },
  //     {arg: 'msg', type: 'string', required: true},
  //     {arg: 'result', type: 'array', required: true}
  //   ],
  //   accepts: [
  //     { arg: 'id', type: 'number', description: 'checkInfoid', http: {source: 'query'}},
  //     { arg: 'sid', type: 'number', description: 'checkInfoid', http: {source: 'query'}}, 
  //   ]
  // });
};