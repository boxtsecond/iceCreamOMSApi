
'use strict';
var redis = require('redis');
const commond = require('./commond');
const co = require('co');

class users{

  constructor(){
    this.client = {};
    this.tableName = 'users';//用户索引表
    // this.sortName = sortName||'table2';
  }

  setup(client,tableName){
    if (client){
      this.client = redis.createClient(client);
      // console.log('client   ',this.client);
    }
    this.commond = new commond(this.client);
    this.tableName = tableName||'users';
    // this.sortName = sortName||'table2';
  }

// client.rpop('users_sync_list',function (err,code) {
//     console.log(err,code)
//     //  查询mysql
//     //  从mysql 同步到redis

// })
  getUsers_sync_list(){
     let _that = this;
    return new Promise((resolve, reject) => {
      this.commond.exec('rpop',['users_sync_list'])
      .then((phonenumber) => {
         resolve(phonenumber);
      })
      .catch((err)=>{
        return reject('500');
      });
    });
  }

   getUserInfo(phonenumber){
    let _that = this;
    return new Promise((resolve, reject) => {
      this.commond.exec('hget',['users_hash',phonenumber])
      .then((uid) => {
        if (uid){
          return _that.commond.exec('hget',['users',uid]);
        }
        return reject('404');
      })
      .then((result)=>{
        return resolve(JSON.parse(result));
      })
      .catch((err)=>{
        return reject('500');
      });
    });
  }

  update(obj){
    // console.log('>>>>>>>>>>>>>>>',obj);
  	let json = eval('('+obj+')');
    let _that = this;
    let o = {};
  	for(let k in json){
  		json[k] = json[k];
      o[k] = json[k];
  	}
    // console.log(json);
    return new Promise((resolve,reject) => {
      let key = json.id;
      let phonenumber = json.phonenumber.toString('utf-8');
    	if (json.isdel === 2){
        co(function*(){
          yield _that.commond.exec('hdel',[_that.tableName, key])
          .catch(function(err){
            console.log('----------users_update error '+ err);
            return reject(err);
          });

          _that.commond.exec('hdel',[_that.tableName+'_hash',phonenumber])
          .then(function(result){
            return resolve(result);
          })
          .catch(function(err){
            console.log('----------users_update error '+ err);
            return reject(err);
          });
        });
    	} else {
        co(function*(){
          let hsResult = yield _that.commond.exec('hset',[_that.tableName, [key, obj]])
          .catch(function(err){
            console.log('----------users_update error '+ err);
            return reject(err);
          });
          _that.commond.exec('hset',[_that.tableName+'_hash',[phonenumber,key]])
          .then(function(result){
            return resolve(result);
          })
          .catch(function(err){
            console.log('update_users error ',err);
            return reject(err);
          });
        });
    	}
    });
  }

  delete(obj){
    let json = eval('('+obj+')');
  	var phonenumber = json.phonenumber;
  	var id = json.id;
    let _that = this;
    return new Promise((resolve, reject)=>{
      // 删除
      co(function* (){
        yield _that.commond.exec('hdel',[_that.tableName, key])
        .catch(function(err){
          console.log('users_update error ',err);
          return reject(err);
        });
        _that.commond.exec('hdel', [_that.tableName+'_hash',phonenumber])
        .then((result)=>{
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
      });
    });
  }
}

module.exports = new users();
