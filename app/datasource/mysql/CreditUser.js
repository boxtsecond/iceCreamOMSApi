'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditUser) {
    return this.wclient('credit_user').insert(creditUser).then(result => {
      creditUser.id = result[0];
      return creditUser;
    });
  }
  del (id) {
    return this.wclient('credit_user').where({id: id}).del();
  }
  updateById (updateCreditUser, id) {
    return this.wclient('credit_user').where({id}).update(updateCreditUser);
  }
  findById (id) {
    return this.rclient('credit_user').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;