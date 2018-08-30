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
    return this.wclient('alipay_notify_record').insert(order);
  }
  
  saveError(order) {
    return this.wclient('alipay_notify_record_error_log').insert(order);
  }
  
  refund(order) {
    return this.wclient('alipay_notify_refund_record').insert(order);
  }
  
  // del (id) {
  //   return this.wclient('channel_follow').where({id: id}).del();
  // }
  // updateById (updateChannelFollow, id) {
  //   return this.wclient('channel_follow').where({id}).update(updateChannelFollow);
  // }
  // findById (id) {
  //   return this.rclient('channel_follow').select().where({id}).limit(1)
  //     .then(result => {
  //       if (result && result.length === 1) return result[0];
  //       else return null;
  //     });
  // }
}

module.exports = masterModel;
