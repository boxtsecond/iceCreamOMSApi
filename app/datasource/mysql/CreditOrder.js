'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditOrder) {
    return this.wclient('credit_order').insert(creditOrder).then(result => {
      creditOrder.id = result[0];
      return creditOrder;
    });
  }
  del (id) {
    return this.wclient('credit_order').where({id: id}).del();
  }
  updateById (updateCreditOrder, id) {
    return this.wclient('credit_order').where({id}).update(updateCreditOrder);
  }
  findById (id) {
    return this.rclient('credit_order').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;