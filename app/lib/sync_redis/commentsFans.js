'use strict';
var redis = require('redis');

class commentsFan{

  constructor(){
    this.client = {};
    this.tableName = 'commentsfanfid'; //用户评论hash表
    this.sortName = 'commentsfansid'; //用户评论sort表
    this.userListName = 'commentsusersid'; //用户评论用户索引表
    this.userSortName = 'commentsuserlikesid';//用户评论用户点赞索引表
    this.replyMe = 'replyme';//用户评论回复我的索引表
    this.replyComment = 'replycomment';//用户评论回复评论索引表
  }

  setup(client,tableName,sortName,userListName,userSortName,replyMe,replyComment){
    this.client = redis.createClient(client);
    this.tableName = tableName||'commentsfanfid';
    this.sortName = sortName||'commentsfansid';
    this.userListName = userListName||'commentsusersid';
    this.userSortName = userSortName||'commentsuserlikesid';
    this.replyMe = replyMe||'replyme';
    this.replyComment = replyComment||'replycomment';
  }

  //增加sort表数据
  addcommentssort(name,key,time,value){
    return new Promise((resolve,reject)=>{
      this.client.zadd(name+':'+key,time,value,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  //增加hash表数据
  addcommentshash(name,key,value){
    return new Promise((resolve,reject)=>{
      this.client.hset(name, [key, value], function(err, result){
          if(err)reject(err);
          resolve(result);
      });
    });
  }

  //删除sort表数据
  delcommentssort(name,key,value){
    return new Promise((resolve,reject)=>{
      this.client.zrem(name+':'+key,value,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  //删除hash表数据
  delcommentshash(name,key){
    return new Promise((resolve,reject)=>{
      this.client.hdel(name,key,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  update(obj){
    let json = eval('('+obj+')');
    let timestamp = json.edittime;
    let id = json.id;
    let isdel = json.isdel;
    let replyid = json.replyid;
    let creater =json.creater;
    let zhenlikeyou = json.zhenlikeyou;
    let zhenreply = json.zhenreply;
    let isreplyuser = json.isreplyuser;
    let replyuser = json.replyuser;
    let replycomment = json.replycomment;
    let userreplylist = json.userreplylist;
    let targetowner =json.targetowner;
    if (isdel === 2){
      return new Promise((resolve, reject)=>{
        let pmlist=[];
        pmlist.push(this.delcommentshash(this.tableName,id));
        pmlist.push(this.delcommentssort(this.userListName,creater,id));
        reply!=-1&&plist.push(this.delcommentssort(this.sortName,replyid,id));
        zhenlikeyou==2&&plist.push(this.delcommentssort(this.userSortName,creater,id));
        zhenreply!=-1&&plist.push(this.delcommentssort(this.userSortName,creater,id));
        isreplyuser==2&&plist.push(this.delcommentssort(this.replyComment,replycomment,id));
        if(replyuser==-1||replyuser==targetowner)plist.push(this.delcommentssort(this.replyMe,targetowner,id));
        else plist.push(this.delcommentssort(this.replyMe,replyuser,timestamp,id));
        Promise.all(pmlist)
                .then(result=>resolve(result))
                .catch(err=>reject(err));
      });
    }else{
      return new Promise((resolve, reject)=>{
        let plist=[];
        plist.push(this.addcommentshash(this.tableName,id,obj));
        plist.push(this.addcommentssort(this.userListName,creater,timestamp,id));
        replyid!=-1&&plist.push(this.addcommentssort(this.sortName,replyid,timestamp,id));
        zhenlikeyou==2&&plist.push(this.addcommentssort(this.userSortName,creater,timestamp,id));
        zhenreply!=-1&&plist.push(this.addcommentssort(this.userSortName,creater,timestamp,id));
        isreplyuser==2&&plist.push(this.addcommentssort(this.replyComment,replycomment,timestamp,id));
        if(replyuser==-1||replyuser==targetowner)plist.push(this.addcommentssort(this.replyMe,targetowner,timestamp,id));
        else plist.push(this.addcommentssort(this.replyMe,replyuser,timestamp,id));
        Promise.all(plist)
                .then(result=>resolve(result))
                .catch(err=>{reject(err);});
      });
    }
  }

  delete(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    let isreplyuser = json.isreplyuser;
    let replyuser = json.replyuser;
    let replycomment = json.replycomment;
    let userreplylist = json.userreplylist;
    return new Promise((resolve, reject)=>{
      let plist=[];
      plist.push(this.delcommentshash(this.tableName,id));
      plist.push(this.delcommentslist(this.sortName,id));
      Promise.all(plist)
              .then(result=>resolve(result))
              .catch(err=>reject(err));
    });
  }
}

module.exports = new commentsFan();
