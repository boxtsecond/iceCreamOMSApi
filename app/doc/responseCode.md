### 规范
```
//-1  服务器繁忙（CPU  内存）
使用的code都是大于1000的
//2000  成功 normal
//   规定以1 0 开头的提示都是监控程序所用的错误
//   以 2 6 开头的提示都是成功
//   以 3 7 开头的都是db这类的交互错误
//   以 4 8 开头的都是提示给用户看的
//   以 5 9 开头的都是 服务器内部错误（比如连接不上mongodb）服务器CPU 内存
//eg:
    //2000   normal
    //3000   prompt 业务中的逻辑错误比如 redis mongodb 错误
    //4000  7000 prompt 用户输入错误(需要提示给用户) 对外的
    //5000  9000 system 服务器内部错误 （内部日志记录）
```

```
log.trace("trace")
log.debug("debug")
log.info("info")
log.warn({lang: 'fr'}, 'au revoir');
log.error("error");
log.fatal("fatal")

```

# guest token
```
          _ip: Joi.string().empty(''),
          access_token: Joi.string().empty(''),
          _appid: Joi.string().required(),

```
# user token
```
       _ip: Joi.string().empty(''),
       _appid: Joi.string().empty(''),
       access_token: Joi.string().empty(''),
       token: Joi.string().empty(''),
       authorization: Joi.string().empty(''),
       auth: Joi.string().empty(''),

```

```
 _ip: Joi.string().empty(''),
          access_token: Joi.string().empty(''),
          _appid: Joi.string().required(),

```

## API定义
```
http: { source: 'path' || 'body' || 'query'  'formData'  'form'
http 200  固定返回值 格式   必须包含 code msg result
 returns:[
      {arg: 'code', type: 'number', required: true},
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ]
 {
    description: '更新用户信息 [未完成]',
    http: { path: '/setProfile/:Uid', verb: 'patch' },
    returns:[
      {arg: 'code', type: 'number', required: true},
      {arg: 'msg', type: 'string', required: true},
      {arg: 'result', type: 'array', required: true}
    ],
    accepts: [
      { arg: 'authid', type: 'string',default:"authid",description:" ",required: true, http: { source: 'path' } }
    ]
  }

```
### APi 使用示例
```
接口里面可能用到的引用
  XXX  是当前对象的注入对象
 var redisSlave = XXX.app.get("redisSlave");
    var redisMaster = XXX.app.get("redisMaster");
    const Apiapp = XXX.app.get("Apiapp");
    const validate = Apiapp.util.schemaValidator;
    const  Joi=Apiapp.util.Joi;
    const eutil = Apiapp.util.eutil;

     return Promise.resolve()
      ....
     .catch((res) => {
              if (eutil.isArray(res)) return Promise.resolve(res);
              else return Promise.reject(res);
     });

```

### 使用记录
```
2000 成功  提示所有的成功 resolve([2000,"success",{} ]);
2001 重复请求被拒绝
2002  账户被禁用
2003 资源不可重复
2004  账户被拉黑
2005  请求中带敏感词
2006  拉黑账户不可以被禁言
2007 资源已删除
2008 账号已存在
3000  成功  获取token出错 resolve([2000,"get token error",{} ]);
3001  redis 数据 获取 失败  // 从redis 中获取ttl 错误
3002  redis 数据 写入 失败
3003  mysql 数据 获取 失败
3004  mysql 数据 写入 失败
3005  mongo 数据 获取 失败
3006  mongo 数据 写入 失败
4000 用户参数格式错误  resolve([4000,"param not valid",{}]);
4001 unauthorized  resolve([4001,"unauthorized",{}]);
4002 用户没有此权限
4003 验证码授权失败
4004 发送验证码失败
4005 用户权限过期
4006 用户参数错误
4007 限时请求，请等待
4008 用过 // 以前留下的状态码，代码中没有使用
4009 用户不存在，注册失败
4010 密码错误
4011 不可删除其它版主的头条
4012 今日已签到
4013 签到期限已过

4400 token 验证失败
4401 token 过期
4402 appid appsecret无效
4403 appid 非法
4404 token 非法用户 过期

45XX 订单错误
4510 参数错误
4511 订单操作频繁
4512 找不到对应数据(充值、商品、虚拟卡)
4513 创建订单失败
4514 商品数量不足
4515 虚拟卡已经被使用
4516 钱包金额不足
4517 订单已发货，不可修改地址
4518 更改订单地址失败
4519 订单类型不支持更改订单地址
4520 用户已超过最大可购买数量
4521 不在允许时间范围内
4522 system order 不需要生成订单，price == 0
4523 不能更新钱包金额(payment notify)
4524 不能更新/创建 order_detail (payment notify)
4525 更新订单失败(payment notify)
4526 删除订单失败

46XX 支付错误
4602 支付宝签名错误
4605 支付宝服务器错误
4603 微信返回错误
4604 微信签名错误
4606 微信查询订单错误
```

5XXX 运营后台
5001 找不到对应数据
5002 数据已存在
5003 上传的文件已存在
5004 合并时，上传的分片文件数量不正确
5005 文件格式不正确
5006 文件模板(对应的行列)不正确

### 推送数据类型
- upvote 版主点赞；
- reply  版主回复；
- publishHeadline 发布头条；
- gag 禁言；
- blacklist 拉黑；
- system 系统消息

### 开发注意事项
- 定义api参数 server.datasources.db.define('paramType'，{}}, paramType为全局
