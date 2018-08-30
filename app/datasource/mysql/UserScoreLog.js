'use strict';

class masterModel {
	constructor(wclient,rclient) {
    this.wclient=wclient;
    this.rclient=rclient;
	}
	add (userScoreLog) {
    return this.wclient('user_score_log').insert(userScoreLog).then(result => {
      userScoreLog.id = result[0];
      return userScoreLog;
    });
  }
  del (id) {
    return this.wclient('user_score_log').where({id: id}).del();
  }
  updateById (updateUserScoreLog, id) {
    return this.wclient('user_score_log').where({id}).update(updateUserScoreLog);
  }
  findById (id) {
    return this.rclient('user_score_log').select().where({id}).limit(1)
      .then(result => {
        if (result && result.length === 1) return result[0];
        else return null;
      });
  }
}

module.exports = masterModel;