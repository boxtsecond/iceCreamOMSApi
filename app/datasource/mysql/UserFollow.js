'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (userFollow) {
    return this.wclient('user_follow').insert(userFollow).then(result => {
      userFollow.id = result[0];
      return userFollow;
    });
  }
  del (id) {
    return this.wclient('user_follow').where({id: id}).del();
  }
  updateById (updateUserFollow, id) {
    return this.wclient('user_follow').where({id}).update(updateUserFollow);
  }
  findById (id) {
    return this.rclient('user_follow').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;