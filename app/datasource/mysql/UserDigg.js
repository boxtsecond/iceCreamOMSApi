'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (userDigg) {
    return this.wclient('user_digg').insert(userDigg).then(result => {
      userDigg.id = result[0];
      return userDigg;
    });
  }
  del (id) {
    return this.wclient('user_digg').where({id: id}).del();
  }
  updateById (updateUserDigg, id) {
    return this.wclient('user_digg').where({id}).update(updateUserDigg);
  }
  findById (id) {
    return this.rclient('user_digg').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;