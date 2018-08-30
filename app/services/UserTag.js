'use strict';
const models = require('../models');
class UserTag {
  constructor(app) {
    this.mysqlUserTagModel = app.get("mysqlUserTagModel");
  }

  save(userTag) {
    return this.mysqlUserTagModel.save(userTag);
  }
  upsert(userTag) {
    return this.mysqlUserTagModel.updateById(new models.userModel.userTagUpsertObj(userTag), userTag.id)
      .then(res => {
        if (res === 1) return res;
        return this.mysqlUserTagModel.save(userTag);
      });
  }
}
module.exports = UserTag;
