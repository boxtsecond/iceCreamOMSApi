'use strict';
// const NodeCache = require( "node-cache" );
// myCache = new NodeCache( { stdTTL: 3000 } )
//
// // Date.now() = 1456000500000
// myCache.set( "ttlKey", "MyExpireData" )
// myCache.set( "noTtlKey", 0, "NonExpireData" )
// obj = { my: "Special", variable: 42 };
// success = myCache.set( "myKey", obj, 20 );
//
// // ts wil be approximately 1456000600000
//
// myCache.getTtl( "ttlKey", function( err, ts ){
//   if( !err ){
//     // ts wil be approximately 1456000600000
//   }
// });
// // ts wil be approximately 1456000600000
//
// ts = myCache.getTtl( "noTtlKey" )
// // ts = 0
//
// ts = myCache.getTtl( "unknownKey" )
//
// setTimeout(function () {
//   success = myCache.set( "myKey", obj, 20 );
// },1000*19)
//
//
// setTimeout(function () {
//   success = myCache.set( "myKey", obj, 20 );
// },1000*45)
// myCache.on( "expired", function( key, value ){
//   // ... do something ...
//   console.log(key,value)
// });
// function test() {
//   myCache.get( "myKey", function( err, value ){
//     if( !err ){
//       console.log( value );
//       // if(value == undefined){
//       //   // key not found
//       // }else{
//       //  console.log( value );
//       //   //{ my: "Special", variable: 42 }
//       //   // ... do something ...
//       // }
//     }
//   });
//    console.log(",,")
// }
//
// setInterval(test,1000)
//
//
//
// const util = require('Timers');
// const  t=require('timers')
// const punycode = require('punycode');
//
// debugger;
// console.log(t )
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const  server1={a:1,b:2};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('Hello World\n');
});

console.log(`${server1}`);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/${JSON.stringify(server1)}`);
});

