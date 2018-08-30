var kue = require('kue');
var Redis = require('ioredis');

class  omsJob{
  constructor(opt){
    opt=opt || {};
    this.debug=opt.debug || false;
    this.retry=opt.retry || 6;
    this.ttl= opt.ttl || 1000 * 60 * 5;
    this.enableUI=opt.enableUI || false;
    this.UI_port=opt.UI_port || 3000;
    this.jobs=kue.createQueue({
      prefix: opt.prefix ||'omsq',
      jobEvents: opt.jobEvents || false,
      redis: {
        createClientFactory: function () {
          return new Redis({ port: opt.redis_port ||7379,          // Redis port
            host: opt.redis_host || "10.40.253.187",   // Redis host
            family: opt.redis_family || 4,           // 4 (IPv4) or 6 (IPv6)
            password: opt.redis_password || "12345678",
            db: opt.redis_db ||14
          });
        }
      }
    });
    this.jobs.on('job enqueue', function(id, type){
      console.log( 'Job %s got queued of type %s', id, type );

    }).on('job complete', function(id, result){
      kue.Job.get(id, function(err, job){
        if (err) return;
        job.remove(function(err){
          if (err) throw err;
          console.log('removed completed job #%d', job.id);
        });
      });
    }).on( 'error', function( err ) {
      console.error( 'oms job... ', err );
    });

    process.once( 'SIGTERM', function ( sig ) {
      this.jobs.shutdown( 5000, function(err) {
        console.log( 'Kue shutdown: ', err||'' );
        process.exit( 0 );
      });
    });
    this.RebootPauseTask();
    if(this.enableUI &&this.UI_port ){
      kue.app.set('title', 'osmeteor');
      kue.app.listen( this.UI_port );
      console.log( 'UI started on port 3000' );
    }
  }
  create(){
    var name = [ 'tobi', 'loki', 'jane', 'manny' ][ Math.random() * 4 | 0 ];
    var job  = this.jobs.create( 'video conversion', {
      title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
    })
      .removeOnComplete(!this.debug).attempts(this.retry).ttl(this.ttl);
    job.on( 'complete', function () {
      console.log( " Job complete" );
    } ).on( 'failed', function () {
      console.log( " Job failed" );
    } ).on( 'progress', function ( progress ) {
      // console.log( '\r  job #' + job.id + ' ' + progress + '% complete' );
      process.stdout.write( '\r  job #' + job.id + ' ' + progress + '% complete' );
    } );
    job.save();
  }


  RebootPauseTask(){
// 重新启动暂停任务
    this.jobs.active( function( err, ids ) {
      ids.forEach( function( id ) {
        kue.Job.get( id, function( err, job ) {
          // Your application should check if job is a stuck one
          if(job)  job.inactive();
        });
      });
    });
  }
  shutdown(){
    this.jobs.shutdown( 5000, function(err) {
        console.log( 'Kue shutdown: ', err||'' );
        process.exit( 0 );
      });
  }
  process(){
   this.jobs.process( 'video conversion', 1, function ( job, done ) {
     console.log(new Date(),"------->>>>>>");
     var frames = job.data.frames;

     // job.progress( i, frames ); // 进度条
     function next( i ) {
       // pretend we are doing some work
       convertFrame( i, function ( err ) {
         if ( err ) return done( err );
         // report progress, i/frames complete
         // console.log( i, frames );

         if ( i >= frames ) done();
         else next( i + Math.random() * 10 );
       } );
     }

     next( 0 );
   } );
    function convertFrame( i, fn ) {
      setTimeout( fn, Math.random() * 50 );
    }
  }
}

let omsjm=new omsJob();
// console.log(omsjm)

// function my_create() {
//   omsjm.create();
//   setTimeout( my_create, Math.random() * 2000 | 0 );
// }
//
// // my_create();
//
// function  my_process() {
//   omsjm.process();
//   setTimeout( my_process, Math.random() * 2000 | 0 );
// }
// my_process();






// function create() {
//   var name = [ 'tobi', 'loki', 'jane', 'manny' ][ Math.random() * 4 | 0 ];
//   var job  = jobs.create( 'video conversion', {
//     title: 'converting ' + name + '\'s to avi', user: 1, frames: 200
//   })
//
//     .removeOnComplete(true).attempts(3).ttl(-1);
//   // .removeOnComplete(!jm.debug)
//   //     .attempts(task.retry)
//    //     .ttl(task.ttl);
//
//
//   job.on( 'complete', function () {
//     console.log( " Job complete" );
//   } ).on( 'failed', function () {
//     console.log( " Job failed" );
//   } ).on( 'progress', function ( progress ) {
//      // console.log( '\r  job #' + job.id + ' ' + progress + '% complete' );
//     process.stdout.write( '\r  job #' + job.id + ' ' + progress + '% complete' );
//   } );
//
//   job.save();
//    setTimeout( create, Math.random() * 2000 | 0 );
// }
//
// create();

// process video conversion jobs, 1 at a time.
//
// jobs.process( 'video conversion', 1, function ( job, done ) {
//
//   console.log(new Date(),"------->>>>>>");
//
//   var frames = job.data.frames;
//
//   function next( i ) {
//     // pretend we are doing some work
//     convertFrame( i, function ( err ) {
//       if ( err ) return done( err );
//       // report progress, i/frames complete
//       // console.log( i, frames );
//         job.progress( i, frames );
//       if ( i >= frames ) done();
//       else next( i + Math.random() * 10 );
//     } );
//   }
//
//   next( 0 );
// } );
//
// function convertFrame( i, fn ) {
//     setTimeout( fn, Math.random() * 50 );
// }

// start the UI

