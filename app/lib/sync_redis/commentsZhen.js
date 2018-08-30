'use strict';
var redis = require('redis');

class commentsZhen{

  constructor(){
    this.client = {};
    this.tableName = 'commentszhenfid';//管理员评论hash表
    this.sortName = 'commentszhensid';//管理员评论sort表
    this.famousSortName = 'commentszhenfamoussid';//管理员评论各人索性表
    this.userSortName = 'commentszhenusersid';//管理员
    this.famousUserSortName='commentszhenfamoususersid';
  }

  setup(client,tableName,sortName,famousSortName,userSortName,famousUserSortName){
    this.client = redis.createClient(client);
    this.tableName = tableName||'commentszhenfid';
    this.sortName = sortName||'commentszhensid';
    this.famousSortName = famousSortName||'commentszhenfamoussid';
    this.userSortName = userSortName||'commentszhenusersid';
    this.famousUserSortName = famousUserSortName||'commentszhenfamoususersid';
  }

  addcommentssort(name,key,value){
    return new Promise((resolve, reject)=>{
      this.client.zadd(name, key, value, function(err, result){
          if(err)reject(err);
          resolve(result);
      });
    });
  }

  addcommentshash(name,key,value){
    return new Promise((resolve,reject)=>{
      this.client.hset(name, [key, value], function(err, result){
          if(err)reject(err);
          resolve(result);
      });
    });
  }

  updatecommentshash(name,key,value){
    return new Promise((resolve,reject)=>{
      this.client.hset(name, [key, value], function(err, result){
          if(err)reject(err);
          resolve(result);
      });
    });
  }

  delcommentssort(name,key){
    return new Promise((resolve,reject)=>{
      this.client.zrem(name,key,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  delcommentshash(name,key){
    return new Promise((resolve,reject)=>{
      this.client.hdel(name,key,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  create(obj){
    let json = eval('('+obj+')');
    let timestamp = json.createtime;
    let id = json.id;
    let isreply = json.isreply;
    let replyid = json.replyid;
    let replyto = json.replyto;
    let creater = json.creater;
    return new Promise((resolve, reject)=>{
        let plist=[];
        plist.push(this.addcommentshash(this.tableName,id,obj));
        plist.push(this.addcommentssort(this.famousSortName+":"+creater+':'+isreply,timestamp,id));
        if(isreply===1){
          plist.push(this.addcommentssort(this.sortName,timestamp,id));
        }
        if(isreply===2&&replyid!=-1&&replyto!=-1){
          plist.push(this.addcommentssort(this.userSortName+":"+replyto,timestamp,id));
          plist.push(this.addcommentssort(this.famousUserSortName+":"+creater+":"+replyto,timestamp,id));
        }
        console.log(2);
        Promise.all(plist)
                .then(result=>{
                  console.log(3);
                  resolve(result);})
                .catch(err=>{
                  console.log(4);
                  reject(err);});
    });
  }

  update(obj){
    let json = eval('('+obj+')');
    let timestamp = json.createtime;
    let id = json.id;
    let isreply = json.isreply;
    let replyid = json.replyid;
    let replyto = json.replyto;
    let isdel = json.isdel;
    let creater = json.creater;
    if(isdel==2){
      return new Promise((resolve, reject)=>{
      let plist=[];
      plist.push(this.delcommentshash(this.tableName,id));
      plist.push(this.delcommentssort(this.sortName,id));
      plist.push(this.delcommentssort(this.userSortName,id));
      plist.push(this.delcommentssort(this.famousSortName+":"+creater+":"+isreply,id));
      plist.push(this.delcommentssort(this.famousUserSortName+":"+creater+":"+replyto,id));
      Promise.all(plist)
             .then(result=>resolve(result))
             .catch(err=>reject(err));
      });
    }
    else{
      return new Promise((resolve,reject)=>{
        let plist = [];
        plist.push(this.addcommentshash(this.tableName,id,obj));
        plist.push(this.addcommentssort(this.famousSortName+":"+creater+':'+isreply,timestamp,id));
        if(isreply===1){
          plist.push(this.addcommentssort(this.sortName,timestamp,id));
        }
        if(isreply===2&&replyid!=-1&&replyto!=-1){
          plist.push(this.addcommentssort(this.userSortName+":"+replyto,timestamp,id));
          plist.push(this.addcommentssort(this.famousUserSortName+":"+creater+":"+replyto,timestamp,id));
        }
        Promise.all(plist)
                .then(result=>resolve(result))
                .catch(err=>reject(err));
      });
    }
  }

  delete(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    let creater = json.creater;
    let isreply = json.isreply;
    let replyto = json.replyto;
    return new Promise((resolve, reject)=>{
      let plist=[];
      plist.push(this.delcommentshash(this.tableName,id));
      plist.push(this.delcommentssort(this.sortName,id));
      plist.push(this.delcommentssort(this.userSortName,id));
      plist.push(this.delcommentssort(this.famousSortName+":"+creater+":"+isreply,id));
      plist.push(this.delcommentssort(this.famousUserSortName+":"+creater+":"+replyto,id));
      Promise.all(plist)
             .then(result=>resolve(result))
             .catch(err=>reject(err));
    });
  }
}

module.exports = new commentsZhen();
