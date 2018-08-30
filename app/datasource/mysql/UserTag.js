'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	save (userTag) {
    return this.wclient('user_tag').insert(userTag).then(result => {
      userTag.id = result[0];
      return userTag;
    });
  }
  del (id) {
    return this.wclient('user_tag').where({id: id}).del();
  }
  updateById (updateUserTag, id) {
    return this.wclient('user_tag').where({id}).update(updateUserTag);
  }
  findById (id) {
    return this.rclient('user_tag').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;