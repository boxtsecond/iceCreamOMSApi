var kue = require('kue');

var Redis = require('ioredis');
// var q = kue.createQueue({
//   prefix: 'q',
//   redis: {
//     createClientFactory: function () {
//       return new Redis({ port: 7379,          // Redis port
//         host: "10.40.253.187",   // Redis host
//         family: 4,           // 4 (IPv4) or 6 (IPv6)
//         password: "12345678",
//         db: 14
//       });
//     }
//   }
// });


// create our job queue
// var jobs = kue.createQueue();

var jobs = kue.createQueue({
  prefix: 'q',
   jobEvents: false,
  // disableSearch: false,

  redis:{
    port: 7379,
    host: '10.40.253.187',
    auth: '12345678',
    db: 13
  }
  // redis: {
  //   createClientFactory: function () {
  //     return new Redis({ port: 7379,          // Redis port
  //       host: "10.40.253.187",   // Redis host
  //       family: 4,           // 4 (IPv4) or 6 (IPv6)
  //       password: "12345678",
  //       db: 13
  //     });
  //   }
  // }
});


// jobs.shutdown( 5000, function(err) {
//   console.log( 'Kue shutdown: ', err||'' );
//   process.exit( 0 );
// });

// jobs.on('job enqueue', function(id, type){
//   console.log( 'Job %s got queued of type %s', id, type );
//
// }).on('job complete', function(id, result){
//   kue.Job.get(id, function(err, job){
//     if (err) return;
//     job.remove(function(err){
//       if (err) throw err;
//       console.log('removed completed job #%d', job.id);
//     });
//   });
// });

jobs.on( 'error', function( err ) {
  console.log( 'Oops... ', err );
});

process.once( 'SIGTERM', function ( sig ) {
  jobs.shutdown( 5000, function(err) {
    console.log( 'Kue shutdown: ', err||'' );
    process.exit( 0 );
  });
});

// jobs.rangeByState( 'complete', 0, n, 'asc', function( err, jobs ) {
//   jobs.forEach( function( job ) {
//     job.remove( function(){
//       console.log( 'removed ', job.id );
//     });
//   });
// });

//
// var minute = 60000;
//
// var email = jobs.create( 'email', {
//   title: 'Account renewal required', to: 'tj@learnboost.com', template: 'renewal-email'
// } ).delay( minute )
//   .priority( 'high' )
//   .save();
//
//
// email.on( 'promotion', function () {
//   console.log( 'renewal job promoted' );
// } );
//
// email.on( 'complete', function () {
//   console.log( 'renewal job completed' );
// } );
//
// jobs.create( 'email', {
//   title: 'Account expired', to: 'tj@learnboost.com', template: 'expired-email'
// } ).delay( minute * 10 )
//   .priority( 'high' )
//   .save();
//
//
// jobs.process( 'email', 10, function ( job, done ) {
//   setTimeout( function () {
//     done();
//   }, Math.random() * 5000 );
// } );
//
//


// 重新启动暂停任务
jobs.active( function( err, ids ) {
  ids.forEach( function( id ) {
    kue.Job.get( id, function( err, job ) {
      // Your application should check if job is a stuck one
      job.inactive();
    });
  });
});

function create() {
  var name = [ 'tobi', 'loki', 'jane', 'manny' ][ Math.random() * 4 | 0 ];
  var job  = jobs.create( 'video conversion', {
    title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
  })

    .removeOnComplete(true).attempts(3).ttl(100);
  // .removeOnComplete(!jm.debug)
  //     .attempts(task.retry)
   //     .ttl(task.ttl);


  job.on( 'complete', function () {
    console.log( " Job complete" );
  } ).on( 'failed', function () {
    console.log( " Job failed" );
  } ).on( 'progress', function ( progress ) {
     // console.log( '\r  job #' + job.id + ' ' + progress + '% complete' );
    process.stdout.write( '\r  job #' + job.id + ' ' + progress + '% complete' );
  } );

  job.save();
  //
  //  setTimeout( create, Math.random() * 2000 | 0 );
}

create();

// process video conversion jobs, 1 at a time.

jobs.process( 'video conversion', 1, function ( job, done ) {
  var frames = job.data.frames;

  function next( i ) {
    // pretend we are doing some work
    convertFrame( i, function ( err ) {
      if ( err ) return done( err );
      // report progress, i/frames complete
      // console.log( i, frames );
        job.progress( i, frames );
      if ( i >= frames ) done();
      else next( i + Math.random() * 10 );
    } );
  }

  next( 0 );
} );

function convertFrame( i, fn ) {
    setTimeout( fn, Math.random() * 50 );
}


kue.app.set('title', 'osmeteor');
console.log( 'UI started on port 3000' );
