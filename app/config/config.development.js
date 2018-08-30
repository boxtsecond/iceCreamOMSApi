'use strict';
module.exports = {
  "grpc": {
    "url": '10.40.253.187',
    "port": 50052,
    "CRMport": 50051,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzeXN0ZW0iOiLov5DokKXlkI7lj7AifQ.NEh33ynq-Utbu7CYa26mjTNb1M05jTgYXAR_fBq0Qqg"
  },
  "passport": {
    'secret': 'biubvayiodsnfaemi123nkluahv9563qn',
    "issuer": "accounts.xuegaoqun.com",
    "audience": "xuegaoqun.com",
    'token': 'sfdgsdgdfg'
  },
  "token": {
    "guest": {
      "secret": "1f231d93-1d50-4cb9-99e4-2c5c94726117",
      "algorithm": "HS256",
      "expiresIn": 2592000
    },
    "user": {
      "secret": "2f231d93-1d50-4cb9-99e4-2c5c94726113",
      "algorithm": "HS256",
      "expiresIn": 2592000
    },
    "star_guest": {
      "secret": "3f231d93-1d50-4cb9-99e4-2c5c94726118",
      "algorithm": "HS256",
      "expiresIn": 2592000

    },
    "star_user": {
      "secret": "4f231d93-1d50-4cb9-99e4-2c5c94726119",
      "algorithm": "HS256",
      "expiresIn": 2592000
    },
    "inside": {
      "secret": "9f231d93-1d50-4cb9-99e4-2c5c94726117",
      "algorithm": "HS256",
      "expiresIn": 2592000
    }
  },
  "mysql": {
    "master": {
      "host": "10.40.253.187",
      "port": 9696,
      "user": "root",
      "password": "123456",
      "database": "xgqoms"
    },
    "salve": {
      "host": "10.40.253.187",
      "port": 9696,
      "user": "root",
      "password": "123456",
      "database": "xgqoms"
    }
  },
  "mogodb": {
    "master": {
      "host": "10.40.253.187",
      "port": 37017,
      "user": "xg",
      "password": "12345678",
      "database": "icecream"
    }
  },
  // "redis": {
  //   "master": {
  //     sentinels: [{host: '10.40.253.187', port: 26377}],
  //     name: 'mymaster'
  //   },
  //   "salve": {
  //     sentinels: [{host: '10.40.253.187', port: 26377}],
  //     name: 'mymaster'
  //   }
  // }
  "redis": {
    "enableProxy":true,
    "proxy":{
      "master":{
        "port": 19000,
        "host":"10.40.253.187",
        "password": ''
      },
      "salve":{
        "port":19000,
        "options":{},
        "host":"10.40.253.187",
        "password": ''
      }
    },
    "master": {
      "port": 8379,
      "host": "10.40.253.187",
      "options": {},
      "password": "12345678"
    },
    "salve": {
      "port": 8379,
      "host": "10.40.253.187",
      "options": {},
      "password": "12345678"
    }
  },
  "aliPay": {
    "app_id": "2017062207542763",
    // "notify_url": "http://api.xuegaoqun.com/app/api/Payments/AliPay",
    "notify_url": "http://120.136.175.13:3003/api/Payments/AliPay",
    "requestUrl": "https://openapi.alipay.com/gateway.do",
  },
  "wechatPay": {
    "appid": "wx98460a75fbd4b6c0",
    "mch_id": "1493054912",
    // "secretKey": "715fab3d2a5a03f16cacb56deabc8081",
    "privateKey": "XfPRXUoOgXl6KWHb3CJw59V96ovUGqiV", //微信商户平台API密钥
    "URL": {
      "UNIFIED_ORDER": 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      "ORDER_QUERY": 'https://api.mch.weixin.qq.com/pay/orderquery',
      "REFUND": 'https://api.mch.weixin.qq.com/secapi/pay/refund',
      "REFUND_QUERY": 'https://api.mch.weixin.qq.com/pay/refundquery',
      "DOWNLOAD_BILL": 'https://api.mch.weixin.qq.com/pay/downloadbill',
      "SHORT_URL": 'https://api.mch.weixin.qq.com/tools/shorturl',
      "CLOSE_ORDER": 'https://api.mch.weixin.qq.com/pay/closeorder'
    },
    // "notify_url": "http://api.xuegaoqun.com/app/api/Payments/WechatPay",
    "notify_url": "http://120.136.175.13:3003/api/Payments/WechatPay",
  },
  "digital": {
    "digitalRedisNum": 500,
    "digitalWarnNum": 100,
    "getLimitNum": 600,
  },
  "kue": {
    "use": true,
    "process": true,
    "maximum": 10,
    "updateUseTrx": true
  },
  "schedule": {
    "goodsRule": "0 0 3 * * *",
    "deleteRedisKeyRule": "0 0 4 * * *"
  },
  "appKey": "464b49ad-589c-45bd-a025-4efcbb78084e",
  "sid": [1]
};
