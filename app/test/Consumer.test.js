'use strict';
var app = require('../../server/server');

const request = require('supertest')(app);
describe('PATCH /Consumers', function() {
  it('updateUserInfo is required', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({uid: 88})
      .expect(200, {
        "code": 4000,
        "msg": "\"updateUserInfo\" is required",
        "result": {}
      });
  });
  it('uid is required', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({updateUserInfo: {
        nickname: "1"
      }})
      .expect(200, {
        "code": 4000,
        "msg": "\"uid\" is required",
        "result": {}
      });
  });
  it('uid:91, updateUserInfo:{nickname: supertest_123456}', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({
        "uid": 91,
        "updateUserInfo": {
          "nickname": "supertest_123456"
        }
      })
      .expect(200, {
        "code": 2000,
        "msg": "success",
        "result": {}
      });
  });
  it('uid:91, updateUserInfo:{nickname: supertest_123456}', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({
        "uid": 91,
        "updateUserInfo": {
          "nickname": "supertest_123456"
        }
      })
      .expect(200, {
        "code": 2001,
        "msg": "昵称重复",
        "result": {}
      });
  });
  it('uid:34, updateUserInfo:{nickname: super_test}', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({
        "uid": 34,
        "updateUserInfo": {
          "nickname": "super_test"
        }
      })
      .expect(200, {
        "code": 3002,
        "msg": "修改失败,该用户id不存在",
        "result": {}
      });
  });
  it('uid:34, updateUserInfo:{nickname: super_test,XXXXX:4}', function() {
    return request
      .patch('/api/Consumers')
      .set('Accept', 'application/json')
      .send({
        "uid": 34,
        "updateUserInfo": {
          "nickname": "super_test",
          XXXXX:4
        }
      })
      .expect(200, {
        "code": 4000,
        "msg": "\"XXXXX\" is not allowed",
        "result": {}
      });
  });
});

describe('POST /Consumers/fastlogin', function() {
  it('验证码授权失败phone:123143532,code:0000', function() {
    return request
      .post('/api/Consumers/fastlogin')
      .set('Accept', 'application/json')
      .send({
        "phonetype": "xiaomi6",
        "phonemodel": 2,
        "itucode": "86",
        "phone": "123143532",
        "register": "1a0018970a9270acf76",
        "registertype": 1,
        "code": "0000"
      })
      .expect(200, {
        "code": 4003,
        "msg": "验证码授权失败",
        "result": {}
      });
  });
  it('itucode is required', function() {
    return request
      .post('/api/Consumers/fastlogin')
      .set('Accept', 'application/json')
      .send({
        "phonetype": "xiaomi6",
        "phonemodel": 2,
        "phone": "123143532",
        "register": "1a0018970a9270acf76",
        "registertype": 1,
        "code": "0000"
      })
      .expect(200, {
        "code": 4000,
        "msg": "\"itucode\" is required",
        "result": {}
      });
  });
  it('2000 success', function() {
    return request
      .post('/api/Consumers/fastlogin')
      .set('Accept', 'application/json')
      .send({
        "phonetype": "xiaomi6",
        "phonemodel": 2,
        "itucode": "86",
        "phone": "12345678901",
        "register": "1a0018970a9270acf76",
        "registertype": 1,
        "code": "0000"
      })
      .expect(res => {
        res.body.result = res.body.result.hasOwnProperty('id');
      })
      .expect(200, {
        "code": 2000,
        "msg": "success",
        "result": true
      });
  });
});
