'use strict';

var http = require('http');
var qs = require('querystring');

const options = require('./default.json').option;
const post_data = require('./default.json').post_data;



/**
 * 发送短信方法
 * @param  {[type]} phone [description]
 * @param  {[type]} msg   [description]
 * @return {[type]}       [description]
 */
function send_sms(phone,msg,option){
  return new Promise(function(resolve){
    var data = Object.assign(post_data, {
      phone:phone,
      msg:msg,
      rd:1
    });
    var content = qs.stringify(data);
    post("/msg/send",content)
      .then(function(result){
        return resolve(result);
      });
  });
}

/**
 * 查询余额方法
 * @param  {string} un  用户名
 * @param  {string} pwd 密码
 * @return {[type]}     [description]
 */
function query_blance(un,pwd){
    var postData = {
        'un': un,
        'pw': pwd
    };
    var content = qs.stringify(postData);
    post("/msg/balance",content);
}

function post(uri,content){
  return new Promise(function(resolve){
    var opt = Object.assign(options,{
      path: uri,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'Content-Length': content.length
      }
    });
    var req = http.request(opt, function (res) {
      //res.setEncoding('utf8');
      res.on('data', function (chunk) {
        console.log('BODY: ' + chunk);
        if (chunk[1] === 0){
          return resolve(true);
        }
        return resolve(false);
      });
    });

    req.write(content);
    req.end();
  });
}

module.exports = {
	sendSMS:send_sms
};
