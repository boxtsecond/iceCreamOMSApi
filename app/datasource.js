'use strict';
var path = require('path');
var Model=require('./lib/Model');
var Register = require('file-register');
var datasource=new Register().register(path.join(__dirname,"datasource"));
var datasource_cfg=require('./datasource.cfg');
var obj=new Model();

obj.set("config",datasource_cfg.get("config"));
obj.set("redisMaster",datasource_cfg.get("redisMaster"));
obj.set("redisSalve",datasource_cfg.get("redisSalve"));
obj.set("mysqlMaster",datasource_cfg.get("mysqlMaster"));
obj.set("mysqlSalve",datasource_cfg.get("mysqlSalve"));

// obj.set("redisKueJob", datasource_cfg.get("redisKueJob"));
// obj.set("redisKueJob_1",datasource_cfg.get("redisKueJob_1"));

obj.set("kue",datasource_cfg.get("kue"));


// obj.set("redisPublish", datasource_cfg.get("redisPublish"));
// obj.set("redisSubscribe", datasource_cfg.get("redisSubscribe"));

//Token

obj.set("redisUserAppKyesModel",new datasource.redis.AppKeys(datasource_cfg.get("redisMaster"),datasource_cfg.get("redisSalve")));
obj.set("mysqlAppKyesModel",new datasource.mysql.AppKyes(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
//
// //CRM
// obj.set("redisUserModel",new datasource.redis.User(datasource_cfg.get("redisUserMaster"),datasource_cfg.get("redisUserSalve")));
// obj.set("redisUserAuthModel",new datasource.redis.UserAuth(datasource_cfg.get("redisUserMaster"),datasource_cfg.get("redisUserSalve")));
//
// obj.set("mysqlUserModel",new datasource.mysql.User(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
// obj.set("mysqlUserAuthModel",new datasource.mysql.UserAuth(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
// obj.set("mysqlUserDiggModel",new datasource.mysql.UserDigg(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
// obj.set("mysqlUserFollowModel",new datasource.mysql.UserFollow(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
// obj.set("mysqlUserScoreLogModel",new datasource.mysql.UserScoreLog(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
// obj.set("mysqlUserTagModel",new datasource.mysql.UserTag(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));



// 日志记录系统

// Redis Subscribe/Publish
// obj.set("redisSubPubEventModel", new datasource.redis.SubPubEvent(datasource_cfg.get('redisSubscribe'), datasource_cfg.get("redisPublish")));

// 订单
obj.set("redisOrdersModel",new datasource.redis.Orders(datasource_cfg.get("redisOrdersModelMaster"),datasource_cfg.get("redisOrdersModelSalve")));

//经验值和签到
obj.set("redisCheckInfoModel",new datasource.redis.CheckInfo(datasource_cfg.get("redisUserExpModelMaster"),datasource_cfg.get("redisUserExpModelSalve")));
obj.set("redisUserExpModel",new datasource.redis.UserExp(datasource_cfg.get("redisUserExpModelMaster"),datasource_cfg.get("redisUserExpModelSalve")));

//钱包
obj.set("redisWalletModel",new datasource.redis.Wallet(datasource_cfg.get("redisWalletModelMaster"),datasource_cfg.get("redisWalletModelSalve")));

//商品
obj.set("redisDiscoverModel",new datasource.redis.Discover(datasource_cfg.get("redisShopProductMaster"),datasource_cfg.get("redisShopProductSalve")));
obj.set("redisGoodsModel",new datasource.redis.Goods(datasource_cfg.get("redisShopProductMaster"),datasource_cfg.get("redisShopProductSalve")));
obj.set("redisDigitalModel",new datasource.redis.Digital(datasource_cfg.get("redisShopProductMaster"),datasource_cfg.get("redisShopProductSalve")));
obj.set("redisChargeModel",new datasource.redis.Charge(datasource_cfg.get("redisShopProductMaster"),datasource_cfg.get("redisShopProductSalve")));

//定时任务
obj.set("redisScheduleModel",new datasource.redis.Schedule(datasource_cfg.get("redisScheduleModelMaster"),datasource_cfg.get("redisScheduleModelSalve")));

obj.set("mysqlCheckInfoModel",new datasource.mysql.CheckInfo(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlDiscoverModel",new datasource.mysql.Discover(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlGoodsModel",new datasource.mysql.Goods(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlDigitalModel",new datasource.mysql.Digital(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlOrdersModel",new datasource.mysql.Orders(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlWalletModel",new datasource.mysql.Wallet(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlChargeModel",new datasource.mysql.Charge(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlUserExpModel",new datasource.mysql.UserExp(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));

obj.set("mysqlAliPayModel",new datasource.mysql.AliPay(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));
obj.set("mysqlWechatPayModel",new datasource.mysql.WechatPay(datasource_cfg.get("mysqlMaster") ,datasource_cfg.get("mysqlSalve")));

// 商品 local cache
// obj.set("localGoodsModel", new datasource.localcache.Goods(obj.get('redisSubPubEventModel')));

module.exports=obj;
