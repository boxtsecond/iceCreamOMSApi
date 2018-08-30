'use strict';

class manager{
  constructor(knex,tablename,maxid){
  // .where({ id: uid })
    this.src = knex(tablename).where('id', '>', maxid).stream({objectMode: true});
  //   this.src = knex(tablename).where('itucode', '=', -1).stream({objectMode: true});
    this.data = [];
    this.maxlimit=1000;
    this.minlimit=100;
    this.count=0;
    var _self = this;
    var i = 0;
    this.state = "stop";
    this.is_end = false;
    let Writable = require('stream').Writable;
    this.write = new Writable({
      objectMode: true,
      write: function(chunk, encoding, cb){
        //  console.log(111);
        // console.log(i++, '============', chunk);
        _self.push(chunk);
        _self.count++;
        cb();
      }
    });

    this.write.on('finish',function(){
      _self.is_end=true;
      console.log(tablename + ' finish');
    });
  }
  start(){
    if (this.state != "stop")  return;
    this.src.pipe(this.write);
    this.state ="start";
  }
  len(){
    return this.data.length;
  }

  shift(){
    if (this.len()<this.minlimit){
      this.src.resume();
    }
    return this.data.shift();
  }

  push(obj){
    this.data.push(obj);
    if (this.len()>this.maxlimit){
      this.src.pause();
    }else{
      if (this.state === 'pause')
        this.src.resume();
    }
  }

  stop(){
    this.src.stop();
    this.state = "stop";
  }

  pause(){
    if (this.state != "start")
      return;
    this.src.pause();
    this.state = "pause";
  }

  resume(){
    if (this.state != "pause")
      return;
    this.src.resume();
    this.state = "start";
  }
}
module.exports=manager;
