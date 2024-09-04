---
title: JSP总结
date: 2020-03-20
tags: 
 - JSP
categories:
 - JavaWeb
---

::: tip 

**JSP**（全称**J**ava**S**erver **P**ages）是一种动态网页技术标准。JSP 部署于网络服务器上，可以响应客户端发送的请求，并根据请求内容动态地生成 HTML、XML 或其他格式文档的 Web 网页，然后返回给请求者。

:::
# JSP总结

## Java Web 和 Java EE 的区别

- Java Web 就是以 Java 语言为基础，使用 JSP 和 Servlet 来开发 Web 程序。Web 程序简单理解就是我们平时说的网站。
- JavaEE 是 Java 的企业级应用，里面包含的功能比较多。JavaEE 是个大杂烩，包括 Applet、EJB、JDBC、JNDI、Servlet、JSP 等技术的标准，运行在一个完整的应用服务器上，用来开发大规模、分布式、健壮的网络应用。这里的网络应用也可以理解为我们平时使用的网站。
- 可以粗略地认为 JavaWeb 就是 JavaEE 的一部分，是成为 JavaEE 大师过程中的第一站。
- 使用 JavaEE 开发的应用
  - 国内：淘宝，京东，工行的网银，12306  ...
  - 国外：Twitter，Minecraft，Hadoop  …

## 学习 Java Web 首先要学习的技术

- JSP 和 Servlet 前置技术
- 前端技术：HTML、CSS、JavaScript
- 编程技术：Java 语言编程
- 数据库：MySQL、Oracle、SQL Server

- 后续学习：
  - SSM、SSH框架
  - SSM：Spring+SpringMVC+MyBatis
  - SSH：Spring+Struts+Hibernate

## Java Web开发需要的软件

1. JDK 8
2. Eclipse IDE For Java EE（或者选择IntelliJ IDEA）
3. Tomcat 8.5 9（32还是64位根据自己的电脑来选择）

## Tomcat 的作用

- Eclipse编写代码--->.Java--->jdk---->.class--->jre运行
- Eclipse编写代码--->.JSP/servlet-->tomcat运行

- 当在一台机器上配置好 Apache 服务器，可利用它响应对 HTML 页面的访问请求。实际上 Tomcat 部分是 Apache 服务器的扩展，但它是独立运行的，所以当你 Apache Tomcat 运行 Tomcat 时，它实际上作为一个与 Apache 独立的进程单独运行的。

## JSP 简介

- JSP 全称是 Java Server Pages：Java 服务端页面。它是一种动态的网页技术，其中既可以定义 HTML、JS、CSS 等静态内容，还可以定义 Java代码的动态内容，也就是说 `JSP = HTML + Java`。如下就是 JSP 代码：

  ```jsp
  <html>
      <head>
          <title>Title</title>
      </head>
      <body>
          <h1>JSP,Hello World</h1>
          <%
          	System.out.println("hello,JSP~");
          %>
      </body>
  </html>
  ```

  上面代码 `h1` 标签内容是展示在页面上，而 Java 的输出语句是输出在 idea 的控制台。

- JSP 一般用来开发动态页面。静态页面上的内容（文字、图片）是不改变的。Web前端工程师开发出来后的页面就是一个静态页面，后端人员需要把静态页面变成动态页面。

## 怎么在 JSP 页面上写 Java 代码

- 可以多次使用`<% %>`

- JSP内容输出表达式`<%= %>`
- JSP定义表达式`<%! %>`	

- JSP中 Java 代码可以和页面 html 代码组合使用

- 成员变量和局部变量：一个 JSP 对应一个Java类，运行的时候，一个 JSP 会创建一个对应的 Java 对象。
- 注释`<%--  --%>`不起任何实际作用，还可以用来注释`<% %>`，在Java代码中依然可以使用 Java 支持的注释

- JSP中引入Java类

  ```jsp
  <%@page import="Java.util.Random"%>
  <%@page import="Java.util.Random,Java.text.*"%>
  ```


## 什么是 JSP 的内置对象

- 不需要声明，不需要创建，就可以直接使用的对象，就是内置对象。

- JSP有九大内置对象，常用的有 request，response，out。一个请求对应一个 request。

- page是 JSP  页面对应的类对象

  ```
  pageContext
  pageContext.forward("xxx.JSP");
  pageContext.include("xxx.JSP");
  pageContext.getRequest getResponse get..
  ```

- session 代表会话

- session request 的生命周期：

  session对象在关闭浏览器，或者到达有效时间（长时间不操作网站）时，会被销毁。

- application web容器的生命周期：

  网站启动起来，创建一个applition，当网站关闭后，application被销毁。一个web应用只有一个application对象。

## page和pageContext内置对象

- page 就是this当前对象

- page 的作用域只在当前页面有效，如果JSP页面发生了请求转发的话，当前页面的page对象就不见了

- 四大域对象：page、request、session、application

  - page域：共享的值只能在本页面进行获取；

  - request域：共享的值在跳转页能够获取；

  - session域：在session不过期的情况下，一直可以获取session内的键值对，浏览器关闭开启session就重新创建；

  - application域：这个共享的值在服务器上一直存在，随时都可以获取，直到服务器重启，如果设置过多的application，会影响服务器性能。

- 作用域：page<request<session<application

- pageContext对象是JSP中很重要的一个内置对象，不过在一般的JSP程序中，很少用到它。它是javax.servlet.jsp.PageContext类的实例对象，可以使用PageContext类的方法。

- 实际上，pageContext 对象提供了对JSP页面所有的对象及命名空间的访问。

## web.xml

- 在创建项目的时候生成（推荐）

- 首页的默认配置

## JSP include指令

- JSP include 指令用于通知 JSP 引擎在翻译当前 JSP 页面时，将其他文件中的内容合并进当前 JSP 页面转换成的 Servlet 源文件中，这种在源文件级别进行引入的方式，称为静态引入，当前 JSP 页面与静态引入的文件紧密结合为一个 Servlet。这些文件可以是 JSP 页面、HTML 页面、文本文件或是一段 Java 代码。其语法格式如下：

  ```jsp
  <%@ include file="relativeURL|absoluteURL" %>
  ```

## 客户端的路径问题

- `<%=request.getContextPath()%>`可返回站点的根路径，也就是项目的虚拟路径

- 实际应用中，一般用来解决JSP测试和生产环境路径不同的问题

  ```jsp
  <%
   String appContext = request.getContextPath();
   String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+appContext; 
  %>
  ```

- 在页面跳转的过程中客户端的相对路径容易不生效，无法被正确找到，所以开发过程中一般不会使用相对路径

## JSP 的缺点

由于 JSP页面内，既可以定义 HTML 标签，又可以定义 Java代码，造成了以下问题：

* 书写麻烦，特别是针对复杂的页面，既要写 HTML 标签，还要写 Java 代码。

* 阅读麻烦，后期再看 JSP 代码时还需要花费很长的时间去梳理。

* 复杂度高，运行需要依赖于各种环境：JRE，JSP容器，JavaEE……

* 占内存和磁盘，JSP会自动生成 .java 和 .class 文件占磁盘，运行的是 .class 文件占内存

* 调试困难，出错后需要找到自动生成的 .java 文件才能进行调试

* 不利于团队协作，前端人员不会 Java，后端人员不精 HTML，如果页面布局发生变化，需要前端工程师对静态页面进行修改，然后再交给后端工程师，由后端工程师最终将该页面改为 JSP 页面


由于上述的问题， **JSP 已逐渐退出历史舞台**，后来开发更多的是使用 **HTML +  Ajax** 来替代。

Ajax 是我们后续会重点学习的技术，有个这个技术后，前端工程师负责前端页面开发，而后端工程师只负责前端代码开发。

技术的发展历程：

![](./assets/491.png)

1. 第一阶段：使用 servlet 既要实现逻辑代码编写，也要对页面进行拼接。

2. 第二阶段：随着技术的发展，出现了 JSP ，人们发现 JSP 使用起来比 Servlet 方便很多，但是还是要在 JSP 中嵌套 Java 代码，也不利于后期的维护

3. 第三阶段：使用 servlet 进行逻辑代码开发，而使用 JSP 进行数据展示

   ![](./assets/492.png)

4. 第四阶段：使用 servlet 进行后端逻辑代码开发，而使用 HTML 进行数据展示，由于 HTML 是静态页面，所以要利用 ajax 进行进行动态数据展示。

那既然 JSP 已经逐渐的退出历史舞台，那我们为什么还要学习 JSP 呢？原因有两点：

* 一些公司可能有些老项目还在用 JSP ，所以要求我们必须动 JSP
* 我们如果不经历这些复杂的过程，就不能体现后面阶段开发的简单
