'use strict';

const eutil=require("eutil");

function channel (params) {
  this.id = params.id;
  this.name = params.name;
  this.remark = params.remark;
  this.ctime = params.ctime || eutil.getTimeSeconds();
  this.mtime = params.mtime || eutil.getTimeSeconds();
}
function channelFollow (params) {
  this.channel_id=params.channel_id;
  this.uid=params.uid;
  this.remark=params.remark;
  this.ctime=eutil.getTimeSeconds();
}
function channelDisplay (params) {
  this.sid = params.sid || 1;
  this.name = params.name;
  this.remark = params.remark;
  this.isdel = params.isdel || 0;
  this.channelid = params.channelid;
  this.score = params.score;
  this.ctime = params.ctime || eutil.getTimeSeconds();
  this.mtime = params.mtime || eutil.getTimeSeconds();
}
function updateDisplayAttributes (params) {
  if (eutil.haveOwnproperty(params, 'sid')) this.sid = params.sid;
  if (eutil.haveOwnproperty(params, 'name')) this.name = params.name;
  if (eutil.haveOwnproperty(params, 'remark')) this.remark = params.remark;
  if (eutil.haveOwnproperty(params, 'channelid')) this.channelid = params.channelid;
  if (eutil.haveOwnproperty(params, 'score')) this.score = params.score;

  this.mtime = params.mtime || eutil.getTimeSeconds();
}
function channelDisplayResFilter (params) {
  if (!params) params = {};
  this.id = params.id || -1;
  this.sid = params.sid || -1;
  this.name = params.name || -1;
  this.remark = params.remark || -1;
  this.isdel = params.isdel;
  this.channelid = params.channelid || -1;
  this.score = params.score || -1;
  this.ctime = params.ctime;
  this.mtime = params.mtime;
}

module.exports= {
  channel,
  channelFollow,
  channelDisplay,
  updateDisplayAttributes,
  channelDisplayResFilter
};