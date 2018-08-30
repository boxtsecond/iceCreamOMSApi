/**
 * Created by osmeteor on 11/21/17.
 */
var Promise = require('bluebird');


var knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '10.40.253.187',
    user : 'root',
    port:4306,
    password : '123456',
    database : 'test'
  },
  debug:false
});

 // for (var i=0;i<99;i++){
   knex.transaction(function(trx) {
     var books = [
       {title: 'Canterbury Tales'},
       {title: 'Moby Dick'},
       {title: 'Hamlet'}
     ];
     return trx
       .insert({name: 'Old Books'})
       .into('catalogues')
       .then(function(ids) {
         return Promise.map(books, function(book) {
           book.catalogue_id = ids[0];
           // if(book.title=='Hamlet')  book.catalogue_id = "44455vv";
           // Some validation could take place here.
           return trx.table('books').insert(book);
         }, {concurrency: 1});
       }).then(ids=>{
           return ids;
       });
   })
     .then(function(inserts) {
       console.log(inserts.length + ' new books saved.');
     })
     .catch(function(error) {
       // If we get here, that means that neither the 'Old Books' catalogues insert,
       // nor any of the books inserts will have taken place.
       console.log("errr",error);
     });

 // }











//
//
// // Using trx as a transaction object:
//
// knex.transaction(function(trx) {
//
//   var books = [
//     {title: 'Canterbury Tales'},
//     {title: 'Moby Dick'},
//     {title: 'Hamlet'}
//   ];
//
//  return  knex.insert({name: 'Old Books'}, 'id')
//     .into('catalogues')
//     .transacting(trx)
//     .then(function(ids) {
//       return Promise.map(books, function(book) {
//         book.catalogue_id = ids[0];
//         // book.catalogue_id = "44455vv";
//         // Some validation could take place here.
//         return knex.insert(book).into('books').transacting(trx);
//       });
//     })
//     .then(trx.commit)
//     .catch(trx.rollback);
// })
//   .then(function(inserts) {
//     console.log(inserts.length + ' new books saved.');
//   })
//   .catch(function(error) {
//     // If we get here, that means that neither the 'Old Books' catalogues insert,
//     // nor any of the books inserts will have taken place.
//     console.error(error);
//   });
