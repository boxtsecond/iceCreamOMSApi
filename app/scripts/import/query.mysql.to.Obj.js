// "use strict";
// const mysqlconnection = require('./config').mysql;
// var knex = require('knex')({
//   "client": "mysql",
//   "connection": {
//     "host":"10.40.253.187",
//     "port":4306,
//     "user":"root",
//     "password":"123456",
//     "database":"icecream"
//   },
//   "pool": {
//     "min": 8,
//     "max": 20
//   }
// });
// knex.select().table('user_star').then(uobj=>{
//   Object.keys(uobj[0]).map(function(item){
//     console.log("this."+item+"=obj."+item+";");
//   });
//     // console.log(uobj)
//
// })
//


const Joi = require('joi');

const schema = Joi.object().keys({
  access_token: Joi.array().items(Joi.object().keys({
    username1: Joi.string().min(3).max(30).required(),
    password2: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
  })),
});
//
// link: Joi.array(),
//
//
//   link: Joi.array().items(Joi.object().keys({
//   dtype: Joi.number().min(1).max(4).required(),
//   url: Joi.string().required(),
//   thumbnail: Joi.string().required(),
//   musiclength: Joi.string().required()
// })).required(),

// Return result.
// result.error === null -> valid

// You can also pass a callback which will be called synchronously with the validation result.
  Joi.validate({access_token:[{ username1: 'abc', password2: "19945555" }]}, schema, function (err, value) {
    console.log(err)

  });  // err === null -> valid
