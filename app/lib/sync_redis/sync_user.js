var mysqlToRedis=require("./mysqlToRedis");
var mysqlSlave = require('./mysql/mysqlSlave');
// mysqlSlave.createClient({
// 					"host":"10.40.200.13",
// 					"user":"root",
// 					"password":"web123",
// 					"database":"icecream"
// 					});
// mysqlSlave.createClient({
//     "host":"139.196.127.94",
//     "user":"root",
//     "password":"!@#AD2006",
//     "database":"icecream"
// });
mysqlSlave.createClient({
    "host":"172.19.247.43",
    "user":"root",
    "password":"!@#AD2006",
    "database":"icecream"
});
var isend=true;
function sync_user_info (argument) {
    isend=false;
	// body...
	// 从队列里面获取数据
	 return new Promise((resolve, reject) => {
        return  mysqlToRedis.users.getUsers_sync_list().then((phonenumber)=>{
		  // console.log(phonenumber);
		  if(phonenumber !==null) {
		  	return mysqlToRedis.users.getUserInfo(phonenumber).then((result)=>{
                reject("skip sync  "+phonenumber);
			}).catch((err)=>{
                return mysqlSlave.getUserInfo(phonenumber).then((result)=>{
                    console.log(result);
                    if(result.length>0){
                        mysqlToRedis.users_update_redis(JSON.stringify(result[0]));
                        reject("sync 成功"+phonenumber);
                    }
                    else {
                        reject("can't find from mysql "+phonenumber);
                    }
                }).catch((err)=>{
                    console.log(err);
                });
	     	 });
		  }else{
		  	 return reject("not find phonenumber");
		  }
		});
	//查看是否已经存在
	//从mysql从库中查询是否存在
	// 同步到redis
    }).catch((err) => {
				console.log(new Date(),err);
         isend=true;
		   // sync_user_info();
	 });


}


setInterval(function(){
     if(isend) sync_user_info();
},1000);

