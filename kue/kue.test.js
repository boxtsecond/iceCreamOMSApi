/**
 * Created by osmeteor on 11/24/17.
 */
var kue = require( 'kue' );

// create our job queue

var jobs = kue.createQueue();

// one minute


// start the UI
kue.app.listen( 3000 );
console.log( 'UI started on port 3000' );
