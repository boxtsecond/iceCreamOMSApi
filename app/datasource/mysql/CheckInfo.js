'use strict';

const moment = require('moment');
class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
    this.table = 'check_info';
  }
  // 队列处理，不需要外部回滚
  // checkIn ({needSave, needUpdate}, outerTrx) {
  //   let queryBuilder = outerTrx ? outerTrx : this.wclient;
  //   return new Promise((resolve, reject) => {
  //     queryBuilder.transaction(trx => {
  //       Promise.props({
  //         saveResult: trx.insert(needSave).into(this.table),
  //         updateResult: needUpdate ? trx(this.table).where({id: needUpdate.id}).update(needUpdate.updateAttributes) : null
  //       }).then(result => resolve({
  //         trx: trx,
  //         returnData: needSave
  //       })).catch(err => {
  //         console.log(err);
  //         resolve({
  //           trx: trx,
  //           err
  //         });
  //       });
  //     }).catch(err => {
  //       // 此事务已回滚
  //     });
  //   });
  // }
  checkIn (checkInfo) {
    return this.wclient.raw(
      this.wclient.insert(checkInfo).into(this.table).toString()
        + ' ON DUPLICATE KEY UPDATE '
        + `con_num = ?, total_num = ?, mtime = ?`,
      [checkInfo.con_num, checkInfo.total_num, checkInfo.mtime]
    );
  }
  listByUid ({sid, uid, maxTime, minTime, skip, count}) {
    let query = this.rclient(this.table).select().where({sid, uid}).orderByRaw('check_time desc');
    if (maxTime) query = query.andWhere('check_time', '<', maxTime);
    if (minTime) query = query.andWhere('check_time', '>', minTime);
    if (skip) query = query.offset(skip);
    if (count) query = query.limit(count);
    return query;
  }

  findByUidAndTime (sid, uid, check_time) {
    return this.rclient('check_info').select().where({sid, uid, check_time}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;