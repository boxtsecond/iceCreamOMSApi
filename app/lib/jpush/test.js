/**
 * Created by osmeteor on 9/26/17.
 */
var eutil = require("eutil");
var JPush = require("jpush-sdk");
// https://github.com/jpush/jpush-api-nodejs-client
var jpush_config_testOption = {
  AppKey: 'b9944aa69c624b694ba970dd',
  MasterSecret: '2b503a1932a4955228493ffa',
  // isDebug:false
};

var client = JPush.buildClient({
  appKey:'b9944aa69c624b694ba970dd',
  masterSecret:'2b503a1932a4955228493ffa',
  isDebug:false
});
// // easy push.
// client.push().setPlatform(JPush.ALL)
//   .setAudience(JPush.ALL)
//   .setNotification('Hi, JPush', JPush.ios('ios alert', 'happy', 5))
//   .send(function (err, res) {
//     if (err) {
//       if (err instanceof JPush.APIConnectionError) {
//         console.log(err.message)
//       } else if (err instanceof JPush.APIRequestError) {
//         console.log(err.message)
//       }
//     } else {
//       console.log('Sendno: ' + res.sendno)
//       console.log('Msg_id: ' + res.msg_id)
//     }
//   })
//
// client.push().setPlatform('ios', 'android')
//   .setAudience(JPush.ALL)
// // JPush.tag('xgq')
//   .setNotification(
//     JPush.ios('Hi, JPush', 'sound', 1),
//     JPush.android('Hi,JPush', 'JPush Title', 1, {'key':'value'}))
//   .setMessage('msg content')
//   .setOptions(null, 60)
//   .send(function(err, res) {
//     if (err) {
//       console.log(err.message)
//     } else {
//       console.log('Sendno: ' + res.sendno);
//       console.log('Msg_id: ' + res.msg_id);
//     }
//   });
// full push.
var jpushextras={
  "env":"development", // development production staging
  "registration_id":['1517bfd3f7fcffc8dee','1a0018970a9d18c6c62'],
  "alert": "---@@@点赞了我",
  "title": "系统通知",
  "extras":{sound:-1,a:1,b:{ date: eutil.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"), type: 3 }}
}


client.push().setPlatform(['ios', 'android'])
 // .setAudience(JPush.tag('xgq'))
  .setAudience(JPush.registration_id(jpushextras.registration_id))
  .setNotification(
    JPush.android(jpushextras.alert,jpushextras.title, null,jpushextras.extras,null,null,1),
    JPush.ios(jpushextras.alert,'happy',"+1",true,{date:eutil.dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss"),type:1})
  )
  .setOptions(null, 60,null,false,null)
  .setMessage(jpushextras.alert,jpushextras.title,null,jpushextras.extras)
  .send(function (err, res) {
    if (err) {
      if (err instanceof JPush.APIConnectionError) {
        console.log(err.message)
        // Response Timeout means your request to the server may have already received,
        // please check whether or not to push
        console.log(err.isResponseTimeout)
      } else if (err instanceof JPush.APIRequestError) {
        console.log(err.message)
      }
    } else {
      console.log('Sendno: ' + res.sendno)
      console.log('Msg_id: ' + res.msg_id)
    }
  })


console.log(86400*3)
