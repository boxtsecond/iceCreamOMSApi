'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (creditSetting) {
    return this.wclient('credit_setting').insert(creditSetting).then(result => {
      creditSetting.id = result[0];
      return creditSetting;
    });
  }
  del (id) {
    return this.wclient('credit_setting').where({id: id}).del();
  }
  updateById (updateCreditSetting, id) {
    return this.wclient('credit_setting').where({id}).update(updateCreditSetting);
  }
  findById (id) {
    return this.rclient('credit_setting').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;