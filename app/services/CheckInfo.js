'use strict';
const models = require('../models');
const moment = require('moment');

var datasource_cfg=require('../datasource.cfg');
var mysqlMaster = datasource_cfg.get('mysqlMaster');

class CheckInfo {
  constructor(app, util, {OrderService, kue}) {
    this.mysqlCheckInfoModel = app.get("mysqlCheckInfoModel");
    this.redisCheckInfoModel = app.get("redisCheckInfoModel");
    this.log = util.log;
    this.scoreRuleCode = {
      oneDayInCheck: '000001',
      tweDaysInCheck: '000002',
      threeDayInCheck: '000003',
      overThreeDaysInCheck: '000004'
    };
    this.orderType = 'system';
    this.OrderService = OrderService;
    this.kueJob = kue;
    this.kueTitle = 'createCheckInfo';
    this.kueProcess(util.config.kue.maximum);
  }
  getScoreRuleCode (con_num) {
    if (con_num == 1) return this.scoreRuleCode.oneDayInCheck;
    else if (con_num == 2) return this.scoreRuleCode.tweDaysInCheck;
    else if (con_num == 3) return this.scoreRuleCode.threeDayInCheck;
    else if (con_num > 3) return this.scoreRuleCode.overThreeDaysInCheck;
    else throw new Error('invalid con_num');
  }
  getByUidAndTime(sid, uid, time) {
    if (!time) time = moment().format('YYYYMMDD');
    return this.redisCheckInfoModel.get(sid, uid, time);
      // mysql 扛不住了，redis请求不到就认为没有数据
      // .then(result => {
      //   this.log.info('CheckInfoService-getByUidAndTime from redis:', result);
      //   if (result) return result;
      //   return this.mysqlCheckInfoModel.findByUidAndTime(sid, uid, time)
      //     .then(mysqlRes => {
      //       this.log.info('CheckInfoService-getByUidAndTime from mysql:', mysqlRes);
      //       if (!mysqlRes) return null;
      //       return this.redisCheckInfoModel.save(mysqlRes)
      //         .then(() => mysqlRes);
      //     });
      // });
  }
  // 获取 @param time 之前最近的签到信息
  getRecent(sid, uid, time) {
    return this.redisCheckInfoModel.getRecent(sid, uid, time);
      // mysql 扛不住了，redis请求不到就认为没有数据
      // .then(recentCheckInfo => {
      //   if (recentCheckInfo) return recentCheckInfo;
      //   return this.mysqlCheckInfoModel.listByUid({sid, uid, maxTime: time, count: 1})
      //     .then(mysqlResult => {
      //       if (!mysqlResult || !mysqlResult[0]) return null;
      //       return this.redisCheckInfoModel.save(mysqlResult[0]).then(() => mysqlResult[0]);
      //     });
      // });
  }
  /**
   *
   * @param {*} uid
   * @param {*} check_time
   * @return {Promise} .then({trx, updates})
   */
  checkIn(checkInfo) {
    let {check_time, uid, sid} = checkInfo;
    if (!check_time) check_time = moment().format('YYYYMMDD');
    let check_yesterday = moment(check_time, 'YYYYMMDD').subtract(1, 'days').format('YYYYMMDD');
    return this.redisCheckInfoModel.verifyRateLimit(sid, uid)
      .then(res => {
        if (!res) return Promise.reject([4511, 'frequent chenkin operation', {}]);
        return this.getByUidAndTime(sid, uid, check_yesterday);
      })
      .then(yesterdayCheckInfo => {
        // 根据上一天的签到数据 生成今天的签到数据
        if (yesterdayCheckInfo) return Object.assign({}, checkInfo, {
          con_num: yesterdayCheckInfo.con_num + 1,
          total_num: yesterdayCheckInfo.total_num + 1,
        });
        // 上一天没签到，取本次签到之前 最晚的 签到数据(是否考虑redis数据的可信度，不从mysql中取最近的记录)
        return this.getRecent(sid, uid, check_yesterday)
          .then(recentCheckInfo => {
            let total_num;
            if (recentCheckInfo) total_num = parseInt(recentCheckInfo.total_num) + 1;
            return Object.assign({}, checkInfo, {
              uid: uid,
              con_num: 1,
              total_num: isNaN(total_num) ? 1 : recentCheckInfo.total_num + 1
            });
          });
      })
      .then(checkInfo => {
        let needSave = new models.checkInfoModel.checkInfo(checkInfo);
        // 如果签到的是今天,只需要添加，今天的签到记录
        if (parseInt(check_time) >= parseInt(moment().format('YYYYMMDD'))) return {needSave};
        // 如果是补签， 还要修改 最新的签到记录
        // return this.redisCheckInfoModel.getNewest(uid, check_yesterday)
        //   .then(recentCheckInfo => new models.checkInfoModel.checkInfo({
        //     uid: uid,
        //     con_num: 1,
        //     total_num: recentCheckInfo ? recentCheckInfo.total_num + 1 : 1
        //   }));
        return {needSave, needUpdate: null};
      })
      .then(({needSave, needUpdate}) => {
        return this.kueCreater(needSave, needUpdate).then(order => ({
          checkInfo: needSave,
          order
        }));
      })
      .then(result => {  // 队列添加成功，数据写入 redis
        if (!result || !result.checkInfo|| !result.order) return null;
        return this.redisCheckInfoModel.save(result.checkInfo)
          .then(() => new models.checkInfoModel.checkInfoResFilter(result.checkInfo, result.order));
      })
      .then(checkInfoResFilter => { //若签到成功 清理redis的旧数据
        if (!checkInfoResFilter) return null;
        return this.redisCheckInfoModel.cleanOldCheckInfos(sid, uid).then(remNumber => checkInfoResFilter);
      });
  }
  kueCreater (needSave, needUpdate) {
    return Promise.resolve()
      .then(() => this.kueJob.create('CreateCheckInfo', {needSave, needUpdate, title: needSave.uid + '_' + needSave.check_time}, 'medium'))
      .then(() => this.OrderService.createUnified(this.orderType, this.getScoreRuleCode(needSave.con_num), 1, {
        _uid: needSave.uid,
        goods_count: 1,
        user_behavior: "签到",
        usekue: 1
      }));
  }
  kueProcess (maximum) {
    return this.kueJob.process('CreateCheckInfo', maximum, (job, done) => {
      if(job.data.status == 'complete') return done();
      let needSave = job.data.needSave;
      let needUpdate = job.data.needUpdate;
      // return done();
      return this.checkInfoCreater(needSave, needUpdate)
        .then(checkInfoResFilter => {
          return done();
        })
        .catch(err => {
          this.log.error('CreateCheckInfo Error: ', err);
          // if (eutil.isArray(err)) return done(); //return job.complete();
          return done(err);
        });
    });
  }
  checkInfoCreater (needSave, needUpdate) {
    return this.mysqlCheckInfoModel.checkIn(needSave);
  }
  /**
   * @param {object} filter
   * @param {array} filter.fields
   * @param {object} filter.where
   * @param {string} filter.order
   * @param {number} filter.limit
   * @param {number} filter.skip
   */
  find(filter) {
    return this.mysqlCheckInfoModel.find(filter);
  }
}
module.exports = CheckInfo;
