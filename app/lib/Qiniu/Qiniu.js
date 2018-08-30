/**
 * Created by Bo on 2018/3/30.
 */
'use strict';
const qiniu = require("qiniu");
const Promise=require("bluebird");
const request = Promise.promisifyAll(require('request'));

qiniu.conf.ACCESS_KEY = 'nVQ3fMxNV7EgwQFiV_IiOgt7HBwlJ7jcV5Apd8F0';
qiniu.conf.SECRET_KEY = 'QSTYraG8IfUiGrkllPnWciPMAtSrltsoj6ASjxxf';

class Qiniu {
  /*
   * @params bucket 要上传的空间
   * */
  uptoken(bucket, fileName) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+fileName);
    return putPolicy.token();
  }
  
  /*
   * @params fileUrl 文件地址
   * @params uploadName 上传后的文件名
   * */
  uploadFile(bucket, fileUrl, uploadName) {
    return Promise.resolve()
      .then(() => {
        return this.uptoken(bucket, uploadName);
      })
      .then(uploadToken => {
        return qiniu.io.putFile(uploadToken, uploadName, fileUrl, null).then(res => {
          console.log(res.body);
          if(res && res.body) return res.body;
          else return Promise.reject("response error");
        });
      });
  }
  
}

module.exports = new Qiniu();
