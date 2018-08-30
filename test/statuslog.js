'use strict';
var fs = require('fs'),path=require('path');
var bunyan = require('bunyan');
module.exports=bunyan.createLogger({
  name: 'myapp',
  streams: [
    {
      level: 'fatal',
      path: path.join(__dirname,"status.log")  // log ERROR and above to a file
    }
  ]
});

