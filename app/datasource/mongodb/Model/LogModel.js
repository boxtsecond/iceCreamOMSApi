'use strict';
var collectionname='Log';//数据表
var mongoose=require('mongoose');
var SchemaInfo=require('../Schema/'+collectionname+'Schema.js');
var Schema = new mongoose.Schema(SchemaInfo.config,SchemaInfo.options);
// Schema.statics.getactive = function(dispaly, callback) {
//   return this.model(collectionname).find({active : true},dispaly, callback);
// };
//##################实例方法##################
Schema.methods.insert= function(callback) {
    return this.save(callback);
};
// Schema.pre('save', function(next){
//     console.log("headline save...");
//     console.log(this);
//     next();
// });

module.exports=function (db) {
  return  db.model(collectionname, Schema);
};

