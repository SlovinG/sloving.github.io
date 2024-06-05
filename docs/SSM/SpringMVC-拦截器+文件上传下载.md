---
title: SpringMVC-拦截器+文件上传下载
date: 2020-04-30
tags: 
 - SSM 
 - Spring
 - SpringMVC
categories:
 - SSM
---

::: tip 什么是拦截器

SpringMVC 的处理器拦截器类似于Servlet开发中的过滤器 Filter，用于对处理器进行预处理和后处理。开发者可以自己定义一些拦截器来实现特定的功能。

:::

# SpringMVC-拦截器+文件上传下载

## 一、拦截器

### 1. 拦截器的概述

![](./assets/016.png)

- 拦截器（Interceptor）是一种动态拦截方法调用的机制，在 SpringMVC 中动态拦截控制器方法的执行
- 作用：
  1. 在指定的方法调用前后执行预先设定的代码
  2. 阻止原始方法的执行
  3. 总结：增强
- 核心原理：AOP 思想

### 2. 拦截器和过滤器的区别

- 归属不同：Filter 属于 Servlet 技术，Interceptor 属于 SpringMVC 技术
- 拦截内容不同：Filter 对所有访问进行增强，Interceptor 仅针对 SpringMVC 的访问进行增强

<img src="./assets/017.png" alt="image-20210805175539717" style="zoom: 33%;" />

## 二、自定义拦截器

**注意：想要自定义拦截器，必须实现 HandlerInterceptor 接口。**

1. 新建一个Moudule，springmvc-07-Interceptor，添加 web 支持

2. 配置 web.xml 和 springmvc-servlet.xml 文件

3. 编写一个拦截器

   ```java
   package com.kuang.interceptor;
   
   import org.springframework.web.servlet.HandlerInterceptor;
   import org.springframework.web.servlet.ModelAndView;
   
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   
   public class MyInterceptor implements HandlerInterceptor {
   
      //在请求处理的方法之前执行
      //如果返回 true 就执行下一个拦截器
      //如果返回 false 就不执行下一个拦截器
      public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
          System.out.println("------------处理前------------");
          return true;
     }
   
      //在请求处理方法执行之后执行
      //注意：如果处理器方法出现异常了，该方法不会执行
      public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
          System.out.println("------------处理后------------");
     }
   
      //在 dispatcherServlet 处理后执行,做清理工作
      //注意：无论处理器方法内部是否出现异常，该方法都会执行
      public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
          System.out.println("------------清理------------");
     }
   }
   ```

4. 在 springmvc 的配置文件中配置拦截器

   ```xml
   <!--关于拦截器的配置-->
   <mvc:interceptors>
      <mvc:interceptor>
          <!--/** 包括路径及其子路径-->
          <!--/admin/* 拦截的是/admin/add等等这种 , /admin/add/user不会被拦截-->
          <!--/admin/** 拦截的是/admin/下的所有-->
          <mvc:mapping path="/**"/>
          <!--bean配置的就是拦截器-->
          <bean class="com.kuang.interceptor.MyInterceptor"/>
      </mvc:interceptor>
   </mvc:interceptors>
   ```

5. 编写一个 Controller，接收请求

   ```java
   package com.kuang.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   import org.springframework.web.bind.annotation.ResponseBody;
   
   //测试拦截器的控制器
   @Controller
   public class InterceptorController {
   
      @RequestMapping("/interceptor")
      @ResponseBody
      public String testFunction() {
          System.out.println("控制器中的方法执行了");
          return "hello";
     }
   }
   ```

6. 前端 index.jsp

   ```jsp
   <a href="${pageContext.request.contextPath}/interceptor">拦截器测试</a>
   ```

7. 启动 Tomcat 测试一下！

<img src="./assets/93.png" style="zoom:50%;" />

## 三、验证用户是否登录（认证用户）

### 实现思路

1. 有一个登陆页面，需要写一个 controller 访问页面
2. 登陆页面有一提交表单的动作，需要在 controller 中处理，判断用户名密码是否正确，如果正确，向 session 中写入用户信息，返回登陆成功
3. 拦截用户请求，判断用户是否登陆，如果用户已经登陆，放行， 如果用户未登陆，跳转到登陆页面

### 测试

1. 编写一个登陆页面 login.jsp

   ```jsp
   <%@ page contentType="text/html;charset=UTF-8" language="java" %>
   <html>
       <head>
           <title>Title</title>
       </head>
       <h1>登录页面</h1>
       <hr>
       <body>
           <form action="${pageContext.request.contextPath}/user/login">
               用户名：<input type="text" name="username"> <br>
               密码：<input type="password" name="pwd"> <br>
               <input type="submit" value="提交">
           </form>
       </body>
   </html>
   ```

2. 编写一个 Controller 处理请求

   ```java
   package com.kuang.controller;
   
   import org.springframework.stereotype.Controller;
   import org.springframework.web.bind.annotation.RequestMapping;
   
   import javax.servlet.http.HttpSession;
   
   @Controller
   @RequestMapping("/user")
   public class UserController {
   
      //跳转到登陆页面
      @RequestMapping("/jumplogin")
      public String jumpLogin() throws Exception {
          return "login";
     }
   
      //跳转到成功页面
      @RequestMapping("/jumpSuccess")
      public String jumpSuccess() throws Exception {
          return "success";
     }
   
      //登陆提交
      @RequestMapping("/login")
      public String login(HttpSession session, String username, String pwd) throws Exception {
          // 向session记录用户身份信息
          System.out.println("接收前端==="+username);
          session.setAttribute("user", username);
          return "success";
     }
   
      //退出登陆
      @RequestMapping("logout")
      public String logout(HttpSession session) throws Exception {
          // session 过期
          session.invalidate();
          return "login";
     }
   }
   ```

3. 编写一个登陆成功的页面 success.jsp

   ```jsp
   <%@ page contentType="text/html;charset=UTF-8" language="java" %>
   <html>
       <head>
           <title>Title</title>
       </head>
       <body>
           <h1>登录成功页面</h1>
           <hr>
           ${user}
           <a href="${pageContext.request.contextPath}/user/logout">注销</a>
       </body>
   </html>
   ```

4. 在 index 页面上测试跳转！启动 Tomcat 测试，未登录也可以进入主页！

   ```jsp
   <%@ page contentType="text/html;charset=UTF-8" language="java" %>
   <html>
       <head>
           <title>$Title$</title>
       </head>
       <body>
           <h1>首页</h1>
           <hr>
           <%--登录--%>
           <a href="${pageContext.request.contextPath}/user/jumplogin">登录</a>
           <a href="${pageContext.request.contextPath}/user/jumpSuccess">成功页面</a>
       </body>
   </html>
   ```

5. 编写用户登录拦截器

   ```java
   package com.kuang.interceptor;
   
   import org.springframework.web.servlet.HandlerInterceptor;
   import org.springframework.web.servlet.ModelAndView;
   
   import javax.servlet.ServletException;
   import javax.servlet.http.HttpServletRequest;
   import javax.servlet.http.HttpServletResponse;
   import javax.servlet.http.HttpSession;
   import java.io.IOException;
   
   public class LoginInterceptor implements HandlerInterceptor {
   
      public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws ServletException, IOException {
          // 如果是登陆页面则放行
          System.out.println("uri: " + request.getRequestURI());
          if (request.getRequestURI().contains("login")) {
              return true;
         }
   
          HttpSession session = request.getSession();
   
          // 如果用户已登陆也放行
          if(session.getAttribute("user") != null) {
              return true;
         }
   
          // 用户没有登陆跳转到登陆页面
          request.getRequestDispatcher("/WEB-INF/jsp/login.jsp").forward(request, response);
          return false;
     }
   
      public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
   
     }
      
      public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
   
     }
   }
   ```

6. 在 Springmvc 的配置文件中注册拦截器

   ```xml
   <!--关于拦截器的配置-->
   <mvc:interceptors>
      <mvc:interceptor>
          <mvc:mapping path="/**"/>
          <bean id="loginInterceptor" class="com.kuang.interceptor.LoginInterceptor"/>
      </mvc:interceptor>
   </mvc:interceptors>
   ```

7. 再次重启 Tomcat 测试！

   OK，测试登录拦截功能无误。

## 四、多个拦截器工作流程分析

- 当配置多个拦截器时，会形成拦截器链
- 拦截器链的运行顺序会参照拦截器的添加顺序
- 当拦截器中出现对原始处理器的拦截，后面的拦截器均终止运行
- 当拦截器运行中断，仅运行配置在前面的拦截器的 afterCompletion 操作

![image-20210805181537718](./assets/043.jpg)

## 五、文件上传和下载概述

### 准备工作

文件上传是项目开发中最常见的功能之一，SpringMVC 可以很好的支持文件上传，但是 SpringMVC 上下文中默认没有装配MultipartResolver，因此默认情况下其不能处理文件上传工作。如果想使用 Spring 的文件上传功能，则需要在上下文中配置MultipartResolver。

前端表单要求：为了能上传文件，必须将表单的 method 设置为POST，并将 enctyp e设置为 multipart/form-data。只有在这样的情况下，浏览器才会把用户选择的文件以二进制数据发送给服务器；

### 对表单中的 enctype 属性做个详细的说明：

- `application/x-www=form-urlencoded`：默认方式，只处理表单域中的 value 属性值，采用这种编码方式的表单会将表单域中的值处理成 URL 编码方式。
- `multipart/form-data`：这种编码方式会以二进制流的方式来处理表单数据，这种编码方式会把文件域指定文件的内容也封装到请求参数中，不会对字符编码。
- `text/plain`：除了把空格转换为 "+" 号外，其他字符都不做编码处理，这种方式适用直接通过表单发送邮件。

```html
<form action="" enctype="multipart/form-data" method="post">
   <input type="file" name="file"/>
   <input type="submit">
</form>
```

一旦设置了 enctype 为 multipart/form-data，浏览器即会采用二进制流的方式来处理表单数据，而对于文件上传的处理则涉及在服务器端解析原始的 HTTP 响应。在2003年，Apache Software Foundation发布了开源的Commons FileUpload组件，其很快成为Servlet/JSP程序员上传文件的最佳选择。

- Servlet3.0规范已经提供方法来处理文件上传，但这种上传需要在Servlet中完成。
- 而Spring MVC则提供了更简单的封装。
- Spring MVC为文件上传提供了直接的支持，这种支持是用即插即用的MultipartResolver实现的。
- Spring MVC使用Apache Commons FileUpload技术实现了一个MultipartResolver实现类：
- CommonsMultipartResolver。因此，<font color='red'>SpringMVC的文件上传还需要依赖Apache Commons FileUpload的组件。</font>

## 六、文件上传

1、导入文件上传的jar包，commons-fileupload ， Maven会自动帮我们导入他的依赖包 commons-io包；

```xml
<!--文件上传-->
<dependency>
   <groupId>commons-fileupload</groupId>
   <artifactId>commons-fileupload</artifactId>
   <version>1.3.3</version>
</dependency>
<!--servlet-api导入高版本的-->
<dependency>
   <groupId>javax.servlet</groupId>
   <artifactId>javax.servlet-api</artifactId>
   <version>4.0.1</version>
</dependency>
```

2、配置 bean：multipartResolver

【**注意！！！这个bena的id必须为：multipartResolver ， 否则上传文件会报400的错误！在这里栽过坑,教训！**】

```xml
<!--文件上传配置-->
<bean id="multipartResolver"  class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
   <!-- 请求的编码格式，必须和jSP的pageEncoding属性一致，以便正确读取表单的内容，默认为ISO-8859-1 -->
   <property name="defaultEncoding" value="utf-8"/>
   <!-- 上传文件大小上限，单位为字节（10485760=10M） -->
   <property name="maxUploadSize" value="10485760"/>
   <property name="maxInMemorySize" value="40960"/>
</bean>
```

CommonsMultipartFile 的 常用方法：

- **String getOriginalFilename()：获取上传文件的原名**
- **InputStream getInputStream()：获取文件流**
- **void transferTo(File dest)：将上传文件保存到一个目录文件中**

 我们去实际测试一下

3、编写前端页面

```html
<form action="/upload" enctype="multipart/form-data" method="post">
 <input type="file" name="file"/>
 <input type="submit" value="upload">
</form>
```

4、**Controller**

```java
package com.kuang.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.commons.CommonsMultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.*;

@Controller
public class FileController {
   //@RequestParam("file") 将name=file控件得到的文件封装成CommonsMultipartFile 对象
   //批量上传CommonsMultipartFile则为数组即可
   @RequestMapping("/upload")
   public String fileUpload(@RequestParam("file") CommonsMultipartFile file , HttpServletRequest request) throws IOException {

       //获取文件名 : file.getOriginalFilename();
       String uploadFileName = file.getOriginalFilename();

       //如果文件名为空，直接回到首页！
       if ("".equals(uploadFileName)){
           return "redirect:/index.jsp";
      }
       System.out.println("上传文件名 : "+uploadFileName);

       //上传路径保存设置
       String path = request.getServletContext().getRealPath("/upload");
       //如果路径不存在，创建一个
       File realPath = new File(path);
       if (!realPath.exists()){
           realPath.mkdir();
      }
       System.out.println("上传文件保存地址："+realPath);

       InputStream is = file.getInputStream(); //文件输入流
       OutputStream os = new FileOutputStream(new File(realPath,uploadFileName)); //文件输出流

       //读取写出
       int len=0;
       byte[] buffer = new byte[1024];
       while ((len=is.read(buffer))!=-1){
           os.write(buffer,0,len);
           os.flush();
      }
       os.close();
       is.close();
       return "redirect:/index.jsp";
  }
}
```

5、测试上传文件，OK！



**采用 file.Transto 来保存上传的文件**

1、编写Controller

```java
/*
* 采用file.Transto 来保存上传的文件
*/
@RequestMapping("/upload2")
public String  fileUpload2(@RequestParam("file") CommonsMultipartFile file, HttpServletRequest request) throws IOException {

   //上传路径保存设置
   String path = request.getServletContext().getRealPath("/upload");
   File realPath = new File(path);
   if (!realPath.exists()){
       realPath.mkdir();
  }
   //上传文件地址
   System.out.println("上传文件保存地址："+realPath);

   //通过CommonsMultipartFile的方法直接写文件（注意这个时候）
   file.transferTo(new File(realPath +"/"+ file.getOriginalFilename()));

   return "redirect:/index.jsp";
}
```

2、前端表单提交地址修改

3、访问提交测试，OK！

## 七、文件下载

### 文件下载步骤

1、设置 response 响应头

2、读取文件 -- InputStream

3、写出文件 -- OutputStream

4、执行操作

5、关闭流 （先开后关）

### 代码实现

```java
@RequestMapping(value="/download")
public String downloads(HttpServletResponse response ,HttpServletRequest request) throws Exception{
   //要下载的图片地址
   String  path = request.getServletContext().getRealPath("/upload");
   String  fileName = "基础语法.jpg";

   //1、设置response 响应头
   response.reset(); //设置页面不缓存,清空buffer
   response.setCharacterEncoding("UTF-8"); //字符编码
   response.setContentType("multipart/form-data"); //二进制传输数据
   //设置响应头
   response.setHeader("Content-Disposition",
           "attachment;fileName="+URLEncoder.encode(fileName, "UTF-8"));

   File file = new File(path,fileName);
   //2、 读取文件--输入流
   InputStream input=new FileInputStream(file);
   //3、 写出文件--输出流
   OutputStream out = response.getOutputStream();

   byte[] buff =new byte[1024];
   int index=0;
   //4、执行 写出操作
   while((index= input.read(buff))!= -1){
       out.write(buff, 0, index);
       out.flush();
  }
   out.close();
   input.close();
   return null;
}
```

前端

```html
<a href="/download">点击下载</a>
```

测试，文件下载OK，可以和我们之前学习的 JavaWeb 原生的方式对比一下，就可以知道这个便捷多了!
