/**
 * Created by osmeteor on 11/30/17.
 */
var schedule = require('node-schedule');

var j = schedule.scheduleJob('27 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

class  scheduleJob{
  constructor(){

  }
}

module.exports=scheduleJob;
