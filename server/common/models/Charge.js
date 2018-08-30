/**
 * Created by Bo on 2017/11/13.
 */

'use strict';

var app=require('../app');
var server=app.server;
var controllers= app.controllers;

module.exports = function(Charge) {
  Charge.getCharge =controllers.Charge.getCharge;
  Charge.chargeCNY =controllers.Charge.chargeCNY;
  
  Charge.beforeRemote('getCharge', controllers.Token.verify_userToken);
  Charge.beforeRemote('chargeCNY', controllers.Token.verify_userToken);
  
  Charge.remoteMethod('getCharge', {
    description: '【需要粉丝用户token】获取充值金额 [已完成]',
    http: { path: '/', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      // { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Charge.remoteMethod('chargeCNY', {
    description: '【需要粉丝用户token】充值 [已完成]',
    http: { path: '/:type/:price', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'type', type: "number", description: '1, 支付宝 2, 微信 ', http: { source: 'path' } },
      { arg: 'price', type: "number", description: '售价(人民币)', http: { source: 'path' } },
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
};
