/**
 * Created by Bo on 2018/1/9.
 */
"use strict";

const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const eutil = require('eutil');
const formidable = require('formidable');
const iconv = require('iconv-lite');
const XLSX = require("node-xlsx");

class Upload {
  constructor() {
    this.uploadPath = path.join(process.cwd(), '../', 'OMS_upload');
    this.initUploadPath();
  }

  checkFileExist(filePath, fileName) {
    filePath = filePath || this.uploadPath;
    return fs.existsSync(path.join(filePath, './', fileName.toString()));
  }

  checkFileChunk(fileName, chunkIndex) {
    const chunkDirName = md5(eutil.dateGetDataStringNUmber() + '_' + fileName);
    return Promise.resolve()
      .then(() => {
        let existPath = this.getFileDir(fileName);
        return this.checkFileExist(path.join(this.uploadPath, existPath), fileName);
      })
      .then(file => {
        if (file) return Promise.reject({check: true});
        else return this.checkFileExist(path.join(this.uploadPath, chunkDirName), chunkIndex);
      })
      .then(exists => {
        if (!exists) {
          let chunkDirPath = path.join(this.uploadPath, chunkDirName);
          return this.checkAndMakeDir(chunkDirPath).then(pathExists => {
            if (pathExists) return this.getDirFile(chunkDirPath);
            else return [];
          });
        } else return Promise.reject({check: true, chunkExist: true});
      });
  }

  getDirFile(dirName) {
    return Promise.filter(fs.readdirSync(dirName).sort(), f => {
      return f[0] !== '.';
    });
  }

  uploadFileChunk(req) {
    let _self = this;
    var form = new formidable.IncomingForm({
      uploadDir: _self.uploadPath
    });
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        let chunkIndex = fields.index;
        let fileName = fields.fileName;
        return _self.renameFile(files.data.path, path.join(_self.uploadPath, md5(eutil.dateGetDataStringNUmber() + '_' + fileName), chunkIndex)).then(() => {
          resolve(chunkIndex);
        }).catch(err => {
          console.error(err);
          reject(chunkIndex);
        });
      });
    });
  }

  renameFile(src, dest) {
    return new Promise((resolve, reject) => {
      fs.rename(src, dest, err => {
        if (err) reject(err);
        else resolve('copy file:' + dest + ' success!');
      });
    });
  }

  checkAndMakeDir(dirPath) {
    return new Promise((resolve, reject) => {
      fs.access(dirPath, error => {
        if (error && error.code === 'ENOENT') {
          fs.mkdirSync(dirPath);
          resolve(false);
        } else resolve(true);
      });
    });
  }

  mergeFile(fileArr, fileName) {
    return Promise.resolve()
      .then(() => {
        let filePath = this.getFileDir(fileName);
        return Promise.map(fileArr, f => {
          let r = fs.readFileSync(path.join(filePath, f));
          return fs.writeFileSync(path.join(this.uploadPath, fileName), r, {flag: 'a'});
        }).then(() => {
          return filePath;
        });
      })
      .then((filePath) => {
        const exec = require('child_process').exec;
        return exec(`rm -rf ${filePath}`, (error) => {
            if(error) console.error(error);
          });
      });
  }

  getFileDir(fileName) {
    return path.join(this.uploadPath, md5(eutil.dateGetDataStringNUmber() + '_' + fileName));
  }

  initUploadPath() {
    let dirPath = this.uploadPath;
    return this.checkAndMakeDir(dirPath);
  }

  // multi ---> 单次(false)/多次(true)执行doFunc
  readFileByLine(fileName, lineNum, doFunc, model, field, skipFirstLine, lineFieldNum, multi) {
    return new Promise((resolve, reject) => {
      if (!eutil.isFunction(doFunc) || !eutil.isFunction(model)) reject({func: true, msg: 'To do is not a function'});
      if (!this.checkFileExist(this.uploadPath, fileName)) reject({notExists: true, msg: 'File is not exists'});
      let r = fs.createReadStream(path.join(this.uploadPath, fileName));
      // let r = fs.createReadStream(path.join(this.uploadPath, fileName), {autoClose: false}, {highWaterMark: 16});
      let line = 0;
      r.on('data', (data) => {
        let lineArr = [];
        if(path.extname(fileName) === '.csv') data = iconv.decode(data, 'gb2312'), lineArr = data.toString().split('\r\n');
        else if(path.extname(fileName) === '.xlsx') lineArr = XLSX.parse(data)[0].data;
        else lineArr = data.toString().split('\r\n');
        line += lineArr.length;
        if((lineArr[0] && lineArr[0].toString().replace(/\s+/g, '').split(',').splice(lineFieldNum).length) !== field.length) reject({field: true, msg: 'Line context length is not equal the field'});
        this.readStreamFileData(lineArr, lineNum || 100, field, skipFirstLine, doFunc, model, lineFieldNum, multi);
      });
      r.on('end', () => {
        resolve(line);
      });
    });
  }
  
  convertFieldToObj(fieldArr, dataArr) {
    return Promise.reduce(fieldArr, (result, f, index) => {
      result[f] = dataArr[index];
      return result;
    }, {});
  }
  
  //lineFieldNum ---> 实际需要的字段的开始下标, 若全需要，则为0
  // 例： ['id', 'goods_name', 'goods_count', 'goods_price', 'addressee', 'address','phone','pay_time','order_no','express_company','express_no'] -----> 只需要后三个字段，则 lineFieldNum == -3 或 8
  // multi ---> 单次(false)/多次(true)执行doFunc
  readStreamFileData(lineArr, num, field, skipFirstLine, doFunc, model, lineFieldNum, multi) {
    return Promise.resolve()
      .then(() => {
        let dataArr = [], pause = false;
        if (skipFirstLine) lineArr.shift(), skipFirstLine = false;
        if(lineArr.length <= num) dataArr = dataArr.concat(lineArr), lineArr = [];
        else {
          pause = true;
          dataArr = dataArr.concat(lineArr.splice(0, num));
        }
        return {dataArr, pause};
      })
      .then(({dataArr, pause}) => {
        return Promise.map(dataArr, (line) => {
          let fieldArr = line;
          if(eutil.isArray(line)) fieldArr = fieldArr.splice(lineFieldNum);
          else fieldArr = fieldArr && fieldArr.toString().replace(/\s+/g, '').split(',').splice(lineFieldNum);
          if(fieldArr && fieldArr.length) {
            return this.convertFieldToObj(field, fieldArr).then(obj => {
              if(!multi) return doFunc(new model(obj));
              else return new model(obj);
            });
          }
        }).then((models) => {
          if(multi && models && models.length) return doFunc(models).then(() => {return pause && lineArr.length;});
          else return pause && lineArr.length;
        });
      })
      .then(noMore => {
        if(!noMore) return true;
        else return this.readStreamFileData(lineArr, num, field, false, doFunc, model, lineFieldNum, multi);
      });
  }
  
}

module.exports = new Upload();

