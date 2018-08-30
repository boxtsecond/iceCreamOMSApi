
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

// process.env.NODE_ENV="production"
//  导入全部用户信息到新的user 表中
// const mysqlconnection = require('./config').mysql;
// const redisconnection = require('./config').redis;

// process.env.NODE_ENV="development"
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

const models = require('../../models');




// 手机号码规则：
// 中国大陆    +86      11位手机号
// 中国台湾    +00886    9位手机号
// 中国香港    +00852    8位手机号 以  6 9 开头
// 中国澳门    +00853    8位手机号 以6 开头
//
// 区分用户属性可以使用区号来区分
//
// 特别说明：
// 台湾本地地区 拨打手机号码是10位号码，09是区号+8位手机号码
// 我们现在采用的是253短信供应商，为大陆地区，是非台湾地区来拨打手机则是00886+9+8位手机号码，所以我们手机号码应该为9位手机号码
// 5 -153  6 - 217 9 -708  用户数

var importUserCount=0;
function importUser(obj) {
  return Promise.resolve(obj)
    .then(obj=>{
      let mobj=new models.userModel.user(obj);
      let mmobj=Object.assign({}, mobj,{
        birthday:obj.birthday,
        phone:obj.phonenumber,
        status:obj.status,
        ctime:Math.floor(parseInt(obj.createtime)/1000),
        lastlogintime:Math.floor(parseInt(obj.lastestlogintime)/1000)
      });
      if(mmobj.phone.length==11)  mmobj.itucode='86';
      if(mmobj.phone.length==9)  mmobj.itucode='00886';
      if(mmobj.phone.length==8)  mmobj.itucode='00852';
      if(mmobj.phone.length==8 && mmobj.phone.substr(0,1)=='6')  mmobj.itucode='00852';
      if(mmobj.phone.length==8 && mmobj.phone.substr(0,1)=='5')  mmobj.itucode='00852';
      if(mmobj.phone.substr(0,1)=='9')  mmobj.itucode='00886';
       mmobj.birthday=682790400;
      if(mmobj.birthday) mmobj.birthday=Math.floor(parseInt(new Date(obj.birthday).getTime())/1000);
      return mmobj;
    }).then(mmobj=>{
      let uuath=new models.userModel.userAuth({uid:mmobj.id,itucode:mmobj.itucode,phone:mmobj.phone},1);
       return {
         user:mmobj,
         uuath:uuath,
       };
    }).then((oo)=>{
      return redisctl.hget("register",oo.uuath.uid)
        .then(register=>{
             if(register){
               return {
                 user:oo.user,
                 uuath:oo.uuath,
                 register:new models.userModel.userRegister({register:register,uid:oo.uuath.uid})
               };
             }else {
               return {
                 user:oo.user,
                 uuath:oo.uuath,
                 register:new models.userModel.userRegister({register:"-1",status:-1,uid:oo.uuath.uid})
               };
             }
      });
    }).then(function (ooo) {
      importUserCount++;
      if(ooo.user.phone.substr(0,1)!='2'){// 不导入以2 开头的
        // consumerService.setUser(ooo.user);
        return consumerService.getUserInfoFromUId(ooo.uuath.uid).then((nn=>{
           if(nn) return null;
           else return consumerService.AddUserInfo(ooo.user,ooo.register,ooo.uuath).catch(err=>{
             // console.error(err);

             return null;
           });
        })).catch(err=>{
           console.error(err);
          return null;
        });
      }else  {

        return null;
      }
    }).catch(err=>{
      // console.error(err);
      return null;
    });




  // userRegister  从redis 里面取
}


class userEx{
  constructor(lastId){
    this.tableName = "users";
    //2197512
    this.exportsManager = new manager(knex,this.tableName,lastId);
    this.exportsManager.start();
    this.state = 'stop';
    this.lastId=lastId;
    let _self = this;
    this.worker = () => {
      if (_self.state ==='stop'){
        return;
      }

      // Promise.map(_self.exportsManager.data, () => {
      //   if (_self.exportsManager.len() > 0) {
      //     var obj = _self.exportsManager.shift();
      //     console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
      //     return importUser(obj);
      //   } else
      //     return null;
      // }, {concurrency: 50})
      // //   .then(function () {
      // //   // _self.worker();
      // //   setTimeout(_self.worker, 1);
      // // })
      //   .finally(function (err) {
      //   // _self.exportsManager.push(obj);
      //   setTimeout(_self.worker, 1);
      //   return null;
      // });

      while(_self.exportsManager.len() > 0){
        var obj = _self.exportsManager.shift();
        _self.lastId=obj.id;
        console.log("----",obj.id,'---',_self.exportsManager.count,'----', _self.exportsManager.is_end);
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





var u= new userEx(2197937);
setInterval(function () {
    if(!u.exportsManager.is_end)  u.start();
    else {
      u=new userEx(u.lastId);
      u.start();
    }
  }
  ,300000);
