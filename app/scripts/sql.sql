// 删除mysql 中 user user_auth user_register 表全部数据
DELETE from user_auth;
DELETE from user_register;
DELETE FROM user;
DELETE FROM user_star;

// 删除 redis 中 user auth userRegister 哈希表全部数据

// 命令行 批量删除 redis中fancomment数据
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 keys "fancomment*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 keys "fc*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 del
// 命令行 批量删除 redis中headline数据
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 keys "headline*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 del

// 全删

redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 1 keys "starcomment*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 1 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 1 keys "sc*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 1 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 keys "starcomment*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 keys "sc*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 del

redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 keys "fancomment*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 keys "fc*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 2 del
redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 keys "headline*" | xargs redis-cli -h 10.40.253.187 -p 7379 -a 12345678 -n 3 del


// 全删(localhost)

redis-cli -p 7379 -a 12345678 -n 1 keys "starcomment*" | xargs redis-cli -p 7379 -a 12345678 -n 1 del
redis-cli -p 7379 -a 12345678 -n 1 keys "sc*" | xargs redis-cli -p 7379 -a 12345678 -n 1 del
redis-cli -p 7379 -a 12345678 -n 3 keys "starcomment*" | xargs redis-cli -p 7379 -a 12345678 -n 3 del
redis-cli -p 7379 -a 12345678 -n 3 keys "sc*" | xargs redis-cli -p 7379 -a 12345678 -n 3 del

redis-cli -p 7379 -a 12345678 -n 2 keys "fancomment*" | xargs redis-cli -p 7379 -a 12345678 -n 2 del
redis-cli -p 7379 -a 12345678 -n 2 keys "fc*" | xargs redis-cli -p 7379 -a 12345678 -n 2 del
redis-cli -p 7379 -a 12345678 -n 3 keys "headline*" | xargs redis-cli -p 7379 -a 12345678 -n 3 del

// mongodb
db.getCollection('fancomments').drop()
db.getCollection('starcomments').drop()
db.getCollection('headlines').remove({})

// 导数据
node app/scripts/import/comments_fan.js | ./node_modules/.bin/bunyan   -o short

NODE_ENV="development" node app/scripts/import/comments_zhen_headline.js | ./node_modules/.bin/bunyan   -o short


NODE_ENV="development" node app/scripts/import/comments_fan.js | ./node_modules/.bin/bunyan   -o short





NODE_ENV="development" node app/scripts/import/comments_zhen_headline.js | ./node_modules/.bin/bunyan   -o short

NODE_ENV="production" node --max-old-space-size=4069   app/scripts/import/comments_zhen_headline.js | ./node_modules/.bin/bunyan   -o short
NODE_ENV="production" node app/scripts/import/comments_zhen_headline.js | ./node_modules/.bin/bunyan   -o short
NODE_ENV="production" node app/scripts/import/admin.js | ./node_modules/.bin/bunyan   -o short

NODE_ENV="production" node --max-old-space-size=4069  user.js |  bunyan   -o short


sudo NODE_ENV="production" node  --max-old-space-size=4096 comments_fan.js  | bunyan -l warn
