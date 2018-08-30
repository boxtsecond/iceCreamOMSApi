/*
 * @Author: dongyuxuan
 * @Date: 2017-10-25 14:33:57
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-11-22 18:33:59
 */
const grpc = require('grpc');
var path = require('path');
const PROTO_PATH = path.join(__dirname, './common.proto');
const commonProto = grpc.load(PROTO_PATH).commonPackage;
const util = require("../../util");

const client = new commonProto.commonService(util.config.grpc.url + ':' + util.config.grpc.CRMport, grpc.credentials.createInsecure());

function grpcCRM(params, funcName) {
  return new Promise((resolve, reject) => {
    var timeout_in_seconds = 10;
    var timeout = new Date().setSeconds(new Date().getSeconds() + timeout_in_seconds);
    client.invoke({
      jsonArgs: JSON.stringify(params),
      invokeFunc: funcName,
      access_token: util.config.grpc.token
    }, {deadline: timeout}, function (err, response) {
      if (err) {
        util.log.error(err);
        reject(err);
      }
      else {
        let result = JSON.parse(response.json);
        resolve(result);
      }
    });
  });
}

module.exports = {
  grpcCRM
};
