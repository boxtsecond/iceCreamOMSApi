'use strict';
var mongoose = require('mongoose');

var options={versionKey: false};
var config= {
    id:{type:Number,required:true},
    nickname:{type:String,require:true,default:"-1"},
    smallavatar:{type:String,require:true,default:"-1"},
    driver:{type:Number,require:true,default:1},
    role:{type:Number,require:true,default:1},// 用户角色
    status:{type:Number,require:true,default:1},//状态  1正常  2禁言  3拉黑
};
module.exports={
    options:options,
    config:config
};
