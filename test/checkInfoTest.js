/*
 * @Author: dongyuxuan 
 * @Date: 2017-12-13 14:03:12 
 * @Last Modified by: dongyuxuan
 * @Last Modified time: 2017-12-15 20:41:42
 */
'use strict'
var fanTokenArr = require('./fanToken_staging.json');

var counts = {
  request: 0,
  success: 0,
  failed: 0
}
function addQuery (requestParams, query) {
	let queryStr = ''
	Object.keys(query).forEach(key => {
		queryStr += `&${key}=${query[key]}`
	})
	requestParams.url = requestParams.url + '?' + queryStr.slice(1)
}
function getFanToken (item) {
  // console.log('item:', item)
  let length = fanTokenArr.length
  if (item > length - 1) item = item % length
  return fanTokenArr[item]
}
function beforePostCheckInfos (requestParams, context, ee, next) {
  requestParams.url = requestParams.url
    .replace(':sid', 1)
  // console.log('token:', getFanToken[counts.request])
  addQuery(requestParams, {
    access_token: getFanToken(counts.request)
  });
  console.log('start post CheckInfos,request count:', counts.request+1, 'url:', requestParams.url);
  counts.request++;
  requestParams.json = true;
  return next();
}
function afterPostCheckInfos (requestParams, response, context, ee, next) {
  let responseBody = response.body
  if (responseBody.code) console.log({code: responseBody.code, msg: responseBody.msg});
  else console.log(responseBody);
  if(response.body.code == 2000) counts.success++;
  else counts.failed++;
  console.log(`success: ${counts.success}/${counts.request}`)
  return next();
}


module.exports = {
  beforePostCheckInfos,
  afterPostCheckInfos
}