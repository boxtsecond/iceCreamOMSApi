const mongoose = require('mongoose')
const Promise = require("bluebird");
global.Promise = Promise;
var config=require("../util").config;
mongoose.Promise=Promise;

mongoose.Promise=global.Promise;
var mongodbUri = "mongodb://" + config.mogodb.master.host + ":" + config.mogodb.master.port + "/" + config.mogodb.master.database;
var mongoMster = mongoose.connect(mongodbUri, {
  useMongoClient: true,
  user: config.mogodb.master.user,
  pass: config.mogodb.master.password,
  poolSize: 5
});
var headlineSchema = require('../datasource/mongodb/Schema/HeadlineSchema')

var Schema = new mongoose.Schema(headlineSchema.config,headlineSchema.options);
// Schema.statics.getactive = function(dispaly, callback) {
//     return this.model(collectionname).find({active : true},dispaly, callback);
// };
//##################实例方法##################
Schema.methods.insert= function(callback) {
    return this.save(callback);
};
// Schema.post('save',function(next){
//     console.log("save....");
//     //next();
//     return next;
// });
Schema.pre('save',true,function(next,done){
    console.log("save...111.");
     next();
     done();
});
var headlineModel=mongoMster.model('Headline', Schema);
var headline = new headlineModel({
  channelId: 1,//频道id
  headlineId:1,//头条ID
  creater:1,//发布者  创建者
  datatype: 1, // 1 text ，2 music voice，3  video，4 picture
  text: 'test'
});
console.log(headline)
headline.save().then(res => {
  console.log(res);
})