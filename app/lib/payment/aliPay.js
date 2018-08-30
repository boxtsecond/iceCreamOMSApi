/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

const crypto = require('crypto');
const Promise = require('bluebird');
const request = Promise.promisifyAll(require('request'));

class AliPay {
  constructor(config) {
    this.requestUrl = config.requestUrl;
    this.privateKey = config.privateKey; //商户私钥
    this.publicKey = config.publicKey; //支付宝公钥
    this.aliPaySignObj = {
      app_id: config.app_id,
      charset: config.charset || 'utf-8',
      sign_type: config.sign_type || 'RSA2',
      version: config.version || '1.0',
      notify_url: config.notify_url
    };
  }
  
  getEncodeStr(aliPaySignObj) {
    return Promise.resolve()
      .then(() => {
        if(aliPaySignObj.toString() == '{}'){
          return Promise.reject(new Error("AliPay Object is not correct!"));
        }
        if(!this.privateKey.toString()){
          return Promise.reject(new Error("AliPay's private key is not correct!"));
        }
        let signStr = '';
        let encodeStr = '';
        for (let n of Object.keys(aliPaySignObj).sort()) {
          if (aliPaySignObj[n]) {
            signStr += (n + '=' + aliPaySignObj[n] + '&');
            encodeStr += (n + '=' + encodeURIComponent(aliPaySignObj[n]) + '&');
          }
        }
        signStr = signStr.substring(0, signStr.length - 1);
        let sign = this.createSign(signStr, this.aliPaySignObj.sign_type, this.aliPaySignObj.charset);
        return encodeStr + 'sign=' + encodeURIComponent(sign);
      });
  }
  
  validSign(aliPayObj) {
    return Promise.resolve()
      .then(() => {
        if(aliPayObj.toString() == '{}'){
          return Promise.reject(new Error("AliPay Object is not correct!"));
        }
        if(!this.publicKey.toString()){
          return Promise.reject(new Error("AliPay's private key is not correct!"));
        }
        let signStr = '';
        for (let n of Object.keys(aliPayObj).sort()) {
          if (n !== 'sign' && n !== 'sign_type') {
            signStr += (n + '=' + decodeURIComponent(aliPayObj[n]) + '&');
          }
        }
        signStr = signStr.substring(0, signStr.length - 1);
        let si = this.createVerify(signStr, aliPayObj.sign, this.aliPaySignObj.sign_type);
        return si;
      });
  }
  
  createSign(strParam, signType, charset) {
    let signer = '';
    switch (signType.toString().toUpperCase()) {
      case 'RSA' :
        signer = crypto.createSign('RSA-SHA1');
        signer.update(strParam, charset);
        return signer.sign(this.privateKey.toString(charset), 'base64');
      case 'RSA2':
        signer = crypto.createSign('RSA-SHA256');
        signer.update(strParam, charset);
        return signer.sign(this.privateKey.toString(charset), 'base64');
      default:
        signer = crypto.createSign('RSA-SHA256');
        signer.update(strParam, charset);
        return signer.sign(this.privateKey.toString(charset), 'base64');
    }
  }
  
  createVerify(signStr, sign, signType) {
    let signer = '';
    switch (signType) {
      case 'RSA' :
        signer = crypto.createVerify('RSA-SHA1').update(signStr);
        return signer.verify(this.publicKey, sign, 'base64');
      case 'RSA2':
        signer = crypto.createVerify('RSA-SHA256').update(signStr);
        return signer.verify(this.publicKey, sign, 'base64');
      default:
        signer = crypto.createVerify('RSA-SHA256').update(signStr);
        return signer.verify(this.publicKey, sign, 'base64');
    }
  }
  
  refund(paramStr) {
    return request.getAsync({
      url: this.requestUrl + '?' + paramStr
    }).then(res => {
        let resData = JSON.parse(res.body)['alipay_trade_refund_response'];
        if(resData.code == '10000' && resData.msg == 'Success'){
          return {sign: this.createVerify(JSON.stringify(resData), JSON.parse(res.body).sign, this.aliPaySignObj.sign_type), resData: resData};
        }else return {sign: false, resData: resData};
      });
  }
  
  query(paramStr) {
    return request.getAsync({
      url: this.requestUrl + '?' + paramStr
    }).then(res => {
      let resData = JSON.parse(res.body)['alipay_trade_query_response'];
      if(resData.code == '10000' && resData.msg == 'Success'){
        return {query: true, resData: resData};
      }else return {query: false, resData: resData};
    });
  }
}

module.exports = AliPay;
