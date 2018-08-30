'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditRecord) {
    return this.wclient('credit_record').insert(creditRecord).then(result => {
      creditRecord.id = result[0];
      return creditRecord;
    });
  }
  del (id) {
    return this.wclient('credit_record').where({id: id}).del();
  }
  updateById (updateCreditRecord, id) {
    return this.wclient('credit_record').where({id}).update(updateCreditRecord);
  }
  findById (id) {
    return this.rclient('credit_record').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;