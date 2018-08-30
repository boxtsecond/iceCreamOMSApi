'use strict';
const models = require('../models');
class UserAddress {
  constructor(app, util) {
    this.mysqlUserAddressModel = app.get("mysqlUserAddressModel");
    this.redisUserAddressModel = app.get("redisUserAddressModel");
    this.log = util.log;
  }
  // 先写mysql，再写redis
  save(userAddress) {
    return this.mysqlUserAddressModel.save(userAddress)
      .then(resultUserAddress => {
        return this.redisUserAddressModel.save(resultUserAddress)
          .then(res => resultUserAddress);
      });
  }
  // 先取redis，再取mysql；redis中取到，直接返回；mysql中取到，写回redis
  listByUid (uid) {
    return this.redisUserAddressModel.listByUid(uid, 0, 3)
      .then(addressList => {
        if (addressList && addressList.length) return addressList;
        return this.mysqlUserAddressModel.find({
          where: {uid}
        }).then(mysqlResultList => {
          if (!mysqlResultList || !mysqlResultList.length) return [];
          // 异步写回redis
          Promise.map(mysqlResultList, address => {
            return this.redisUserAddressModel.save(address);
          });
          return mysqlResultList;
        });
      });
  }
  findById (id) {
    return this.redisUserAddressModel.get(id)
      .then(userAddress => {
        if (userAddress) return userAddress;
        return this.mysqlUserAddressModel.findById(id)
          .then(userAddress => {
            if (!userAddress) return null;
            return this.redisUserAddressModel.set(userAddress);
          });
      });
  }
  upsert(userAddress) {
    return this.mysqlUserAddressModel.updateById(userAddress, userAddress.id)
      .then(result => {
        console.log(result);
        if (result === 1) return true;
        else this.save(userAddress).then(() => false);
      });
  }
  updateAttributes (attributes, id) {
    return this.findById(id)
      .then(oldAddress => {
        if (!oldAddress) return null;
        let newAddress = Object.assign({}, oldAddress, attributes);
        return this.redisUserAddressModel.set(newAddress).then(res => oldAddress);
      })
      .then(oldAddress => {
        if (!oldAddress) return null;
        // 异步更新mysql
        this.mysqlUserAddressModel.updateById(attributes, id).then(result => {
          if (result) this.log.debug('userAddressService-updateAttributes,异步更新mysql成功', result);
        });
        return oldAddress;
      });
  }
  updateDefaultAddress (oldDefaultAddressId, newDefaultAddressId, newDefaultAddress) {
    let existOldDefault = oldDefaultAddressId && oldDefaultAddressId != -1;
    return Promise.props({
      oldDefaultResult: existOldDefault ? this.updateAttributes({status: 0}, oldDefaultAddressId) : true,
      newDefaultResult: this.updateAttributes({status: 1, address: newDefaultAddress}, newDefaultAddressId)
    });
  }
  updateAll (data, where) {
    return this.mysqlUserAddressModel.updateAll(data, where);
  }
  /**
   * @param {object} filter
   * @param {array} filter.fields
   * @param {object} filter.where
   * @param {string} filter.order
   * @param {number} filter.limit
   * @param {number} filter.skip
   */
  find(filter) {
    return this.mysqlUserAddressModel.find(filter);
  }
  // 根据 地址id 及 用户id 删除用户地址，删除redis 及 mysql 中的相应记录
  del(id, indexTableKeys) {
    return Promise.props({
      redisResult: this.redisUserAddressModel.del(id, indexTableKeys),
      mysqlResult: this.mysqlUserAddressModel.delById(id)
    });
  }
}
module.exports = UserAddress;
