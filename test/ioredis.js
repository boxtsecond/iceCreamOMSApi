'use strict';
// var Redis = require('ioredis');
// var redis = new Redis({
//   "host": "127.0.0.1",
//   "port": 7379,
//   "password": "12345678",
//   "name": "redisSlaveDatasource",
//   "family": 4,
//   "connector": "kv-redis"
// });
//
// redis.set('foo', 'bar');
// redis.get('foo', function (err, result) {
//   console.log(result);
// });
//
// // Or using a promise if the last argument isn't a function
// redis.get('foo').then(function (result) {
//   console.log(result);
// });
//
// // Arguments to commands are flattened, so the following are the same:
// redis.sadd('set', 1, 3, 5, 7);
// redis.sadd('set', [1, 3, 5, 7]);
//
// // All arguments are passed directly to the redis server:
// // redis.set('key', 100, 'EX', 10);
// redis.setex('eeeee', 10022, 'EX',function (err) {
//      console.log(err)
// });

// sudo docker run --name sentinel_2 -d -p 26377:26379 joshula/redis-sentinel --sentinel announce-ip  10.40.253.187  --sentinel announce-port 26377
// http://download.redis.io/redis-stable/sentinel.conf
var Redis = require('ioredis');
// var redis = new Redis({
//   sentinels: [{ host: '101.132.133.8', port: 26379 },
//       {  host: '101.132.134.18', port: 26379 },{  host: '101.132.130.169', port: 26379 }],
//     password: 'qkClOyzCmXYSTP8P',
//     name: 'mymaster'
// });
// var redis = new Redis({
//     sentinels: [{ host: '101.132.133.8', port: 26379 }
//     //, { host: '101.132.134.18', port: 26379 }, { host: '101.132.130.169', port: 26379 }
//     ],
//     name: 'mymaster',
//     password: 'qkClOyzCmXYSTP8P',
// });

// var redis = new Redis({
//     sentinels: [{ host: '101.132.133.8', port: 26379 }, { host: '101.132.134.18', port: 26379 }
//     , { host: '101.132.130.169', port: 26379 }],
//       auth: ,
//     connectTimeout: 9000,
//     name: 'mymaster'
// });



// let redis = new Redis({
//     // host: '101.132.133.8',
//   // port:7379,
//     sentinels: [
//     {
//         host: '101.132.133.8',
//         port: '26379'
//     }, {
//         host: '101.132.134.18',
//         port: '26379'
//     }, {
//         host: '101.132.130.169',
//         port: '26379'
//     }
// ],
//     name: "mymaster",
//     password: 'qkClOyzCmXYSTP8P'
// });
//
// // redis.set('foo', 'ba222r44444');
// redis.get('foo', function (err, result) {
//   console.log(result);
// });



// redis.hget('commentszhenfid',3739).then((re)=>{
//   // console.log(re)
//
//
// })
// redis.hget('osmeteor',3740).then((re)=>{
//   console.log(re)
//
//
// })
//



// redis.hget('commentszhenfid',3739).then((re)=>{
//    console.log(re)
//
//


// })


var redis = new Redis({
  "port": 7379,
  "host": "10.40.253.187",
  "options": {},
  "password": "12345678"
});
// redis.hgetall("test_").then(e=>{
//  console.log(e);
// })




//
// redis.hmset("test_",  [ '591d94b5-dfa9-4216-a597-c22464bdd309',
//   '{"appsecret":"98fe6629-1e25-408b-9db4-8cca1a8d02d3","remark":"雪糕群粉丝端"}' ,"key","value"]).then(e=>{
//   console.log("----",e)
// })


'use strict';
global.Promise=require("bluebird");

Promise.config({
  // Enable warnings
  warnings: false,
  // Enable long stack traces
  longStackTraces: true,
  // Enable cancellation
  cancellation: true,
  // Enable monitoring
  monitoring: true
});

Promise.reduce(["file1.txt", "file2.txt", "file3.txt"], function(_list, fileName) {
      _list.push(fileName)
     return  _list;
}, []).then(function(total) {
  //Total is 30
  console.log(total)
});



