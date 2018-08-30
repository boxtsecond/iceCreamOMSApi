/**
 * Created by Bo on 2017/10/30.
 */

/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

const fs = require('fs');
const md5 = require('md5');
const sha1 = require('sha1');
const xml2js = require('xml2js');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));

class WechatPay {
  constructor(config) {
    this.privateKey = config.privateKey; //签名时使用的key值
    this.secretKey = config.secretKey;
    this.pfx = config.pfx; //退款时使用的证书 //微信商户平台证书
    this.passphrase = config.passphrase || config.mch_id; //证书密码
    this.URL = config.URL;
    this.wechatPaySignObj = {
      appid: config.appid,
      mch_id: config.mch_id,
      sign_type: config.sign_type || 'MD5',
      notify_url: config.notify_url
    };
  }
  
  getNoceStr(length) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var maxPos = chars.length;
    var noceStr = '';
    var i;
    for (i = 0; i < (length || 32); i++) {
      noceStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return noceStr;
  }
  
  getSign(wechatPaySignObj) {
    return Promise.resolve()
      .then(() => {
        if(wechatPaySignObj.toString() == '{}'){
          return Promise.reject(new Error("WechatPay Object is not correct!"));
        }
        if(!this.privateKey.toString()){
          return Promise.reject(new Error("WechatPay's private key is not correct!"));
        }
        let signStr = Object.keys(wechatPaySignObj).filter(function(key) {
          return key !== 'sign' && wechatPaySignObj[key] !== undefined && wechatPaySignObj[key] !== '';
        }).sort().map(function(key) {
          return key + '=' + wechatPaySignObj[key];
        }).join('&');
        let sign = this.createSign(signStr, this.privateKey, this.wechatPaySignObj.sign_type);
        return encodeURIComponent(sign);
      });
  }
  
  bulidXml(obj) {
    var builder = new xml2js.Builder({
      allowSurrogateChars: true
    });
    var xml = builder.buildObject({
      xml: obj
    });
    return xml;
  }
  
  parseXml(xml) {
    return new Promise((resolve, reject) => {
      return xml2js.parseString(xml, {
        trim: true,
        explicitArray: false
      }, function (err, json) {
        if(err) return reject(err);
        return resolve(json ? json.xml : {});
      });
    });
  }
  
  getPrePayId(obj, len) {
    let xml = this.bulidXml(obj);
    return request.postAsync({
      url: this.URL.UNIFIED_ORDER,
      body: xml
    }).then(res => {
        return this.parseXml(res.body);
      })
      .then(data => {
        if (data.return_code == 'FAIL') {
          return {err: true, errMsg: data.return_msg};
        } else if (data.result_code == 'FAIL') {
          return {err: true, errMsg: data.err_code};
        } else if (this.wechatPaySignObj.appid !== data.appid) {
          return {err: true, errMsg: 'Invalid AppId'};
        } else if (this.wechatPaySignObj.mch_id !== data.mch_id) {
          return {err: true, errMsg: 'Invalid MchId'};
        }
        // data.return_code = '';
        // data.return_msg = '';
        // data.result_code = '';
        return this.getSign(data)
          .then(validSign => {
            if(validSign != data.sign) return {err: true, errMsg: 'Invalid Signature'};
            else return {err: false, data: data};
          });
      });
  }
  
  validSign(wechatPayObj) {
    let sign = wechatPayObj.sign;
    //delete wechatPayObj.sign;
    return this.getSign(wechatPayObj)
      .then(si => {
        if(si === sign){
          return true;
        }else return false;
      });
  }
  
  createSign(strParam, privateKey, signType) {
    strParam += ('&key=' + privateKey);
    switch (signType.toString().toUpperCase()) {
      case 'MD5' :
        return md5(strParam).toUpperCase();
      case 'SHA1':
        return sha1(strParam).toUpperCase();
      default:
        return md5(strParam).toUpperCase();
    }
  }
  
  refund(obj) {
    let xml = this.bulidXml(obj);
    return request.postAsync({
      url: this.URL.REFUND,
      body: xml,
      agentOptions: {
        pfx: this.pfx,
        passphrase: this.passphrase,
      }
    })
      .then(res => {
        return this.parseXml(res.body);
      })
      .then(resData => {
        if(resData.return_code == 'SUCCESS' && resData.return_msg){
          return this.validSign(resData).then(sign => {return {sign, resData};});
        }else return {sign: false, resData: resData};
      });
  }
  
  query(obj) {
    let xml = this.bulidXml(obj);
    return request.postAsync({
      url: this.URL.ORDER_QUERY,
      body: xml
    }).then(res => {return this.parseXml(res.body);})
      .then(resData => {
      if(resData.return_code == 'SUCCESS' && resData.return_msg && resData.appid == this.wechatPaySignObj.appid && resData.mch_id == this.wechatPaySignObj.mch_id){
        return {query: true, resData: resData};
      }else return {query: false, resData: resData};
    });
  }
}

module.exports = WechatPay;
