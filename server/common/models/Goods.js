/*
 * @Author: dongyuxuan
 * @Date: 2017-10-23 17:55:45
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2018-01-05 13:33:31
 */
'use strict';

var jwt = require('jwt-simple');
var base64 = require('base-64');
var app=require('../app');
var server=app.server;
var controllers= app.controllers;

module.exports = function(Goods) {

  Goods.listByDiscoverIdAndSid = controllers.Goods.listByDiscoverIdAndSid;
  Goods.beforeRemote('listByDiscoverIdAndSid', controllers.Token.verify_userToken_skipBlacklist);
  Goods.remoteMethod('listByDiscoverIdAndSid', {
    description: '【需要粉丝用户token】根据小星空等级和发现id获取商品列表 [已完成]',
    http: { path: '/:discoverId/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'discoverId', type: 'number',description:"发现ID",default:0, http: { source: 'path' } },
      { arg: 'sid', type: 'number', description: '小星空等级id,郑爽  1 杨幂 2', default:1, http: { source: 'path' } },
      { arg: 'lastGoods_sn',type: 'string', description:"期望获取list上一条的goods_sn",default:0, http: { source: 'query' } },
      { arg: 'lastScore',type: 'number', description:"期望获取list上一条的score",default:0, http: { source: 'query' } },
      { arg: 'count',type: 'number', description:"期望获取list的数量",default:0, http: { source: 'query' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } }
    ]
  });
  Goods.listByDiscoverIdAndSidWithStarToken = controllers.Goods.listByDiscoverIdAndSid;
  Goods.beforeRemote('listByDiscoverIdAndSidWithStarToken', controllers.Token.verify_userStarToken_skipBlacklist);
  Goods.remoteMethod('listByDiscoverIdAndSidWithStarToken', {
    description: '【需要版主用户token】根据小星空等级和发现id获取商品列表 [已完成]',
    http: { path: '/Star/:discoverId/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'discoverId', type: 'number',description:"发现ID",default:0, http: { source: 'path' } },
      { arg: 'sid', type: 'number', description: '小星空等级id,郑爽  1 杨幂 2', default:1, http: { source: 'path' } },
      { arg: 'lastGoods_sn',type: 'string', description:"期望获取list上一条的goods_sn",default:0, http: { source: 'query' } },
      { arg: 'lastScore',type: 'number', description:"期望获取list上一条的score",default:0, http: { source: 'query' } },
      { arg: 'count',type: 'number', description:"期望获取list的数量",default:0, http: { source: 'query' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } }
    ]
  });

  Goods.findByGoods_sn = controllers.Goods.findByGoods_sn;
  Goods.beforeRemote('findByGoods_sn', controllers.Token.verify_userToken_skipBlacklist);
  Goods.remoteMethod('findByGoods_sn', {
    description: '【需要粉丝用户token】根据goods_sn获取商品详情 [已完成]',
    http: { path: '/:goods_sn', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'goods_sn', type: 'string',description:"发现ID",default:0, http: { source: 'path' } },
    ]
  });
  Goods.findByGoods_snWithStarToken = controllers.Goods.findByGoods_sn;
  Goods.beforeRemote('findByGoods_snWithStarToken', controllers.Token.verify_userStarToken_skipBlacklist);
  Goods.remoteMethod('findByGoods_snWithStarToken', {
    description: '【需要版主用户token】根据goods_sn获取商品详情 [已完成]',
    http: { path: '/Star/:goods_sn', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'goods_sn', type: 'string',description:"发现ID",default:0, http: { source: 'path' } },
    ]
  });
  
  Goods.getPriceByCode = controllers.Goods.getPriceByCode;
  Goods.beforeRemote('getPriceByCode', controllers.Token.verify_userToken_skipBlacklist);
  Goods.remoteMethod('getPriceByCode', {
    description: '【需要粉丝用户token】根据code获取积分 [已完成]',
    http: { path: '/spend', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
    ]
  });
  Goods.getPriceByCodeWithStarToken = controllers.Goods.getPriceByCode;
  Goods.beforeRemote('getPriceByCodeWithStarToken', controllers.Token.verify_userStarToken_skipBlacklist);
  Goods.remoteMethod('getPriceByCodeWithStarToken', {
    description: '【需要版主用户token】根据code获取积分 [已完成]',
    http: { path: '/Star/spend', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
    ]
  });
  
  Goods.getUpdateTips = controllers.Goods.getUpdateTips;
  Goods.beforeRemote('getUpdateTips', controllers.Token.verify_userToken_skipBlacklist);
  Goods.remoteMethod('getUpdateTips', {
    description: '【需要粉丝用户token】获取商品上新提示 [已完成]',
    http: { path: '/getUpdateTips/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number',description:"sid",default:0, http: { source: 'path' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } }
    ]
  });
  
  Goods.getStarUpdateTips = controllers.Goods.getUpdateTips;
  Goods.beforeRemote('getStarUpdateTips', controllers.Token.verify_userStarToken_skipBlacklist);
  Goods.remoteMethod('getStarUpdateTips', {
    description: '【需要版主端token】获取商品上新提示 [已完成]',
    http: { path: '/getStarUpdateTips/:sid', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number',description:"sid",default:0, http: { source: 'path' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } }
    ]
  });
};
