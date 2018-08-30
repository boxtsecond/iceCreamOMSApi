'use strict';

const eutil=require("eutil");

function log (params) {
  this.fromSource = params.fromSource || 1;// 1 雪糕群
  this.sid = params.sid || -1;  // 操作者ID
  this.uid = params.uid || -1;  // 被操作者ID
  this.remoteAccessIP = params.remoteAccessIP || "0.0.0.0";// 操作者ID
  this.subject = params.subject || "system";// 主题 版主操作：star 系统日志：system，粉丝操作：fan
  this.content = params.content || "";  // 内容
  this.ctime = params.ctime || eutil.getTimeSeconds();
  this.mtime = params.mtime || eutil.getTimeSeconds();
}

module.exports= {
  log
};