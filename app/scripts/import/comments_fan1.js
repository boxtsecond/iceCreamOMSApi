
'use strict';
 // process.env.NODE_ENV="development";
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

function new_Stat_id (obj) {
  this.id=obj.id;
  this.link=obj.link;
  this.text=obj.text;
  this.isreply=obj.isreply;
  this.replyid=obj.replyid;
  this.replyto=obj.replyto;
  this.datatype=obj.datatype;
  this.likelist=obj.likelist;
  this.thumbnail=obj.thumbnail;
  this.createtime=obj.createtime;
  this.musiclength=obj.musiclength;
}



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
const FanCommentService=botservices.get("FanCommentService");
const StarCommentService=botservices.get("StarCommentService");
const models = require('../../models');




// 导入头条
var importUserCount=0;
function importcomments_fan(obj) {
  return Promise.resolve(obj)
    .then(obj=>{
      if(obj.creater=="-1") {
        // console.log(obj.id);
        return Promise.reject("skip id -1 comments");
      }
      else
        return obj;
    })
    .then(obj=>{
        // console.log(obj);
        let likelist=[];
        if(obj.likelist!='-1'){
          likelist=obj.likelist.toString().split(',').map(function(item) {
            return {
              id:parseInt(item),
              score:Date.now()
            };
          });
        }
      let replylist=[];
      if(obj.replylist!='-1'){
        replylist=obj.replylist.toString().split(',').map(function(item) {
          return parseInt(item);
        });
      }
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
        let _fanComment=new models.fanCommentModel.fanComment({
          channelId:1,
          headlineId:parseInt(obj.replyid),
          commentId:obj.id,
          ctime:obj.createtime,
          mtime:obj.edittime,
          driver:1,
          //likelist:
          datatype:obj.datatype,
          text:obj.data,
          link:link,
          // like_count
          // fans_likelist:likelist,
          _uid:parseInt(obj.creater),
          isdel:isdel
        });
        if(isdel){
          _fanComment.like_count=likelist.length;
          _fanComment.likelist=likelist;
        }
        return {
          fanComment:_fanComment,
          likelist:likelist,
          obj:obj,
          isdel:isdel,
          replylist:replylist,
          link:link
        };

    }).then(mmobj=>{
      importUserCount++;
      // return mmobj.obj;
      if(mmobj.link>1){
        return  FanCommentService.import_FanComments(mmobj.fanComment,mmobj.likelist).then(()=>{
          return mmobj;
        });
      }else  return mmobj;
    })


    // .then(mmobj=>{
    //   // 导入明星回复
    //   // console.log(mmobj.isdel,mmobj.replylist,mmobj.obj.zhenreply)
    //   if(mmobj.isdel!=1 && mmobj.replylist.length==0 && mmobj.obj.zhenreply!='-1'){
    //     // 从redis里面获取
    //     return  redisctl.hget("commentszhenfid",mmobj.obj.zhenreply) .then(commentszhen=>{
    //        if(commentszhen){
    //          return {fanComment: mmobj.fanComment,obj: new new_Stat_id(JSON.parse(commentszhen))};
    //        }else  {
    //          // 从 mysql 里面获取
    //         return  knex('comments_zhen').where({id: mmobj.obj.zhenreply}).select('*').limit(1)
    //            .then((res) => {
    //              if(res && res.length > 0) return {fanComment: mmobj.fanComment,obj: new new_Stat_id(res[0])};
    //              else  return {fanComment: mmobj.fanComment,obj: null};
    //            })
    //            .catch(err => {return {fanComment: mmobj.fanComment,obj: null};});
    //        }
    //     }).then((_obj)=>{
    //       // {fanComment, obj}
    //       let fanComment=_obj.fanComment;
    //       let obj=_obj.obj;
    //       if(obj) {
    //         if (!obj.id){
    //           console.log('###139-----',obj);
    //           return Promise.reject("skip  not find zhencomments from redis or mysql");
    //         }
    //         // headlineId, replyUserId, replyCommentId, firstCommentId | isread safe mtime
    //         let musiclength="00:00";
    //         if(obj.musiclength!='-1') musiclength= obj.musiclength;
    //         let isdel=0;
    //         if(obj.isdel==2) isdel=1;
    //         let starComment = new models.starCommentModel.starComment({
    //           channelId:1,
    //           headlineId:parseInt(fanComment.headlineId),
    //           replyUserId: fanComment.creater,
    //           replyCommentId: fanComment.commentId,
    //           firstCommentId: fanComment.commentId,
    //           commentId:obj.id,
    //           ctime:obj.createtime,
    //           mtime:obj.edittime,
    //           driver:1,
    //           //likelist:
    //           datatype:obj.datatype,
    //           text:obj.data,
    //           link:[
    //             {
    //               "thumbnail" : obj.thumbnail,
    //               "url" : obj.link,
    //               "dtype" : obj.datatype,
    //               "musiclength":musiclength
    //             }
    //           ],
    //           // like_count
    //           // fans_likelist:likelist,
    //           _uid:parseInt(obj.creater),
    //           isdel:isdel
    //         });
    //         return StarCommentService.import_StarComment(starComment);
    //       }
    //       else  return Promise.reject("skip  not find zhencomments from redis or mysql");
    //     });
    //   }else  if(mmobj.isdel!=1 && mmobj.replylist.length>0 && mmobj.obj.zhenreply!='-1') {
    //
    //     return Promise.map(mmobj.replylist, reply_id => {
    //       return redisctl.hget("commentszhenfid", reply_id).then(commentszhen => {
    //         if (commentszhen) {
    //           return {fanComment: mmobj.fanComment,obj: new new_Stat_id(JSON.parse(commentszhen))};
    //         } else {
    //           // 从 mysql 里面获取
    //           return knex('comments_zhen').where({id: reply_id}).select('*').limit(1)
    //             .then((res) => {
    //               if (res && res.length > 0) return {fanComment: mmobj.fanComment,obj: new new_Stat_id(res[0])};
    //               else  return {fanComment: mmobj.fanComment,obj: null};
    //             })
    //             .catch(err => {
    //               return {fanComment: mmobj.fanComment,obj: null};
    //             });
    //         }
    //       }).then((_obj)=>{
    //         // {fanComment, obj}
    //         let fanComment=_obj.fanComment;
    //         let obj=_obj.obj;
    //         if (!obj.id) console.log('###193-----', obj);
    //         // headlineId, replyUserId, replyCommentId, firstCommentId | isread safe mtime
    //         if(obj) {
    //           let musiclength="00:00";
    //           if(obj.musiclength!='-1') musiclength= obj.musiclength;
    //           let isdel=0;
    //           if(obj.isdel==2) isdel=1;
    //           let starComment = new models.starCommentModel.starComment({
    //             channelId:1,
    //             headlineId:parseInt(fanComment.headlineId),
    //             replyUserId: fanComment.creater,
    //             replyCommentId: fanComment.commentId,
    //             firstCommentId: fanComment.commentId,
    //             commentId:obj.id,
    //             ctime:obj.createtime,
    //             mtime:obj.edittime,
    //             driver:1,
    //             //likelist:
    //             datatype:obj.datatype,
    //             text:obj.text,
    //             link:[
    //               {
    //                 "thumbnail" : obj.thumbnail,
    //                 "url" : obj.link,
    //                 "dtype" : obj.datatype,
    //                 "musiclength":musiclength
    //               }
    //             ],
    //             // like_count
    //             // fans_likelist:likelist,
    //             _uid:parseInt(obj.creater),
    //             isdel:isdel
    //           });
    //           return StarCommentService.import_StarComment(starComment);
    //         }
    //         else  return Promise.reject("skip  not find zhencomments from redis or mysql");
    //       });
    //     }, {concurrency: 100});
    //   }
    //   else   return Promise.reject("skip zhenreply -1 comments");
    // })
    //
    //
    .catch(err=>{
      // console.error(err);
      return null;
    });
}


class comments_fanEx{
  constructor(lastId){
    this.tableName = "comments_fan";
    this.exportsManager = new manager(knex,this.tableName,lastId);
    this.exportsManager.start();
    this.state = 'stop';
    let _self = this;
    this.lastId=lastId;
    this.worker = () => {
      if (_self.state === 'stop') {
        return;
      }
      console.log("-----count", _self.exportsManager.count, _self.exportsManager.is_end);

      // Promise.map(_self.exportsManager.data, () => {
      //   if (_self.exportsManager.len() > 0) {
      //     var obj = _self.exportsManager.shift();
      //     console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
      //     return importcomments_fan(obj);
      //   } else
      //     return null;
      // }, {concurrency: 500}).finally(function () {
      //   // _self.worker();
      //   setTimeout(_self.worker, 1);
      // });



      while(_self.exportsManager.len() > 0){
        var obj = _self.exportsManager.shift();
        _self.lastId=obj.id;
        console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
        importcomments_fan(obj).catch(function(err){
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

// 3705226
var u= new comments_fanEx(0);
u.start();
// setInterval(function () {
//     if(!u.exportsManager.is_end)  u.start();
//     else {
//       u=new comments_fanEx(u.lastId);
//       u.start();
//     }
//   }
//   ,300000)

// Promise.map(['1','2','3'], function(fileName) {
//   // Promise.map awaits for returned promises as well.
//   console.log("#######",fileName);
//   return fileName;
// },{concurrency: 1}).then(function() {
//   console.log("done");
// });




