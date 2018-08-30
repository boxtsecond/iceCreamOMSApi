'use strict';

var app=require('../app');
var controllers= app.controllers;

module.exports = function(Digital) {
  
  Digital.importDigitalByFile = controllers.Digital.importDigitalByFile;
  Digital.beforeRemote('importDigitalByFile', controllers.Token.verify_userStarToken_skipBlacklist);
  Digital.remoteMethod('importDigitalByFile', {
    description: '【需要明星用户token】 导入文件中的 digital_card',
    http: { path: '/file/:fileName', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'fileName', type: 'string',description:"文件名",default:'0', http: { source: 'path' } }
    ]
  });
  
};
