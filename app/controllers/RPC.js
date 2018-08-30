'use strict';
var jwt = require('jwt-simple');
var base64 = require('base-64');
// 快速登录
const authToken = require("../auth/Token");
var botservices = require('../services');
const util = botservices.get("util");
const models = require('../models');
const Joi = util.Joi;

class RPC {

}

module.exports=new RPC();
