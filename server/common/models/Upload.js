'use strict';

var app=require('../app');
var controllers= app.controllers;

module.exports = function(Upload) {
  
  Upload.checkFileChunk = controllers.Upload.checkFileChunk;
  Upload.beforeRemote('checkFileChunk', controllers.Token.verify_userStarToken_skipBlacklist);
  Upload.remoteMethod('checkFileChunk', {
    description: '【需要明星用户token】检查文件是否存在[已完成]',
    http: { path: '/check/:fileName/:index', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'fileName', type: 'string',description:"文件名",default:'0', http: { source: 'path' } },
      { arg: 'index', type: 'number', description: '分片index', default:0, http: { source: 'path' } }
    ]
  });
  
  Upload.uploadFileChunk = controllers.Upload.uploadFileChunk;
  Upload.beforeRemote('uploadFileChunk', controllers.Token.verify_userStarToken_skipBlacklist);
  Upload.remoteMethod('uploadFileChunk', {
    description: '【需要明星用户token】上传分片文件 表单提交[已完成]',
    http: { path: '/upload', verb: 'post' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'data', type: "object", description: 'url ', http: function (ctx) { return { req: ctx.req, res: ctx.res, body: ctx.req.body }; } },
    ]
  });
  
  Upload.mergeFile = controllers.Upload.mergeFile;
  Upload.beforeRemote('mergeFile', controllers.Token.verify_userStarToken_skipBlacklist);
  Upload.remoteMethod('mergeFile', {
    description: '【需要明星用户token】合并分片文件[已完成]',
    http: { path: '/merge/:fileName/:size', verb: 'get' },
    returns:[
      {arg: 'code', type: 'number', required: true ,
        description: '2000 success \n'
      },
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'fileName', type: 'string',description:"文件名",default:'0', http: { source: 'path' } },
      { arg: 'size', type: 'number',description:" 分片文件数量",default:0, http: { source: 'path' } }
    ]
  });
  
};
