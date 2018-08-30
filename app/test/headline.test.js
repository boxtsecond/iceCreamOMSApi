'use strict';
const app = require('../../server/server');
const Mock = require('mockjs')
const should = require('should')

var fanTokens = [
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjk5NzEsImV4cCI6MTUwODgzNjAyMn0.4WhDzhRjrtMGDYvFTOZESTIfd8ZthPpRmzwKj6RawH4'
]
var starTokens = [
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOi04LCJleHAiOjE1MDg4MzU5NDB9.OMlwGZTyVr2Gg0STWd5WshRRzmwuOi3mom0YDNGufPI',
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOi00LCJleHAiOjE1MDkyNjY2Mjd9.J6OQXQHrgKKeJqONntS1W6ggtBvlDq6Gg0jkfBb4bFA'
]
var channelId = 1;
var publishHeadlinTPl = {
  channelId: channelId,
  'datatype|1': [1,2,3,4],
  link: function () {
    if (this.datatype === 1) return [];
    else {
      return [{
        dtype: this.datatype,
        url: Mock.Random.url(),
        thumbnail: Mock.Random.url(),
        musiclength: Mock.Random.string('number', 2) + '|' + Mock.Random.string('number', 2)
      }]
    }
  },
  text: function () {
    return (this.datatype === 1) ? Mock.Random.cparagraph(1,2) : '-1'
  },
  'driver|1': [1,2],
  'ataillist|1-3': [Mock.Random.integer()]
}
const request = require('supertest')(app);
var resHeadlineId = [];
describe('test api /Headlines', function() {
  it('post /api/Headlines', function() {
    return request
      .post('/api/Headlines')
      .query({access_token: starTokens[0]})
      .set('Accept', 'application/json')
      .send(Mock.mock(publishHeadlinTPl))
      .expect(200)
      .then(res => {
        should.exist(res);
        res.body.result.should.have.property('headlineId')
        resHeadlineId.push(res.body.result.headlineId)
      })
  });
  it(`put /api/Headlines/${channelId}/\${headlineId}/upvote true`, function() {
    if (!resHeadlineId || !resHeadlineId.length)  {
      console.log('post failed, get new can not test')
      return;
    }
    return request
      .put(`/api/Headlines/${channelId}/${resHeadlineId[resHeadlineId.length - 1]}/upvote`)
      .query({access_token: fanTokens[0],action: true})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        res.body.code.should.equal(2000)
      })
  });
  it(`put /api/Headlines/${channelId}/\${headlineId}/upvote true`, function() {
    if (!resHeadlineId || !resHeadlineId.length)  {
      console.log('post failed, get new can not test')
      return;
    }
    return request
      .put(`/api/Headlines/${channelId}/${resHeadlineId[resHeadlineId.length - 1]}/upvote`)
      .query({access_token: fanTokens[0],action: true})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        res.body.code.should.equal(2001)
      })
  });
  it(`get /api/Headlines/${channelId}/new`, function() {
    if (!resHeadlineId || !resHeadlineId.length)  {
      console.log('post failed, get new can not test')
      return;
    }
    return request
      .get(`/api/Headlines/${channelId}/new`)
      .query({access_token: fanTokens[0]})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        res.body.result.should.have.property('headlineId')
        res.body.result.headlineId.should.equal(resHeadlineId[resHeadlineId.length - 1])
        res.body.result.like_count.should.equal(1)
      })
  });
  it(`del /api/Headlines/${channelId}/\${headlineId}`, function() {
    if (!resHeadlineId || !resHeadlineId.length)  {
      console.log('post failed, delete can not test')
      return;
    }
    return request
      .del(`/api/Headlines/${channelId}/${resHeadlineId[resHeadlineId.length - 1]}`)
      .query({access_token: starTokens[0]})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        console.log(res.body.code)
        res.body.code.should.equal(2000)
      })
  })
  it(`get /api/Headlines/${channelId}/new`, function() {
    if (!resHeadlineId || !resHeadlineId.length)  {
      console.log('post failed, get new can not test')
      return;
    }
    return request
      .get(`/api/Headlines/${channelId}/new`)
      .query({access_token: fanTokens[0]})
      .set('Accept', 'application/json')
      .expect(200)
      .then(res => {
        res.body.result.should.have.property('headlineId')
        res.body.result.headlineId.should.not.equal(resHeadlineId[resHeadlineId.length - 1])
      })
  });
});
