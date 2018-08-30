'use strict';

var http = require('http');

var qs = require('querystring');

const options = {
    "hostname": "intapi.253.com",
    "port": 80,
    "path": "/mt",
    "method": "GET"
  };

const post_data = {
  "un": "I9947255",
  "pw": "8oqnjzEZfhc32e"
};

var message=require('./message');

function send_sms(itucode,phone,code){
  let msg= '【雪糕群】您的验证码为' + code + ',10分钟内有效,不要告诉其他人哦';
   if(itucode=='86'|| itucode==86){
     return message.sendSMS(phone,msg);
   }
   else {
     if(itucode =="00886") itucode="886";
     if(itucode =="00852") itucode="852";
     if(itucode =="00853") itucode="853";
     let phoneNumber = itucode+phone;
    return new Promise((resolve,reject) => {
        let data = Object.assign(post_data,{
          da:phoneNumber,
          sm:msg,
          rf:1,
          tf:3,
          dc:15
        });
    //let uri = '/mt?da=${data.da}&sm=${data.sm}&rf=1&tf=3&dc=15&un=${post_data.un}&pw=${post_data.pw}';
    let uri = '/mt?da='+data.da+'&sm='+data.sm+'&rf=1&tf=3&dc=15&un='+post_data.un+'&pw='+post_data.pw;
    let content = qs.stringify(data);
    get(uri,content)
      .then((result) => {
      return resolve(result);
  })
  .catch(err=>reject(err));
  });
  }

}

function get(uri, content){
  return new Promise(function(resolve){
    var opt = Object.assign(options,{
      path: uri,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        'Content-Length': content.length
      }
    });
    var req = http.request(opt, function (res) {
      res.on('data', function (chunk) {
        // console.log('BODY: ' + chunk);
        return resolve(chunk);
      });
    });
    req.write(content);
    req.end();
  });
}

module.exports = {
  sendSMS: send_sms
};
