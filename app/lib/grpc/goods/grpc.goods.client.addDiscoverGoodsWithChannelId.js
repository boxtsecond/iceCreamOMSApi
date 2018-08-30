const grpcCRM = require('../client').grpcCRM;
const eutil=require("eutil");

// let invokeFunc = 'GoodsService-addDiscoverGoodsWithChannelId';
// let args = [
//   {
//     "channel_id": 1
//   },
//   {
//     sid: 1,
//     discover_displayid: 3,
//   }
// ];
let invokeFunc = 'GoodsService-updateDiscoverGoodsWithChannelId';
let args = [
  {
    "channel_id": 1,
    type: 2
  },
  {
    sid: 1,
    discover_displayid: 3,
  }
];
grpcCRM(args, invokeFunc).then((res)=>{
  console.log(res);
}).catch(err => console.log(err));
