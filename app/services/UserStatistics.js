/*
 * @Author: dongyuxuan 
 * @Date: 2017-10-30 10:00:06 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-11-08 14:29:09
 */
'use strict';
const models = require('../models');
class UserStatistics {
  constructor(app, util){
    this.redisUserStatisticsModel = app.get("redisUserStatisticsModel");
    this.log = util.log;
  }
  // 统计数据 +1
  incrUserStatistics () {
    return this.redisUserStatisticsModel.incrUserStatistics();
  }
  // 取数据
  getUserCount () {
    return this.redisUserStatisticsModel.getUserCount();
  }
  getUserCountDayList (year, month, dayOfMonth, count) {
    return this.redisUserStatisticsModel.getUserCountDayList(year, month, dayOfMonth, count);
  }
  getUserCountWeek (year, week) {
    return this.redisUserStatisticsModel.getUserCountWeek(year, week);
  }
}
module.exports = UserStatistics;