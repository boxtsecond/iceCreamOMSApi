##
- 登录页
    - 登录按钮：post Fans/login 
        - @params: phonenumber: string, password: String
        - @return: 
            1. 2000 success
            2. 4006 账号密码错误
    - 点击其它区域 get Fans/:phonenumber/exist
        - @return: 
            1. 2000 success {result: boolean}
- 重置密码
    - 获取验证码：post Message/index
        - @params: phonenumber: string, register: boolean(false)
        - @return:
            1. 2000 success
            2. 4000 请输入正确的手机号
            3. 2001 手机号码已存在 (此场景不会出现)
    - 登录按钮：post Fans/register
        - @params: phonenumber: String, code: String, password: String
        - @return:
            1. 2000 success
            2. 4000
            3. 4006 账号验证码错误
- 注册页
    - 获取验证码： post Message/index
        - @params: phonenumber: string, register: boolean(true)
        - @return:
            1. 2000 success
            2. 4000 请输入正确的手机号
            3. 2001 手机号码已存在
    - 登录按钮： post Fans/register
        - @params: phonenumber: String, code: String, password: String
        - @return:
            1. 2000 success
            2. 4000
            3. 4006 账号验证码错误
- 快速登录页
    - 获取验证码： post Message/index
        - @params: phonenumber: string, register: boolean(false)
        - @return:
            1. 2000 success
            2. 4000 请输入正确的手机号
            3. 2001 手机号码已存在 (此场景不会出现)
    - 登录按钮： post Fans/loginWithCode （同旧Api Fans/login）
        - @params: phonenumber: String, code: String
        - @return:
            1. 2000 success