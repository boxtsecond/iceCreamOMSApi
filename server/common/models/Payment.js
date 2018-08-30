/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

var app = require('../app');
var server = app.server;
var controllers = app.controllers;

var RefundOBJ = server.datasources.db.define('RefundOBJ', {
  order_no: { type: String, require: true, default: "123456780", description: "orderCode" },
}, {
  description: '',
  idInjection: false, strict: false
});

module.exports = function (Payment) {
  Payment.getAliPaySignStr = controllers.Payment.getAliPaySignStr;
  Payment.aliPayRefund = controllers.Payment.aliPayRefund;
  Payment.aliPayNotify = controllers.Payment.aliPayNotify;
  Payment.aliPayQuery = controllers.Payment.aliPayQuery;
  Payment.getWechatPaySign = controllers.Payment.getWechatPaySign;
  Payment.wechatRefund = controllers.Payment.wechatRefund;
  Payment.wechatPayNotify = controllers.Payment.wechatPayNotify;
  Payment.wechatPayQuery = controllers.Payment.wechatPayQuery;
  
  Payment.beforeRemote('getAliPaySignStr', controllers.Token.verify_userToken);
  Payment.beforeRemote('aliPayRefund', controllers.Token.verify_userToken);
  Payment.beforeRemote('aliPayQuery', controllers.Token.verify_userToken);
  Payment.beforeRemote('getWechatPaySign', controllers.Token.verify_userToken);
  Payment.beforeRemote('wechatRefund', controllers.Token.verify_userToken);
  Payment.beforeRemote('wechatPayQuery', controllers.Token.verify_userToken);
  
  // Payment.remoteMethod('getAliPaySignStr', {
  //   description: '【需要粉丝端用户token】 获取支付宝签名 [已完成]',
  //   http: { path: '/AliPay/:orderCode', verb: 'get' },
  //   returns: [
  //     {
  //       arg: 'code', type: 'number', required: true,
  //       description: `2000 success,
  //       4000 用户参数格式错误
  //       `
  //     },
  //     { arg: 'msg', type: 'string', required: true },
  //     { arg: 'result', type: 'array', required: true }
  //   ],
  //   accepts: [
  //     { arg: 'orderCode', type: 'number', description: "orderCode", default:1234567890,http: { source: 'path' }},
  //     { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},
  //   ]
  // });
  
  Payment.remoteMethod('aliPayRefund', {
    description: '【需要粉丝端用户token】 支付宝退款 [已完成]',
    http: { path: '/AliPayRefund', verb: 'post' },
    returns: [
      {
        arg: 'code', type: 'number', required: true,
        description: `2000 success,
        4000 用户参数格式错误
        `
      },
      { arg: 'msg', type: 'string', required: true },
      { arg: 'result', type: 'array', required: true }
    ],
    accepts: [
      { arg: 'data', type: "RefundOBJ", description: 'RefundOBJ', http: { source: 'body' } },
    ]
  });
  
  Payment.remoteMethod('aliPayNotify', {
    description: '【需要粉丝端用户token】 支付宝异步回调 [已完成]',
    http: { path: '/AliPay', verb: 'post' },
    accepts: [
      // { arg: 'Id', type: 'number', description: "AppurlId", default:1,http: { source: 'path' }},
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return { req: ctx.req, res: ctx.res, body: ctx.req.body }; } },
    ]
  });
  
  Payment.remoteMethod('aliPayQuery', {
    description: '【需要粉丝端用户token】 支付宝订单查询 [已完成]',
    http: { path: '/AliPayQuery/:order_no', verb: 'get' },
    returns: [
      {
        arg: 'code', type: 'number', required: true,
        description: `2000 success,
        4000 用户参数格式错误
        `
      },
      { arg: 'msg', type: 'string', required: true },
      { arg: 'result', type: 'array', required: true }
    ],
    accepts: [
      { arg: 'order_no', type: 'string', description: "orderCode", default:'1234567890',http: { source: 'path' }},
      { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},
    ]
  });
  
  // Payment.remoteMethod('getWechatPaySign', {
  //   description: '【需要粉丝端用户token】 微信支付 [已完成]',
  //   http: { path: '/WechatPay/:orderCode', verb: 'get' },
  //   returns: [
  //     {
  //       arg: 'code', type: 'number', required: true,
  //       description: `2000 success,
  //       4000 用户参数格式错误
  //       `
  //     },
  //     { arg: 'msg', type: 'string', required: true },
  //     { arg: 'result', type: 'array', required: true }
  //   ],
  //   accepts: [
  //     { arg: 'orderCode', type: 'number', description: "orderCode", default:1234567890,http: { source: 'path' }},
  //     { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},
  //   ]
  // });
  
  Payment.remoteMethod('wechatRefund', {
    description: '【需要粉丝端用户token】 微信退款 [已完成]',
    http: { path: '/WechatPayRefund', verb: 'post' },
    returns: [
      {
        arg: 'code', type: 'number', required: true,
        description: `2000 success,
        4000 用户参数格式错误
        `
      },
      { arg: 'msg', type: 'string', required: true },
      { arg: 'result', type: 'array', required: true }
    ],
    accepts: [
      { arg: 'data', type: "RefundOBJ", description: 'RefundOBJ', http: { source: 'body' } },
    ]
  });
  
  Payment.remoteMethod('wechatPayNotify', {
    description: '【需要粉丝端用户token】 微信异步回调 [已完成]',
    http: { path: '/WechatPay', verb: 'post' },
    // returns: [
    //   {
    //     arg: 'return_code', type: 'number', required: true,
    //     description: `2000 success,
    //     4000 用户参数格式错误
    //     `
    //   },
    //   { arg: 'return_msg', type: 'string', required: true }
    // ],
    accepts: [
      // { arg: 'Id', type: 'number', description: "AppurlId", default:1,http: { source: 'path' }},
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return { req: ctx.req, res: ctx.res, body: ctx.req.body.xml }; } },
    ]
  });
  
  Payment.remoteMethod('wechatPayQuery', {
    description: '【需要粉丝端用户token】 微信订单查询 [已完成]',
    http: { path: '/WechatPayQuery/:orderCode', verb: 'get' },
    returns: [
      {
        arg: 'code', type: 'number', required: true,
        description: `2000 success,
        4000 用户参数格式错误
        `
      },
      { arg: 'msg', type: 'string', required: true },
      { arg: 'result', type: 'array', required: true }
    ],
    accepts: [
      { arg: 'orderCode', type: 'string', description: "orderCode", default:1234567890,http: { source: 'path' }},
      { arg: 'data', type: "object", description: 'url ', http: function(ctx) { return ctx.req.query; }},
    ]
  });
  
};
