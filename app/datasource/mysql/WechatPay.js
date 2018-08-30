/**
 * Created by Bo on 2017/11/9.
 */
'use strict';

class masterModel {
  constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
  }
  
  save(order) {
    return this.wclient('wechatpay_notify_record').insert(order);
  }
  
  saveError(order) {
    return this.wclient('wechatpay_notify_record_error_log').insert(order);
  }
  
  refund(order) {
    return this.wclient('wechatpay_notify_refund_record').insert(order);
  }
  
}

module.exports = masterModel;
