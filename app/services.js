'use strict';
var Register = require('file-register');
var path = require('path');
var Model=require('./lib/Model');
var services=new Register().register(path.join(__dirname,"services"));
var datasource=require('./datasource');
var util=require('./util');
// const _kueJob = require('./lib/job/kueJob');

// const kue = new _kueJob({debug:false,retry:6,ttl:1000 * 60 * 60,enableUI:false,redisclient:datasource.get("redisKueJob")});

const kue =datasource.get('kue');

// const kue = new _kueJob({debug:false,retry:6,ttl:1000 * 60 * 60,enableUI:false});
const _schedule = require('./lib/schedule/schedule');
const schedule = new _schedule({kue, util});
const upload = require('./lib/upload/upload');
const Qiniu = require('./lib/Qiniu/Qiniu');

var obj=new Model();
obj.set("util",util);
obj.set("kue", kue);
obj.set("upload", upload);
// obj.set("Qiniu", Qiniu);
obj.set("schedule", schedule);
obj.set("TokenService",new services.Token(datasource));

obj.set("DiscoverService",new services.Discover(datasource, util));
obj.set("GoodsService",new services.Goods(datasource, util));
obj.set("DigitalService",new services.Digital(datasource, util));

obj.set("WalletService",new services.Wallet(datasource, util));
obj.set("UserExpService",new services.UserExp(datasource, util));
obj.set("ChargeService",new services.Charge(datasource, util));
obj.set("PaymentService",new services.Payment(datasource, util));
obj.set("OrderService",new services.Orders(datasource, util, {ChargeService: obj.get('ChargeService'), GoodsService: obj.get('GoodsService'), WalletService: obj.get('WalletService'), DigitalService: obj.get('DigitalService'),UserExpService: obj.get('UserExpService'), kue: obj.get('kue')}));
obj.set("ScheduleService",new services.ScheduleJob(datasource, util, {GoodsService: obj.get('GoodsService'),ChargeService: obj.get('ChargeService'), DigitalService: obj.get('DigitalService'),  kue: obj.get('kue'), schedule: obj.get('schedule')}));

obj.set("CheckInfoService",new services.CheckInfo(datasource, util, {OrderService: obj.get('OrderService'), kue: obj.get('kue')}));
obj.set("StatusService", new services.Status(util));
module.exports=obj;
