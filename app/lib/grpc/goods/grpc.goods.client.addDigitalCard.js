const grpcCRM = require('../client').grpcCRM;
const eutil=require("eutil");

let invokeFunc = 'DigitalService-addDigitalCard';



// for(let i=25;i<9999;i++){
//   let code_number="00"+i;
//   let args = [
//     {
//       goods_id :"941153093154902016", // goods_sn
//       type : 1,//1 签到卡
//       code :"xgq-xdk-code-"+code_number, //'卡片号',
//       sn :"xgq-xdk-sn-"+code_number, // 卡片序号
//       cd_type:1, //'1 纯文字  2 二维码  3 条形码'
//       use_uid :  -1,//使用用户id
//       use_time :   0,//使用时间
//       owner_uid :   -1,//购买者用户id
//       owner_time :   0,//购买时间
//       name :   '卡片名称-签到卡',// 卡片名称
//       ico :  'signCard',//卡片图标
//       wrapper_url :  '-1',//卡片封套url
//       market_price :   0.00,//市场售价
//       price :   0.00, //实际价格
//       introduct :   '签到卡简介'+code_number,//简介
//       detail :   '详情'+code_number,//详情
//       status :   1, //'状态，-1：删除；0：禁用；1：启用'
//       note :   '备注'+code_number,
//       ctime :  eutil.getTimeSeconds(),
//       mtime :   eutil.getTimeSeconds()
//     }
//   ];
//   grpcCRM(args, invokeFunc).then((res)=>{
//     console.log(res);
//   }).catch(err => console.log(err));
// }

