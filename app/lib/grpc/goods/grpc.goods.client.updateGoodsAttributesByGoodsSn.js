/**
 * 修改抢购时间
 * Created by dyuxuan on 12/13/17.
 */
const grpcCRM = require('../client').grpcCRM;
var eutil=require("eutil");

process.env.NODE_ENV="development";
let invokeFunc = 'GoodsService-updateGoodsAttributesByGoodsSn';
let args = [
  {
    "onflashsale_time": 1512987008,
    "offflashsale_time": 1513591808
  }
  ,941152943204339712
];


grpcCRM(args, invokeFunc).then((res)=>{

  console.log(res);

}).catch(err => console.log(err));

  console.log("当前时间到秒：",eutil.getTimeSeconds(new Date()));
  console.log("之前几天当前时间到秒：",eutil.getTimeSeconds(eutil.dateGetBeforeDay(null,1)));
console.log("之后几天当前时间到秒：",eutil.getTimeSeconds(eutil.dateGetNextDay(null,10)));
// console.log(eutil.getTimeSeconds(eutil.dateGetBeforeDay(null,1)))
// console.log("dateGetBeforeDay  -->",eutil.dateFormat( eutil.dateGetBeforeDay(null,1),"yyyy-MM-dd hh:mm:ss S"));
//


// 79  78
