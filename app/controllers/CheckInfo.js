'use strict';
// 快速登录
var botservices=require('../services');
const models = require('../models');
const moment = require('moment');
const checkInfoService=botservices.get("CheckInfoService");
const util=botservices.get("util");
const Joi=util.Joi;

class CheckInfo {
  checkIn(sid, queryData) {
    let data = {sid, check_time: parseInt(moment().format('YYYYMMDD')), _uid: queryData._uid};
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          _uid: Joi.number().required(),
          check_time: Joi.number().required(),
          sid: Joi.number().required(),
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      }).then(() => {
        // 判断用户是否签到
        return checkInfoService.getByUidAndTime(data.sid, data._uid, data.check_time)
          .then(todayCheckInfo => {
            if (todayCheckInfo) return Promise.reject([4012, '今日已签到', todayCheckInfo]);
          });
      }).then(() => {
        // 签到,根据 历史签到记录，insert今天的签到记录
        return checkInfoService.checkIn(new models.checkInfoModel.checkInfo(data));
      }).then(checkInfo => {
        if (!checkInfo) return Promise.reject([3004, '签到事务失败，已回滚', {}]);
        return [2000, 'success', checkInfo];
      }).catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
}
module.exports = new CheckInfo();
