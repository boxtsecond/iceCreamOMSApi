'use strict';
const models = require('../models');

class Log{
  constructor(app) {
    this.mongodbLogModel=app.get("mongodbLogModel");
  }
  record (log) {
    let logEntity = this.mongodbLogModel(log);
    return logEntity.save().then(resLog => {
      if (!resLog) return null;
      else return resLog;
    });
  }
}
module.exports = Log;
