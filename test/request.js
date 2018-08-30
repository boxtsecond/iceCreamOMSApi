'use strict';
// var request = require("request");
//
// var options = { method: 'POST',
//   url: 'https://oapi.dingtalk.com/robot/send',
//   qs: { access_token: '87fd561addc56cae40f9753f1a2079bc370e57cda57a03b8b88a844c072412c4' },
//   headers:
//     { 'postman-token': '6aafd537-77a9-ff67-c7c6-0ce7492bcfa8',
//       'cache-control': 'no-cache',
//       'content-type': 'application/json' },
//   body:
//     { msgtype: 'text',
//       // 系统故障！！！！😫😫抓狂抓狂....
//       text: { content: ' 测试信息...' },
//       at: { "atMobiles": [
//         // "18321538399",
//         // "13816699484"
//       ],  isAtAll: false } },
//   json: true };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });


// var cluster = require("cluster");
//
// if(cluster.isMaster){
//   var worker = cluster.fork()
//   worker.on("message", function(msg){
//     console.log('.,,,',msg);
//     console.log("message",new Date());
//   });
// }else{
//   function aa() {
//     process.send({as: 'asasdf'});
//     setTimeout(aa, 1000);
//   }
//
//   setTimeout(aa, 1000);
//
//
// }




router.post('/',(req, resp)=>{

  switch(type){
    case 1:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android(result1[0].nickname+' 点赞了我','系统通知',2,{date:pushTime,type:1}),
                  JPush.ios(result1[0].nickname+' 点赞了我','系统通知',0,true,{date:pushTime,type:1}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 2:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android(result1[0].nickname+' 回复','系统通知',2,{date:pushTime,type:1}),
                  JPush.ios(result1[0].nickname+' 回复','系统通知',0,true,{date:pushTime,type:1}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 3:
      models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
        .then(result=>{
          client.push().setPlatform(JPush.ALL)
            .setAudience(JPush.ALL)
            .setOptions(null,null,null,true)
            .setNotification(JPush.android(result[0].nickname+' 发消息了','雪糕群',2,{date:pushTime,type:3}),
              JPush.ios(result[0].nickname+' 发消息了','雪糕群',0,true,{date:pushTime,type:3}))
            .send((err, res)=>{
              if (err){
                console.log(err);
                return resp.status(500).send('server error')
              }
              resp.status(200).json('success')
            })
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 4:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android('你有一条消息被 '+result1[0].nickname+" ' 昵称 ' 看上了",'系统通知',2,{date:pushTime,type:1}),
                  JPush.ios('你有一条消息被 '+result1[0].nickname+" ' 昵称 '看上了",'系统通知',0,true,{date:pushTime,type:1}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 5:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android('你已经被拉黑了','系统通知',2,{date:pushTime,type:2}),
                  JPush.ios('你已经被拉黑了','系统通知',0,true,{date:pushTime,type:2}))
                .send((err, res)=>{
                  if (err)resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 6:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android('你已被禁言','系统通知',2,{date:pushTime,type:2}),
                  JPush.ios('你已被禁言','系统通知',0,true,{date:pushTime,type:2}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    default:
      resp.status(400).send('params missing')
  }
})

/* *
 * push user create time 2017/6/17
 */

router.post('/back',(req, resp)=>{
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var pushTime =  year + "-" + month + "-" + date + " " + hour + ":" + minute;
  if (Type.isNumber(req.body.type))return resp.status(400).json('type should be a number')
  if (Type.isNumber(req.body.Uid))return resp.status(400).json('Uid should be a number') //明星id
  if (Type.isString(req.body.env))return resp.status(400).json('env should be a string')
  var type=parseInt(req.body.type)
  if (req.body.env!='production')return resp.status(200).json('development should not push')
  switch(type){
    case 1:
      if(Type.isString(req.body.time))return resp.status(400).json('time should be string')
      if(Type.isString(req.body.content))return resp.status(400).json('content should be string')
      if(Type.isNumber(req.body.id)){
        models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
          .then(result=>{
            client.push().setPlatform(JPush.ALL)
              .setAudience(JPush.ALL)
              .setOptions(null,null,null,true)
              .setNotification(JPush.android(req.body.content,'',2,{date:req.body.time,type:3}),
                JPush.ios(req.body.content,'',0,true,{date:req.body.time,type:3}))
              .setSingleSchedule(req.body.time)
              .setSchedule('Schedule_Name', true, function (err, res) {
                models.getModel('pushmodel').pushInfomation(req.body.content,'路人,忠实粉,真爱粉  发送人:'+result[0].nickname,-1)
                  .then(result1=>resp.status(200).json('success'))
                  .catch(err=>resp.status(500).send('server error'))
              })
          })
          .catch(err=>res.status(500).send('server error'))
      } else {
        models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
          .then(result=>{
            //2017-05-17 10:03:00
            if (Type.isNumber(req.body.Rid))req.body.Rid=-1
            models.getModel('redismodel').getRegistId(req.body.id)
              .then(result1=>{
                client.push().setPlatform(JPush.ALL)
                  .setAudience(JPush.registration_id(result1))
                  .setOptions(null,null,null,true)
                  .setNotification(JPush.android(req.body.content,'',2,{date:req.body.time,type:2}),JPush.ios(req.body.content,'',0,true,{date:req.body.time,type:2}))
                  .setSingleSchedule(req.body.time)
                  .setSchedule('Schedule_Name', true, function (err, res) {
                    models.getModel('pushmodel').pushInfomation(req.body.content,req.body.id,req.body.Rid,-1)
                      .then(result2=>resp.status(200).json('success'))
                      .catch(err=>resp.status(500).send('server error'))
                  })
              })
              .catch(err=>resp.status(500).send('server error'))
          })
          .catch(err=>res.status(500).send('server error'))
      }
      break;
    case 2:
      if(Type.isString(req.body.tag))return resp.status(400).json('tag should be string')
      if(Type.isString(req.body.content))return resp.status(400).json('content should be string')
      var tag = req.body.tag
      models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
        .then(result=>{
          client.push().setPlatform('ios', 'android')
            .setAudience(JPush.tag(tag))
            .setOptions(null,null,null,true)
            .setNotification(JPush.android(req.body.content,'',2,{date:pushTime,type:3}),JPush.ios(req.body.content,'',0,true,{date:pushTime,type:3}))
            .send((err, res)=>{
              models.getModel('pushmodel').pushInfomation(req.body.content,req.body.tag,-1)
                .then(result1=>resp.status(200).json('success'))
                .catch(err=>resp.status(500).send('server error'))
            })
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 3:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      if(Type.isString(req.body.content))return resp.status(400).json('content should be string')
      if (Type.isNumber(req.body.Rid))req.body.Rid=-1  //举报信息的id
      if (Type.isNumber(req.body.Cid))req.body.Cid=-1  //被举报评论的id
      if (Type.isNumber(req.body.Fid))req.body.Fid=-1  //反馈推送唯一标识
      models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
        .then(result=>{
          models.getModel('redismodel').getRegistId(req.body.id)
            .then(result1=>{//'13065ffa4e3805d86ec,190e35f7e07455da4c2'
              client.push().setPlatform('android','ios')
                .setAudience(JPush.registration_id(result1))//result1
                .setOptions(null,null,null,true)
                .setNotification(JPush.android(req.body.content,'系统通知',2,{date:pushTime,type:2}),JPush.ios(req.body.content,'',0,true,{date:pushTime,type:2}))
                .send((err, res)=>{
                  models.getModel('pushmodel').pushInfomation(req.body.content,req.body.id,req.body.Rid,req.body.Cid)
                    .then(result2=>{
                      //反馈已发送
                      if (req.body.Fid==1) {
                        models.getModel('pushmodel').setReportStatus(req.body.Rid)
                          .then(result3=>resp.status(200).json('success'))
                          .catch(err=>resp.status(500).send('server error'))
                      } else {
                        resp.status(200).json('success')
                      }
                    })
                    .catch(err=>resp.status(500).send('server error'))
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 4:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android('你已被拉黑','系统通知',2,{date:pushTime,type:2}),
                  JPush.ios('你已被拉黑','',0,true,{date:pushTime,type:2}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 5:
      if(Type.isNumber(req.body.id))return resp.status(400).json('id should be number')
      models.getModel('redismodel').getRegistId(req.body.id)
        .then(result=>{
          models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
            .then(result1=>{
              client.push().setPlatform('ios', 'android')
                .setAudience(JPush.registration_id(result))
                .setOptions(null,null,null,true)
                .setNotification(JPush.android('你已被禁言','系统通知',2,{date:pushTime,type:2}),
                  JPush.ios('你已被禁言','',0,true,{date:pushTime,type:2}))
                .send((err, res)=>{
                  if (err)return resp.status(500).send('server error')
                  resp.status(200).json('success')
                })
            })
            .catch(err=>resp.status(500).send('server error'))
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    case 6:
      if(Type.isString(req.body.content))return resp.status(400).json('content should be string')
      models.getModel('trendszhengmodel').getAdmininfoData(req.body.Uid)
        .then(result=>{
          client.push().setPlatform(JPush.ALL)
            .setAudience(JPush.ALL)
            .setOptions(null,null,null,true)
            .setNotification(JPush.android(req.body.content,'',2,{date:pushTime,type:3}),
              JPush.ios(req.body.content,'',0,true,{date:pushTime,type:3}))
            .send((err, res)=>{
              models.getModel('pushmodel').pushInfomation(req.body.content,'路人,忠实粉,真爱粉  发送人:'+result[0].nickname,-1)
                .then(result1=>resp.status(200).json('success'))
                .catch(err=>resp.status(500).send('server error'))
            })
        })
        .catch(err=>resp.status(500).send('server error'))
      break;
    default:
      resp.status(400).send('params missing')
  }
})

module.exports = router;
