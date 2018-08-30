/*
 * @Author: dongyuxuan 
 * @Date: 2017-11-27 17:03:23 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-12-04 13:32:06
 */
'use strict';

class localGoodsModel {
  constructor (redisSubPubEventModel) {
    this.goods = {};// hash key: discoverId, value: [] 
    this.redisSubPubEventModel = redisSubPubEventModel;
    this.keys = {
      UPDATE_GOODSLIST: 'update_goodsList',
      CLEAR_GOODSLIST: 'clear_goodsList',
      CLEAR_AllGOODSLIST: 'clear_allGoodsList',
    };
    this.subscribeChannnel = 'goods';
    this.redisSubPubEventModel.redisPublishEvent.on(this.subscribeChannnel, message => {
      let storeObj = JSON.parse(message);
      switch (storeObj.key) {
        case this.keys.UPDATE_GOODSLIST: {
          let {discoverIdAndSid, goodsList} = storeObj.value;
          return this.updateGoodsList(discoverIdAndSid, goodsList);
        }
        case this.keys.CLEAR_GOODSLIST: {
          let discoverIdAndSid = storeObj.value;
          return this.clearGoodsList(discoverIdAndSid);
        }
        case this.keys.CLEAR_AllGOODSLIST:
          return this.clearAllGoodsList();
      }
    });
    this.redisSubPubEventModel.subscribe(this.subscribeChannnel)
      .then(({event, count}) => {
        console.log('subecribe channel goods, count:', count);
      });
  }
  publishUpdateGoodsList (discoverId, sid, goodsList) {
    let discoverIdAndSid = discoverId + '_' + sid;
    return this.redisSubPubEventModel.publish(this.subscribeChannnel, JSON.stringify({
      key: this.keys.UPDATE_GOODSLIST,
      value: {discoverIdAndSid, goodsList}
    })).then(res => goodsList);
  }
  publishClearGoodsList (discoverId, sid) {
    let discoverIdAndSid = discoverId + '_' + sid;
    return this.redisSubPubEventModel.publish(this.subscribeChannnel, JSON.stringify({
      key: this.keys.CLEAR_GOODSLIST,
      value: discoverIdAndSid
    })).then(res => discoverId);
  }
  publishClearAllGoodsList () {
    return this.redisSubPubEventModel.publish(this.subscribeChannnel, JSON.stringify({
      key: this.keys.CLEAR_AllGOODSLIST,
      value: null
    }));
  }
  /*******修改数据 函数********/
  updateGoodsList (discoverIdAndSid, goodsList) {
    this.goods[discoverIdAndSid] = goodsList;
  }
  clearGoodsList (discoverIdAndSid) {
    this.goods[discoverIdAndSid] = [];
  }
  clearAllGoodsList () {
    this.goods = {};
  }
  getGoodsList (discoverId, sid) {
    let discoverIdAndSid = discoverId + '_' + sid;
    let goodsList = this.goods[discoverIdAndSid];
    return goodsList || [];
  }
}

module.exports = localGoodsModel;