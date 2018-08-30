
用户表添加  itucode 电信码
用户积分增减记录表(账目表) 包括经验值  包括管理员操作

版主表
版主操作日志表

商品分类表
商品表 -> 虚拟商品卡号
订单表
订单配送
订单操作日志表

活动分类表
活动表
活动报名表

## 登陆页
- 2.1 功能 

- 账号密码登陆
     - 注册页面 
         - 发送验证码  -> 判断手机号规则 -> 发送验证码->返回账号是否存在 【api接口】
         - 设置密码  没有账号自动创建账号 自动登录成功  【api接口】
     - 重置密码 忘记密码
         - 发送验证码  -> 判断手机号规则 -> 发送验证码 【api接口】 (..)
    - 快速登录 
         - 发送验证码 接口 POST /Messages【 api接口】
         - 快速登陆 没有账号自动创建账号 自动登录成功 【api接口】
    - 账号登陆
         - 返回账号是否存在  【api接口】 
    - 更换手机号(登陆之后才能更换手机号)
         - 获取验证码  -> 重置密码的接口
         - 验证验证码   【api接口】
         - 绑定新手机号 
              - 获取验证码  -> 注册页面-发送验证码
              - 修改手机号  判断手机号规则 -> 判断验证码-> 是否注册(注册) -> 修改手机号  【api接口】
    - 三方登陆 (暂时不做)
         - 登陆  qq   weixin weibo  
         - 绑定  qq   weixin weibo  已经绑定过了提示绑定失败
         - 通过qq/weixin /weibo 登陆之后绑定手机号(判断手机号是否注册 并返回客户端)
         -  绑定接口
     
                



- 登陆接口


- 账号登陆
     
     
     - 重置密码 

##
- 登录页
   - 发送验证码 POST /Messages
   - 粉丝登录 POST Fans/login
- 菜单栏
   - 个人中心
       - 上传修改头像  POST Fans/profile authid (获取qiniutoken ) http://upload.qiniup.com  
       - 修改用户信息  
       - 获取用户信息 Fans/login 登陆之后获取
       - 获取用户JWT token Fans/login 登陆之后获取
- 首页
   - 获取头条 GET Comments/getHeadline
   - 获取郑爽信息:昵称与头像 get Stars/getProfileUid/-5
   - 获取置顶评论 getTopNews Comments/getTopComments?icons=3
   - 获取粉丝最新评论 
       - 第一次进入界面获取  Comments/getNewComments?uid=3446&timelimit=0
       - 获取留言翻页  Comments/getNewComments?uid=3446&timelimit=1504248628580
       - 获取新留言  Comments/getNewCommentsNotice?uid=3446&timelimit=1504248628573
   - 是否有直播聊天 socket.io
   - 获取所有评论总数  Comments/getCommentsCount?id=3324
   - 点赞头条 Comments/likeStarComments/3473
   - 点赞评论 Comments/likeComments/3473
   - 获取历史发布 Stars/getMomentsHistory?limit=10&score=0
   - 每个条发布分别请求其评论数  Comments/getCommentsCount?id=3324
   - 发布信息   ?
       - 获取qiniutoken 
       - 文字
       - 音频
       - 视频

       
       
- 版主端
       - 登陆  Star/login
       - 上头条
       - 修改个人信息
       - 修改密码
       - 拉黑
       - 禁言 
       - 恢复正常
       - 置顶
       - 回复 
       - 版主端发送信息
       

```` 
 http: function(ctx) {
    // ctx is LoopBack Context object

    // 1\. Get the HTTP request object as provided by Express
    var req = ctx.req;

    // 2\. Get 'a' and 'b' from query string or form data and return their sum.
    return -req.param('a') - req.param('b');
  }
Object.keys(userAccountSchema.obj).map(function (item) {     console.log("this."+item+"=obj."+item+";") })

````
