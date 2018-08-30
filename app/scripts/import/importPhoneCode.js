'use strict';
// 往redis写入2000个没有生存时间的 记录


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


let redisconnection;
// process.env.NODE_ENV="development";
if(process.env.NODE_ENV=="development"){
  redisconnection = require('./config1').redis;
}else {
  redisconnection = require('./config').redis;
}

var Redis = require('ioredis');
var redisctl=new Redis(redisconnection);

var userinfo=require('./userinfo.json');


class phoneCodeEx {
  constructor () {
    this.userAuthKey = 'auth:1';
    this.count = 2000;
    this.codeKey = 'phone_';
    this.defaultCode = '0000';
    this.ituPhoneList = [];
    this.resolveCount = 0;
    this.rejectCount = 0;
  }
  start(){
    Promise.map(userinfo, (phone)=>{
      console.log(this.resolveCount);
      return this.setCode("86"+phone);
    }, { concurrency: 5} ).then(()=>{
      console.log("done");
    });
  }
  del(){
    Promise.map(userinfo, (phone)=>{
      console.log(this.resolveCount);
      return this.delCode("86"+phone);
    }, { concurrency: 5} ).then(()=>{
      console.log("done");
    });
  }
  delCode (ituPhone) {
    return redisctl.del(this.codeKey + ituPhone)
      .then(res => this.resolveCount++)
      .catch(err => this.rejectCount++);
  }
  setCode (ituPhone) {
    return redisctl.set(this.codeKey + ituPhone,this.defaultCode)
      .then(res => this.resolveCount++)
      .catch(err => this.rejectCount++);
  }
}
var u = new phoneCodeEx();
u.start();
// u.del();


