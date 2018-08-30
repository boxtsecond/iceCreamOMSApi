'use strict';
module.exports = {
  "grpc": {
    "url": '172.19.247.91',
    "port": 50052,
    "CRMport": 50051,
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzeXN0ZW0iOiJvbXMifQ.nZpPAsst4dFKQ1Nck6Qo1Ubio1dW3IkNDKdB4d-Hx5Q"
  },
  "passport":{
    'secret': 'biubvayiodsnfaemi123nkluahv9563qn',
    "issuer":"accounts.xuegaoqun.com",
    "audience":"xuegaoqun.com",
    'token' : 'sfdgsdgdfg'
  },
  "token":{
    "guest":{
      "secret":"1f231d93-1d50-4cb9-99e4-2c5c94726317",
      "algorithm":"HS256",
      "expiresIn":2592000

    },
    "user":{
      "secret":"2f231d93-1d50-4cb9-99e4-2c5c94726213",
      "algorithm":"HS256",
      "expiresIn":10368000
    },
    "star_guest":{
      "secret":"3f231d93-1d50-4cb9-99e4-2c5c94726518",
      "algorithm":"HS256",
      "expiresIn":2592000

    },
    "star_user":{
      "secret":"4f231d93-1d50-4cb9-99e4-2c5c94726919",
      "algorithm":"HS256",
      "expiresIn":10368000
    },
    "inside":{
      "secret":"9f231d93-1d50-4cb9-99e4-2c5c94726817",
      "algorithm":"HS256",
      "expiresIn":10368000
    }
  },
  "mysql":{
    "master":{
      "host":"172.19.247.84",
      "port":9696,
      "user":"root",
      "password":"YONCTKlxYYnOEY",
      "database":"xgqoms"
    },
    "salve":{
      "host":"172.19.247.84",
      "port":9696,
      "user":"root",
      "password":"YONCTKlxYYnOEY",
      "database":"xgqoms"
    }
  },
  "redis":{
    "enableProxy":true,
    "proxy":{
      "master":{
        "port":19000,
        "host":"172.19.247.82",
        "password": '9HS3xgUBuv7sAa'
      },
      "salve":{
        "port":19001,
        "options":{},
        "host":"172.19.247.82",
        "password": '9HS3xgUBuv7sAa'
      }
    },
    "master":{
      sentinels: [
        {
          host: '172.19.247.82',
          port: '26379'
        }, {
          host: '172.19.247.80',
          port: '26379'
        }, {
          host: '172.19.247.81',
          port: '26379'
        }
      ],
      name: "mymaster",
      password: '9HS3xgUBuv7sAa'
    },
    "salve":{
      "port":7379,
      "host":"127.0.0.1",
      "options":{},
      sentinels: [
        {
          host: '172.19.247.82',
          port: '26379'
        }, {
          host: '172.19.247.80',
          port: '26379'
        }, {
          host: '172.19.247.81',
          port: '26379'
        }
      ],
      name: "mymaster",
      password: '9HS3xgUBuv7sAa'
    }
  },
  "aliPay": {
    "app_id": "2017062207542763",
    // "notify_url": "http://api.xuegaoqun.com/app/api/Payments/AliPay",
    "notify_url": "https://oms.xuegaoqun.com/oms/api/Payments/AliPay",
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
    "notify_url": "https://oms.xuegaoqun.com/oms/api/Payments/WechatPay",
  },
  "digital": {
    "digitalRedisNum": 500,
    "digitalWarnNum": 100,
    "getLimitNum": 600,
  },
  "kue": {
    "use": true,
    "process": true,
    "maximum": 5,
    "updateUseTrx": true
  },
  "schedule": {
    "goodsRule": "0 0 4 * * *",
    "deleteRedisKeyRule": "0 0 5 * * *"
  },
  "appKey": "464b49ad-589c-45bd-a025-4efcbb78084e",
  "sid": [1]
};
