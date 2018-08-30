'use strict';
var app = require('../../server/server');

const request = require('supertest')(app);
describe('POST /Tokens/getToken', function() {
  it('should get token', function() {
    return request
      .post('/api/Tokens/getToken')
      .set('Accept', 'application/json')
      .send({
        "appid": "591d94b5-dfa9-4216-a597-c22464bdd309",
        "appsecret": "98fe6629-1e25-408b-9db4-8cca1a8d02d3"
      })
      .expect(res => {
        console.log(res)
      })
      .expect(200);
  });
});
