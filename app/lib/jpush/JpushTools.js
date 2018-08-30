"use strict";

var eutil = require("eutil");
var JPush = require("jpush-sdk");

// 点赞
// 禁言
// 拉黑
// 回复
// 评论
class JpushTools {
  constructor(appKey, masterSecret,development_registration_id) {
    this.client = JPush.buildClient({
      appKey:appKey,
      masterSecret:masterSecret,
      // retryTimes:1,
      // isDebug:true
      // , isDebug:false
    });
    this.development_registration_id=development_registration_id ||
      ['191e35f7e07dcc5e0af','141fe1da9e933696bed','1a0018970a9270acf76'];
  }
  // 推送消息
  sendIosAndAndroidTextMsg(data) {
    let _self=this;
    return new Promise(function(resolve, reject){
      if(data.registration_id[0]==0){
        resolve (null);
      }
      else if(data.env=="development"){
        if(data.registration_id[0]==-1){
          _self.client.push()
            // .setPlatform(['ios', 'android'])
            .setAudience(JPush.ALL)
            .setAudience(JPush.registration_id(_self.development_registration_id))
            // .setAudience(JPush.tag('xgq'))
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            // .setOptions(null, 86400*3,null,false,null) // 默认保留3天// ios 开发环境
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天//  ios  生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }else {
          _self.client.push()
            .setPlatform(['ios', 'android'])
            // .setAudience(JPush.ALL)
            // .setAudience(JPush.tag('xgq'))
            .setAudience(JPush.registration_id(data.registration_id))
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              // JPush.ios(data.alert,'happy',"+1",true,null)
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            // .setOptions(null, 86400*3,null,false,null) // 默认保留3天// ios 开发环境
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天// ios  生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }
      }
      if(data.env=="production"){
        if(data.registration_id[0]==-1){
          _self.client.push()
            .setPlatform(JPush.ALL)
            // .setAudience(JPush.tag('xgq'))
            .setAudience(JPush.ALL)
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              // JPush.ios(data.alert,'happy',"+1",true,null)
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天// 生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }else {
          _self.client.push()
            .setPlatform(['ios', 'android'])
            // .setAudience(JPush.ALL)
            // .setAudience(JPush.tag('xgq'))
            .setAudience(JPush.registration_id(data.registration_id))
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              // JPush.ios(data.alert,'happy',"+1",true,null)
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            // .setOptions(null, 86400*3,null,false,null) // 默认保留3天// ios 开发环境
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天// ios  生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }

      }
      else{
        if(data.registration_id[0]==-1){
          _self.client.push()
            // .setAudience(JPush.ALL)
            .setPlatform(['ios', 'android'])
            .setAudience(JPush.registration_id(_self.development_registration_id))
            // .setAudience(JPush.tag('xgq'))
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            // .setOptions(null, 86400*3,null,false,null) // 默认保留3天// ios 开发环境
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天//  ios  生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }else {
          _self.client.push()
            // .setAudience(JPush.ALL)
            .setPlatform(['ios', 'android'])
            // .setAudience(JPush.tag('xgq'))
            .setAudience(JPush.registration_id(data.registration_id))
            .setNotification(
              JPush.android(data.alert,data.title, null,data.extras,null,null,1),
              // JPush.ios(data.alert,'happy',"+1",true,null)
              JPush.ios(data.alert,'happy',"+1",true,data.extras,data.extras,null,null)
            )
            // .setOptions(null, 86400*3,null,false,null) // 默认保留3天// ios 开发环境
            .setOptions(null, 86400*3,null,true,null) // 默认保留3天// ios  生产环境
            // .setMessage(data.alert,data.title,null,data.extras)
            .send(function (err, res) {
              if (err) reject(err); else  resolve (null);
            });
        }
      }
    });
  }

  // 周期性定时任务
  /**
   start 表示定期任务有效起始时间，格式与必须严格为: "YYYY-mm-dd HH:MM:SS"，且时间必须为24小时制。
   end 表示定期任务的过期时间，格式同上。定时任务不超过一年。
   time 表示触发定期任务的定期执行时间，格式严格为: "HH:MM:SS"，且为24小时制。
   time_unit 表示定期任务的执行的最小时间单位有："day"、"week" 及"month" 三种。大小写不敏感，如"day", "Day", "DAy" 均为合法的time_unit。
   frequency 此项与time_unit的乘积共同表示的定期任务的执行周期，如time_unit为day，frequency为2，则表示每两天触发一次推送，目前支持的最大值为100。
   point 一个列表，此项与time_unit相对应：

   time_unit	point	描述:
   day	NIL	当time_unit为day时point此项无效
   week	"MON","TUE","WED","THU","FRI","SAT","SUN"	当time_unit为week时，point为对应项的一项或多项，表示星期几进行触发,point中的值大小写不敏感
   month	"01","02","03" .... "31"	当time_unit为month时，point为当前进行月对应的日期，且必须有效，如month为2月，则31或30日是不会进行触发的
   */
  sendIosAndAndroidTextMsgPeriodicalSchedule(data) {
    return ((err, res) => {
      //全部推送--周期性定时任务
      if (data.Audience.registration_id[0] == -1)
        this.client.push().setPlatform(JPush.ALL)
          .setAudience(JPush.ALL)
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .setPeriodicalSchedule(data.PeriodicalSchedule)
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
      else
      //单独推送--周期性定时任务
        this.client.push().setPlatform(data.Platform)
          .setAudience(JPush.registration_id(data.Audience.registration_id))
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .setPeriodicalSchedule(data.PeriodicalSchedule)
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
    });
  }

}
module.exports=JpushTools;
// var jpushextras={
//   "env":"development", // development production staging
//   "registration_id":['1517bfd3f7fcffc8dee','1a0018970a9d18c6c62'],// -1
//   "tag":[-1],
//   "alert": "---@@@点赞了我",
//   "title": "系统通知",
//   // type upvote Reply
//   "extras":{
//     sound:"-1",deeplink:'-1',applink:"-1",
//     content:{
//       text:"",
//       data:{}
//     },
//     pushtime:{ date: eutil.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"), type: "upvote" }}
// };
// var jpush_config_test = {
//   AppKey: 'b9944aa69c624b694ba970dd',
//   MasterSecret: '2b503a1932a4955228493ffa',
// };
//
// let myjpush = new JpushTools(jpush_config_test.AppKey, jpush_config_test.MasterSecret);
//
//
//
// myjpush.sendIosAndAndroidTextMsg(jpushextras).then(err=>{
//   console.log(err);
// });
