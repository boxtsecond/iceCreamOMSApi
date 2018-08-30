'use strict';
module.exports = {
  "grpc": {
    "url": '127.0.0.1',
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
      "host":"172.19.247.63",
      "port":9696,
      "user":"root",
      "password":"123456",
      "database":"xgqoms"
    },
    "salve":{
      "host":"172.19.247.63",
      "port":9696,
      "user":"root",
      "password":"123456",
      "database":"xgqoms"
    }
  },
  "redis":{
    "enableProxy":true,
    "proxy":{
       "master":{
         "port":19000,
         "host":"172.19.247.64",
         "password": 'hzOU0siFJOUSR6'
       },
      "salve":{
        "port":19000,
        "options":{},
        "host":"172.19.247.64",
        "password": 'hzOU0siFJOUSR6'
      }
    },
    "master":{
      sentinels: [
        {
          host: '172.19.247.64',
          port: '16381'
        }, {
          host: '172.19.247.64',
          port: '16382'
        }, {
          host: '172.19.247.64',
          port: '16383'
        }
      ],
      name: "mymaster",
      password: 'hzOU0siFJOUSR6'
    },
    "salve":{
      "port":7379,
      "host":"127.0.0.1",
      "options":{},
      sentinels: [
        {
          host: '172.19.247.64',
          port: '16381'
        }, {
          host: '172.19.247.64',
          port: '16382'
        }, {
          host: '172.19.247.64',
          port: '16383'
        }
      ],
      name: "mymaster",
      password: 'hzOU0siFJOUSR6'
    }
  },
  "aliPay": {
    "app_id": "2017062207542763_staging",
    "notify_url": "https://oms.xuegaoqun.com/oms/api/Payments/AliPay_staging",
    "requestUrl": "https://openapi.alipay.com/gateway.do_staging",
  },
  "wechatPay": {
    "appid": "wx98460a75fbd4b6c0_staging",
    "mch_id": "1493054912_staging",
    // "secretKey": "715fab3d2a5a03f16cacb56deabc8081",
    "privateKey": "XfPRXUoOgXl6KWHb3CJw59V96ovUGqiV_staging", //微信商户平台API密钥
    "URL": {
      "UNIFIED_ORDER": 'https://api.mch.weixin.qq.com/pay/unifiedorder_staging',
      "ORDER_QUERY": 'https://api.mch.weixin.qq.com/pay/orderquery_staging',
      "REFUND": 'https://api.mch.weixin.qq.com/secapi/pay/refund_staging',
      "REFUND_QUERY": 'https://api.mch.weixin.qq.com/pay/refundquery_staging',
      "DOWNLOAD_BILL": 'https://api.mch.weixin.qq.com/pay/downloadbill_staging',
      "SHORT_URL": 'https://api.mch.weixin.qq.com/tools/shorturl_staging',
      "CLOSE_ORDER": 'https://api.mch.weixin.qq.com/pay/closeorder_staging'
    },
    "notify_url": "https://oms.xuegaoqun.com/oms/api/Payments/WechatPay_staging",
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
    "goodsRule": "0 0 3 * * *",
    "deleteRedisKeyRule": "0 0 4 * * *"
  },
  "appKey": "464b49ad-589c-45bd-a025-4efcbb78084e",
  "sid": [1]
};
