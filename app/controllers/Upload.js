/**
 * Created by Bo on 2018/1/9.
 */
'use strict';

var botservices=require('../services');
const util=botservices.get("util");
const upload=botservices.get("upload");
const Joi=util.Joi;

class Upload {
  
  checkFileChunk (fileName, chunkIndex) {
    return Promise.resolve()
      .then(() => {
        return upload.checkFileChunk(fileName, chunkIndex);
      })
      .then(file => {
        return Promise.resolve([2000, 'success', {chunkList: file}]);
      })
      .catch(err => {
        if(err.check) {
          if(err.chunkExist) return Promise.resolve([5002, 'Chunk File Exists', {chunkIndex}]);
          else return Promise.resolve([5003, 'File Exists', {fileName}]);
        }else {
          util.log.error(err);
          return Promise.reject(err);
        }
      });
  }
  
  uploadFileChunk (data) {
    return Promise.resolve()
      .then(() => {
        return upload.uploadFileChunk(data.req);
      })
      .then(index => {
        return Promise.resolve([2000, 'success', {index}]);
      })
      .catch(err => {
        console.error(err);
        return Promise.reject(err);
      });
  }
  
  mergeFile (filename, size) {
    return Promise.resolve()
      .then(() => {
        let dirName = upload.getFileDir(filename);
        return upload.getDirFile(dirName);
      })
      .then(chunkList => {
        if(chunkList.length !== size) return Promise.reject([5004, 'upload File is not completed', {chunkList}]);
        else return upload.mergeFile(chunkList, filename);
      })
      .then(() => {
        return Promise.resolve([2000, 'success', {}]);
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }
  
}

module.exports = new Upload();
