'use strict';
// // const Joi = require('joi');
// //
// // const schema = Joi.object().keys({
// //   username: Joi.string().alphanum().min(3).max(30).required(),
// //   password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
// //   access_token: [Joi.string(), Joi.number()],
// //   birthyear: Joi.number().integer().min(1900).max(2013).options({ language: { any: { allowOnly: 'must match password' },
// //   email: Joi.string().email()
// // }).with('username', 'birthyear').without('password', 'access_token');
// //
// // // Return result.
// // const result = Joi.validate({ username: 'abc', birthyear: -1994 }, schema);
// //
// // console.log(result)
//
// const Joi = require('joi');
// const schema = Joi.object().options({ abortEarly: false }).keys({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(8).required(),
//   password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: '中文 match password' }} }),
//   first_name: Joi.string().required(),
//   last_name: Joi.string().required(),
//   company: Joi.string().optional()
// });
//
//
// const data = {
//   password: 'abcd1234',
//   password_confirmation: 'abc1',
//   first_name: 'Joe',
//   last_name: 'Doe'
// };
//
// function schemaValidator (schema, payload)  {
//   return new Promise((resolve, reject) => {
//       Joi.validate(payload, schema, (err, value) => {
//       if (err) {
//              if(err.details.length > 0) return resolve(err.details[0].message);
//               else return resolve(null);
//       }
//       else return resolve(null);
//
//    });
// });
// };
//
// schemaValidator(schema,data).then(err=>{
//   console.log(err)
// })
//
// // const result = Joi.validate(data, schema);
// // Joi.validate({ username: 'abc', birthyear: 1994 }, schema, function (err, value) {
// //
// //   console.log(err, value)
// //
// // });  // err === null -
//
// // Joi.assert(data, schema);



// var bluebird=require("bluebird")
//
// console.log(bluebird)


// var eutil=require("eutil")
//
// console.log(
//   "------->",
//   eutil.dateFormat(new Date('9999-12-30 23:59:59'),"yyyy-MM-dd hh:mm:ss S"),
//   eutil.dateFormat( new Date('2017-05-30 00:00:00'),"yyyy-MM-dd hh:mm:ss S")
// );
//
// console.log(new Date('2017-05-30 23:59:59').getTime())

//
// var itucodeArray=["86","00886","00852","00853"];
// console.log(itucodeArray.toString());
//
// const uuid = require('uuid');
//
// // ... using predefined DNS namespace (for domain names)
// ; // ⇨ 'fdda765f-fc57-5604-a269-52a7df8164ec'
//
//
// console.log(uuid())

// var itucodeArray=["86","00886","00852","00853"];
// // console.log(itucodeArray.toString());

// const uuid = require('uuid');

var eutil=require("eutil");

console.log(eutil.getTimeSeconds(eutil.dateGetDayOfStart()))

// console.log(
//   "------->",
//   new Date('2016-07-02 23:59:59')/1000,
//   eutil.dateFormat(new Date('2006-06-02 23:59:59'),"yyyy-MM-dd hh:mm:ss S"),
//   eutil.dateFormat(new Date(253402185599000),"yyyy-MM-dd hh:mm:ss S")
// );

// console.log(uuid())

//
// var moment = require('moment')
//
// let now = moment();
// let yesterday = moment().subtract(1, 'days');
// let date1 = moment(new Date(2017,0,13))
// let date2 = moment(new Date(2017,0,-3))
//
// // console.log(date1)
// // console.log(date1.day(-1))
// // console.log(moment(date1).day(-10))
// // console.log(date1)
// console.log(Date.now())
// console.log(now.unix())
// console.log(yesterday.unix())
// console.log(now.format('YYYYMMDD'))
// console.log(yesterday.format('YYYYMMDD'))
// console.log(eutil.dateFormat(new Date(), "yyyyMMdd"))

// const fs = require('fs');
//
// let con = fs.readFileSync('/Users/aiyi/Downloads/order.sql').toString();
// let list = con.split('CREATE TABLE `order` (')[1].split('UNIQUE KEY')[0].split(',');
// console.log(list)
//
// for(let i = 0; i < list.length; i++){
//   let name = list[i].split('`')[1];
//   if(name){
//     if(list[i].indexOf('DEFAULT') != -1){
//       let def = list[i].split('DEFAULT ')[1].split(' COMMENT')[0];
//       console.log(`this.${name} = order.${name} || ${def};`);
//     }else console.log(`this.${name} = order.${name};`);
//   }
// }

//
// console.log(
//   "------->",
//   eutil.dateFormat(new Date('2006-06-02 23:59:59'),"yyyyMMdd hh:mm:ss S"),
//   eutil.dateFormat(new Date(253402185599000),"yyyy-MM-dd hh:mm:ss S"),
//   new Date().getTime()
// );
// // require('node-snowflake').Server(3001);
//   var snowflake = require('node-snowflake').Snowflake;
//   console.log(snowflake.nextId(15));
//
// // 120171110
//
// // 800350175882659
// // 订单id库
// 800357163196020
// 800325226618207
// //18 位
// // 928877350484054016
// // 1510285544163
// //
// // 1506416986
// //
// //
// // 9
// // 120171110 + 9999
// //
// // 15
// // 800359710668696
// //
// //
// // 举例订单号：
// //
// // 120170622000001
// var Long = require("long");
//
// // var longVal = new Long(0xFFFFFFFF, 0x7FFFFFFF);
//
// for(var i=0;i<9999;i++){
//   var longVal = new Long(i+9, 2017-11-14,true);
//   console.log(longVal.toString());
//
// }

// const _ = require('lodash');
//
// let update = {pay_time: '1111111', mtime: '1111111', payment_type: 1, order_status: 4, is_pay: 1, pay_price: '1111111'};
// let order = {
//   "uid": 9974,
//   "order_no": 220171122094209,
//   "is_digital": 0,
//   "order_type": 1,
//   "report_type": 2,
//   "goods_cat_count": 1,
//   "goods_id": "931361187248082944",
//   "goods_name": "【雪糕熊公仔30cm】官方正版限时预售 预计11/30发货 可爱吊牌+暖心随机标语",
//   "goods_small_url": "http://ou5f5jxfx.bkt.clouddn.com/xgx_01.jpg,http://ou5f5jxfx.bkt.clouddn.com/xgx_02.jpg,http://ou5f5jxfx.bkt.clouddn.com/xgx_03.jpg",
//   "goods_video_url": "http://ou5flefix.bkt.clouddn.com/xgx_b791cf6faf3d2802674e2c15b30d250e.mp4",
//   "goods_page_url": "http://html.adinnet.cn/zanzhushang.html",
//   "goods_ico": "-1",
//   "goods_count": 1,
//   "goods_price": "-10.00",
//   "is_ship": 0,
//   "ship_time": 0,
//   "ship_completed_time": 0,
//   "ship_best_time": "",
//   "is_receipt": 0,
//   "confirm_receipt_time": 0,
//   "order_status": 2,
//   "refund_status": -1,
//   "status": 0,
//   "account": "-1",
//   "is_pay": 1,
//   "pay_time": 1511327683,
//   "payment_type": 4,
//   "insure_price": 0,
//   "pack_fee": 0,
//   "amount": 1,
//   "address": "是就多久多久,15821267862,北京市 | 北京市 | 东城区,嘟嘟嘟",
//   "addressid": -1,
//   "addressee": "是就多久多久",
//   "express_company": "-1",
//   "express_no": "-1",
//   "logistics": "-1",
//   "country": "",
//   "province": "北京市",
//   "city": "北京市",
//   "district": "东城区,嘟嘟嘟",
//   "zipcode": "",
//   "itucode": "-1",
//   "phone": "15821267862",
//   "email": "-1",
//   "inv_type": "",
//   "inv_payee": "",
//   "inv_content": "",
//   "inv_tax_price": 0,
//   "coupon_no": "",
//   "discount_price": 0,
//   "discount_other_price": 0,
//   "user_note": "",
//   "order_note": "",
//   "note": "",
//   "user_behavior": "商城购买: 【雪糕熊公仔30cm】官方正版限时预售 预计11/30发货 可爱吊牌+暖心随机标语",
//   "sid": 1,
//   "manufacture_time": 0,
//   "is_synced": 0,
//   "synced_time": 0,
//   "promotion_price": 0,
//   "gainsharing_price": 0,
//   "is_mass": 0,
//   "cd_key": "",
//   "cd_sn": "",
//   "change_price": "-10.00",
//   "change_type": 4,
//   "pay_price": "-10.00",
//   "change_time": 1511327683,
//   "ctime": 1511327683,
//   "mtime": 1511327683
// };
//
// let newO = _.assign(order, update);
// console.log(newO);
// console.log(newO.pay_price);
//
// var mydata=
// {
//   "channelId": 1,
//   "headlineId": 10447,
//   "mtime": 1511432519238,
//   "ctime": 1511431064419,
//   "like_count": 0,
//   "reply_count": 3,
//   "likelist": [],
//   "driver": 1,
//   "datatype": 1,
//   "text": "cmV3dHJld3Q=",
//   "link": [
//   {
//     "dtype": 1,
//     "url": "-1",
//     "thumbnail": "-1",
//     "musiclength": "00:00"
//   }
// ],
//   "ataillist": [
//   0
// ],
//   "creater": -4,
//   "isdel": 0,
//   "createrInfo": {
//   "id": -4,
//     "nickname": "周星驰",
//     "avatar": "3f76e4876693b8d88b29ac2fca9d7e24ce977e2de39191f7e446fe53b3bd078a",
//     "smallavatar": "3f76e4876693b8d88b29ac2fca9d7e24ce977e2de39191f7e446fe53b3bd078a",
//     "driver": 1,
//     "role": -1,
//     "status": 1,
//     "sex": -1,
//     "birthday": 682790400,
//     "exp": 0
// },
//   "hasUpvoted": false,
//   "hasLive": 1
// }
//
// console.log(JSON.stringify(mydata))
