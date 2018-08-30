'use strict';
var redis = require('redis');

class stickies{

  constructor(){
    this.client = {};
    this.tableName = 'stickies:cid';//置顶索引表
  }

  setup(client,tableName){
    this.client = redis.createClient(client);
    this.tableName = tableName||'stickies:cid';
  }

  create(obj){
    let json = eval('('+obj+')');
    let commentsid = json.commentsid;
    let id = json.id;
      return new Promise((resolve, reject)=>{
          this.client.hset(this.tableName, [id, commentsid], function(err, result){
            if (err){
              console.error('-----------create error ' + err);
              return reject(err);
            }
            return resolve(json);
          });

      });
  }

  delete(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    return new Promise((resolve, reject)=>{
        this.client.hdel(this.tableName, id, function(err, result){
          if (err){
            console.error('-----------comments_delete error ' + err);
            return reject(err);
          }
          return resolve(json);
        });
    });
  }
}

module.exports = new stickies();