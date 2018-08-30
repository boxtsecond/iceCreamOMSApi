/**
 * Created by Bo on 2017/11/13.
 */

'use strict';

var app=require('../app');
var server=app.server;
var controllers= app.controllers;

module.exports = function(Wallet) {
  Wallet.getWallet =controllers.Wallet.getWallet;
  Wallet.updateWalletBalance =controllers.Wallet.updateWalletBalance;
  
  Wallet.beforeRemote('getWallet', controllers.Token.verify_userToken);
  Wallet.beforeRemote('updateWalletBalance', controllers.Token.verify_userToken);
  
  Wallet.remoteMethod('getWallet', {
    description: '【需要粉丝用户token】获取钱包 [已完成]',
    http: { path: '/', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Wallet.remoteMethod('updateWalletBalance', {
    description: '【需要粉丝用户token】获取钱包 [已完成]',
    http: { path: '/:uid/:balance', verb: 'put' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'uid', type: "number", description: 'url ', http: {source: 'path'} },
      { arg: 'balance', type: "number", description: 'url ', http: {source: 'path'} },
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
};
