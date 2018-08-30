/*
 * @Author: dongyuxuan 
 * @Date: 2017-10-30 18:28:11 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2018-01-02 18:19:24
 */
'use strict';

class redisCheckInfoModel {
  constructor(wclient,rclient){
    this.wclient=wclient;
    this.rclient=rclient;
    this.valueTable = 'checkinfo:';// +sid + uid，有序集合 score：check_time，value：JSON字符串
    this.limitKey = 'check_limit:';  // +sid + uid string 签到限速
    this.limitTime = 300; //单用户 单app 5分钟内只能提交一次签到信息
    this.keepNumber = 30; //redis只保留最近的数据个数
  }
  getValueKey (sid, uid) {
    return this.valueTable + sid + ':' + uid;
  }
  getLimitKey (sid, uid) {
    return this.limitKey + sid + ':' + uid;
  }
  save (checkInfo) {
    return this.set(checkInfo);
  }
  getRecent (sid, uid, check_time) {
    return this.listByUidAndTime(sid, uid, '(' + check_time, '-inf', false, {count: 1})
      .then(checkInfos => {
        if (checkInfos && checkInfos[0]) return JSON.parse(checkInfos[0]);
        else return null;
      });
  }
  getNewest (sid, uid) {
    return this.listByUid(sid, uid, 0, 0)
      .then(checkInfos => {
        if (checkInfos && checkInfos[0]) return JSON.parse(checkInfos[0]);
        else return null;
      });
  }
  getCheckInfosCount (sid, uid) {
    return this.rclient.zcard(this.getValueKey(sid, uid));
  }
  // 根据score 从小到大 排序
  remCheckInfosByRank (sid, uid, start, stop) {
    return this.wclient.zremrangebyrank(this.getValueKey(sid, uid), start, stop);
  }
  // 返回删除的数据个数
  cleanOldCheckInfos (sid, uid) {
    return this.getCheckInfosCount(sid, uid).then(count => {
      if (count <= this.keepNumber) return 0;
      return this.remCheckInfosByRank(sid, uid, 0, -(this.keepNumber + 1));// .then(remNumbers => {//删除数量})
    });
  }
  // 从新到旧（score从大到小）
  listByUid (sid, uid, start, stop) {
    return this.rclient.zrevrange(this.getValueKey(sid, uid), start, stop);
  }
  listByUidAndTime (sid, uid, startTime, stopTime, withscores, limit) {
    let args = [this.getValueKey(sid, uid), startTime, stopTime];
    if (withscores) args.push('WITHSCORES');
    if (limit && limit.count) args.push('LIMIT', limit.offset || 0, limit.count);
    return this.rclient.zrevrangebyscore(...args);
  }
  /**
   * @return {boolean} 该用户是否通过限速验证
   */
  verifyRateLimit(sid, uid) {
    let key = this.getLimitKey(sid, uid);
    return this.wclient.incr(key)
      .then(res => {
        if (parseInt(res) > 1) return false;
        return this.wclient.expire(key, this.limitTime)
          .then(res => true);
      });
  }
  set (checkInfo) {
    return this.wclient.zadd(this.getValueKey(checkInfo.sid, checkInfo.uid), checkInfo.check_time, JSON.stringify(checkInfo));
  }
  get (sid, uid, check_time) {
    return this.listByUidAndTime(sid, uid, check_time, check_time)
      .then(checkInfos => {
        if (checkInfos && checkInfos[0]) return JSON.parse(checkInfos[0]);
        else return null;
      });
  }
}
module.exports = redisCheckInfoModel;