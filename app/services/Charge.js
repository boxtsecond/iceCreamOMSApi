/**
 * Created by Bo on 2017/11/13.
 */

'use strict';
const models = require('../models');
const _ = require('lodash');
const eutil = require('eutil');

class Charge {
  constructor(app) {
    this.mysqlChargeModel = app.get("mysqlChargeModel");
    this.redisChargeModel = app.get("redisChargeModel");
    // 启动预加载
    this.initRedis();
  }
  
  get(id) {
    return this.redisChargeModel.get(id)
      .then(w => {
        if (w) return w;
        else {
          return this.mysqlChargeModel.get(id)
            .then(charge => {
              if (!charge) return null;
              else {
                return this.redisChargeModel.set(charge)
                  .then(() => {
                    return new models.chargeModel.ChargeResFilter(charge);
                  });
              }
            });
        }
      });
  }
  
  set(wallet) {
    return this.mysqlChargeModel.set(wallet)
      .then(() => {
        return this.redisChargeModel.set(wallet);
      });
  }
  
  getAll() {
    return this.redisChargeModel.getAll()
      .then(charge => {
        if (charge && JSON.stringify(charge) != '{}') {
          return _.values(charge).map(c => {
            return new models.chargeModel.ChargeResFilter(JSON.parse(c));
          });
        }
        else {
          return this.mysqlChargeModel.getAll()
            .then(chs => {
              let chsListObj = _.reduce(chs, function (result, n) {
                result[n.id] = JSON.stringify(n);
                return result;
              }, {});
              this.redisChargeModel.setList(chsListObj);
              return chs;
            });
        }
      });
  }
  
  getByCategoryId(category_id, returnObj) {
    return this.redisChargeModel.getByCategoryId(category_id)
      .then(charge => {
        if (charge && JSON.stringify(charge) != '{}') {
          if (!returnObj) {
            return _.values(charge).sort().map(c => {
              return new models.chargeModel.ChargeResFilter(JSON.parse(c));
            });
          } else {
            return Promise.reduce(Object.keys(charge).sort(), (result, c) => {
              result[c] = new models.chargeModel.ChargeResFilter(JSON.parse(charge[c]));
              return result;
            }, {});
          }
        }
        else {
          return this.mysqlChargeModel.getByCategoryId(category_id)
            .then(chs => {
              if (chs && chs.length) {
                let nchs = [];
                return Promise.reduce(chs, (result, n) => {
                  nchs.push(new models.chargeModel.ChargeResFilter(n));
                  result[n.code] = JSON.stringify(n);
                  return result;
                }, {}).then(obj => {
                  this.redisChargeModel.setListByCategoryId(category_id, obj);
                  return !returnObj ? nchs : obj;
                });
              } else return false;
            });
        }
      });
  }
  
  getByCode(code) {
    return this.redisChargeModel.getByCode(code)
      .then(w => {
        if (w) return w;
        else {
          return this.mysqlChargeModel.getByCode(code)
            .then(charge => {
              if (!charge) return null;
              else {
                this.redisChargeModel.setByCode(charge);
                return charge;
              }
            });
        }
      });
  }
  
  getCodeByCNYPrice(price) {
    return this.redisChargeModel.getCodeByCNYPrice(price)
      .then(p => {
        if (p) return p;
        else {
          return this.mysqlChargeModel.getCodeByCNYPrice(price)
            .then(code => {
              if (!code) return null;
              else return this.redisChargeModel.setCodeByCNYPrice(price, code);
            });
        }
      });
  }
  
  updateScoreRuleByOSS(scoreRuleArr) {
    return Promise.resolve()
      .then(() => {
        if (!eutil.isArray(scoreRuleArr) || !scoreRuleArr.length) return Promise.reject([4000, "params error", {}]);
        return Promise.reduce(scoreRuleArr, (result, s) => {
          if (!s || !s.code) return result;
          s.mtime = eutil.getTimeSeconds();
          let updateObj = {code: s.code, upMysql: Object.assign({}, s), upRedis: s};
          delete updateObj.upMysql.code;
          result.push(updateObj);
          return result;
        }, []);
      })
      .then((updateArr) => {
        if (!updateArr.length) return Promise.reject([4000, "params error, don't have code", {}]);
        return this.updateScoreRuleArr(updateArr).then(() => {
          return [2000, 'success', {}];
        }).catch(err => {
          console.log(err);
          if (eutil.isArray(err)) return err;
          else return [500, 'error', err];
        });
      });
  }
  
  updateScoreRuleArr(updateArr) {
    return Promise.map(updateArr, obj => {
      return this.mysqlChargeModel.update(obj.code, obj.upMysql).then((u) => {
        if (!u) return this.mysqlChargeModel.set(obj.upRedis);
        else return true;
      }).then(() => {
        return Promise.all([
          this.redisChargeModel.setByCode(obj.upRedis),
          [6, 7].indexOf(obj.upRedis.category_id) != -1 ? this.redisChargeModel.setByCategoryId(obj.upRedis.category_id, obj.upRedis) : null
        ]);
      });
    });
  }
  
  // 启动预加载
  initRedis() {
    return this.redisChargeModel.getAll()
      .then(charge => {
        if (charge && JSON.stringify(charge) != '{}') {
          return false;
        }
        else return this.mysqlChargeModel.getAll();
      })
      .then(chs => {
        if (chs) {
          return Promise.reduce(chs, function (result, n) {
            result[n.code] = JSON.stringify(n);
            return result;
          }, {})
            .then(obj => {
              return this.redisChargeModel.setList(obj);
            });
        }
      });
  }
}

module.exports = Charge;


