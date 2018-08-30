
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
let grpcExtract = require('./lib/grpc/server');
var RateLimit = require('express-rate-limit');
let limitMax=20000;
if(process.env.NODE_ENV=="development") limitMax=20;
var limitoptions={
  windowMs: 1000,
  delayAfter:0,
  max: limitMax, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
  message: 'Too many requests, please try again later.',
  headers: true,
  statusCode: 429
};
var limiter = new RateLimit(limitoptions);
module.exports=function (app,cb) {
      grpcExtract.start();
      // app.use('/api/Orders/*', limiter);
     // console.log(app.get("appName"))
   // app.set("log",bunyan.createLogger({name: app.get("appName")}));

  //   const config=app.get("config");
  //   // 连接mysql
  //   let mysqlMaster=Apiapp.mysql.mysqlMaster;
  //   mysqlMaster.createClient(config.mysql.master);
  //   app.set("mysqlMaster",mysqlMaster);
  // // 连接redis
  //   let redisMaster=Apiapp.redis.redisMaster;
  //   redisMaster.createClient(config.redis.master);
  //   app.set("redisMaster",redisMaster);
  //   let redisSlave=Apiapp.redis.redisSlave;
  //   redisSlave.createClient(config.redis.salve);
  //   app.set("redisSlave",redisSlave);
  //
  //
  //   const adapter=Apiapp.lib.adapter(app);
  //   app.set("adapter",adapter);
  //   //  设置访问权限
  //   const auth_passport=Apiapp.auth.auth_passport(app);
  //    app.set("auth_passport",auth_passport);
  //   const verToken=Apiapp.auth.verToken(app);
  //
  //     // app.remotes().before ('/api/Consumers/login', function (ctx, next) {
  //     //   // ctx.result ={data:ctx.result};
  //     //   console.log(ctx.req.body)
  //     //   next();
  //     // });
  //
  //
  //   app.get('/api/Stars/login', auth_passport.basic());
  //



  // 敏感词
  // setInterval(function(){
  //   wordfilter.clearList();
  //   redisSlave.getSensitiveWords()
  //     .then(result=>wordfilter.addWords(result))
  //   .catch(err=>{})
  //  },60000)
  //
  // app.set("wordfilter",wordfilter);
  // auth_passport.jwt()
  //  app.get('/api/Stars/getHeadline/*', auth_passport.basic());
  // app.set("auth",redisSlave);
  // 连接 mongodb
  //  app.set("mongodb","");



     cb(null);
};
