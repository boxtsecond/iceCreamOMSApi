/**
 * Created by osmeteor on 12/15/17.
 */
'use strict';
var Redis = require('ioredis');
function getIPAdress() {
  let res=[],interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      let alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        res.push(alias.address)
      }
    }
  }
  return res;
};

const  Ips=getIPAdress();
var redis = new Redis({
  sentinels: [ {
    host: '172.19.247.82',
    port: '26379'
  }, {
    host: '172.19.247.80',
    port: '26379'
  }, {
    host: '172.19.247.81',
    port: '26379'
  }],
  name: 'mymaster',
  role: 'slave',
  preferredSlaves: function (availableSlaves) {
    for (var i = 0; i < availableSlaves.length; i++) {
      const slave = availableSlaves[i];
      if(Ips.filter(ip=>{
        if(slave.ip === ip) return true;
        else  return false;
      }).length>0)
        return slave;
    }
    // if no preferred slaves are available a random one is used
    return false;
  }
});
