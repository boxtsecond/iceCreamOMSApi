/**
 * Created by Bo on 2017/11/10.
 */

'use strict';

var app=require('../app');
var server=app.server;
var controllers= app.controllers;

var OrderListOBJ = server.datasources.db.define('OrderListOBJ', {
  count: { type: Number, require: true, default: 0, description: "分页个数" },
  lastTime: { type: Number, require: true, default: 10,description: "分页时上一个ctime" },
  sort: { type: Number, require: true, default: -1, description: "-1 时为倒序，其他默认正序" }
}, {
  description: '',
  idInjection: false, strict: false
});

var OrderOBJ = server.datasources.db.define('OrderOBJ', {
  goods_sn: { type: String, require: true, default: "OTM3OTcwMjA0NDU2MTI4NTEy", description: "商品id" },
  sid: { type: Number, require: true, default: 1, description: "sid" },
  goods_count: { type: Number, require: true, default: 1,description: "商品数量" },
  is_digital: { type: Number, require: true, default: 0,description: "是否为虚拟商品 " },
  address: { type:  String, require: true, default: '',description: "地址" }
}, {
  description: '',
  idInjection: false, strict: false
});

var OrderAddressOBJ = server.datasources.db.define('OrderAddressOBJ', {
  address: { type:  String, require: true, default: '',description: "地址" }
}, {
  description: '',
  idInjection: false, strict: false
});

var TestOrderOBJ = server.datasources.db.define('TestOrderOBJ', {
  goods_sn: { type: String, require: true, default: "931055167900618752", description: "商品id" },
  goods_count: { type: Number, require: true, default: 1,description: "商品数量" },
  type: { type: String, require: true, default: 'mall',description: "" }
}, {
  description: '',
  idInjection: false, strict: false
});

var DeleteOrderOBJ = server.datasources.db.define('DeleteOrderOBJ', {
  orderList: [{ type: Array, require: true, default: [],description: "订单信息" }],
  isRefund: { type: Boolean, require: true, default: true, description: "是否退回星星" }
}, {
  description: '',
  idInjection: false, strict: false
});

module.exports = function(Order) {
  
  Order.getOrderDetail = controllers.Order.getOrderDetail;
  Order.getOrderListDetail = controllers.Order.getOrderListDetail;
  Order.getOrderByType = controllers.Order.getOrderByType;
  Order.getOrderTypeList = controllers.Order.getOrderTypeList;
  Order.createOrder = controllers.Order.createOrder;
  Order.updateOrderAddress = controllers.Order.updateOrderAddress;
  // Order.updateOrder = controllers.Order.updateOrder;
  Order.deleteOrder = controllers.Order.deleteOrder;
  Order.updateOrderByFile = controllers.Order.updateOrderByFile;
  
  Order.beforeRemote('getOrderDetail', controllers.Token.verify_userToken);
  Order.beforeRemote('getOrderListDetail', controllers.Token.verify_userToken);
  Order.beforeRemote('getOrderByType', controllers.Token.verify_userToken);
  Order.beforeRemote('getOrderTypeList', controllers.Token.verify_userToken);
  Order.beforeRemote('createOrder', controllers.Token.verify_userToken);
  Order.beforeRemote('updateOrderAddress', controllers.Token.verify_userToken);
  Order.beforeRemote('updateOrderByFile', controllers.Token.verify_userStarToken_skipBlacklist);
  // Order.beforeRemote('deleteOrder', controllers.Token.verify_userStarToken_skipBlacklist);
  
  Order.remoteMethod('getOrderDetail', {
    description: '【需要粉丝用户token】获取某一订单明细 [已完成]',
    http: { path: '/detail/:sid/:order_no', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number', description: '', default: 1, http: { source: 'path' } },
      { arg: 'order_no', type: 'string', description: ' 订单号', http: { source: 'path' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Order.remoteMethod('getOrderListDetail', {
    description: '【需要粉丝用户token】获取订单明细列表 [已完成]',
    http: { path: '/detailList', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'OrderListOBJ', description: '', http: { source: 'body' } },
    ]
  });
  
  Order.remoteMethod('getOrderByType', {
    description: '【需要粉丝用户token】获取订单详情 [已完成]',
    http: { path: '/:sid/:order_no', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: 'number', description: '', default: 1, http: { source: 'path' } },
      { arg: 'order_no', type: 'string', description: ' 订单号', http: { source: 'path' } },
      { arg: 'data', type: 'object', description: '', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Order.remoteMethod('getOrderTypeList', {
    description: '【需要粉丝用户token】获取订单详情列表 [已完成]',
    http: { path: '/list', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'OrderListOBJ', description: '', http: { source: 'body' } },
    ]
  });
  
  Order.remoteMethod('createOrder', {
    description: '【需要粉丝用户token】创建订单 [已完成]',
    http: { path: '/create', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: "OrderOBJ", description: '', http: {source: 'body'} },
      // { arg: 'data', type: "object", description: '', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Order.remoteMethod('updateOrderAddress', {
    description: '【需要粉丝用户token】修改订单地址 [已完成]',
    http: { path: '/address/:sid/:order_no', verb: 'put' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'sid', type: "number", description: '', default: 1, http: {source: 'path'} },
      { arg: 'order_no', type: "string", description: '', http: {source: 'path'} },
      { arg: 'data', type: "OrderAddressOBJ", description: '', http: {source: 'body'} },
      // { arg: 'data', type: "object", description: '', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Order.remoteMethod('updateOrderByFile', {
    description: '【需要明星用户token】文件导入更新订单 [已完成]',
    http: { path: '/file/:fileName', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'fileName', type: "string", description: '', http: {source: 'path'} }
      // { arg: 'data', type: "object", description: '', http: function (ctx) { return ctx.req.query; } },
    ]
  });
  
  Order.remoteMethod('deleteOrder', {
    description: '【需要粉丝用户token】删除全部订单详情 [已完成]',
    http: { path: '/', verb: 'delete' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      // { arg: 'data', type: "deleteOrderOBJ", description: '', http: function (ctx) { return ctx.req.query; } },
      // { arg: 'data', type: "DeleteOrderOBJ", description: '', http: { source: 'body'} },
    ]
  });
  
  Order.testCreateUnified = controllers.Order.testCreateUnified;
  // Order.beforeRemote('testCreateUnified', controllers.Token.verify_userToken);
  Order.remoteMethod('testCreateUnified', {
    description: '【需要粉丝用户token】获取订单详情列表 [已完成]',
    http: { path: '/testCreateUnified', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: 'TestOrderOBJ', description: '', http: { source: 'body' } },
    ]
  });
};
