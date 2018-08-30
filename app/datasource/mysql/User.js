'use strict';
// var mysql = require('knex');
//const sendmsgcontrol = require('./control/sendmsgcontrol');
//const fanscontrol = require('./control/fanscontrol');

class masterModel {
  constructor(wclient, rclient) {
    this.wclient = wclient;
    this.rclient = rclient;
  }
  getUserById(id) {
    return new Promise((resolve, reject) => {
      this.rclient('user').where({ id: id }).select('*').limit(1)
        .then((res) => {
          if (res && res.length > 0) resolve(res[0]);
          else resolve(null);
        })
        .catch(err => reject(err));
    });
  }
  addUser(user) {
    let _self = this;
    return new Promise((resolve, reject) => {
      _self.wclient('user').insert(user).then(result => {
        user.id = result[0];
        user.nickname = result[0];
        return resolve(user);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  existPhone(itucode, phone) {
    let _self = this;
    return new Promise((resolve, reject) => {
      this.rclient('user').where({ itucode: itucode, phone: phone }).select('id').limit(1)
        .then((res) => {
          if (res && res.length > 0) resolve(true);
          else resolve(false);
        });
    });
  }

  /**
   * add user auth register
   * @param {*} user
   * @param {*} userAuth
   * @param {*} userRegister
   */
  addUserInfo(user, userAuth, userRegister) {
    return new Promise((resolve, reject) => {
      this.wclient.transaction(trx => {
        trx.insert(user, 'id').into('user')
          .then(ids => {
            user.id = ids[0];
            userAuth.uid = ids[0];
            userRegister.uid = ids[0];
            return Promise.all([
              trx.insert(userAuth).into('user_auth'),
              trx.insert(userRegister).into('user_register')
            ]);
          }).then(ids => {
            userRegister.id = ids[1][0];
          })
          .then(trx.commit)
          .catch(err => {
            trx.rollback();
            return reject(err);
          })
          .then(() => resolve({ user, userAuth, userRegister }));
      }).catch(err => {
        return null;
      });
    });
  }

  addUserAuthRegister(user, userAuth, userRegister) {
    let _self = this;
    return _self.addUser(user)
      .then(user => _self.addUserAuth(Object.assign(userAuth, { uid: user.id }))
        .then(userAuth => Promise.resolve({ user, userAuth })))
      .then(({ user, userAuth }) => _self.addUserRegister(Object.assign(userRegister, { uid: user.id }))
        .then(userRegister => Promise.resolve({ user, userAuth, userRegister })));

  }
  resetpwd(uid, newpwd) {
    let _self = this;
    return _self.updateUserAuth({ credential: newpwd }, uid)
      .then(() => _self.getUser(uid));
  }
  updateUser(updateUser, uid) {
    return this.wclient('user').where({ id: uid }).update(updateUser);
  }
  updateUserAuth(updateUserAuth, uid) {
    return this.wclient('user_auth').where({ uid: uid, identity_type: 1 }).update(updateUserAuth);
  }

  addUserAuth(userAuth) {
    let _self = this;
    return new Promise((resolve, reject) => {
      _self.wclient('user_auth').insert(userAuth).then(result => {
        userAuth.id = result[0];
        return resolve(userAuth);
      }).catch((err) => {
        console.log(err);
        return reject('server err');
      });
    });
  }
}

module.exports = masterModel;
