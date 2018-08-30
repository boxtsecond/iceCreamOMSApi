/**
 * Created by osmeteor on 11/15/17.
 */
"use strict";
var Promise = require('bluebird');
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '10.40.253.187',
    port:9696,
    user : 'root',
    password : '123456',
    database : 'xgqoms'
  }
});


let arr = [];
knex.select('goods_sn').table('goods').then(goodsArr => {
  return Promise.map(goodsArr, g => {
    arr.push(new Buffer(g.goods_sn).toString('base64'));
    // console.log(new Buffer(g.goods_sn).toString('base64')+',');
  })
    .then(() => {console.log(JSON.stringify(arr));})
})

// var Promise = require('bluebird');
// knex.transaction(function(trx) {
//   knex('books').transacting(trx).insert({name: 'Old Books'})
//     .then(function(resp) {
//       var id = resp[0];
//       return someExternalMethod(id, trx);
//     })
//     .then(trx.commit)
//     .catch(trx.rollback);
// })
//   .then(function(resp) {
//     console.log('Transaction complete.');
//   })
//   .catch(function(err) {
//     console.error(err);
//   });



// knex.select().table('wallet').then(err=>{
//      console.log(err)
//     Object.keys(err[0])
//     .map(function (item) { 
// console.log("this."+item+"=obj."+item+";") 
//     })
// })


function new_wallet(uid,type,balance,amount,note,bankcard_id,sign,credential,status,ctime,mtime) {
  this.uid=uid;
  this.type=type;
  this.balance=balance;
  this.amount=amount;
  this.note=note;
  this.bankcard_id=bankcard_id;
  this.sign=sign;
  this.credential=credential;
  this.status=status;
  this.ctime=ctime;
  this.mtime=mtime;
}



// select * from wallet
knex.transaction(trx => {
  trx.raw('update ?? set `balance` = `balance` + ? where `uid` = ? and `type` = ?',["wallet", 0.5, 998, 1])
    .then(err=>{
      trx.commit();
    console.log(err)
  })
    .catch(err => {
    console.log(err);

  });

}).catch(err => {
  // 此事务已回滚
});

/*

// Using trx as a query builder:
knex.transaction(function(trx) {

  var wallets = [
   new new_wallet(999,1,15.5,0,"note",-1,"sign","credential",1,new Date().getTime()/1000,new Date().getTime()/1000),
    new new_wallet(998,1,15.5,0,"note",-1,"sign","credential",1,new Date().getTime()/1000,new Date().getTime()/1000),
    new new_wallet(997,1,15.5,0,"note",-1,"sign","credential",1,new Date().getTime()/1000,new Date().getTime()/1000),
  ];



  return trx("wallet").returning('uid').where({uid: 998})
    .update("balance = balance+1")
  //
  // return trx
  //   .insert(wallets)
  //   .into('wallet')
  //   .then(function(ids) {
  //     console.log(ids);
  //
  //     // return Promise.map(books, function(book) {
  //     //   book.catalogue_id = ids[0];
  //     //
  //     //   // Some validation could take place here.
  //     //
  //     //   return trx.insert(info).into('books');
  //     // });
  //   })
    .then(trx.commit)
    .catch(trx.rollback);
})
  .then(function(inserts) {
    console.log(inserts + ' new books saved.');
  })
  .catch(function(error) {
    // If we get here, that means that neither the 'Old Books' catalogues insert,
    // nor any of the books inserts will have taken place.
    console.error(error);
  });
*/
