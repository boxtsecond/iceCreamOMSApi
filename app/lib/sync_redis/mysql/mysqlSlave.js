'use strict';
var mysql = require('knex');
var mysql2 = require('mysql');

class masterModel{
	constructor(){
		// this.host=host;
		// this.port=port;
		// this.masterhost=masterhost;
		// this.masterport=masterport;
		this.client={};
		//this.client2={};
		//this.options={};
	}

	createClient(options){
		this.client=mysql({"client":"mysql","connection":options,pool:{min:10,max:100}});
		//this.options=options
		//this.client2 = mysql2.createConnection(this.options);
		//this.client2.connect();
		//this.client2.end();
	}



	addUser(user){
		let u1 = {
		  id: -1,
		  nickname: '-1',
		  avatar: '-1',
		  birthday: null,
		  sex: 1,
		  professional: '-1',
		  address: '-1',
		  isdel: 1,
		  status: 1,
		  follow:'-1',
		};
		let _that = this;
		return new Promise((resolve, reject)=>{
			this.client.select().from('users').where('phonenumber',user.phonenumber)
			.then((res) => {
				if (res && res.length > 1){
					return reject('Forbidden');
				}
				if(res && res.length == 1){
					if (res[0].status == 3){
						return reject('Forbidden');
					}
					return resolve(res[0]);
				}
				let date = new Date();
				// 修改登陆时间
				let obj = Object.assign(user, {
					createtime: date.getTime(),
					lastlogintime: date.getTime(),
					lastestlogintime:date.getTime()
				});
				_that.client('users').insert(obj)
					.then(function(result){
						user.id = result[0];
						return resolve(Object.assign(u1,user));
					}).catch((err) => {
						return reject('server err');
					});
			})
			.catch(function(err){
				return reject('server err');
			});
		});
	}

  	delUser(useruid){
		let result={};
		return result;
	}

	addComment(obj){
		return new Promise((resolve,reject)=>{
			this.client.insert(obj).into('comments_fan')
				.then(result=>resolve(result))
		        .catch(err=>reject(err));
		});
	}

	// addComment(obj){
	// 	return new Promise((resolve,reject)=>{
	// 		this.client2.query("insert into comments_fan(data,link,likelist,createtime,edittime,datatype,replyid) values ('"+obj.data+"','"+obj.link+"','"+obj.likelist+"','"+obj.createtime+"','"+obj.edittime+"','"+obj.datatype+"','"+obj.replyid+"')",(err,res)=>{
	// 			if(err){
	// 				console.log(err)
	// 				reject(err)}
	// 			resolve(res)
	// 		})
	// 	})
	// }

	addCommentZhen(obj){
		return new Promise((resolve,reject)=>{
			this.client.insert(obj).into('comments_zhen')
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	addReport(obj){
		return new Promise((resolve,reject)=>{
			this.client.insert(obj).into('reports')
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	addStickie(commentid){
		return new Promise((resolve,reject)=>{
			this.client.insert({"commentid":commentid}).into('stickies')
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	delComment(target,commentid){
		return new Promise((resolve,reject)=>{
			this.client(target).update({isdel:2}).where("id",commentid).limit(1)
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	clearStickies(){
		return new Promise((resolve,reject)=>{
			this.client('stickies').delete('*')
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	delStickie(key,value){
		return new Promise((resolve,reject)=>{
			this.client('stickies').delete().where(key,value).limit(1)
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	replyComment(commentid,rid,rlist){
		let newtime = new Date().getTime();
		return new Promise((resolve,reject)=>{
			this.client('comments_fan').update({'zhenreply':rid,'replylist':rlist,'edittime':newtime}).where("id",commentid).limit(1)
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	replyCommentZhen(commentid,rlist){
		return new Promise((resolve,reject)=>{
			this.client('comments_zhen').update({replylist:rlist}).where("id",commentid).limit(1)
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	updateCommentDetail(target,commentid,obj){
		return new Promise((resolve,reject)=>{
			this.client(target).update(obj).where("id",commentid)
				.then(result=>resolve(result))
				.catch(err=>reject(err));
		});
	}

	updateUserinfo(uid,user){
		// console.log(uid, user);
		if (!uid)
			return Promise.resolve('bad request');
		if (!user){
			return Promise.resolve('bad request');
		}
		console.log(typeof(user));
		if (typeof(user) != 'object'){
			return Promise.resolve('bad request');
		}

		return this.client('users').update(user).where("id", uid)
			.then(function(result){
				console.log(result);
				return Promise.resolve(result);
			})
			.catch((err) => {
				console.log(err);
				return Promise.resolve('err');
			});
			// return "done";
	}

	updateAdmininfo(uid,user){
		// console.log(uid, user);
		if (!uid)
			return Promise.resolve('bad request');
		if (!user){
			return Promise.resolve('bad request');
		}
		console.log(typeof(user));
		if (typeof(user) != 'object'){
			return Promise.resolve('bad request');
		}

		return this.client('admins').update(user).where("id", uid)
			.then(function(result){
				console.log(result);
				return Promise.resolve(result);
			})
			.catch((err) => {
				console.log(err);
				return Promise.resolve('err');
			});
			// return "done";
	}

	getUserInfo(phoneNumber){
		return new Promise((resolve, reject)=>{
			this.client('users').select().where('phonenumber',phoneNumber)
			.then(result=>resolve(result))
			.catch(err=>reject(err));
		});
	}

	getUserId(){
		return new Promise((resolve, reject)=>{
			this.client('users').select().max('id')
			.then(result=>resolve(JSON.stringify(result[0])))
			.catch(err=>reject(err));
		});
	}

	addTestUser(user){
		return new Promise((resolve, reject)=>{
				let date = new Date();
				let obj = Object.assign(user, {
					nickname:'-1',
					avatar:-1,
					birthday:null,
					sex:1,
					professional:-1,
					address:-1,
					isdel:1,
					status:1,
					createtime: date.getTime(),
					lastlogintime: date.getTime(),
					lastestlogintime:date.getTime(),
					tag:0
				});
				this.client('users').insert(obj)
					.then(result=>resolve(user))
					.catch(err=>reject(err));
		});
	}
}

module.exports = new masterModel();
