'use strict';

var mongoose = require('mongoose');
var ObjectId=mongoose.Schema.Types.ObjectId;
var options={};
var config={
    name:{type:String,required:true},
    type:{type:String,default: 'system'},
    updateby: { type: String, default: 'system' },
    ctime:{ type: Date, default: Date.now },
    utime: { type: Date, default: Date.now },
    value:{

    }
    // 评论系统排序规则设置
    // 赞助商设置
};
module.exports={
    options:options,
    config:config
};
