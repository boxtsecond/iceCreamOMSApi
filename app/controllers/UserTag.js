'use strict';
// 快速登录
var botservices=require('../services');
const models = require('../models');
const userTagService=botservices.get("UserTagService");
const util=botservices.get("util");
const Joi=util.Joi;

class UserTag {
  save(data) {
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          _uid: Joi.number().required(),

          name: Joi.string().required()
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      }).then(() => {
        return userTagService.save(new models.userModel.userTag(data))
          .then(res => Promise.resolve([2000, 'success', res]));
      }).catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  upsert(data, id) {
    data.id = id;
    return Promise.resolve()
      .then(() => {
        const schema = Joi.object().options({ convert: false }).keys({
          _ip: Joi.string().empty(''),
          _uid: Joi.number().required(),

          id: Joi.number().required(),
          name: Joi.string().required()
        });
        return util.schemaValidator(schema,data).then((res)=>{
          if(res) return Promise.reject([4000, res, {}]);
          else return res;
        });
      }).then(() => {
        return userTagService.upsert(new models.userModel.userTag(data))
          .then(res => Promise.resolve([2000, 'success', res]));
      }).catch(function(res){
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }
}
module.exports = new UserTag();
