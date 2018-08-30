'use strict';
// var mysql = require('knex');
//const sendmsgcontrol = require('./control/sendmsgcontrol');
//const fanscontrol = require('./control/fanscontrol');

class masterModel{
	constructor(wclient,rclient){
		this.wclient=wclient;
		this.rclient=rclient;
	}
	getUserAuthsByIdentity (userAuth) {
		return this.rclient('user_auth').select('*').where(userAuth).limit(1)
			.then((res) =>{
				if(res && res.length>0) return res[0];
				else return null;
    });
	}
  getUserAuthsUidByIdentity (userAuth) {
    return this.rclient('user_auth').select('*').where(userAuth).limit(1)
			.then((res) => {
				if(res && res.length > 0) return res[0];
				else  return null;
			});
  }
	/**
	 *
	 * @param {*} updateUserAuth
	 * @param {*} Identity :{identity_type, identifier}
	 */
	updateUserAuthByIdentity (updateUserAuth, Identity) {
		return this.rclient('user_auth').where(Identity).update(updateUserAuth);
	}
	/**
	 * @param {*} conditions
	 * @param {*} query :{identity_type, identifier}
	 */
	updateUserAuth (conditions, query) {
		return this.rclient('user_auth').where(query).update(conditions);
	}
	// 根据identity_Type 和 uid 修改auth
	updateUserAuthByIdentityTypeAndUid (updateUserAuth, identityType, uid) {
		console.log(arguments);
		return this.rclient('user_auth').where({
			identity_type: identityType,
			uid
		}).update(updateUserAuth);
	}
	addUserAuth (userAuth) {
		return new Promise((resolve, reject) => {
        this.wclient('user_auth').insert(userAuth).then(result => {
				userAuth.id = result[0];
				return resolve(userAuth);
			});
		});
	}
}

module.exports = masterModel;
