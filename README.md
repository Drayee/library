iot工作室考核项目

I administer 图书馆管理系统
 1.前端发送post请求后，后端接受post请求
   请求action非login -> 接受动态cookie与webmethod中的uniquecode对比 -> 不相同 -> 刷新主页 
                                                                  -> 相同 -> 判断action中的操作然后对mysql数据库进行增删改查 -> 返回json格式的response -> 前端进行处理
                     -> 验证用户与密码是否正确 -> 正确 -> 发送cookie,cookie为动态的uniquecode,并将uniquecode赋给webmethod的uniquecode
                                             -> 不正确 -> 主页重定向到主页
  2.后端的结果传递方式：
    user通过map[]传递
    book通过detail[](记录)传递
    borrow通过book[](记录)传递

II user(home) 用户操作系统
    请求post请求
     登录 重定向到login 携带post参数
     注册 重定向到regist 携带post参数
      后端接受后重定向到home携带uniquecode 而且会携带用户信息

III 未体现(没有前端交互)
  借书 还书
  在library中有lend return的方法
 
