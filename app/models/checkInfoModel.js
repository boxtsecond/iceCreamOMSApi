'use strict';

const eutil=require("eutil");
function checkInfo (params) {
  this.uid = params.uid || params._uid;
  this.con_num = params.con_num;
  this.total_num = params.total_num;
  this.check_time = params.check_time || eutil.dateFormat(new Date(), "yyyyMMdd");
  
  this.ctime = params.ctime || eutil.getTimeSeconds();
  this.mtime = params.mtime || eutil.getTimeSeconds();
  this.sid = params.sid || 1;
}
function checkInfoResFilter (params, order) {
  // this.uid = params.uid || params._uid;
  this.con_num = params.con_num;
  this.total_num = params.total_num;
  this.check_time = params.check_time || eutil.dateFormat(new Date(), "yyyyMMdd");
  
  // this.ctime = params.ctime;
  // this.mtime = params.mtime;
  this.sid = params.sid || 1;
  this.score = order.goods_price;
}
module.exports= {
  checkInfo,
  checkInfoResFilter
};