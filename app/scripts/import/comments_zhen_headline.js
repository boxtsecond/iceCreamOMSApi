
'use strict';
// process.env.NODE_ENV="development"
global.Promise=require("bluebird");
Promise.config({
  // Enable warnings
  warnings: false,
  // Enable long stack traces
  longStackTraces: true,
  // Enable cancellation
  cancellation: true,
  // Enable monitoring
  monitoring: true
});
// process.env.NODE_ENV="production"
//  导入全部用户信息到新的user 表中
let mysqlconnection = require('./config').mysql;
let redisconnection = require('./config').redis;
if(process.env.NODE_ENV=="development"){
  mysqlconnection = require('./config1').mysql;
  redisconnection = require('./config1').redis;
}else {
  mysqlconnection = require('./config').mysql;
  redisconnection = require('./config').redis;
}
var knex = require('knex')(mysqlconnection);

var events = require('events');
var util = require('util');
var manager=require('./lib/manager');
var Redis = require('ioredis');
var redisctl=new Redis(redisconnection);

var botservices=require('../../services');
const consumerService=botservices.get("consumerService");
const HeadlineService=botservices.get("HeadlineService");
const models = require('../../models');

// 导入头条
var importUserCount=0;
// select count(id)  from comments_zhen
function importcomments_zhen(obj) {
  return Promise.resolve(obj)
    .then(obj=>{
        // if(obj.creater=="-1") {
        //   // console.log(obj.id);
        //   return Promise.reject("skip id -1 comments");
        // }
        if(obj.replyid=='-1' && obj.creater!="-1"){
          let likelist=[];
          if(obj.likelist!='-1'){
            likelist=obj.likelist.toString().split(',').map(function(item) {
              return parseInt(item) ;
            });
          }
          let ataillist=[];
          if(obj.ataillist!='-1') ataillist=obj.ataillist.toString().split(',').map(function(item) {
            return parseInt(item) ;
          });
          let musiclength="00:00";
          if(obj.musiclength!='-1') musiclength= obj.musiclength;
          let isdel=0;
          if(obj.isdel==2) isdel=1;

          let link=[];
          if(obj.link!='-1') link=obj.link.toString().split(',').map(function(item) {
            return  {
              "thumbnail" : obj.thumbnail,
              "url" : item,
              "dtype" : obj.datatype,
              "musiclength":musiclength
            };
          });

          let _headline=new models.headlineModel.headline({
            channelId:1,
            headlineId:obj.id,
            ctime:obj.createtime,
            //likelist:
            datatype:obj.datatype,
            text:obj.text,
            link:link,
            ataillist:ataillist,
            _uid:parseInt(obj.creater),
            isdel:isdel,
            like_count:likelist.length
          });
             return  {
               headline:_headline,
               likelist:likelist
             };
        }else {
           return Promise.reject("skip start comments");
        }
    }).then(mmobj=>{
      importUserCount++;
       return HeadlineService.import_headline(mmobj.headline,mmobj.likelist,false);

    }) .catch(err=>{
       // console.error(err);
      return null;
    })




  // userRegister  从redis 里面取
}


class comments_zhenEx{
  constructor(lastId){
    this.tableName = "comments_zhen";
    this.exportsManager = new manager(knex,this.tableName,lastId);
    this.exportsManager.start();
    this.state = 'stop';
    this.lastId=lastId;
    let _self = this;
    this.worker = () => {
      if (_self.state === 'stop') {
        return;
      }
      // console.log("-----count", _self.exportsManager.count, _self.exportsManager.is_end)
      // Promise.map([1,2,3,4,5,6], function(job){
      //   if(_self.exportsManager.len() > 0){
      //     var obj = _self.exportsManager.shift();
      //    return  importcomments_zhen(obj).catch(function(err){
      //         console.error(obj);
      //         // _self.exportsManager.push(obj);
      //        return null;
      //     });
      //   }else {
      //     return null;
      //   }
      //
      //
      // } , { concurrency: 5} ).then(function () {
      //     _self.worker();
      // });
      // Promise.map([1, 2, 3, 4, 5, 6,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,48.50], () => {
      //   if (_self.exportsManager.len() > 0) {
      //     var obj = _self.exportsManager.shift();
      //     _self.lastId=obj.id;
      //     console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
      //     return importcomments_zhen(obj).catch(function (err) {
      //       console.error(obj);
      //       // _self.exportsManager.push(obj);
      //       return null;
      //     });
      //   } else
      //     return null;
      // }, {concurrency: 1}).then(function () {
      //   // _self.worker();
      //   setTimeout(_self.worker, 1);
      // });


        while(_self.exportsManager.len() > 0){
          var obj = _self.exportsManager.shift();
            _self.lastId=obj.id;
           console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
          importcomments_zhen(obj).catch(function(err){
            // console.log(obj);
            // _self.exportsManager.push(obj);
          });
        }
        setTimeout(_self.worker,1000 * 1);

    };
  }

  start(){
    if (this.state != 'stop')
      return;
    this.state = 'start';
    this.worker();
  }

  stop(){
    this.state = 'stop';
  }
}

// var u= new comments_zhenEx();
//   u.start()

var u= new comments_zhenEx(6197);
setInterval(function () {
    if(!u.exportsManager.is_end)  u.start();
    else {
      u=new comments_zhenEx(u.lastId);
      u.start();
    }
  }
  ,1000);



