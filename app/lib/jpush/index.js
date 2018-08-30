// 'use strict';
//
//
// var botservices = require('../../services');
// const util = botservices.get("util");
// const  JpushTools=require('./JpushTools');
// // let mjpush=new JpushTools("b9944aa69c624b694ba970dd","2b503a1932a4955228493ffa",['1517bfd3f7fcffc8dee','1a0018970a9d18c6c62'])
// let mjpush=new JpushTools("53dae67c71ba21ee6a4ea76c","54389706abbbfa173ea6f110",
//   ['161a3797c83f0549f7e','191e35f7e07dcc5e0af','141fe1da9e933696bed',"171976fa8ab8f57c6ac",'1a0018970a9270acf76'
//   ]
// );
//
//
//
// // Extract
// //
// // PushService.ExtractMsgFromQueue().then(res=>{
// //
// //   console.log(new Date(),"..",res);
// // });
// //
//
//
//
//
//
//
//
// let push_data={
//   "env": "production",
//   "registration_id": [
//      '161a3797c83066e3f32','120c83f760170d57d1a','121c83f7601ed92f408'
//   ],
//   "tag": [
//     -1
//   ],
//   "alert": "xxx@@@点赞了我",
//   "title": "系统通知",
//   "extras": {
//     "sound": "-1",
//     "deeplink": "-1",
//     "applink": "-1",
//     "content": {
//       "text": "",
//       "data": {
//
//       }
//     },
//     "pushtime": "2017-09-26 21:23:58",
//     "type": "upvote"
//   }
// };
//
// // PushService.InsertToMSgQueue(push_data)
//
// // mjpush.sendIosAndAndroidTextMsg(data).then(re=>{
// //
// //    console.log(re);
// // }).catch(err=>{
// //   console.log(err);
// // });
//
//
// class  Extract{
//    constructor(){
//       this.isend=true;
//       this.timer=null;
//       this.cycleTime=1000;
//    }
//   ExtractQueryAndHandle(){
//      let _self=this;
//     _self.isend=false;
//     return new Promise((resolve, reject) => {
//       PushService.ExtractMsgFromQueue().then(res=>{
//         if(res){
//           _self.isend=false;
//           console.log(new Date(),res);
//           mjpush.sendIosAndAndroidTextMsg(res).then(re=>{
//             console.log(re);
//             resolve(null);
//           }).catch(()=>{
//             resolve(null);
//           });
//         }
//         else  resolve(null);
//       }).catch(()=>{
//         resolve(null);
//       });
//     }).then(()=>{
//       _self.isend=true;
//       return ;
//     });
//   }
//    start(){
//      let _self=this;
//      this.timer=setInterval(function(){
//        if(_self.isend) _self.ExtractQueryAndHandle();
//      },_self.cycleTime);
//    }
//    stop(){
//      clearInterval(this.timer);
//    }
// }
//
// module.exports = Extract;
// // let _Extract=new Extract();
// // _Extract.start();
//
//
//
//
// //
// // var isend=true;
// // function sync_user_info (argument) {
// //   isend=false;
// //   // 从队列里面获取数据
// //   return new Promise((resolve, reject) => {
// //     PushService.ExtractMsgFromQueue().then(res=>{
// //        if(res){
// //            console.log(new Date(),res);
// //          mjpush.sendIosAndAndroidTextMsg(res).then(re=>{
// //            console.log(re)
// //            resolve(null);
// //          });
// //        }
// //          else  resolve(null);
// //     });
// //   }).then(()=>{
// //       isend=true;
// //       return ;
// //   })
// //     .catch((err) => {
// //     console.log(new Date(),err);
// //     isend=true;
// //   });
// // }
// //
// //
// // setInterval(function(){
// //   if(isend) sync_user_info();
// // },1000)
