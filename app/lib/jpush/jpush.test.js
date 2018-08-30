/**
 * Created by osmeteor on 9/24/17.
 */
var eutil = require("eutil");
var JPush = require("jpush-sdk");

var jpush_config_test = {
  'AppKey': '510393d9d30014bbc4d3da0e',
  'MasterSecret': '8005bda8cb648d1422cfe6b2'
};
class JpushTools {
  constructor(appKey, masterSecret) {
    this.client = JPush.buildClient({
      appKey:appKey,
      masterSecret:'2b503a1932a4955228493ffa',
      isDebug:false
    });
  }
  // 推送消息
  sendIosAndAndroidTextMsg(data) {
    return ((err, res) => {
      //全部推送
      if (data.Audience.registration_id[0] == -1)
        this.client.push().setPlatform(JPush.ALL)
          .setAudience(JPush.ALL)
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
      else
      //单独推送
        this.client.push().setPlatform(data.Platform)
          .setAudience(JPush.registration_id(data.Audience.registration_id))
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
    });
  }

  // 一次性定时任务
  sendIosAndAndroidTextMsgSingleSchedule(data) {
    return ((err, res) => {
      //全部推送--一次性定时任务
      if (data.Audience.registration_id[0] == -1)
        this.client.push().setPlatform(JPush.ALL)
          .setAudience(JPush.ALL)
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .setSingleSchedule(data.SingleSchedule)
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
      else
      //单独推送--一次性定时任务
        this.client.push().setPlatform(data.Platform)
          .setAudience(JPush.registration_id(data.Audience.registration_id))
          .setOptions(data.Options)
          .setNotification(JPush.ios(data.Notification.ios),
            JPush.android(data.Notification.android))
          .setSingleSchedule(data.SingleSchedule)
          .send((err, res) => {
            if (err) {
              console.log(err);
              return res.status(500).send('server error');
            }
            res.status(200).json('success');
          });
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
let myjpush = new JpushTools(jpush_config_test.AppKey, jpush_config_test.MasterSecret);


var data = {
  "Platform": ['ios', 'android'],
  "Audience": {
    "registration_id": [-1], //registration_id  -1  全部JPush.ALL
    "tag": [-1]
  },
  "Notification": {
    "ios": {
      "alert": "",
      "sound": "",
      "badge": "",
      "contentAvailable": true,
      "extras": "",
      "category": "",
      "mutable-content": true
    },
    "android": {

      "builder_id": 2,
      "extras": { date: eutil.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"), type: 3 },
      "priority": "",
      "category": "",
      "style": "",
      "value": "",
      "alertType": ""
    },
  },
  "SingleSchedule": { date: eutil.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") },
  "PeriodicalSchedule": {
    "start": "2017-09-24 12:00:00",
    "end": "2017-11-24 12:00:00",
    "time": "12:00:00",
    "time_unit": "WEEK",
    "frequency": 1,
    "point": ["WED", "FRI"]
  }
};

myjpush.sendIosAndAndroidTextMsg(data);



// client.push().setPlatform(JPush.ALL)
//   .setAudience(JPush.ALL)
//   .setOptions(null,null,null,true)
//   .setNotification(JPush.android(result[0].nickname+' 发消息了','雪糕群',2,{date:pushTime,type:3}),
//     JPush.ios(result[0].nickname+' 发消息了','雪糕群',0,true,{date:pushTime,type:3}))
//   .send((err, res)=>{
//     if (err){
//       console.log(err);
//       return resp.status(500).send('server error')
//     }
//     resp.status(200).json('success')
//   })



// //easy push
// client.push()
// .setPlatform(JPush.ALL)
//   .setAudience(JPush.ALL)
//   .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
//   .send(function(err, res) {
//     if (err) {
//       console.log(err.message)
//     } else {
//       console.log('Sendno: ' + res.sendno)
//       console.log('Msg_id: ' + res.msg_id)
//     }
//   });


