'use strict';
//  导入全部用户信息到新的user 表中
// const mysqlconnection = require('./config').mysql;
// const redisconnection = require('./config').redis;
// process.env.NODE_ENV="development"
// process.env.NODE_ENV="production"
//  导入全部用户信息到新的user 表中
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
const StarService=botservices.get("StarService");
const models = require('../../models');
var importUserCount=0;
function importAdmins(obj) {
  return Promise.resolve(obj)
    .then(obj=>{
      let mobj=new models.user_starModel.user_star(obj);
      let mmobj=Object.assign({}, mobj,{
        id:-obj.id,
        username:obj.username,
        password:obj.password,
        avatar:obj.avatar,
        smallavatar:obj.avatar
      });
      if(mmobj.id==2)  mmobj.isstar=1;
         mmobj.master_channel_id=1;
        return mmobj;
    }).then(mmobj=>{
       StarService.setUser_Star(mmobj)
         // 查询用户是否存在
      return  StarService.getStarIdByUsername(mmobj.username).then(obj=>{
          if(obj) return null;
          else   return mmobj;
      })
         // 添加新明星用户
    }).then(function (mmobj) {
      importUserCount++;
      if(!mmobj){  // 存在就不导入
         return null;
      }else  {
        return StarService.AddUserStarInfo(mmobj).then((nn=>{
          return StarService.addNicknameSet(mmobj.nickname).then(mm=>{
            return null;
          });
        })).catch(err=>{
          // console.error(err);
          return null;
        });
      }
    }).catch(err=>{
      // console.error(err);
      return null;
    })




  // userRegister  从redis 里面取
}


class userEx{
  constructor(){
    this.tableName = "admins";
    this.exportsManager = new manager(knex,this.tableName,-10000001);
    this.exportsManager.start();
    this.state = 'stop';
    let _self = this;
    this.worker = () => {
      if (_self.state ==='stop'){
        return;
      }
      console.log("-----count",_self.exportsManager.count,_self.state)
      // Promise.map(_self.exportsManager, function(item){
      //   var obj = _self.exportsManager.shift();
      //   var obj = _self.exportsManager.shift();
      //   // console.log(obj);
      //     importAdmins(obj).catch(function(err){
      //       // console.log(obj);
      //       // _self.exportsManager.push(obj);
      //     });
      //
      //
      // } , { concurrency: 1} ).then(()=>{
      // });
      // Promise.map([1, 2, 3, 4, 5, 6,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,48.50], () => {
      //   if (_self.exportsManager.len() > 0) {
      //     var obj = _self.exportsManager.shift();
      //     return importAdmins(obj).catch(function (err) {
      //       console.error(obj);
      //       // _self.exportsManager.push(obj);
      //       return null;
      //     });
      //   } else
      //     return null;
      // }, {concurrency: 1}).then(function () {
      //   // _self.worker();
      //   setTimeout(_self.worker, 1);
      // });




      while(_self.exportsManager.len() > 0){
        var obj = _self.exportsManager.shift();
        // console.log(obj);
        importAdmins(obj).catch(function(err){
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
