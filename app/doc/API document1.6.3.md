Request

USERS

HTTP request

_暂不提供查询所有用户_
	get http://xxx/users/

	获取所有用户

传参

	无

返回

	id            		int         用户id
	nickname      		string		昵称
	avatar		  		string		头像
	birthday	  		string		生日
	sex			  		int 		性别
	professional  		string   	职业
	phonenumber	  		string	 	电话
	address		  		string		地址
	status		  		int			状态  1正常  2禁言  3拉黑
	createtime	   		string		创建时间
	lastlogintime		string		上次登陆时间
	latestlogintime		string		最后登陆时间

---------------------------------------------------------

get http://xxx/users/:id

	获取用户具体信息

	id                         用户id

传参

	无

返回

	id            		int         用户id
	nickname      		string		昵称
	avatar		  		string		头像
	birthday	  		string		生日
	sex			  		int 		性别
	professional  		string   	职业
	phonenumber	  		string	 	电话
	address		  		string		地址
	status		  		int			状态  1正常  2禁言  3拉黑
	createtime	   		string		创建时间
	lastlogintime		string		上次登陆时间
	latestlogintime		string		最后登陆时间


HTTP request

	patch https://xxx/users/

	修改用户信息

传参

	authtoken 				string		登陆凭证
	authid					int			用户id
	user					Object		需要修改的用户信息

返回

	“success”或者“failed”




HTTP request

	put https://xxx/users/

	修改用户状态信息

传参
	id            		int         用户id
	nickname      		string		昵称
	avatar		  		string		头像
	birthday	  		string		生日
	sex			  		int 		性别
	professional  		string   	职业
	phonenumber	  		string	 	电话
	address		  		string		地址
	status		  		int			状态  1正常  2禁言  3拉黑
	createtime	   		string		创建时间
	lastlogintime		string		上次登陆时间
	latestlogintime		string		最后登陆时间

返回

	“success”或者“failed”



==============================================================



HTTP request

login

	post https://xxxx/login

	用户登陆

传参

	phonenumber 	string		用户手机号
	register			string		设备号，推送
	code  				string		验证码

返回

	id            		int         用户id
	nickname      		string		昵称
	avatar		  		string		头像
	birthday	  		string		生日
	sex			  		int 		性别
	professional  		string   	职业
	phonenumber	  		string	 	电话
	address		  		string		地址
	status		  		int			状态  1正常  2禁言  3拉黑
	createtime	   		string		创建时间
	lastlogintime		string		上次登陆时间
	latestlogintime		string		最后登陆时间
	token				string		登陆凭证


==============================================================

HTTP request

message

	post http://xxxx/message/

	验证码获取

传参

	phonenumber 	string		用户手机号
	areacode			string		区号
返回

	“success”或者“failed”


==============================================================


HTTP request

Comments

	get http://xxx/comments?limit＝10&score＝0&zhenfilter＝2&userfilter＝3&count=1&timelimit=1111111&searchtype=2

	获取所有评论

传参
	无
	可选参数
		searchtype        int           1为获取新的评论，2为获取旧的评论
		timelimit		  int           searchtype为1时，传已有的最新的评论的编辑时间，传已有的最老的评论的编辑时间
		count             int           为1时则返回数据总数
		userfilter   	  int           user的id
		zhenfilter        int           zhen的头条id
		likefilter		  int            user的id
		limit 　      	  int			限制获取评论数量（默认为15）
		score     	      int		    从第score条数据开始获取最新的limit条记录（默认score为0）

	userfilter跟zhenfilter跟likefilter选填一个     需要关于zhen的某条留言的评论只填zhenfilter，需要关于用户的往期发言只填userfilter，需要zhen对某个用户点赞的评论列表只填likefilter

返回

	id             int			    评论id   
	link		   string			url
	datatype	   int			    数据类型（1为文本，2为语音，3为视频，4为图片）			
	data		   string			文本内容（数据类型为1）
	replyid        string			回复评论的id
	creater		   string		    发表评论者的id
	likelist	   string			点赞的用户列表
	isdel	       int		        是否删除  1正常  2删除
	createtime	   string			创建时间
	edittime	   string			编辑时间
	zhenlikeyou    int  			zhen是否点赞了你的这条评论（1为否，2为是）
	user 		   object			用户信息
	zhenreply	   string			zhen回复你的评论的id
	replylist	   string			回复你的评论的id列表

样式
[{
    "id": 11,
    "link": "reqfwfwe",
    "datatype": 1,
    "data": "cnm",
    "replyid": "-1",
    "likelist": "23123,4232,42321",
    "createtime": "1489736927466",
    "edittime": "1489736927466",
    "creater": "1",
    "isdel":2
  },
  {
    "id": 12,
    "link": "reqfwfwe",
    "datatype": 1,
    "data": "cnm",
    "replyid": "-1",
    "likelist": "-1",
    "createtime": "1489743427989",
    "edittime": "1489743427989",
    "creater": "2",
    "isdel":1
  }］




---------------------------------------------------
get http://xxx/comments/:uid

	获取单条评论详细
	uid                  评论id   
传参
	无

	可选参数
		无

返回

	id             int			    评论id   
	link		   string			url
	datatype	   int			    数据类型（1为文本，2为语音，3为视频，4为图片）			
	data		   string			文本内容（数据类型为1）
	replyid        string			回复评论的id
	creater		   string		    发表评论者的id
	likelist	   string			点赞的用户列表
	isdel	       int		        是否删除  1正常  2删除
	createtime	   string			创建时间
	edittime	   string			编辑时间
	zhenlikeyou    int  			zhen是否点赞了你的这条评论（1为否，2为是）
	user 		   object			用户信息
	zhenreply	   string			zhen回复你的评论的id
	replylist	   string			回复你的评论的id列表
样式
  {
    "id": 12,
    "link": "reqfwfwe",
    "datatype": 1,
    "data": "cnm",
    "replyid": "-1",
    "likelist": "-1",
    "createtime": "1489743427989",
    "edittime": "1489743427989",
    "creater": "2",
    "isdel":1
  }

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
post http://xxx/comments/

	增加一条评论

传参
	authtoken 		string		登陆凭证
	authid			int			用户id
	creater     	int			创建者的id
	datatype		int			数据类型
	data        	string		文本信息
	link			string		数据的URL
	replyid     	string      郑爽头条的id
	thumbnail       string      缩略图
	musiclength     string		音乐时长

返回

	id          评论id   

样式
[3］

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

delete http://xxx/comments/:uid

	删除一条评论

	uid     int   评论的id
传参
	authtoken 		string		登陆凭证
	authid			int			用户id
	可选参数
	无

返回
	“success”或者“failed”

－－－－－－－－－－－－－－－－－－－－－－－－－－－

patch http://xxx/comments/:uid

	更新一条评论
	uid    评论的id

传参
	authtoken 				string		登陆凭证
	authid					int			用户id
	jsonpatch				dict        jsonpatch
	
	jsonpatch的path不带/
	
	op  
	  add                               增加
	  delete   							删除
	  
	可选参数
	无

返回
	“success”或者“failed”



================================================================

HTTP request

Stickies

	get http://xxx/stickies/

	获取所有置顶评论

传参
	无

	可选参数
		无

返回

	id          	int				评论id   
	link			string			url
	datatype		int				数据类型（1为文本，2为语音，3为视频，4为图片）			
	data			string			文本内容（数据类型为1）
	replyid     	string			回复评论的id
	creater			string			发表评论者的id
	likelist		string			点赞的用户列表
	isdel	    	int				是否删除  1正常  2删除
	createtime		string			创建时间
	edittime		string			编辑时间
	zhenlikeyou    	int  			zhen是否点赞了你的这条评论（1为否，2为是）
	sid				int    			置顶表id
	user 			object			用户信息

样式
[{
    "id": 11,
    "link": "reqfwfwe",
    "datatype": 1,
    "data": "cnm",
    "replyid": "-1",
    "likelist": "23123,4232,42321",
    "createtime": "1489736927466",
    "edittime": "1489736927466",
    "creater": "1",
    "isdel":2,
    "sid":2
  },
  {
    "id": 12,
    "link": "reqfwfwe",
    "datatype": 1,
    "data": "cnm",
    "replyid": "0",
    "likelist": "0",
    "createtime": "1489743427989",
    "edittime": "1489743427989",
    "creater": "2",
    "isdel":1,
    "sid":1
  }］

---------------------------------------------------

post http://xxx/stickies/

	增加一条置顶评论

传参

	commentid    		int			评论id

	可选参数

		无

返回

	id          					置顶信息id

样式

[3］

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

delete http://xxx/stickies/:uid

	删除一条置顶评论

	uid      置顶表id

传参
	无
	可选参数
	无

返回
	“success”或者“failed”
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝


HTTP request

CommentsZhen

	get http://xxx/commentszhen?limit=0&score=0&userfilter=0

	获取头条郑爽的帖子

传参
	limit 　      	  int			限制获取zhen评论数量（默认为15）
	score     	      int		    从第score条数据开始获取最新的limit条记录（默认score为0）
可选参数
	userfilter   	  int           user的id


返回

	id             int			    头条id   
	link		   string			url
	datatype	   int			    数据类型（1为文本，2为语音，3为视频，4为图片）			
	text		   string			文本内容
	likelist       string			点赞者的id
	isreply	       int		        是否删除  1不是  2是
	createtime	   string			创建时间
	replyid		   string			回复评论的id
	ataillist      string           @的用户的id列表
	atailusers      string           @的用户的信息列表

样式
{
    "id": 11,
    "link": "reqfwfwe",
    "datatype": 1,
    "text": "cnm",
    "likelist": "23123,4232,42321",
    "createtime": "1489736927466",
    "isreply":2,
    "replyid":1,
    "ataillist":-1,
    "atailusers":[]
  }

---------------------------------------------------

post http://xxx/commentszhen

	郑爽增加一条头条或者评论

传参

	isreply     	int			 1（头条），2（回复）
	datatype		int			数据类型
	text        	string		文本信息
	link			string		数据的URL
	thumbnail       string      缩略图
	musiclength     string		音乐时长
	ataillist       string      @的用户的列表

	可选参数
		replyid     string      如果该评论是回复某条信息的，则此字段为那条信息的id，如不是回复，则没有此字段  
		replyto     string      如果该评论是回复某条信息的，则此字段为那条信息的创建者id，如不是回复，则没有此字段    

返回

	id          评论id   

样式

[3］

----------------------------------------------------

patch http://xxx/commentszhen/:uid

	点赞一条评论

	uid    评论的id

传参

	authtoken 				string		登陆凭证
	authid					int			用户id
	jsonpatch     			dict  		jsonpatch

	jsonpatch的path不带/

	op  
	  add                               增加
	  delete   							删除
	可选参数

	无

返回
	“success”或者“failed”

----------------------------------------------------

del http://xxx/commentszhen/:uid

	点赞一条评论

	uid    评论的id

传参

	可选参数

	无

返回
	“success”或者“failed”


=========================================================

HTTP request

qiniutoken

	get http://xxx/qiniutoken?type=a&name=b&bucket=c&url=d

	获取qiniuyun的token

传参

	type 　      	  string			值为up或者down
	name     	      string		    上传文件的名字（type为up时必填）
	bucket            string            bucket名字（type为up时必填）
	url 			  string 			domain名字加文件名字（type为down时必填）  http://domain/name

返回

	token              string          token信息

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

HTTP request

token

	get http://xxx/token

	获取jwt的token

传参

	username     	      string		    用户名
	password            string            	密码
	用http-basic加密传参

返回
	type              string          加密类型
	token             string          token信息
	avatar			  string          zhen的头像
	nickname		  string          zhen的昵称

==============================================================

HTTP request

	get http://xxx/zuser

	获取郑爽的头像名称

传参

	无

返回

	nickname              string          郑爽名称
	avatar                string          郑爽头像


	patch http://xxx/zuser

	修改郑爽昵称与头像

传餐

	nickname							string					郑爽名称
	avatar 								string					郑爽头像
	oldpassword                         string                  旧密码
	newpassword							string					新密码
返回

	“sucess” or "failed"

==============================================================

HTTP request
	get http://xxx/zusers/:uid

	获取郑爽的头像名称

传参

	无

返回
	
	nickname			string			明星名字
	avatar 				string       	明星头像
	

==============================================================

HTTP request

	put http://xxx/users

	管理员 禁言或者拉黑粉丝

传参

	status               int              状态（ 1 正常  2 禁言  3 拉黑 ）
	id 					 id 			  被操作的用户ID

返回

	“success”或者“failed”

==============================================================

HTTP request  

	patch   http://xxx/zcomments/:uid

	郑爽点赞用户的评论

	uid    	用户评论的id

传参
	jsonpatch               jsonpatch
	id    		int 		郑爽的 id
	jwt的token


==========================================================
HTTP request

	post http://xxx/report

	举报

传参


	reporter				int				举报人的id
	type					int 			1, 举报 3, 建议 4,投诉
	accused					int				被举报人的id
	data   					string			举报人的举报内容
	targetid				int				举报的评论id
	authtoken 				string			登陆凭证
	authid					int				用户id

返回

	“success”或者“failed”



--------------------------------------------------------------

端口4321


服务端

socket

	消息号
		apply              申请创建房间
	传递
		roomid             房间号

-----------------------------------------------

	消息号
		noway              真爽拒绝聊天请求
	传递
		roomid				房间号

-----------------------------------------------

	消息号
		join			   加入房间
	传递
		roomid				房间号

-----------------------------------------------

    消息号
    	message			   发送消息
    传递
    	msg                消息内容

-----------------------------------------------


客户端

socket

	消息号
		msg                 发送消息

-----------------------------------------------

	消息号
		sys					系统消息

-----------------------------------------------

	消息号
		admin				郑爽监听信息，管理员信息（目前是通知有人申请聊天）

-----------------------------------------------

	消息号
		answer				粉丝段监听，真爽是不是要跟你搞事

===========================================================

HTTP request

	get http://xxx:4321/avatars/:uid

	获取聊天室内用户的信息
		uid                  房间id   
传参
	无

	可选参数
		无

返回


样式
  [{"id":2,"avatar":"2017-04-18_GWQJ9pgO.png","nickname":"南方队的巴登巴"},{"id":3,"avatar":"Adjpg1494389525729.jpg","nickname":"x2017"}]

－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－

HTTP request

	get http://xxx:4321/rooms/:uid

	获取房间信息（是否存在，房主信息）
		uid                  房间id   
传参
	无

	可选参数
		无

返回


样式
	{"exist":1,"owner":{"id":"9879","avatar":"2017-05-17_Zqsu7SlP.png","nickname":"杨"}}

------------------------------------------------------------

HTTP request

	get http://xxx:4321/chatlogs/:uid

	获取聊天记录
		uid                  房间id   
传参
	无

	可选参数
		无

返回


样式
	[{"msg":"好多好多话想说一","user":{"username":"zhenshuang","id":-2,"password":"e10adc3949ba59abbe56e057f20f883e"},"roomid":"444","time":1495098005050},{"msg":"测试结果表明。我","user":{"id":9879,"nickname":"杨","avatar":"2017-05-17_Zqsu7SlP.png","birthday":null,"phonenumber":"18721604931","sex":1,"professional":"-1","address":"xuegao_9879,18721604931,上海市 | 浦东新区,碧波路690号","isdel":1,"status":1,"createtime":"1493040419839","lastlogintime":"1494922996518","lastestlogintime":"1494927423428","tag":0,"token":"110913003ad211e7a43649f3fd269533"},"roomid":"444","time":1495098016424},{"msg":"是啥","user":{"id":3,"nickname":"x2017","avatar":"Adjpg1494389525729.jpg","birthday":"1988-05-12 00:00:00","phonenumber":"13052014786","sex":1,"professional":"CEO","address":"x,13052014786,上海市|浦东新区,dhxjskskskksdxz","isdel":1,"status":1,"createtime":"1491040412055","lastlogintime":"1494912294965","lastestlogintime":"1494913337553","tag":0,"token":"85a6a8f03ad011e7a43649f3fd269533"},"roomid":"444","time":1495100768706},{"msg":"一个风风光光个","user":{"username":"zhenshuang","id":-2,"password":"e10adc3949ba59abbe56e057f20f883e"},"roomid":"444","time":1495100773813},{"msg":"他 v 天 v 天天 v 分 vv 人果然 v 天 v 通过它通过 v 太阳还很远很远","user":{"username":"zhenshuang","id":-2,"password":"e10adc3949ba59abbe56e057f20f883e"},"roomid":"444","time":1495100935664},{"msg":"55","user":{"id":2,"nickname":"南方队的巴登巴","avatar":"2017-04-18_GWQJ9pgO.png","birthday":"1992-04-13 00:00:00","phonenumber":"18205626269","sex":1,"professional":"白领","address":"南方队的巴登巴登,18205626269,吉林省 | 松原市 | 扶余市,负负负负负负","isdel":1,"status":2,"createtime":"1491040312055","lastlogintime":"1494228816752","lastestlogintime":"1494556268025","tag":0,"token":"24cadc1036be11e7924dcf936affe193"},"roomid":"444","time":1495105542282},{"msg":"99","user":{"id":2,"nickname":"南方队的巴登巴","avatar":"2017-04-18_GWQJ9pgO.png","birthday":"1992-04-13 00:00:00","phonenumber":"18205626269","sex":1,"professional":"白领","address":"南方队的巴登巴登,18205626269,吉林省 | 松原市 | 扶余市,负负负负负负","isdel":1,"status":2,"createtime":"1491040312055","lastlogintime":"1494228816752","lastestlogintime":"1494556268025","tag":0,"token":"24cadc1036be11e7924dcf936affe193"},"roomid":"444","time":1495105550009}]

-----------------------------------------------------------

HTTP request

	get http://xxx:4321/sockets/:uid

	获取房间人数
		uid                  房间id   
传参
	无

	可选参数
		无

返回
	

样式
	{"population":1}



