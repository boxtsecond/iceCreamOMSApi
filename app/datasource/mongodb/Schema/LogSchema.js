'use strict';
var mongoose = require('mongoose');
var eutil=require('eutil');

var options={versionKey: false};
var config= {
  //   用户id
  fromSource:{type:Number, default:1},// 操作者ID // 1 雪糕群  2  运营后台
  operatoid:{type:Number, default:-1},// 操作者ID
  uid:{type:Number, default:-1},// 被操作者ID
  remoteAccessIP:{type:String,require:true,default:"0.0.0.0"},// 远程访问IP
  subject:{type:String,require:true,default:"system"}, // 主题 版主操作：star 系统日志：system，粉丝操作：fan
  content:{type:String,require:true,default:""},// 内容
  ctime: { type: Number, default: eutil.getTimeSeconds(), index: true },
  mtime: { type: Number, default: eutil.getTimeSeconds(), index: true },
  level:{ type: Number, default:1 },
  role_id:{type:Number, default:1}, //操作模块id
  sid: {type:Number, default:1} // 小星空等级 1.郑爽
};
module.exports={
    options:options,
    config:config
};
