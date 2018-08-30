/**
 * Created by osmeteor on 9/24/17.
 */

// https://github.com/jpush/jpush-api-nodejs-client/blob/master/doc/api.md

// 版主端推送 1 点赞粉丝  2 回复粉丝 3 郑爽发消息了 4 @粉丝上头条 （你有一条消息被 '+result1[0].nickname+" ' 昵称 '看上了"） 5 拉黑粉丝   6 禁言粉丝
// 客服推送
//


var data= {
  "Platform": ['ios', 'android'],
  "Audience": {
    "registration_id": [], //registration_id  -1  全部JPush.ALL
    "tag": []
  },
  "Options": [null, null, null, true],
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
      "alert": "xx 点赞了我",
      "title": "系统通知",
      "builder_id": 2,
      "extras": {date: pushTime, type: 3},
      "priority": "",
      "category": "",
      "style": "",
      "value": "",
      "alertType": ""
    },
  }
}

var Schedule= {
  "Platform": ['ios', 'android'],
  "Audience": {
    registration_id: [],
    "tag": []
  }, //registration_id  -1  全部JPush.ALL
  "Options": [null, null, null, true],
  "Notification": {
    "ios": {
      "alert": "",
      "sound": "",
      "badge": "",
      "contentAvailable": "",
      "extras": "",
      "category": "",
      "mutable-content": ""
    },
    "android": {
      "alert": "xx 点赞了我",
      "title": "系统通知",
      "builder_id": 2,
      "extras": {date: pushTime, type: 3},
      "priority": "",
      "category": "",
      "style": "",
      "value": "",
      "alertType": ""
    },
  },
  "SingleSchedule": {
    "name": "",
  }
}





