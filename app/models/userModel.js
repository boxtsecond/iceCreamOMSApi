'use strict';

const eutil=require("eutil");
const bcrypt = require('bcrypt');

function user(obj) {
  this.id=obj.id;
  this.nickname=obj.nickname|| '-1';
  if(this.nickname== '-1')this.nickname=this.id;
  this.smallavatar=obj.smallavatar|| '-1';// 用户头像小图
  this.avatar=obj.avatar|| '-1';
  if(this.smallavatar=='-1' &&this.avatar!='-1') this.smallavatar=this.avatar;
  this.driver=obj.driver|| 1;
  this.authid=obj.authid || '';
  this.itucode=obj.itucode ||-1;
  this.phone=obj.phone || "";
  this.phonetype=obj.phonetype || "";
  this.phonemodel=obj.phonemodel || -1;//默认 -1   安卓 1  ios 2
  this.email=obj.email || "";
  this.uname=obj.uname || "";
  this.role=obj.role || -1;
  this.status=obj.status || 1; //状态  1正常  2禁言  3拉黑
  this.identity=obj.identity || -1;
  this.birthday=obj.birthday ||682790400;
  this.sex=obj.sex ||-1;//-1 默认 1男 2女 3不男不女
  this.professional=obj.professional || '';
  this.address=obj.address || "";
  this.addressid=obj.addressid|| -1;
  this.isdel=obj.isdel || 0;
  this.tag=obj.tag ||-1;
  this.reg_ip=obj._ip || obj.reg_ip || '0.0.0.0';
  this.openid=obj.openid|| "";
  this.signature=obj.signature || "";
  this.invite_code=obj.invite_code || "";
  this.con_check=obj.con_check|| 0;
  this.total_check=obj.total_check|| 0;
  this.exp=obj.exp|| 0;
  this.expid=obj.expid|| -1;
  this.score=obj.score || 0;
  this.scoreid=obj.scoreid|| -1;
  this.score1=obj.score1 ||0;
  this.score2=obj.score2|| 0;
  this.score3=obj.score3|| 0;
  this.score4=obj.score4|| 0;
  this.ctime =obj.ctime|| eutil.getTimeSeconds();
  this.mtime = obj.mtime|| eutil.getTimeSeconds();
  this.lang=obj.lang||"";
  this.timezone=obj.timezone||0;
  if(this.itucode=='86') {
    this.lang="zh-cn";
    this.timezone=8;
  }
  if(this.itucode=='00886') {
    this.lang="zh-tw";
    this.timezone=8;
  }
  if(this.itucode=='00852') {
    this.lang="zh-hk";
    this.timezone=8;
  }
  if(this.itucode=='00853') {
    this.lang="zh-mo";
    this.timezone=8;
  }

  this.lastlogintime=eutil.getTimeSeconds();
  this.lastloginip=obj._ip || obj.lastloginip || "0.0.0.0";
  this.search_key=obj.search_key ||"";
  this.topic_count=obj.topic_count|| 0;
  this.reply_count=obj.reply_count|| 0;
  this.follower_count=obj.follower_count|| 0;
  this.following_count=obj.following_count|| 0;
  this.comment_count=obj.comment_count|| 0;
  this.friend_count=obj.friend_count|| 0;
  this.forward_count=obj.forward_count|| 0;
}

function userResFilter(obj) {
  this.id=obj.id;
  this.nickname=obj.nickname|| '-1';
  if(this.nickname== '-1')this.nickname=this.id;
  this.smallavatar=obj.smallavatar|| '-1';// 用户头像小图
  this.avatar=obj.avatar|| '-1';
  if(this.smallavatar=='-1' && this.avatar!='-1') this.smallavatar=this.avatar;
  this.driver=obj.driver|| 1;
  this.authid=obj.authid || '';
  this.itucode=obj.itucode ||-1;
  this.phone=obj.phone || "";
  this.email=obj.email || "";
  this.uname=obj.uname || "";
  this.role=obj.role || -1;
  this.status=obj.status || 1; //状态  1正常  2禁言  3拉黑
  this.identity=obj.identity || -1;
  this.birthday=obj.birthday ||682790400;
  this.sex=obj.sex ||-1;//-1 默认 1男 2女 3不男不女
  this.professional=obj.professional || '';
  this.address=obj.address || "";
  this.isdel=obj.isdel || 0;
  this.tag=obj.tag ||-1;
  this.openid=obj.openid|| "";
  this.signature=obj.signature || "";
  this.con_check=obj.con_check|| 0;
  this.total_check=obj.total_check|| 0;
  this.exp=obj.exp|| 0;
  // this.expid=obj.expid|| -1;
  this.score=obj.score || 0;
  // this.scoreid=obj.scoreid|| -1;
  // this.score1=obj.score1 ||0;
  // this.score2=obj.score2|| 0;
  // this.score3=obj.score3|| 0;
  // this.score4=obj.score4|| 0;
  this.ctime = obj.ctime;
  this.mtime = obj.mtime;
  // this.lang=obj.lang||"";
  this.timezone=obj.timezone||0;
  if(this.itucode==86) {
    this.lang="zh-cn";
    this.timezone=8;
  }
  this.lastlogintime=obj.lastlogintime;
  // this.lastloginip=obj.lastloginip || "0.0.0.0";
  // this.search_key=obj.search_key ||"";
  // this.topic_count=obj.topic_count|| 0;
  // this.reply_count=obj.reply_count|| 0;
  // this.follower_count=obj.follower_count|| 0;
  // this.following_count=obj.following_count|| 0;
  // this.comment_count=obj.comment_count|| 0;
  // this.friend_count=obj.friend_count|| 0;
  // this.forward_count=obj.forward_count|| 0;
}

// 简化版本的 用户信息
function userInfo(obj) {
  this.id=obj.id;
  this.nickname=obj.nickname|| '-1';
  if(this.nickname== '-1')this.nickname=this.id;
  this.avatar=obj.avatar || '-1';
  this.smallavatar=obj.smallavatar|| '-1';// 用户头像小图
  if(eutil.isUndefined(this.smallavatar)) this.smallavatar="-1";
  if(this.smallavatar=='-1' && this.avatar!='-1') this.smallavatar=this.avatar;
  this.driver=obj.driver|| 1;//类型（1七牛默认、2 本地）
  this.role=obj.role || -1;// 用户角色
  this.status=obj.status || 1; //状态  1正常  2禁言  3拉黑
  this.sex=obj.sex ||-1;//-1 默认 1男 2女 3不男不女
  this.birthday=obj.birthday ||682790400;
  this.exp=obj.exp|| 0;
  this.expid=obj.expid|| -1;
  this.scoreid=obj.scoreid|| -1;
}
function userRegister(params) {
  this.register = params.register;
  this.register_type = params.registertype || 1; //推送方式 1 极光 2 百度 3 网易云 4 蝴蝶云
  this.status = params.status || 1;
  this.uid = params.uid || undefined;
}
function updateUser (params) {
  if (eutil.haveOwnproperty(params, 'nickname')) this.nickname = params.nickname.trim();
  if (eutil.haveOwnproperty(params, 'avatar')) this.avatar = params.avatar;
  if (eutil.haveOwnproperty(params, 'smallavatar')) this.smallavatar = params.smallavatar;
  if (eutil.haveOwnproperty(params, 'sex')) this.sex = params.sex;
  if (eutil.haveOwnproperty(params, 'birthday')) this.birthday = params.birthday;
  if (eutil.haveOwnproperty(params, 'professional')) this.professional = params.professional;
  if (eutil.haveOwnproperty(params, 'address')) this.address = params.address;
  if (eutil.haveOwnproperty(params, 'status')) this.status = params.status;
  if (eutil.haveOwnproperty(params, 'tag')) this.tag = params.tag;
  this.mtime = params.mtime || eutil.getTimeSeconds();
}
function loginUserObj (params) {
  this.lastloginip = params._ip;
  this.lastlogintime = this.mtime = eutil.getTimeSeconds();
}
function userRegisterIndex (params) {
  this.register_type = params.registertype || 1; //推送方式 1 极光 2 百度 3 网易云 4 蝴蝶云
  this.uid = params.uid;
}
function userAuth(params,identity_type) {
  this.uid = params.uid || undefined;
  this.identity_type = identity_type;
  if (identity_type === 1) this.identifier = params.itucode + params.phone;
  this.credential=  params.credential ||-1;
  this.is_sync=  params.is_sync ||0;
}
function updateUserAuth(params) {
  if (eutil.haveOwnproperty(params, 'identity_type')) this.identity_type = params.identity_type;
  if (eutil.haveOwnproperty(params, 'identifier')) this.identifier = params.identifier;
  else if (eutil.haveOwnproperty(params, 'itucode') && eutil.haveOwnproperty(params, 'phone')) this.identifier = '' + params.itucode + params.phone;
  if (eutil.haveOwnproperty(params, 'credential')) this.smallavatar = params.credential;
  if (eutil.haveOwnproperty(params, 'is_sync')) this.sex = params.is_sync;

  // if (eutil.haveOwnproperty(params, 'uid')) throw new Error('auth.uid can not be updated');
  // if (eutil.haveOwnproperty(params, 'identity_type')) throw new Error('auth.identity_type can not be updated');
}
function import_userAuth (params) {
  this.uid = params.uid || undefined;
  this.identity_type = params.identity_type || 1;
  this.identifier = params.identifier || -1;
  this.credential=  params.credential ||-1;
  this.is_sync=  params.is_sync ||0;
}
function userAuthIdentity (params, identity_type) {
  this.identity_type = identity_type;
  if (identity_type === 1) this.identifier = params.itucode + params.phone;
}
function saltpwd (pwd) {
  return bcrypt.genSalt(10)
    .then(salt => bcrypt.hash(pwd, salt));
}
function validatepwd (pwd, saltpwd) {
  return bcrypt.compare(pwd, saltpwd); // .then(res => true || false)
}

function userTag (params) {
  this.id = params.id;
  this.name = params.name;
}
function userTagUpsertObj (params) {
  this.name = params.name;
}
// hashpwd("1234141ere1d").then(hash => console.log(hash))



module.exports= {
  user:user,
  userResFilter:userResFilter,
  userInfo:userInfo,
  userRegister:userRegister,
  userAuth:userAuth,
  saltpwd:saltpwd,
  validatepwd:validatepwd,
  userAuthIdentity:userAuthIdentity,
  userRegisterIndex:userRegisterIndex,
  updateUser: updateUser,
  loginUserObj: loginUserObj,
  import_userAuth,
  updateUserAuth,
  userTag,
  userTagUpsertObj
};
