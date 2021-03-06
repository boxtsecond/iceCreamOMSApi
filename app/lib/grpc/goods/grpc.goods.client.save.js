const grpcCRM = require('../client').grpcCRM;
const eutil=require("eutil");

let invokeFunc = 'GoodsService-save';
let args = [
  {
    "is_digital": 0,
    "type": 1,
    "category_id": 1,
    //"goods_sn": "-1",
    "is_hot": 0,
    "is_best": 0,
    "is_new": 0,
    "is_promote": 0,
    "goods_name": "这是一个",
    "goods_ico": "-1",
    "small_url": "http://ou5f5jxfx.bkt.clouddn.com/xgx_01.jpg,http://ou5f5jxfx.bkt.clouddn.com/xgx_02.jpg,http://ou5f5jxfx.bkt.clouddn.com/xgx_03.jpg",
    "video_url": "http://ou5flefix.bkt.clouddn.com/xgx_b791cf6faf3d2802674e2c15b30d250e.mp4",
    "page_url": "http://html.adinnet.cn/zanzhushang.html",
    "is_sale":0 ,//是否上架，0，否；1，是
    "onsale_time": eutil.getTimeSeconds(eutil.dateGetBeforeDay(null,1)),
    "offsale_time": eutil.getTimeSeconds(eutil.dateGetNextDay(null,2)),
    "onflashsale_time": 0,//抢购开始时间
    "offflashsale_time": 0, //抢购截止时间
    "dispalyflashsale_time": 0, // '是否显示抢购时间，0，否；1，是 ',
    "dispalyflashsale_countdown_time": 0,// '是否开启抢购倒计时，0，否；1，是 ',
    "is_show_goods_price":0,//'是否显示商品价格，0，否；1，是 '
    "is_check":0, //'是否通过审核，0，否；1，是 ',
    "sell_num": 0, //已出售量
    "total_sale_price": 0, //总销售价
    "goods_num": 100,
    "warn_num": 0,
    "goods_market_price": 0.5,
    "goods_price": 0.01,
    "freight_price": 0,
    "freight_template_id": -1,
    "buylimit": 0,
    "goods_introduct": `<section class="editor selected"><section style="margin-top: 20px; border: 0px none; padding: 0px;"><section style="height: 8px; margin-left: 48px; display: inline-block; padding: 4px 0px 6px; width: 85%; color: inherit; background-color: rgb(254, 254, 254);"><section class="96wx-bdc" style="border: 1px solid rgb(226, 86, 27); box-sizing: border-box; padding: 0px; color: inherit;"></section></section><section style="text-align: center; box-sizing: border-box; padding: 0px; margin-top: -12px; color: inherit;"><section class="96wx-bgc" style="display: inline-block; padding: 5px 10px; box-sizing: border-box; margin: 0px; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"><section class="96wx-color" style="color: inherit; font-size: 16px;">                    请在此输入标题</section></section></section><section class="96wx-bdc" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 9px; margin-left: 15px; margin-top: -60px; color: inherit;"><section class="96wx-bdc" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 7px; color: inherit;"><section class="96wx-bgc" style="width: 10px; height: 10px; border-radius: 50%; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"></section></section></section><section class="96wx-bdc" style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 6px; margin-top: -20px; color: inherit; background-color: rgb(254, 254, 254);"><section class="96wx-bdc" style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 5px; color: inherit;"><section class="96wx-bgc" style="width: 6px; height: 6px; border-radius: 50%; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"></section></section></section></section></section><section class="editor"><section class="96wx-bdc" style="text-align: center;"><section class="96wx-bdc" style="background-color:rgb(254,254,254);padding: 0px 15px;display:inline-block;margin: 0px auto -38px;"><section class="96wx-color" style="text-align: center; color: rgb(89, 89, 89); font-size: 20px;">                商品展示列表</section></section><section class="96wx-bdc" style="margin: -45px 25px 40px; "><section class="96wx-bdc 96wx-color" style="display: inline-block; width: 100%; padding: 10px 0px; margin: 3px 0px 0px; color: rgb(70, 70, 72); box-sizing: border-box; float: left; border-color: rgb(198, 198, 199);"><section class="96wx-bdc" style="border: 0px none rgb(198, 198, 199); margin: 1em 0px 0px; clear: both; box-sizing: border-box; padding: 0px; color: inherit;"><section class="96wx-bdc 96wx-bgc" style="color: rgb(70, 70, 72); float: right; border-color: rgb(198, 198, 199); width: 6px; border-radius: 50%; margin-bottom: -3px; height: 6px !important; background-color: rgb(198, 198, 199);"></section><section class="96wx-bdc 96wx-bgc" style="color: rgb(70, 70, 72); text-align: left; border-color: rgb(198, 198, 199); width: 6px; border-radius: 50%; margin-bottom: -2px; height: 6px !important; background-color: rgb(198, 198, 199);"></section><section class="96wx-bdc" style="margin-top: -20px; text-decoration: inherit; color: inherit; border-color: rgb(198, 198, 199); box-sizing: border-box; background-color: transparent;"><section class="96wx-bdc" style="border-top-width: 1px; border-top-style: solid; width: 100%; float: left; border-color: rgb(198, 198, 199); box-sizing: border-box; color: inherit;"></section></section></section></section></section></section></section><section class="editor"><section style="margin-top: 20px; border: 0px none; padding: 0px;"><section style="height: 8px; margin-left: 48px; display: inline-block; padding: 4px 0px 6px; width: 85%; color: inherit; background-color: rgb(254, 254, 254);"><section class="96wx-bdc" style="border: 1px solid rgb(226, 86, 27); box-sizing: border-box; padding: 0px; color: inherit;"></section></section><section style="text-align: center; box-sizing: border-box; padding: 0px; margin-top: -12px; color: inherit;"><section class="96wx-bgc" style="display: inline-block; padding: 5px 10px; box-sizing: border-box; margin: 0px; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"><section class="96wx-color" style="color: inherit; font-size: 16px;">                    请在此输入标题</section></section></section><section class="96wx-bdc" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 9px; margin-left: 15px; margin-top: -60px; color: inherit;"><section class="96wx-bdc" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 7px; color: inherit;"><section class="96wx-bgc" style="width: 10px; height: 10px; border-radius: 50%; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"></section></section></section><section class="96wx-bdc" style="width: 35px; height: 35px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 6px; margin-top: -20px; color: inherit; background-color: rgb(254, 254, 254);"><section class="96wx-bdc" style="width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgb(226, 86, 27); padding: 5px; color: inherit;"><section class="96wx-bgc" style="width: 6px; height: 6px; border-radius: 50%; color: rgb(255, 255, 255); background-color: rgb(226, 86, 27);"></section></section></section></section></section><section class="editor"><section class="96wx-bdlc" style="margin: 0px auto; padding: 4px; max-width: 100%; box-sizing: border-box; border-width: 6px; border-color: rgba(33, 33, 33, 0.0980392) rgba(33, 33, 33, 0.0980392) rgba(33, 33, 33, 0.0980392) rgb(239, 52, 115); border-style: solid; width: 150px; clear: both; height: 150px; border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-right-radius: 50%; border-bottom-left-radius: 50%; color: inherit; word-wrap: break-word !important;"><section class="96wx-bgc" style="margin: 0px; padding: 10px; max-width: 100%; box-sizing: border-box; width: 130px; border-top-left-radius: 50%; border-top-right-radius: 50%; border-bottom-right-radius: 50%; border-bottom-left-radius: 50%; color: inherit; border-color: rgb(234, 159, 184); background-color: rgb(239, 52, 115); word-wrap: break-word !important; height: 130px !important;color:rgb(255,255,255)"><p class="96wx-bdc" style="margin-top: 0px; margin-bottom: 0px; padding: 40px 0px 0px; max-width: 100%; min-height: 1em; color: inherit; border-color: rgb(239, 52, 115); box-sizing: border-box !important; word-wrap: break-word !important; text-align: center;"><span class="96wx-bdc 96wx-color" style="margin: 0px; padding: 0px; max-width: 100%; border-color: rgb(239, 52, 115); color: inherit; font-size: 18px; box-sizing: border-box !important; word-wrap: break-word !important;">写给自己的</span></p></section></section></section><section class="editor"><section class="96wx-bdc" style="float:left;box-sizing: border-box; "><section class="96wx-bgc 96wx-bgpic" style="width: 50px;padding: 8px;color: rgb(255, 255, 255); height: 40px !important; word-wrap: break-word !important; box-sizing: border-box !important; background-image: url(http://newcdn.96weixin.com/c/mmbiz.qlogo.cn/mmbiz/yqVAqoZvDibEH82vfP7Aa2wic3y5MwmI43yB9icJz1SnvZ9cg0G1vNVaGOUeSnLAWlQTrd99SURN3H8UGZFFCjeOA/0?wx_fmt=png); background-color: rgb(89, 195, 249); background-size: contain; background-position: 50% 50%; background-repeat: no-repeat;"><p style=" white-space: normal;line-height: 2em; text-align: center; "><strong><span style="color:rgb(12, 12, 12); font-size:20px; line-height:inherit">1</span></strong></p></section></section><section style="color: rgb(89, 195, 249); border-color: rgb(89, 195, 249); display: inline-block; padding: 5px 10px;"><p style="line-height: 2em;font-size:18px;"><span class="96wx-color" style="color:rgb(12, 12, 12)">请输入标题支持小资产阶级这款基础科学价值内裤三角裤了自己快乐才艰苦卓绝空间相册看艰苦卓绝可成就小康之家课间操开心 加看着楼下考虑考虑这款旅行车看了真开心离开了离开LKLSZL下卡拉斯科来打卡了<img src="http://img.baidu.com/hi/jx2/j_0025.gif"/></span></p></section><section style="display: block; width: 0; height: 0; clear: both;"></section></section><p><br/></p>`,
    "goods_detail": "既钟情于你，便相伴终身 — 0元启动小爽生日应援",
    "activities_address": "-1",
    "onactivities_time": 0,
    "offactivities_time": 0,
    "status": 1,
    "provide_invoice": 0,
    "provide_warranty": 0,
    "goods_weight": 0,
    "click_count": 0,
    "browse_count": 0,
    "share_count": 0,
    "favorite_count": 0,
    "like_count": 0,
    "tenant_id": -1,
    "score": 0,//排序
    "logistics_template_id": -1,
    "comments_id": -1,
    "share_id": -1,
    "qa_id": -1,
    "sellmonthly_num": 0,
    "promote_price": 0,
    "onpromote_time": 0,
    "offpromote_time": 0,
    "keywords": "-1",
    "note": "\"\"",
    "is_synced": 0,
    "synced_time": 0,
    "goods_instructions":"使用说明我也不知道怎么用啦啦啦啦啦啦啦啦" // 使用说明
  },
  {
    sid: 1,
    discover_displayid: 3,
  }
];
grpcCRM(args, invokeFunc).then((res)=>{
  console.log(res);
}).catch(err => console.log(err));
