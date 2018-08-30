"use strict";

var Redis = require('ioredis');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: '139.196.124.244',
  user: 'root',
  password: '!@#AD2006',
  database:'icecream'
});

connection.connect();
//查询

var redisMaster=new Redis({ port: 7379,          // Redis port
  host: "10.40.253.187",   // Redis host
  family: 4,           // 4 (IPv4) or 6 (IPv6)
  password:"12345678",
  db: 4
});

let index=0;

function intoRedis(index,cb) {
  connection.query('select * from comments_fan where replyid=5079   ORDER BY createtime desc  limit '+index+',100', function(err, rows, fields) {
    if (err) {
      console.log(err);
    }
    else  {
          cb(rows);
    }
  });
}

global.Promise=require("bluebird");


function  init(myindex) {
  intoRedis(myindex,function(rows) {
    index=index+100;
    Promise.map(rows, function(item){
      let _count=item.likelist.toString().split(",").length;
      console.log("_count1",myindex,_count,item.creater);
      redisMaster.zadd("_count1",_count,item.creater);
    } , { concurrency: 1} ).then(()=>{
      init(index);
    });
  });
}
init(0)

// redisMaster.zrevrange("_count",0,100).then(data=>{
//   console.log(data);
// });






//关闭连接
// connection.end();
//

