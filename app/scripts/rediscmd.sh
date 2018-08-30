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
