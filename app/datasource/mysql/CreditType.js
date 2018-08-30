'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditType) {
    return this.wclient('credit_type').insert(creditType).then(result => {
      creditType.id = result[0];
      return creditType;
    });
  }
  del (id) {
    return this.wclient('credit_type').where({id: id}).del();
  }
  updateById (updateCreditType, id) {
    return this.wclient('credit_type').where({id}).update(updateCreditType);
  }
  findById (id) {
    return this.rclient('credit_type').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;