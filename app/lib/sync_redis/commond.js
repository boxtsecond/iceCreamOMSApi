'use strict';

class redismanager{
  constructor(client){
    this.client = client;
  }

  exec(func, options){
    return new Promise((resolve, reject) => {
      this.client[func](...options, function(err,result){
        if (err){
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
}
module.exports = redismanager;
