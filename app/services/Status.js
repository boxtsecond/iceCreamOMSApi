'use strict';
const os = require('os');
class Status {
  constructor(util) {
    this.startedDate=new Date();
    this.appName=util.appName;
    this.hostname=os.hostname();
  }
  healthcheck(){
     return {appName:this.appName,hostname:this.hostname,started:this.startedDate,uptime:new Date()-this.startedDate};
  }
}
module.exports = Status;
