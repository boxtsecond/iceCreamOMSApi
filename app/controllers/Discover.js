'use strict';
// 快速登录
var botservices = require('../services');
const models = require('../models');
const discoverService = botservices.get("DiscoverService");
const util = botservices.get("util");
const Joi = util.Joi;

class Discover {
  listBySid(sid) {
    return Promise.resolve()
      .then(() => {
        return discoverService.listBySid(sid);
      }).then(discovers => {
        return [2000, 'success', discovers.map(discover => new models.discoverModel.discoverDisplayResFilter(discover))];
      }).catch(function (res) {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

  //修改发现排序
  updateDiscoverDisplayScore(data) {
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          _uid: Joi.number().required(),
          _appid: Joi.string().empty(''),
          _ip: Joi.string().empty(''),
          sid: Joi.number().min(1).required(),
          idAndScoreList: Joi.array().items(Joi.object().keys({
            id: Joi.number().min(1).required(),
            score: Joi.number().min(0).required(),
          })).required(),
        });
        return util.schemaValidator(schema, data).then((res) => {
          if (res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      })
      .then(() => {
        return DiscoverService.updateDiscoverDisplayScore(data.sid, data.idAndScoreList)
          .then((result) => {
            if (result) return Promise.resolve(2000, 'success', result);
            else return Promise.reject(3004, 'fail', result);
          })
      })
      .catch(function (res) {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          log.error(res);
          return Promise.reject(res);
        }
      });
  }

}
module.exports = new Discover();
