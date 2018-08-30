/**
 * Created by Bo on 2017/10/30.
 */

'use strict';

const util = require('../util');
const fs = require('fs');
const path = require('path');
const eutil=require("eutil");
const convertStr2Date = require('../lib/payment/lib').convertStr2Date;

function AliPayPaymentSign(obj, order) {
  this.app_id = obj.app_id;
  this.charset = obj.charset;
  this.notify_url = obj.notify_url;
  this.version = obj.version;
  this.sign_type = obj.sign_type;
  this.method = 'alipay.trade.app.pay';
  this.timestamp = util.eutil.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
  this.biz_content = JSON.stringify({
    body: order.remark || '雪糕群',
    subject: order.subject || '雪糕群',
    out_trade_no: order.order_no,
    timeout_express: util.config.aliPay.timeout || '15m',
    total_amount: Number(order.pay_price).toFixed(2),
    product_code: 'QUICK_MSECURITY_PAY',
  });
}

function AliPayRefundSign(obj, order) {
  this.app_id = obj.app_id;
  this.charset = obj.charset;
  this.notify_url = obj.notify_url;
  this.version = obj.version;
  this.sign_type = obj.sign_type;
  this.method = 'alipay.trade.refund';
  this.timestamp = util.eutil.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
  this.biz_content = JSON.stringify({
    out_trade_no: order.order_no || '',
    trade_no: order.transactionId || '',
    refund_amount: order.pay_price
  });
}

function AliPayQuerySign(obj, order) {
  this.app_id = obj.app_id;
  this.charset = obj.charset;
  this.notify_url = obj.notify_url;
  this.version = obj.version;
  this.sign_type = obj.sign_type;
  this.method = 'alipay.trade.query';
  this.timestamp = util.eutil.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
  this.biz_content = JSON.stringify({
    out_trade_no: order.order_no,
    trade_no: order.transactionId || ''
  });
}

function AliPayInit(aliPay) {
  let init = Object.create(aliPay);
  init.privateKey = fs.readFileSync(path.join(__dirname, "../../app/lib/payment/alipay_rsa_private_key.pem")).toString();
  init.publicKey = fs.readFileSync(path.join(__dirname, "../../app/lib/payment/alipay_public_key_sha256.pem")).toString();
  return init;
}

function AliPayOrder(obj) {
  this.uid = obj.uid || -1;
  this.trade_no = obj.trade_no;
  this.out_trade_no = obj.out_trade_no;
  this.total_amount = obj.total_amount;
  this.refund_fee = obj.refund_fee || 0.00;
  this.buyer_id = obj.buyer_id;
  this.version = obj.version;
  this.body = obj.body;
  this.sign = obj.sign;
  this.notify_time = obj.notify_time ? eutil.getTimeSeconds(new Date(obj.notify_time)): 0;
  this.subject = obj.subject;
  this.sign_type = obj.sign_type;
  this.charset = obj.charset;
  this.notify_type = obj.notify_type;
  this.gmt_create = obj.gmt_create ? eutil.getTimeSeconds(new Date(obj.gmt_create)): 0;
  this.gmt_payment = obj.gmt_payment ? eutil.getTimeSeconds(new Date(obj.gmt_payment)): 0;
  this.gmt_refund = obj.gmt_refund ? eutil.getTimeSeconds(new Date(obj.gmt_refund)): 0;
  this.gmt_close = obj.gmt_close ? eutil.getTimeSeconds(new Date(obj.gmt_close)): 0;
  this.trade_status = obj.trade_status;
  this.app_id = obj.app_id;
  this.seller_id = obj.seller_id;
  this.notify_id = obj.notify_id;
  this.buyer_logon_id = obj.buyer_logon_id;
  this.receipt_amount = obj.receipt_amount || 0.00;
  this.out_biz_no = obj.out_biz_no || '';
  this.seller_email = obj.seller_email;
  this.total_amount = obj.total_amount;
  this.invoice_amount = obj.invoice_amount || 0.00;
  this.buyer_pay_amount = obj.buyer_pay_amount || 0.00;
  this.point_amount = obj.point_amount || 0.00;
  this.fund_bill_list = obj.fund_bill_list || '';
  this.passback_params = obj.passback_params || '';
  this.voucher_detail_list = obj.voucher_detail_list || '';
  this.ctime = obj.ctime || eutil.getTimeSeconds();
  this.mtime = obj.mtime || eutil.getTimeSeconds();
}

function AliPaySignError(obj) {
  this.trade_no = obj.trade_no;
  this.out_trade_no = obj.out_trade_no;
  this.version = obj.version;
  this.sign = obj.sign;
  this.notify_time = obj.notify_time ? eutil.getTimeSeconds(new Date(obj.notify_time)): 0;
  this.sign_type = obj.sign_type;
  this.charset = obj.charset;
  this.notify_type = obj.notify_type;
  this.app_id = obj.app_id;
  this.notify_id = obj.notify_id;
  this.ctime = eutil.getTimeSeconds();
}

function AliPayRefundOrder(obj, uid) {
  this.uid = uid || -1;
  this.trade_no = obj.trade_no || '';
  this.out_trade_no = obj.out_trade_no || '';
  this.refund_fee = obj.refund_fee;
  this.gmt_refund_pay = obj.gmt_refund_pay ? eutil.getTimeSeconds(new Date(obj.gmt_refund_pay)): 0;
  this.trade_status = obj.msg;
  this.store_name = obj.store_name || '';
  this.buyer_user_id = obj.buyer_user_id || '';
  this.buyer_logon_id = obj.buyer_logon_id || '';
  this.trade_code = obj.code;
  this.fund_change = obj.fund_change || '';
  this.refund_detail_item_list_fund_channel = obj.refund_detail_item_list ? obj.refund_detail_item_list[0].fund_channel : '';
  this.refund_detail_item_list_amount = obj.refund_detail_item_list ? obj.refund_detail_item_list[0].amount : 0;
  this.refund_detail_item_list_fund_type = obj.refund_detail_item_list ? obj.refund_detail_item_list[0].fund_type : '';
  this.refund_detail_item_list_real_amount = obj.refund_detail_item_list ? obj.refund_detail_item_list[0].real_amount : 0;
  this.ctime = obj.ctime || eutil.getTimeSeconds();
  this.mtime = eutil.getTimeSeconds();
}

function WechatPayPaymentSign(obj, order) {
  this.appid = obj.appid;
  this.mch_id = obj.mch_id;
  this.body = order.remark || '雪糕群-充值';
  this.notify_url = obj.notify_url;
  this.out_trade_no = order.order_no;
  this.total_fee = Number(order.pay_price)*100; //微信的单位是分
  // this.total_fee = 1;
  this.spbill_create_ip = order.spbill_create_ip || process.env.HOST || '0.0.0.0';
  this.trade_type = 'APP';
}

function WechatPayRefundSign(obj, order) {
  this.appid = obj.appid;
  this.mch_id = obj.mch_id;
  this.out_trade_no = order.order_no;
  this.transaction_id = order.transaction_id;
  this.out_refund_no = order.order_no+Date.now();
  this.total_fee = Number(order.pay_price)*100;
  this.refund_fee = Number(order.pay_price)*100;
}

function WechatPayQuerySign(obj, order) {
  this.appid = obj.appid;
  this.mch_id = obj.mch_id;
  this.out_trade_no = order.order_no;
  this.transaction_id = order.transaction_id;
  this.out_refund_no = order.out_refund_no;
}

function WechatPayInit(wechatPay) {
  let init = Object.create(wechatPay);
  init.pfx = fs.readFileSync(path.join(__dirname, "../../app/lib/payment/wechatPay_cert.p12"));
  return init;
}

function WechatPayOrder(obj) {
  this.uid = obj.uid || -1;
  this.appid = obj.appid;
  this.mch_id = obj.mch_id;
  this.attach = obj.attach || '';
  this.ctime = obj.ctime || eutil.getTimeSeconds();
  this.mtime = obj.mtime || eutil.getTimeSeconds();
  this.bank_type = obj.bank_type || '';
  this.fee_type = obj.fee_type || 'CNY';
  this.is_subscribe = obj.is_subscribe || '';
  this.nonce_str = obj.nonce_str;
  this.openid = obj.openid || '';
  this.out_trade_no = obj.out_trade_no;
  this.result_code = obj.result_code;
  this.return_code = obj.return_code;
  this.sign = obj.sign;
  this.time_end = obj.time_end || eutil.getTimeSeconds();
  this.total_fee = obj.total_fee;
  this.trade_type = obj.trade_type || '';
  this.transaction_id = obj.transaction_id;
  this.return_msg = obj.return_msg || '';
  this.device_info = obj.device_info || '';
  this.err_code = obj.err_code || '';
  this.err_code_des = obj.err_code_des || '';
  this.cash_fee = obj.cash_fee || 0;
  this.cash_fee_type = obj.cash_fee_type || '';
  this.coupon_fee = obj.coupon_fee || 0;
  this.coupon_count = obj.coupon_count || 0;
  this.coupon_id_$n = obj.coupon_id_$n || '';
  this.coupon_fee_$n = obj.coupon_fee_$n || 0;
}

function WechatPaySignError(obj) {
  this.appid = obj.appid;
  this.mch_id = obj.mch_id;
  this.ctime = eutil.getTimeSeconds();
  this.bank_type = obj.bank_type || '';
  this.nonce_str = obj.nonce_str;
  this.openid = obj.openid || '';
  this.out_trade_no = obj.out_trade_no;
  this.result_code = obj.result_code;
  this.return_code = obj.return_code;
  this.sign = obj.sign;
  this.time_end = obj.time_end ? eutil.getTimeSeconds(convertStr2Date(obj.time_end)): 0;
  this.total_fee = Number(obj.total_fee);
  this.trade_type = obj.trade_type;
  this.transaction_id = obj.transaction_id;
  this.cash_fee = Number(obj.cash_fee);
}

function WechatPayRefundOrder(obj, uid) {
  this.uid = uid || -1;
  this.ctime = obj.ctime || eutil.getTimeSeconds();
  this.mtime = obj.mtime || eutil.getTimeSeconds();
  this.fee_type = obj.fee_type || '';
  this.nonce_str = obj.nonce_str;
  this.out_trade_no = obj.out_trade_no || '';
  this.out_refund_no = obj.out_refund_no || '';
  this.return_code = obj.return_code;
  this.sign = obj.sign;
  this.total_fee = obj.total_fee || 0;
  this.transaction_id = obj.transaction_id || '';
  this.return_msg = obj.return_msg || '';
  this.refund_fee = obj.refund_fee || 0;
  this.refund_id = obj.refund_id || '';
  this.settlement_refund_fee = obj.settlement_refund_fee || 0;
  this.settlement_total_fee = obj.settlement_total_fee || 0;
  this.err_code = obj.err_code || '';
  this.err_code_des = obj.err_code_des || '';
  this.cash_fee = obj.cash_fee || 0;
  this.cash_fee_type = obj.cash_fee_type || '';
  this.cash_refund_fee = obj.cash_refund_fee || 0;
  this.coupon_type_$n = obj.coupon_type_$n || '';
  this.coupon_refund_fee = obj.coupon_refund_fee || 0;
  this.coupon_refund_fee_$n = obj.coupon_refund_fee_$n || 0;
  this.coupon_refund_count = obj.coupon_refund_count || 0;
  this.coupon_refund_id_$n = obj.coupon_refund_id_$n || '';
}

function WechatPayPrepayid (obj, WechatObj) {
  this.appid = WechatObj.appid;
  this.partnerid = WechatObj.mch_id;
  this.prepayid = obj.prepay_id;
  this.package = 'Sign=WXPay';
  this.timestamp = eutil.getTimeSeconds().toString();
}

module.exports = {
  AliPayPaymentSign: AliPayPaymentSign,
  AliPayRefundSign: AliPayRefundSign,
  AliPayQuerySign: AliPayQuerySign,
  AliPayInit: AliPayInit,
  AliPayOrder: AliPayOrder,
  AliPaySignError: AliPaySignError,
  AliPayRefundOrder: AliPayRefundOrder,
  WechatPayPaymentSign: WechatPayPaymentSign,
  WechatPayRefundSign: WechatPayRefundSign,
  WechatPayQuerySign: WechatPayQuerySign,
  WechatPayInit: WechatPayInit,
  WechatPayOrder: WechatPayOrder,
  WechatPaySignError: WechatPaySignError,
  WechatPayRefundOrder: WechatPayRefundOrder,
  WechatPayPrepayid: WechatPayPrepayid
};
