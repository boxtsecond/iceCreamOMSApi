/**
 * Created by osmeteor on 8/12/17.
 */
var redis = require('redis');

// var redisConnection = require('../config/redisconnection');

// var redisConnection={
//     "host": "139.224.233.20",
//     "port": 7379
// }
// var redisConnection={
//     "host": "10.40.200.42",
//     "port": 6379
// }

var redisConnection={
    "host": "127.0.0.1",
    "port": 7379
};

// var protocol = require('gearmanode/lib/gearmanode/protocol');


var encoding = require('encoding');
var commentsFans = require('./commentsFans');
var users = require('./users');
var stickies = require('./stickies');
var commentsZhen = require('./commentsZhen');
var sensitiveWords = require('./sensitiveWords');
var admins = require('./admins');

commentsFans.setup(redisConnection);
users.setup(redisConnection,'users');
stickies.setup(redisConnection,'stickies:cid');
commentsZhen.setup(redisConnection);
sensitiveWords.setup(redisConnection);
admins.setup(redisConnection);

// var commentsFansTest = require('./test/commentsFans');
// var usersTest = require('./test/users');
// var stickiesTest = require('./test/stickies');
// var commentsZhenTest = require('./test/commentszhen');
// var sensitiveWordsTest = require('./test/sensitiveWords');
// var adminsTest = require('./test/admins');
// commentsFansTest.setup(Object.assign(redisConnection,{db:3}));
// usersTest.setup(Object.assign(redisConnection,{db:3}),'users');
// stickiesTest.setup(Object.assign(redisConnection,{db:3}),'stickies:cid')
// commentsZhenTest.setup(Object.assign(redisConnection,{db:3}));
// sensitiveWordsTest.setup(Object.assign(redisConnection,{db:3}));
// adminsTest.setup(Object.assign(redisConnection,{db:3}))


function comments_fans_update_redis(obj) {
    console.log(new Date(),"comments_fans_update_redis");
    commentsFans.update(obj)
        .catch(function(err){
            console.error(err);
        });
}
function sensitive_words_update_redis(obj) {
    console.log(new Date(),"sensitive_words_update_redis");
    sensitiveWords.update(obj)
        .catch(function(err){
            console.error(err);
        });
}
function sensitive_words_delete_redis(obj) {
    console.log(new Date(),"sensitive_words_delete_redis");
    sensitiveWords.delete(obj)
        .catch(function(err){
            console.error(err);
        });
}
function comments_zhen_update_redis(obj) {
    console.log(new Date(),"comments_zhen_update_redis");
    commentsZhen.update(obj)
        .catch(function(err){
            console.error(err);
        });
}
function comments_fans_create_redis(obj) {
    console.log(new Date(),"comments_fans_create_redis");
    commentsFans.update(obj)
        .catch(function(err){
            console.error(err);
        });
}

function comments_fans_delete_redis(obj) {
    console.log(new Date(),"comments_fans_delete_redis");
    commentsFans.delete(obj)
        .catch(function(err){
            console.error(err);
        });
}
function comments_zhen_create_redis(obj) {
    console.log(new Date(),"comments_zhen_create_redis");
    commentsFans.delete(obj)
        .catch(function(err){
            console.error(err);
        });
}
function comments_zhen_delete_redis(obj) {
    console.log(new Date(),"comments_zhen_delete_redis");
    commentsZhen.delete(obj)
        .catch(function(err){
            console.error(err);
        });
}
function stickies_create_redis(obj) {
    console.log(new Date(),"stickies_create_redis");
    stickies.create(obj)
        .catch(function(err){
            console.error(err);
        });
}

function stickies_delete_redis(obj) {
    console.log(new Date(),"stickies_delete_redis");
    stickies.create(obj)
        .catch(function(err){
            console.error(err);
        });
}

function users_insert_redis(obj) {
    console.log(new Date(),"users_insert_redis");
    users.update(obj)
        .catch(function(err){
            console.error(err);
        });
}
function users_update_redis(obj) {
    console.log(new Date(),"users_update_redis");
    users.update(obj)
        .catch(function(err){
            console.error(err);
        });
}
function admin_update_redis(obj) {
    console.log(new Date(),"admin_update_redis");
    admins.update(obj)
        .catch(function(err){
            console.error(err);
        });
}

module.exports={
    commentsFans:commentsFans,
    users:users,
    stickies:stickies,
    commentsZhen:commentsZhen,
    sensitiveWords:sensitiveWords,
    admins:admins,
    comments_fans_create_redis:comments_fans_create_redis,
    comments_fans_update_redis:comments_fans_update_redis,
    comments_fans_delete_redis:comments_fans_delete_redis,
    sensitive_words_update_redis:sensitive_words_update_redis,
    sensitive_words_delete_redis:sensitive_words_delete_redis,

    comments_zhen_create_redis:comments_zhen_create_redis,
    comments_zhen_delete_redis:comments_zhen_delete_redis,

    comments_zhen_update_redis:comments_zhen_update_redis,
    stickies_create_redis:stickies_create_redis,// 点赞
    stickies_delete_redis:stickies_delete_redis,// 点赞
    users_insert_redis:users_insert_redis,
    users_update_redis:users_update_redis
};
