'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditCharge) {
    return this.wclient('credit_charge').insert(creditCharge).then(result => {
      creditCharge.id = result[0];
      return creditCharge;
    });
  }
  del (id) {
    return this.wclient('credit_charge').where({id: id}).del();
  }
  updateById (updateCreditCharge, id) {
    return this.wclient('credit_charge').where({id}).update(updateCreditCharge);
  }
  findById (id) {
    return this.rclient('credit_charge').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;