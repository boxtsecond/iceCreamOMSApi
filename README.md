# My Application


development->staging->production

- development ``` npm run dev```
- staging ``` npm run stag```
- production ``` npm run prod```
   app.get("mysqlMaster");
   app.get("redisMaster");
   app.get("redisSlave");
   app.get("eutil");
    app.get("log");

The project is generated by [LoopBack](http://loopback.io).


https://github.com/grpc/grpc/tree/master/examples/node

### 文件夹说明

``` 
app  核心业务  包括与数据库交互 数据流数据字典
    -cache  本地缓存
    -controllers  目前暂时不用
    - lib  常用的第三方包或者扩展
    - mysql  mysql 数据库交互相关
    - redis  redis 数据库存取相关
client  客户端html 
common  对外的API服务
doc    项目相关文档
docker  docker 便于本地开发测试
node_modeules  nodejs 模块
scripts  项目中维护常用的相关脚本
server   api服务启动服务
package.json  nodejs 配置文件
 

```

###api 

```
about 关于
admin
comments  粉丝粉丝之间的留言
commentszhen  明星回复留言
login
message
qiniutoken
refresh  刷新敏感词
report 报表
stickies 点赞
token  获取token 
users 
usertoken
zcomments
zcommentszhen
zuser
zusers


```


##
使用状态码申请
 http://120.136.175.13/icecreamProduct/icecreamApp/wikis/%E8%BF%94%E5%9B%9E%E5%80%BC%E7%8A%B6%E6%80%81%E7%A0%81%E6%9F%A5%E8%AF%A2%E5%88%97%E8%A1%A8
Mentions  @ 到提到我的
Comments 
Likes


Discover 发现
举报信息
意见反馈
tag  真爱粉   脑残粉

2.x
积分设置
订单管理(虚拟物品)
财务报表
商城


reports 意见反馈


```
用过新的api的用户自动迁移到mongodb 
```



### 功能列表

- 雪糕群粉丝端app 

```
 api 用户登录
 api 用户注册
 jpush 通知消息 系统通知 极光推送
 通知消息 回复点赞  ？？？
 api 我的发言 
 h5 关于我们
 api 意见反馈 
 socket 互动直播
 api 获取所有评论
 api 拉黑
 api 禁言
```

- 雪糕群版主端

```

```


https://docs.docker.com/compose/install/#master-builds




