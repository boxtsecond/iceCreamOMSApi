/**
 * Created by Bo on 2017/11/10.
 */

'use strict';
const models = require('../models');
const eutil = require('eutil');
const _ = require('lodash');
const GrpcService = require('../lib/grpc/client');

class Orders {
  constructor(app, util, services) {
    this.mysqlOrdersModel = app.get("mysqlOrdersModel");
    this.redisOrdersModel = app.get("redisOrdersModel");
    this.log = util.log;
    this.ChargeService = services.ChargeService;
    this.GoodsService = services.GoodsService;
    this.DigitalService = services.DigitalService;
    this.WalletService = services.WalletService;
    this.UserExpService = services.UserExpService;
    this.knex = app.get("mysqlMaster");
    // this.kueJob = new kueJob({redisclient: [app.get('redisKueJob'), app.get('redisKueProcess')]});
    this.kueJob = services.kue;
    if (util.config.kue.process) {
      this.kueProcess(util.config.kue.maximum);
      this.kueUpdateUserExpProcess(util.config.kue.maximum);
      this.kueUpdateOrderProcess(util.config.kue.maximum, util.config.kue.updateUseTrx);
    }
    this.digitalWarnNum = util.config.digital.digitalWarnNum || 20;
    this.digitalRedisNum = util.config.digital.digitalRedisNum || 100;
  }
  
  // 创建统一下单模型
  // 验证订单签名信息 uid +goods_sn+ 金额+密钥串
  //1  先获取订单id
  //2  创建订单模型
  // order 表 失败 -> kue  事务
  // orderDetail 失败 -> kue 事务
  //
  //
  // createUnified
  // cancelOrder
  // notifyPaid 通知
  
  // type  充值Recharge  system 系统[+/-积分] mall实物类[商城] digital虚拟类[商城 电子卡] cash现金消费
  
  /**
   * 统一下单
   * @param orderType 订单类型
   * @param goods_sn 商品标志
   * @param is_digital 商品类型 0 实物 1 虚拟
   * @param data 参数 {_uid, goods_count}
   */
  createUnified(orderType, goods_sn, is_digital, data) {
    return Promise.resolve()
      .then(() => {
        if (!data._uid || !goods_sn) return Promise.reject([4510, 'params error', {}]);
      })
      .then(() => {
        return this.getOrderLimit(data.sid || 1, data._uid)
          .then(allow => {
            if (!allow) return Promise.reject([4511, 'frequent operation', {}]);
            else return this.getGoodsOrderByType(orderType, goods_sn, data.goods_count || 1, data);
          });
      })
      .then(orderData => {
        if (orderData.err) return Promise.reject(orderData.err);
        return {limit: orderData.limit, order: new models.orderModel.Order('pre_order_no', _.merge(orderData.order, data)), digital_card: orderData.digital_card, import_digital_card_total: orderData.import_digital_card_total};
      })
      .then(result => {
        return this.verificationEssential(result.order, goods_sn, result.limit, is_digital, result.digital_card, result.import_digital_card_total, data);
      })
      .then(order => {
        return Promise.all([
          order.exp_price > 0 ? this.UserExpService.updateRedisUserExp(order.sid, order.uid, order.exp_price) : null,
          order.is_pay ? this.GoodsService.updateRedisGoodsStatistics(order.sid, order.report_type, order.change_price > 0 ? order.change_price : -1 * order.change_price) : null,
          order.is_pay ? this.GoodsService.updateRedisGoodsBill(order.sid, order.goods_id, eutil.dateFormat(eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), order.change_price > 0 ? order.change_price : -1 * order.change_price, order.goods_count) : null
        ]).then(() => {
          return order;
        });
      })
      .then(ord => {
        if (ord.is_pay) {
          let orderDetail = new models.orderModel.OrderDetail(ord);
          return Promise.all([
            this.redisOrdersModel.createOrder(ord),
            this.redisOrdersModel.createOrderSort(ord),
            this.redisOrdersModel.createOrderDetail(orderDetail),
            this.redisOrdersModel.createOrderDetailSort(orderDetail),
            this.redisOrdersModel.createOrderTypeSort(ord)
          ]).then(() => {
            return ord;
          });
        }
        else return ord;
      })
      .then((od) => {
        if (data.usekue) {
          this.kueCreate(orderType, od, data.walletType || 1);
          return od;
        } else {
          return this.create(od, data.walletType).then(o => {
            if (od.exp_price > 0) {
              return this.UserExpService.getUserExp(od.sid, od.uid).then(exp => {
                return GrpcService.grpcCRM([{exp}, od.uid], 'consumerService-updateUserInfo')
                  .then(res => {
                    if (res[0] != 2000) {
                      this.kueUpdateUserExp({sid: od.sid, uid: od.uid, exp_price: exp, order_no: od.order_no});
                    }
                    return od;
                  });
              });
            } else return od;
          });
        }
      })
      .catch(res => {
        if (eutil.isArray(res)) return Promise.reject(res);
        else {
          this.log.error(res);
          return Promise.reject(res);
        }
      });
  }
  
  /**
   * 创建订单
   * @param order 订单模型
   */
  create(order, walletType) {
    return this.knex.transaction(trx => {
      return Promise.resolve()
        .then(() => {
          if (!order.is_digital) {
            return this.redisOrdersModel.getUpdateAddressKey(order.order_no, order.sid, order.uid).then(o => {
              if (o) return o;
              else return false;
            });
          } else return false;
        })
        .then((ord) => {
          let nwOrder = ord || order;
          let transactionObj = {
            mysqlOrder: this.mysqlOrdersModel.createOrder(nwOrder, trx)
          };
          if (nwOrder.is_pay) {
            transactionObj.mysqlOrderDetail = this.mysqlOrdersModel.createOrderDetail(new models.orderModel.OrderDetail(nwOrder), trx);
            if (nwOrder.change_price != 0) {
              transactionObj.mysqlWallet = this.WalletService.updateBalance(nwOrder.uid, walletType || 1, nwOrder.change_price, trx);
            }
            if (nwOrder.exp_price > 0) {
              transactionObj.mysqlUserExp = this.UserExpService.updateUserExp(nwOrder.sid, nwOrder.uid, nwOrder.exp_price, trx);
            }
            if (nwOrder.report_type == 2) {
              if (nwOrder.cd_key) {
                transactionObj.mysqlDigitalCard = this.DigitalService.updateDigitalOwner(nwOrder.goods_id, nwOrder.cd_key, nwOrder.uid, trx);
              } else {
                // 下单时不操作 goods 销量的更改，用定时任务去自动更新
                // transactionObj.updateMysqlGoods = this.GoodsService.updateGoodsCount(order.goods_id, order.goods_count, trx);
                transactionObj.mysqlGoodsLimit = this.GoodsService.updateGoodsLimit(nwOrder.sid, nwOrder.uid, nwOrder.goods_id, nwOrder.goods_count, trx);
              }
            }
          }
          return {transactionObj, ord};
        })
        .then(({transactionObj, ord}) => {
          return Promise.props(transactionObj).then(tranData => {
            // if (tranData.updateMysqlGoods && tranData.updateMysqlGoods[0] && tranData.updateMysqlGoods[0].affectedRows == 0) return Promise.reject([4514, 'Goods is not enough', {}]);
            if (tranData.mysqlDigitalCard === 0) return Promise.reject([4515, 'Digital card is already used', {}]);
            if (tranData.mysqlWallet && tranData.mysqlWallet[0] && tranData.mysqlWallet[0].affectedRows == 0) {
              // return this.WalletService.updateRedisBalanceByMysql(order.uid, walletType || 1)
              //   .then(() => {
              //     return Promise.reject([4516, "User's balance is not enough", {order_no: order.order_no, uid: order.uid}]);
              //   });
              return Promise.reject([4516, "User's balance is not enough", {order_no: order.order_no, uid: order.uid}]);
            }
            if (tranData.mysqlUserExp === 0) return Promise.reject([4522, "Update user's exp fail", {}]);
            return ord;
          }).catch(res => {
            // return Promise.all([
            //   order.is_pay && limit ? this.GoodsService.updateRedisGoodsLimit(order.sid, order.uid, order.goods_id, -1 * order.goods_count) : null,//购买限制
            //   order.is_pay && limit ? this.GoodsService.updateRedisGoodsNum(order.goods_id, -1 * order.goods_count) : null,//销量
            //   order.is_pay ? this.GoodsService.updateRedisGoodsStatistics(order.sid, order.report_type, order.change_price < 0 ? order.change_price : -1 * order.change_price, true) : null,//销量
            //   order.is_pay ? this.GoodsService.updateRedisGoodsBill(order.sid, order.goods_id, eutil.dateFormat(eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), order.change_price < 0 ? order.change_price : -1 * order.change_price, -1 * order.goods_count) : null
            // ]).then(() => {
            //   if (eutil.isArray(res)) return Promise.reject(res);
            //   else return Promise.reject([4513, '创建失败，已回滚', {error: res}]);
            // });
            if (eutil.isArray(res)) return Promise.reject(res);
            else if (res.code == 'ER_DUP_ENTRY' && res.errno == 1062) return Promise.reject('done');
            else return Promise.reject([4513, '创建失败，已回滚', JSON.stringify({error: res})]);
          });
        })
        .then(od => {
          if (!od) {
            let redisArr = [
              this.redisOrdersModel.createOrder(order),
              this.redisOrdersModel.createOrderSort(order)
            ];
            if (order.is_pay) {
              let orderDetail = new models.orderModel.OrderDetail(order);
              redisArr.push(this.redisOrdersModel.createOrderDetail(orderDetail));
              redisArr.push(this.redisOrdersModel.createOrderDetailSort(orderDetail));
              // redisArr.push(this.WalletService.updateRedisBalance(order.uid, order.change_price));
              if (order.report_type == 2) {
                redisArr.push(this.redisOrdersModel.createOrderTypeSort(order));
                // if(order.cd_key) {
                //   redisArr.push(this.DigitalService.deleteUnusedDigital(order.goods_id, order.goods_count));
                // }
                // else {
                //   redisArr.push(this.GoodsService.updateRedisGoodsNum(order.goods_id, order.goods_count));
                // }
              }
            }
            return Promise.all(redisArr).then(() => {
              return order;
            });
          } else return this.redisOrdersModel.delUpdateAddressKey(od.order_no, od.sid, od.uid).then(() => {
            return od;
          });
        });
    });
  }
  
  /**
   * 利用kue消息队列创建 create 任务
   * @param order 订单模型
   */
  kueCreate(orderType, order, walletType) {
    // console.log('CreateOrderJob: ========>', order.order_no);
    return this.kueJob.create('CreateOrder', {orderType, order, walletType, title: order.order_no}, 'high');
  }
  
  /**
   * 利用kue消息队列消费 create 任务
   * @param order 订单模型
   */
  kueProcess(maximum) {
    return this.kueJob.process('CreateOrder', maximum, (job, done) => {
      if (job.data.status == 'complete') return done();
      // console.log('CreateOrderProcess: ========>', job.data.order.order_no);
      return this.create(job.data.order, job.data.walletType).then(o => {
        let order = job.data.order;
        if (order.exp_price > 0) {
          return this.UserExpService.getUserExp(order.sid, order.uid)
            .then(exp => {
              this.kueUpdateUserExp({sid: order.sid, uid: order.uid, exp_price: exp, order_no: order.order_no});
              return done();
            }).catch(err => {
              this.log.error('GetUserExp Error: ', err);
              return done(err);
            });
        } else return done();
      }).catch(err => {
        // this.log.error('CreateOrder Error: ', err);
        if (err == 'done') return done();
        else if (eutil.isArray(err)) return done(new Error(JSON.stringify(err))); //return job.complete();
        else return done(err);
        // return done(err);
      });
    });
  }
  
  kueUpdateUserExp(data) {
    // console.log('UpdateUserExpJob: ========>', data.order_no);
    data.title = data.order_no;
    return this.kueJob.create('UpdateUserExp', data, 'normal');
  }
  
  kueUpdateUserExpProcess(maximum) {
    return this.kueJob.process('UpdateUserExp', maximum, (job, done) => {
      if (job.data.status == 'complete') return done();
      // console.log('UpdateUserExpProcess: ========>', job.data.order_no);
      return this.UserExpService.getUserExp(job.data.sid, job.data.uid)
        .then(exp => {
          if (exp == job.data.exp_price) {
            return GrpcService.grpcCRM([{exp: job.data.exp_price}, job.data.uid], 'consumerService-updateUserInfo').then(res => {
              return done();
            }).catch(err => {
              this.log.error('GrpcCRM UpdateEXP Error: ', err);
              // this.kueUpdateUserExp(job.data);
              return done(err);
            });
          } else return done();
        });
    });
  }
  
  kueUpdateOrder(order_no, updateOrder, order, insert, orderDetail) {
    // console.log('UpdateOrderJob: ========>', order_no);
    return this.kueJob.create('UpdateOrder', {order_no, updateOrder, order, insert, orderDetail, title: order.order_no}, 'critical');
  }
  
  kueUpdateOrderProcess(maximum, useTrx) {
    return this.kueJob.process('UpdateOrder', maximum, (job, done) => {
      if (job.data.status == 'complete') return done();
      // console.log('UpdateOrderProcess: ========>', job.data.order_no);
      return Promise.resolve()
        .then(() => {
          if (useTrx) {
            return this.updateOrderUseTransaction(job.data.order_no, job.data.updateOrder, job.data.order, job.data.insert, job.data.orderDetail);
          } else {
            return Promise.all([
              this.mysqlOrdersModel.updateOrder(job.data.order.uid, job.data.order_no, job.data.updateOrder),
              !job.data.insert ? this.mysqlOrdersModel.updateOrderDetail(job.data.order.uid, job.data.order_no, new models.orderModel.GetOrderDetailParams(job.data.updateOrder)) : this.mysqlOrdersModel.createOrderDetail(job.data.orderDetail),
              job.data.order.change_price != 0 ? this.WalletService.updateBalance(job.data.order.uid, job.data.order.type || 1, job.data.order.change_price) : null
            ]);
          }
        })
        .then(o => {
          return done();
        }).catch(err => {
          // this.log.error('UpdateOrder Error: ', err);
          if (err == 'done') return done();
          else if (eutil.isArray(err)) return done(new Error(JSON.stringify(err))); //return job.complete();
          else return done(err);
        });
      
    });
  }
  
  // kueUpdateOrderProcess(maximum) {
  //   return this.kueJob.process('UpdateOrder', maximum, (job, done) => {
  //     if(job.data.status == 'complete') return done();
  //     console.log('UpdateOrderProcess: ========>', job.data.order_no);
  //     return Promise.all([
  //       this.mysqlOrdersModel.updateOrder(job.data.order_no, job.data.updateOrder),
  //       !job.data.insert ? this.mysqlOrdersModel.updateOrderDetail(job.data.order_no, new models.orderModel.GetOrderDetailParams(job.data.updateOrder)) : this.mysqlOrdersModel.createOrderDetail(job.data.orderDetail),
  //       this.WalletService.updateBalance(job.data.order.uid, job.data.order.type || 1, job.data.order.change_price)
  //     ]).then(o => {
  //       return done();
  //     }).catch(err => {
  //       this.log.error('UpdateOrder Error: ', err);
  //       if (eutil.isArray(err)) return done(new Error(JSON.stringify(err))); //return job.complete();
  //       else return done(err);
  //     });
  //   });
  // }
  
  
  /**
   * 获取订单明细
   * @param order_no 订单号
   */
  getOrderDetail(order_no, sid, uid) {
    return this.redisOrdersModel.getOrderDetail(order_no, sid, uid)
      .then(order => {
        if (order) return new models.orderModel.OrderDetailResFilter(order);
        else return this.mysqlOrdersModel.getOrderDetail(order_no, sid, uid)
          .then(o => {
            if (!o) return null;
            else {
              Promise.all([
                this.redisOrdersModel.createOrderDetail(o),
                this.redisOrdersModel.createOrderDetailSort(o)
              ]);
              return new models.orderModel.OrderDetailResFilter(o);
            }
          });
      });
  }
  
  /**
   * 获取订单
   * @param order_no 订单号
   */
  getOrder(order_no, sid, uid) {
    return this.redisOrdersModel.getOrder(order_no, sid, uid)
      .then(order => {
        if (order) return order;
        else {
          return this.mysqlOrdersModel.getOrder(order_no, sid, uid)
            .then(o => {
              if (!o) return null;
              else {
                Promise.all([
                  this.redisOrdersModel.createOrder(o),
                  this.redisOrdersModel.createOrderSort(o),
                  o.report_type == 2 ? this.redisOrdersModel.createOrderTypeSort(o) : null
                ]);
                return o;
              }
            });
        }
      });
  }
  
  /**
   * 获取订单明细列表
   * @param uid 用户Id
   * @param start 起始
   * @param end 结束
   */
  getOrderListDetail(sid, uid, lastTime, count, sort) {
    return this.redisOrdersModel.getOrderListDetail(sid, uid, lastTime, count, sort)
      .then(order => {
        if (order && order.length) return order;
        else {
          return this.mysqlOrdersModel.getOrderListDetail(sid, uid, lastTime, count, sort)
            .then(orders => {
              if (orders && orders.length) {
                return Promise.map(orders, (o) => {
                  Promise.all([
                    this.redisOrdersModel.createOrderDetail(o),
                    this.redisOrdersModel.createOrderDetailSort(o)
                  ]);
                  return new models.orderModel.OrderDetailResFilter(o);
                });
              } else return [];
            });
        }
      });
  }
  
  /**
   * 获取订单列表
   * @param uid 用户Id
   * @param lastTime
   * @param count
   */
  getOrderList(sid, uid, lastTime, count, sort) {
    return this.redisOrdersModel.getOrderList(sid, uid, lastTime, count, sort)
      .then(order => {
        if (order && order.length) return order;
        else {
          return this.mysqlOrdersModel.getOrderList(sid, uid, lastTime, count, sort)
            .then(orders => {
              if (orders && orders.length) {
                return Promise.map(orders, (o) => {
                  Promise.all([
                    this.redisOrdersModel.createOrder(o),
                    this.redisOrdersModel.createOrderSort(o),
                    o.report_type == 2 ? this.redisOrdersModel.createOrderTypeSort(o) : null
                  ]);
                  return new models.orderModel.OrderResFilter(o);
                });
              } else return [];
            });
        }
      });
  }
  
  /**
   * 根据report_type获取订单详情
   * @param order_no 订单号
   * @param uid 用户Id
   * @param type
   */
  getOrderByType(order_no, sid, uid, type) {
    return this.redisOrdersModel.getOrderByType(order_no, sid, uid, type)
      .then(order => {
        if (order) return new models.orderModel.OrderResFilter(order);
        else {
          return this.mysqlOrdersModel.getOrderByType(order_no, sid, uid, type)
            .then(o => {
              if (!o) return null;
              else {
                Promise.all([
                  this.redisOrdersModel.createOrder(o),
                  this.redisOrdersModel.createOrderSort(o),
                  o.report_type == 2 ? this.redisOrdersModel.createOrderTypeSort(o) : null
                ]);
                return new models.orderModel.OrderResFilter(o);
              }
            });
        }
      });
  }
  
  /**
   * 根据report_type获取订单详情列表
   * @param uid 用户Id
   * @param lastTime
   * @param count
   */
  getOrderTypeList(type, sid, uid, lastTime, count, sort) {
    return this.redisOrdersModel.getOrderTypeList(type, sid, uid, lastTime, count, sort)
      .then(order => {
        if (order && order.length) return order;
        else return null;
      })
      .then(od => {
        if (od && od.length) return od;
        else {
          return this.mysqlOrdersModel.getOrderTypeList(type, sid, uid, lastTime, count, sort)
            .then(orders => {
              if (orders && orders.length) {
                return Promise.map(orders, (o) => {
                  Promise.all([
                    this.redisOrdersModel.createOrder(o),
                    this.redisOrdersModel.createOrderSort(o),
                    this.redisOrdersModel.createOrderTypeSort(o)
                  ]);
                  return new models.orderModel.OrderResFilter(o);
                });
              } else return [];
            });
        }
      });
  }
  
  /**
   * 创建订单号
   * @param
   */
  getOrderNo(sid, type) {
    let date = eutil.dateGetDataStringNUmber();
    return this.getOrderCount(date)
      .then(count => {
        if (String(count).length === 9) this.log.warn("order number warn Order number spillover length is ", String(count).length);
        if (String(count).length > 9) this.log.error("order number error Order number spillover length is ", String(count).length);
        if (String(sid).length === 3) this.log.warn("order number warn sid spillover length is ", String(sid).length);
        if (String(sid).length > 3) this.log.error("order number error sid spillover length is ", String(sid).length);
        if (String(type).length === 2) this.log.warn("order number warn type spillover length is ", String(type).length);
        if (String(type).length > 2) this.log.error("order number error type spillover length is ", String(type).length);
        count = count ? Number(count).toString() : '1';
        return eutil.strPadstr(String(sid), "0", 3) + type + date + eutil.strPadstr(String(count), "0", 9);
        //return '0'.repeat(3 - String(sid).length) + sid + type + date + '0'.repeat(9 - String(count).length) + count;
      });
    // 数组超出报警
  }
  
  /**
   * 更新订单
   * @param order 订单模型
   */
  updateOrder(order_no, order, updateOrder, updateOrderDetail) {
    let list = [
      this.mysqlOrdersModel.updateOrder(order.uid, order_no, updateOrder),
      this.redisOrdersModel.createOrder(order),
      this.redisOrdersModel.createOrderSort(order),
      order.report_type == 2 ? this.redisOrdersModel.createOrderTypeSort(order) : null
    ];
    if (updateOrderDetail) {
      let orderDetail = new models.orderModel.OrderDetail(order);
      list.push(this.mysqlOrdersModel.updateOrderDetail(order.uid, order_no, updateOrderDetail));
      list.push(this.redisOrdersModel.createOrderDetail(orderDetail));
      list.push(this.redisOrdersModel.createOrderDetailSort(orderDetail));
    }
    return Promise.all(list);
  }
  
  /**
   * 收到异步回调更新订单
   */
  // updateOrderByNotify(order_no, updateOrder, order, insert, useTrx) {
  //   if (useTrx) {
  //     let orderDetail = new models.orderModel.OrderDetail(order);
  //     return this.updateOrderUseTransaction(order_no, updateOrder, order, insert, orderDetail)
  //       .then(() => {
  //         let redisArr = [
  //           this.redisOrdersModel.createOrder(order),
  //           this.redisOrdersModel.createOrderSort(order),
  //           this.redisOrdersModel.createOrderDetail(orderDetail),
  //           this.redisOrdersModel.createOrderDetailSort(orderDetail),
  //           this.WalletService.updateIncrRedisBalance(order.uid, order.change_price, order.type || 1)
  //         ];
  //         return Promise.all(redisArr);
  //       }).then(() => {return order;});
  //   } else {
  //     let orderDetail = new models.orderModel.OrderDetail(order);
  //     let list = [
  //       this.mysqlOrdersModel.updateOrder(order_no, updateOrder),
  //       !insert ? this.mysqlOrdersModel.updateOrderDetail(order_no, new models.orderModel.GetOrderDetailParams(updateOrder)) : this.mysqlOrdersModel.createOrderDetail(orderDetail),
  //       this.WalletService.updateBalance(order.uid, order.type || 1, order.change_price)
  //     ];
  //     return Promise.all(list)
  //       .then(() => {
  //         return Promise.all([
  //           this.redisOrdersModel.createOrder(order),
  //           this.redisOrdersModel.createOrderSort(order),
  //           this.redisOrdersModel.createOrderDetail(orderDetail),
  //           this.redisOrdersModel.createOrderDetailSort(orderDetail),
  //           this.WalletService.updateIncrRedisBalance(order.uid, order.change_price, order.type || 1)
  //         ]);
  //       })
  //       .catch(err => {
  //         return Promise.reject(err);
  //       });
  //   }
  // }
  
  updateOrderUseTransaction(order_no, updateOrder, order, insert, orderDetail) {
    return this.knex.transaction(trx => {
      return Promise.resolve()
        .then(() => {
          let transactionObj = {
            updateOrder: this.mysqlOrdersModel.updateOrder(order.uid, order_no, updateOrder, trx),
            updateOrderDetail: !insert ? this.mysqlOrdersModel.updateOrderDetail(order.uid, order_no, new models.orderModel.GetOrderDetailParams(updateOrder), trx) : this.mysqlOrdersModel.createOrderDetail(orderDetail, trx)
          };
          if (order.change_price != 0) {
            transactionObj.updateBalance = this.WalletService.updateBalance(order.uid, order.type || 1, order.change_price, trx);
          }
          return transactionObj;
        })
        .then(transactionObj => {
          return Promise.props(transactionObj).then(tranData => {
            if (tranData.updateOrder === 0) return Promise.reject([4512, "Can't find order", {order_no: order_no}]);
            if (tranData.updateBalance && tranData.updateBalance[0] && tranData.updateBalance[0].affectedRows == 0) {
              return Promise.reject([4523, "Update user's balance fail", {uid: order.uid, change_price: order.change_price}]);
            }
            if (tranData.updateOrderDetail === 0) return Promise.reject([4524, "Update user's order_detail fail", {}]);
            return order;
          }).catch(err => {
            if (eutil.isArray(err)) return Promise.reject(err);
            else if (err.code == 'ER_DUP_ENTRY' && err.errno == 1062) return Promise.reject('done');
            else return Promise.reject([4525, '更新失败，已回滚', JSON.stringify({error: err})]);
          });
        });
    });
  }
  
  /**
   * 收到异步回调使用kue更新订单
   */
  updateOrderByNotifyWithKUE(order_no, updateOrder, order, insert) {
    return Promise.resolve()
      .then(() => {
        let orderDetail = new models.orderModel.OrderDetail(order);
        let redisArr = [
          this.redisOrdersModel.createOrder(order),
          this.redisOrdersModel.createOrderSort(order),
          this.redisOrdersModel.createOrderDetail(orderDetail),
          this.redisOrdersModel.createOrderDetailSort(orderDetail),
          this.WalletService.updateIncrRedisBalance(order.uid, order.change_price, order.type || 1)
        ];
        return Promise.all(redisArr).then(() => {
          this.kueUpdateOrder(order_no, updateOrder, order, insert, orderDetail);
          return orderDetail;
        });
      });
    
  }
  
  /**
   * 订单限速，若通过则异步设置订单限速
   * @param order 订单模型
   */
  getOrderLimit(sid, uid) {
    return this.redisOrdersModel.getOrderLimit(sid, uid)
      .then(o => {
        return this.redisOrdersModel.setOrderLimit(sid, uid).then(() => {return o - 1 <= 0;});
      });
  }
  
  /**
   * 创建订单限制
   * @param order 订单模型
   */
  setOrderLimit(sid, uid, order_no) {
    return this.redisOrdersModel.setOrderLimit(sid, uid, order_no);
  }
  
  /**
   * 获取订单数量
   * @param date 日期
   */
  getOrderCount(date) {
    return this.redisOrdersModel.upsertOrderCount(date)
      .then(count => {
        if (count && count !== 1) return count;
        else return this.mysqlOrdersModel.getOrderCount(eutil.getTimeSeconds(eutil.dateGetDayOfStart())).then(cnt => {
          if (!cnt) return count;
          else return this.redisOrdersModel.upsertOrderCount(date, cnt - 0 + 1).then(() => {
            return cnt - 0 + 1;
          });
        });
      });
  }
  
  /**
   * 更新订单地址
   * @param order 新订单数据
   */
  updateOrderAddress(order, addressInfo) {
    return this.mysqlOrdersModel.updateOrder(order.uid, order.order_no, new models.orderModel.GetOrderParams(addressInfo))
      .then(o => {
        if (o) {
          return Promise.all([
            this.redisOrdersModel.createOrder(order),
            this.redisOrdersModel.createOrderSort(order),
            order.report_type == 2 ? this.redisOrdersModel.createOrderTypeSort(order) : null
          ]);
        } else return this.redisOrdersModel.addUpdateAddressKey(order);
      });
  }
  
  getOrderByNo(sid, order_no) {
    return this.redisOrdersModel.getOrderByNo(sid, order_no)
      .then(order => {
        if (order) return order;
        else {
          return this.mysqlOrdersModel.getOrderByNo(order_no)
            .then(o => {
              if (!o) return null;
              else {
                Promise.all([
                  this.redisOrdersModel.createOrder(o),
                  this.redisOrdersModel.createOrderSort(o),
                ]);
                return o;
              }
            });
        }
      });
  }
  
  /**
   * 根据订单类型获取订单所需要的商品信息
   * 充值 goods_sn ---> score_rule code
   * 系统 goods_sn ---> score_rule code
   * 实物 goods_sn ---> goods goods_sn
   * 虚拟 goods_sn ---> goods goods_sn and digital_card goods_id
   */
  getGoodsOrderByType(type, goods_sn, buy_count, data) {
    switch (type) {
      //CNY-充值
      case 'recharge':
        return this.ChargeService.getByCode(goods_sn)
          .then(charge => {
            if (charge && charge.category_id == 6) return {
              order: new models.chargeModel.ChargeForOrder(charge, data.type, buy_count),
              limit: false
            };
            else return {err: [4512, 'Can not find charges', {}]};
          });
        break;
      // 积分变动
      case 'system':
        return this.ChargeService.getByCode(goods_sn)
          .then(charge => {
            //过滤系统内部积分变动是0的调用
            if (charge && charge.price != 0) {
              return {order: new models.chargeModel.SystemForOrder(charge, buy_count), limit: false, is_pay: 1};
            } else if (charge) return {order: false, err: [4522, 'charges price is 0', {code: goods_sn}]};
            else return {err: [4512, 'Can not find charges', {}]};
          });
        break;
      //实物(商城) 和 虚拟(电子卡)
      case 'goods':
        return this.GoodsService.findByGoodsSn(goods_sn)
          .then(goods => {
            if (!goods) return {err: [4512, 'Can not find workable goods', {}]};
            else return this.GoodsService.filterGoodsAndClassify(goods)
              .then(info => {
                if(info.err) return {err: info.err};
                else return this.getOrderByGoodsType(goods, buy_count, info.limit, info.goodsType, info.needAddress, data.address);
              });
          });
        break;
      //运营后台加积分
      case 'OSS':
        if (!data.creater) return {err: [4000, 'OSS system need creater', {}]};
        return {order: new models.chargeModel.OSSForOrder(data, buy_count), limit: false};
        break;
      default:
        return {err: [4513, 'create order type error', {type}]};
    }
  }
  
  /**
   * 根据商品类型获取不同的订单参数
   */
  getOrderByGoodsType(goods, buy_count, limit, goodsType, needAddress, address) {
    switch (goodsType) {
      case 'Mall':
        return this.getMallOrderByGoods(goods, limit, buy_count, needAddress, address);
        break;
      case 'Digital':
        //虚拟订单信息(无兑换码,主要是为了统一参数名称和获取价格)
        return {order: new models.digitalModel.DigitalForOrder([], buy_count, {}, goods), limit, digital_card: true, import_digital_card_total: goods.import_digital_card_total};
        break;
      default:
        return {err: [4513, 'create goods type error', {goodsType}]};
        break;
    }
  }
  
  /**
   * 获取虚拟订单参数
   */
  getDigitalOrderByGoods(buy_count, goods_sn, order, goods_num) {
    return this.DigitalService.getUnusedDigital(goods_sn, buy_count)
      .then(data => {
        if (!data) return {err: [4512, 'Can not find workable digital', {}]};
        if(goods_num <= this.digitalWarnNum) {
          this.log.warn(`Digital Card Num is blow Warn Num .... ${goods_num}, ${this.digitalWarnNum}`);
          this.DigitalService.setUnusedDigital(goods_sn, this.digitalRedisNum);
        }
        if (data.num) return {err: [4514, 'Digital is not enough', {num: data.num}]};
        return Promise.reduce(data.digital, (result, d, index) => {
          if (index == 0) result[0] = d.code, result[1] = d.sn;
          else result[0] += ',' + d.code, result[1] += ',' + d.sn;
          return result;
        }, []).then(code_sn => {
          return _.merge(order, new models.digitalModel.DigitalForOrder(code_sn, buy_count, data.digital[0], order));
        });
      });
  }
  
  /**
   * 获取实物订单参数
   */
  getMallOrderByGoods(goods, limit, goods_count, needAddress, address) {
    if (needAddress && !address) return {
      err: [4000, 'address form error', {address: '用户名,手机号码,省|市|区,街道等具体信息 or 用户名,手机号码,直辖市|区,街道等具体信息'}]
    };
    let mallOrder = needAddress ? new models.orderModel.OrderAddressFilter(address) : {};
    if (!needAddress || mallOrder.address && mallOrder.addressee && mallOrder.district && mallOrder.phone > 0) {
      return {order: new models.goodsModel.GoodsForOrder(_.merge(goods, mallOrder), goods_count), limit};
    }
    else return {
      err: [4000, 'address form error', {address: '用户名,手机号码,省|市|区,街道等具体信息 or 用户名,手机号码,直辖市|区,街道等具体信息'}]
    };
  }
  
  /**
   * 检验生成订单的必要条件，并返回完整订单模型
   * 1. 用户余额
   * 2. 商品余量
   * 3. 生成订单号
   */
  verificationEssential(order, goods_sn, limit, is_digital, digital_card, import_digital_card_total, data) {
    return Promise.resolve()
      .then(() => {
        if (order.is_pay && order.change_price != 0) {
          return this.WalletService.updateIncrRedisBalance(order.uid, order.change_price, data.walletType || 1)
            .then(balance => {
              if (!balance && balance != 0) {
                return this.WalletService.set(new models.walletModel.Wallet({uid: data._uid, type: data.walletType||1})).then(w => {
                  return order.change_price - 0;
                });
              }
              else return Number(balance).toFixed(2) - 0;
            })
            .then(w => {
              if (order.report_type == 3 || w >= 0) return order;
              else return this.WalletService.updateIncrRedisBalance(order.uid, Number(-1 * order.change_price).toFixed(2) - 0, data.walletType || 1).then(() => {
                return Promise.reject([4516, "User's balance is not enough", {uid: order.uid, balance: w}]);
              });
            });
        } else return order;
      })
      .then(order => {
        if(!limit) return order; //没有限制，说明是非商城订单，不检查且不记录商品余量
        return this.GoodsService.checkGoodsCount(order.sid, order.uid, goods_sn, order.goods_count, limit).then(check => {
          if (check.err) return this.WalletService.updateIncrRedisBalance(order.uid, Number(-1 * order.change_price).toFixed(2) - 0, data.walletType || 1).then(() => {
            return Promise.reject(check.err);
          });
          //实物订单
          if (!digital_card) return order;
          // if(!import_digital_card_total || import_digital_card_total <= 0) return order;
          if(import_digital_card_total <= 0) return order;
          else return this.getDigitalOrderByGoods(order.goods_count, goods_sn, order, limit.goods_num).then(o => {
            if(!o.err) return o;
            else return Promise.all([
              this.GoodsService.updateRedisGoodsNum(goods_sn, order.goods_count * -1),
              limit.buylimit ? this.GoodsService.updateRedisGoodsLimit(order.sid, order.uid, goods_sn, order.goods_count * -1) : null,
              this.WalletService.updateIncrRedisBalance(order.uid, Number(-1 * order.change_price).toFixed(2) - 0, data.walletType || 1)
            ]).then(() => {
              return Promise.reject(o.err);
            });
          });
        });
      })
      .then(order => {
        return this.getOrderNo(order.sid, is_digital + 1).then(order_no => {
          order.order_no = order_no;
          return order;
        });
      });
  }
  
  deleteOrder(order_no, sid, uid, creater, isRefund) {
    return this.mysqlOrdersModel.deleteOrder(order_no, sid, uid, creater, isRefund)
      .then(() => {
        return this.redisOrdersModel.deleteOrder(order_no, sid, uid);
      });
  }
  
  deleteOrderDetail(order_no, sid, uid) {
    return this.mysqlOrdersModel.deleteOrderDetail(order_no, sid, uid)
      .then(() => {
        return this.redisOrdersModel.deleteOrderDetail(order_no, sid, uid);
      });
  }
  
  updateOrderByOSS(sid, order_no, updateParams) {
    return Promise.resolve()
      .then(() => {
        let updateOrder = new models.orderModel.GetOrderParams(updateParams, true);
        if (Object.keys(updateOrder).length < 1) {
          return Promise.reject([4000, 'update params error', {}]);
        } else {
          let updateOrderDetail = new models.orderModel.GetOrderDetailParams(updateOrder, true);
          if (Object.keys(updateOrderDetail).length < 1) updateOrderDetail = null;
          return {updateOrder, updateOrderDetail};
        }
      })
      .then(({updateOrder, updateOrderDetail}) => {
        return this.getOrderByNo(sid || 1, order_no)
          .then(order => {
            if (!order) return Promise.reject([4512, 'can not find order', {order_no}]);
            else return {updateOrder, updateOrderDetail, order: _.assign(order, updateOrder)};
          });
      })
      .then(({updateOrder, updateOrderDetail, order}) => {
        return this.updateOrder(order_no, order, updateOrder, updateOrderDetail)
          .then(() => {
            return [2000, 'success', {}];
          });
      })
      .catch(function (res) {
        if (eutil.isArray(res)) return res;
        else {
          this.log.error(res);
          return [500, 'error', res];
        }
      });
  }
  
  updateOrderByFile (fileModel) {
    if(!fileModel.findCondition.order_no || !fileModel.updateParams.express_no) return Promise.reject({msg: 'File context is error'});
    return this.updateOrderByOSS(fileModel.findCondition.sid, fileModel.findCondition.order_no, fileModel.updateParams);
  }
  
  /*
   * 删除订单信息
   * @creater: Bo
   * @params orderObj type: Array/Object {sid, uid, order_no}
   * @params isRefund type: Boolean
   * @params creater type: Number 操作者
   **/
  deleteOrderByOSS(orderObj, isRefund, creater) {
    return Promise.resolve()
      .then(() => {
        if(eutil.isObject(orderObj) && orderObj.uid && orderObj.order_no && orderObj.sid) orderObj = [orderObj];
        if(eutil.isArray(orderObj)) return orderObj;
        else return Promise.reject([4510, 'params is error', {}]);
      })
      .then((orderList) => {
        return Promise.reduce(orderList, (result, order) => {
          return Promise.resolve()
            .then(() => {
              if(order.sid && order.uid && order.order_no) {
                return this.getOrderByNo(order.sid, order.order_no).then(o => {
                  if(!o || !o.is_pay) return result.push({order_no: order.order_no, reason: "can't find order or order is not pay"});
                  if(o.status != 1) return result.push({order_no: order.order_no, reason: `order's status is ${o.status}`});
                  if(o.order_status == 7) return result.push({order_no: order.order_no, reason: `order_status is ${o.order_status}`});
                  if(o.report_type == 1 || (o.report_type == 2 && o.cd_key)) return result.push({order_no: order.order_no, reason: `order's report_type is ${o.report_type}`});
                  if(o.change_price == 0) isRefund = false;
                  return this.deleteOrderWithTrx(o, creater, isRefund).then(data => {
                    if(data) return result.push({order_no: o.order_no, reason: `delete order with trx error`, trxData: data});
                    else return Promise.all([
                      this.redisOrdersModel.deleteOrder(o.order_no, o.sid, o.uid),
                      this.redisOrdersModel.deleteOrderDetail(o.order_no, o.sid, o.uid),
                      this.WalletService.updateIncrRedisBalance(o.uid, o.pay_price, 1),
                      order.exp_price > 0 ? this.UserExpService.updateRedisUserExp(o.sid, o.uid, -1*o.exp_price) : null,
                      this.GoodsService.updateRedisGoodsNum(o.goods_id, -1*o.goods_count),
                      this.GoodsService.updateRedisGoodsStatistics(o.sid, o.report_type, -1*o.pay_price, true),
                      this.GoodsService.updateRedisGoodsBill(o.sid, o.goods_id, eutil.dateFormat(eutil.dateGetBeforeDay(null, 1), 'yyyyMM'), -1*o.pay_price, -1*o.goods_count)
                    ]).then(() => {
                      return this.GoodsService.getGoodsLimitCount(o.sid, o.uid, o.goods_id).then(count => {
                        if(count > 0) return this.GoodsService.updateRedisGoodsLimit(o.sid, o.uid, o.goods_id, -1*o.goods_count);
                      });
                    }).then(() => {
                      if(o && o.exp_price > 0) return this.UserExpService.getUserExp(o.sid, o.uid).then(exp => {
                        return GrpcService.grpcCRM([{exp}, o.uid], 'consumerService-updateUserInfo')
                          .then(res => {
                            if (res[0] != 2000) this.kueUpdateUserExp({sid: o.sid, uid: o.uid, exp_price: exp, order_no: o.order_no});
                          });
                      });
                    });
                  });
                });
              } else result.push({order_no: order.order_no, reason: 'params error'});
            })
            .then(() => {
              return result;
            });
        }, []);
      })
      .then(failArr => {
        if(failArr && failArr.length) return [4526, 'fail delete order', {failList: failArr}];
        else return [2000, 'success', {}];
      })
      .catch(function (res) {
        if (eutil.isArray(res)) return res;
        else {
          console.error('delete order error: ', res);
          return [500, 'error', res];
        }
      });
  }
  
  deleteOrderWithTrx(order, creater, isRefund) {
    return this.knex.transaction(trx => {
      return Promise.resolve()
        .then(() => {
          let transactionObj = {
            order: this.mysqlOrdersModel.deleteOrder(order.order_no, order.sid, order.uid, creater, isRefund, trx),
            orderDetail: this.mysqlOrdersModel.deleteOrderDetail(order.order_no, order.sid, order.uid, trx)
          };
          if (order.change_price != 0) {
            transactionObj.wallet = this.WalletService.updateBalance(order.uid, 1, order.pay_price, trx);
          }
          if (order.exp_price > 0) {
            transactionObj.userExp = this.UserExpService.updateUserExp(order.sid, order.uid, -1 * order.exp_price, trx);
          }
          if (order.report_type == 2) {
            transactionObj.goodsLimit = this.GoodsService.updateGoodsLimit(order.sid, order.uid, order.goods_id, -1 * order.goods_count, trx);
          }
          return transactionObj;
        }).then(obj => {
          return Promise.props(obj).then(tranData => {
            if (tranData.wallet && tranData.wallet[0] && tranData.wallet[0].affectedRows == 0) {
              return Promise.reject([4516, "User's balance is not enough", {order_no: order.order_no, uid: order.uid}]);
            }
            if (tranData.userExp === 0) return Promise.reject([4522, "Update user's exp fail", {}]);
            return null;
          }).catch(res => {
            if (eutil.isArray(res)) return Promise.reject(res);
            else if (res.code == 'ER_DUP_ENTRY' && res.errno == 1062) return Promise.reject('done');
            else return Promise.reject([4513, '创建失败，已回滚', JSON.stringify({error: res})]);
          });
        });
    });
  }
}

module.exports = Orders;
