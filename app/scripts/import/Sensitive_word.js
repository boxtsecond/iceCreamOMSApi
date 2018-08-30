
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
const Sensitive_wordService=botservices.get("Sensitive_wordService");

const models = require('../../models');
var importUserCount=0;


Sensitive_wordService.loadSensitive_word()

function importUser(obj) {
  return Promise.resolve(obj)
    .then(obj=>{
          Sensitive_wordService.Insert({
            "sensitive_categoryId" : 1,
            "word":obj.name
        });
    }).then(mmobj=>{
          importUserCount++;
          return null;
    }) .catch(err=>{
      return null;
    })




  // userRegister  从redis 里面取
}


class userEx{
  constructor(){
    this.tableName = "sensitive_words";
    this.exportsManager = new manager(knex,this.tableName);
    this.exportsManager.start();
    this.state = 'stop';
    let _self = this;
    this.worker = () => {
      if (_self.state ==='stop'){
        return;
      }
      console.log("-----count",_self.exportsManager.count,_self.state)
      while(_self.exportsManager.len() > 0){
        var obj = _self.exportsManager.shift();
             // console.log(obj)
        importUser(obj).catch(function(err){
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

var u= new userEx();
u.start()
