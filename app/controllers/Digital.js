/**
 * Created by Bo on 2018/1/9.
 */
'use strict';

var botservices=require('../services');
const DigitalService=botservices.get("DigitalService");
const upload=botservices.get("upload");
const util=botservices.get("util");
const Joi=util.Joi;
const models = require('../models');
const path = require('path');

class Digital {
  
  importDigitalByFile (fileName) {
    return Promise.resolve()
      .then(() => {
        let field = ['goods_id', 'name', 'code', 'sn', 'status', 'type', 'price', 'market_price', 'introduct', 'ico', 'wrapper_url', 'detail', 'note', 'cd_type'];
        let fileExt = path.extname(fileName);
        if(fileExt !== '.csv' && fileExt !== '.txt' && fileExt !== '.xlsx') return Promise.reject([5005, 'Not support on file types, please use .csv or .txt or .xlsx file', {}]);
        return upload.readFileByLine(fileName, 100, DigitalService['addDigitalCard'].bind(DigitalService), models.digitalModel.Digital, field, true, 0, true).catch(err => {
          if(err.func) return Promise.reject([500, err.msg, {}]);
          if(err.notExists) return Promise.reject([5001, err.msg, {}]);
          if(err.field) return Promise.reject([5006, err.msg, {}]);
          return Promise.reject(err);
        });
      })
      .then(count => {
        return Promise.resolve([2000, 'success', {count}]);
      })
      .catch(res => {
        if (util.eutil.isArray(res)) return Promise.resolve(res);
        else {
          util.log.error(res);
          return Promise.reject(res);
        }
      });
  }

}

module.exports = new Digital();
