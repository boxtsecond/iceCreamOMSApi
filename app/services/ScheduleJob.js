/**
 * Created by Bo on 2017/12/8.
 */

'use strict';
const models = require('../models');
const eutil = require('eutil');

class ScheduleJob {
  constructor(app, util, services) {
    this.redisScheduleModel = app.get("redisScheduleModel");
    this.log = util.log;
    this.config = util.config;
    this.GoodsService = services.GoodsService;
    this.DigitalService = services.DigitalService;
    this.ChargeService = services.ChargeService;
    this.kueJob = services.kue;
    this.Schedule = services.schedule;
    this.goodsMysqlProcess(util.config.kue.maximum);
    this.goodsStatisticsMysqlProcess(util.config.kue.maximum);
    this.goodsBillMysqlProcess(util.config.kue.maximum);
    this.digitalCardInitRedisProcess(util.config.kue.maximum);
    // this.createScheduleJob();
    this.start();
    this.deleteScheduleJob();
  }

  getScheduleGoodsInfo(date) {
    return this.redisScheduleModel.incrGoodsKey(date)
      .then(id => {
        return {title: 'goods', id};
      });
  }

  getScheduleGoodsStatisticsInfo(date) {
    return this.redisScheduleModel.incrGoodsStatisticsKey(date)
      .then(id => {
        return {title: 'goods_statistices', id};
      });
  }

  getScheduleGoodsBillInfo(date) {
    return this.redisScheduleModel.incrGoodsBillKey(date)
      .then(id => {
        return {title: 'goods_bill', id};
      });
  }

  getScheduleDigitalCardInfo(date) {
    return this.redisScheduleModel.incrDigitalCardKey(date)
      .then(id => {
        return {title: 'digital_card', id};
      });
  }

  createScheduleJob(priority) {
    let date = eutil.dateGetDataStringNUmber();
    return Promise.all([
      this.getScheduleGoodsInfo(date),
      this.getScheduleGoodsStatisticsInfo(date),
      this.getScheduleGoodsBillInfo(date),
      this.getScheduleDigitalCardInfo(date)
    ]).then(result => {
      return Promise.map(result, r => {
        return this.kueJob.create(r.title, {id: r.id}, priority);
      });
    });
  }

  start () {
    let _self = this;
    return _self.Schedule.create({
      title: 'Schedule Goods',
      rule: this.config.schedule.goodsRule,
      // rule: '0 37 12 * * *',
      func: function () {
        return _self.createScheduleJob('normal');
      }
    });
  }

  scheduleGoodsLimit(jobId) {
    return this.redisScheduleModel.getGoodsKey(eutil.dateGetDataStringNUmber())
      .then(id => {
        if (id && id == jobId) return true;
        else return false;
      });
  }

  scheduleGoodsStatisticesLimit(jobId) {
    return this.redisScheduleModel.getGoodsStatisticsKey(eutil.dateGetDataStringNUmber())
      .then(id => {
        if (id && id == jobId) return true;
        else return false;
      });
  }

  scheduleGoodsBillLimit(jobId) {
    return this.redisScheduleModel.getGoodsBillKey(eutil.dateGetDataStringNUmber())
      .then(id => {
        if (id && id == jobId) return true;
        else return false;
      });
  }

  scheduleDigitalCardLimit(jobId) {
    return this.redisScheduleModel.getDigitalCardKey(eutil.dateGetDataStringNUmber())
      .then(id => {
        if (id && id == jobId) return true;
        else return false;
      });
  }

  goodsMysqlProcess(maximum) {
    return this.kueJob.process('goods', maximum || 10, (job, done) => {
      this.log.info(`Check goods persistence, job id is ${job.data.id}`);
      return this.scheduleGoodsLimit(job.data.id)
        .then(doJob => {
          if (!doJob) return done();
          else {
            return this.goodsMysqlPer(job.data.id).then(() => {return done();})
              .catch(err => {
                this.log.error(err);
                return done(err);
              });
          }
        });
    });
  }

  goodsMysqlPer(id) {
    this.log.info(`Start goods persistence, job id is ${id}`);
    return this.GoodsService.getAllGoodsNum()
      .then(({goodsNum, sellNum}) => {
        if (goodsNum && sellNum) {
          return Promise.map(Object.keys(goodsNum), k => {
            return this.GoodsService.updateMysqlGoodsNums(k, goodsNum[k], sellNum[k]);
          });
        }
      });
  }

  goodsStatisticsMysqlProcess(maximum) {
    return this.kueJob.process('goods_statistices', maximum || 10, (job, done) => {
      this.log.info(`Check goods_statistices persistence, job id is ${job.data.id}`);
      return this.scheduleGoodsStatisticesLimit(job.data.id)
        .then(doJob => {
          if (!doJob) return done();
          else {
            return this.goodsStatisticsMysqlPer(job.data.id).then(() => {return done();})
              .catch(err => {
                this.log.error(err);
                return done(err);
              });
          }
        });
    });
  }

  goodsStatisticsMysqlPer(id) {
    this.log.info(`Start goods_statistices persistence, job id is ${id}`);
    return this.GoodsService.getGoodsStatistics(this.config.sid)
      .then(data => {
        if (data[0] && JSON.stringify(data[0]) != '{}' && data[1] && JSON.stringify(data[1]) != '{}') {
          return Promise.map(Object.keys(data[0]), k => {
            let arr = k.split('_');
            return this.GoodsService.updateGoodsStatistics(arr[0], arr[1], {
              sell_num: data[0][k],
              total_sell_price: data[1][k]
            });
          });
        }else return false;
      });
  }

  goodsBillMysqlProcess(maximum) {
    return this.kueJob.process('goods_bill', maximum || 10, (job, done) => {
      this.log.info(`Check goods_bill persistence, job id is ${job.data.id}`);
      return this.scheduleGoodsBillLimit(job.data.id)
        .then(doJob => {
          if (!doJob) return done();
          else {
            return this.goodsBillMysqlPer(job.data.id).then(() => {return done();})
              .catch(err => {
                this.log.error(err);
                return done(err);
              });
          }
        });
    });
  }

  goodsBillMysqlPer(id) {
    this.log.info(`Start goods_bill persistence, job id is ${id}`);
    return this.GoodsService.getRedisGoodsBill(eutil.dateFormat(eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), this.config.sid).then(data => {
      if(data && JSON.stringify(data) != '{}') {
        return Promise.map(Object.keys(data), sn => {
          return this.getGoodsByGoodsBill (sn)
            .then(goods => {
              if (goods) return this.GoodsService.upsertGoodsBill(new models.goodsModel.GoodsBill(goods, data[sn]));
            });
        });
      } else return false;
    });
  }

  getGoodsByGoodsBill (sn) {
    return this.GoodsService.findByGoodsSn(sn)
      .then(goods => {
        if (goods) {
          goods.report_type = 2;
          goods.goods_price = goods.goods_price.toString();
          return goods;
        }
        else return this.ChargeService.getByCode(sn)
          .then(charge => {
            if (charge) {
              charge.report_type = charge.category_id == 6 ? 1 : (charge.price > 0 ? 3 : 4);
              charge.price = charge.price > 0 ? charge.price : -1 * charge.price;
              charge.price = charge.price.toString();
            }
            return charge;
          });
      });
  }

  deleteScheduleJob() {
    let date = eutil.dateGetDataStringNUmber(eutil.dateGetBeforeDay(null,1));
    let _self = this;
    return this.Schedule.create({
      title: 'deleteJobId',
      rule: this.config.schedule.deleteRedisKeyRule,
      priority: 'normal',
      func: function () {
        return Promise.all([
          _self.redisScheduleModel.deleteGoodsKey(date),
          _self.redisScheduleModel.deleteGoodsStatisticsKey(date),
          _self.redisScheduleModel.deleteGoodsBillKey(date),
          _self.redisScheduleModel.deleteDigitalCardKey(date)
        ]);
      }
    });
  }

  digitalCardInitRedisProcess(maximum) {
    return this.kueJob.process('digital_card', maximum || 10, (job, done) => {
      this.log.info(`Check digital_card for init redis digital_card, job id is ${job.data.id}`);
      return this.scheduleDigitalCardLimit(job.data.id)
        .then(doJob => {
          if (!doJob) return done();
          else {
            return this.digitalCardInitRedis(job.data.id).then(() => {return done();})
              .catch(err => {
                this.log.error(err);
                return done(err);
              });
          }
        });
    });
  }

  digitalCardInitRedis(id) {
    this.log.info(`Start init redis digital_card, job id is ${id}`);
    return this.DigitalService.initDigitalRedis();
  }
}

module.exports = ScheduleJob;

