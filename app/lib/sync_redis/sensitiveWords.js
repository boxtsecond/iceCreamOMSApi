'use strict';
var redis = require('redis');

class sensitiveWords{

  constructor(){
    this.client = {};
    this.tableName = 'sensitivewords';//敏感词索引表
  }

  setup(client,tableName){
    this.client = redis.createClient(client);
    this.tableName = tableName||'sensitivewords';
  }

  updatesensitivewordshash(name,key,value){
    return new Promise((resolve,reject)=>{
      this.client.zadd(name, key, value, function(err, result){
          if(err)reject(err);
          resolve(result);
      });
    });
  }

  delsensitivewordshash(name,key){
    return new Promise((resolve,reject)=>{
      this.client.zrem(name,key,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  update(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    let name = json.name;
    return new Promise((resolve,reject)=>{
    this.updatesensitivewordshash(this.tableName,id,name)
        .then(result=>resolve(result))
        .catch(err=>reject(err));
    });
  }

  create(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    let name = json.name;
    return new Promise((resolve,reject)=>{
    this.updatesensitivewordshash(this.tableName,id,name)
        .then(result=>resolve(result))
        .catch(err=>reject(err));
    });
  }

  delete(obj){
    let json = eval('('+obj+')');
    let id = json.id;
    let name = json.name;
    return new Promise((resolve, reject)=>{
      let plist=[];
      this.delsensitivewordshash(this.tableName,name)
          .then(result=>resolve(result))
          .catch(err=>reject(err));
    });
  }
}

module.exports = new sensitiveWords();
