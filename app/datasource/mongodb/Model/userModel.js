'use strict';
var collectionname='user';//数据表
var mongoose=require('mongoose');
var db=require('../mongodb.js');
var SchemaInfo=require('../Schema/'+collectionname+'Schema.js');
var Schema = new mongoose.Schema(SchemaInfo.config,SchemaInfo.options);
Schema.statics.getactive = function(dispaly, callback) {
    return this.model(collectionname).find({active : true},dispaly, callback);
};
//##################实例方法##################
Schema.methods.insert= function(callback) {
    return this.save(callback);
};
Schema.post('save',function(next){
    console.log("save....");
    //next();
    return next;
});
Schema.pre('save',true,function(next,done){
    console.log("save...111.");
     next();
     done();
});
var model=db.model(collectionname, Schema);
module.exports=model;
