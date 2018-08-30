'use strict';
var mongoose=require('mongoose');
var collectionname='config';//数据表
var SchemaInfo=require('../Schema/'+collectionname+'Schema.js');
var Schema = new mongoose.Schema(SchemaInfo.config,SchemaInfo.options);
//##################实例方法##################
Schema.methods.findByName= function(name, callback) {
    return this.model(collectionname).find({name: name}, callback);
};
Schema.methods.findByType= function(type, callback) {
    return this.model(collectionname).find({type: type}, callback);
};
Schema.methods.findAll = function(callback) {
    return this.model(collectionname).find({}, callback);
};
//##################实例方法##################
//##################静态方法##################
Schema.statics.findByName = function(name, callback) {
    return this.model(collectionname).find({name: name}, callback);
};
Schema.statics.findAll = function(callback) {
    return this.model(collectionname).find({}, callback);
};
Schema.statics.findByType= function(type, callback) {
    return this.model(collectionname).find({type: type}, callback);
};
//##################静态方法##################
module.exports={
  Schema:Schema,
  collectionname:collectionname
};
