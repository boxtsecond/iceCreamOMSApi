'use strict';
var redis = require('redis');

class admins{

  constructor(){
    this.client = {};
    this.tableName = 'users';//用户索引表
    // this.sortName = sortName||'table2';
  }

  setup(client,tableName){
    this.client = redis.createClient(client);
    this.tableName = tableName||'users';
    // this.sortName = sortName||'table2';
  }

  adduser(tableName,key,value){
    return new Promise((resolve,reject)=>{
      this.client.hset(tableName,key,value,function(err,result){
        if(err)reject(err);
        resolve(result);
      });
    });
  }

  update(obj){
  	let json = eval('('+obj+')');
    return new Promise((resolve,reject) => {
      this.adduser(this.tableName,json.id,obj)
          .then(result=>resolve(result))
          .catch(err=>reject(err));
    });
  }

  create(obj){
    let json = eval('('+obj+')');
    return new Promise((resolve,reject) => {
      this.adduser(this.tableName,json.id,obj)
          .then(result=>resolve(result))
          .catch(err=>reject(err));
    });
  }
}

module.exports = new admins();
