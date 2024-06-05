---
title: Filter和Listener总结
date: 2020-04-09
tags: 
 - JSP
 - Java
categories:
 - JavaWeb
---


# Filter和Listener总结

## Filter

### Filter 概述

Filter 表示过滤器，是 JavaWeb 三大组件（Servlet、Filter、Listener）之一。

过滤器可以把对资源的请求 **拦截** 下来，从而实现一些特殊的功能。

如下图所示，浏览器原本可以无限制访问服务器上的所有的资源（servlet、jsp、html等）：

![](./assets/553.png)

而在访问到这些资源之前可以使过滤器拦截来下，也就是说在访问资源之前会先经过 Filter，如下图：

![](./assets/554.jpg)

拦截器拦截到后可以做什么功能呢？

**过滤器一般完成一些通用的操作**。比如每个资源都要写一些代码完成某个功能，我们为了提高代码复用率、减少冗余，可以将这些代码写在过滤器中，因为请求每一个资源都要经过过滤器。

### Filter 的常见应用场景

- 后台页面的访问过滤、权限控制

- 中文参数处理（字符集编码处理）
- 过滤敏感词汇
- 请求的 **预** 处理以及请求的 **后** 处理

### 如何创建 Filter

1. 定义类，实现 Filter接口，并重写其所有方法：

   ```java
   public class FilterDemo implements Filter {
       pubLic void init(FilterConfig filterConfig) {}
       pubLic void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {}
       public void destroy() {}
   }
   ```

2. 配置 Filter 拦截资源的路径：在类上定义 `@WebFilter` 注解（也可以在 web.xml 中进行路径配置）。而注解的 `value` 属性值 `/*` 表示拦截所有的资源：

   ```java
   @WebFileter("/*")
   public class FilterDemo implements Filter {}
   ```

3. 在 doFilter() 方法中输出一句话，并放行：

   ```java
   pubLic void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
       System.out.println("filter 被执行了...");
       //放行
       chain.doFilter(request,response);
   }
   ```

上述代码中的 `chain.doFilter(request,response);` 就是放行，也就是让其访问本该访问的资源。

### Filter 的 web.xml 配置方法

在 `web.xml` 中进行 filter 的配置，和 Servlet 的配置很类似。

- 过滤所有的访问请求：

  ```xml
  <url-pattern>/*</url-pattern>
  ```

- 只过滤 JSP：

  ```xml
  <url-pattern>*.jsp</url-pattern>
  ```

- 配置文件具体方式：

  ```xml
  <filter>
  	<filter-name></filter-name>
  	<filter-class></filter-class>
  </filter>
  
  <filter-mapping>
  	<filter-name></filter-name>
  	<url-pattern></url-pattern>
  </filter-mapping>
  ```

- 给过滤器添加参数：

  ```xml
  <init-param>
  	<param-name></param-name>
      <param-value></param-value>
  </init-param>
  ```

- 过滤器的 dispatcher（配置到 servletmapping 里面）：

  ```xml
  <dispatcher>REQUEST</dispatcher>
  
  <dispatcher>INCLUDE</dispatcher>
  
  <dispatcher>FORWARD</dispatcher>
  
  <dispatcher>ERROR</dispatcher>
  ```

### Filter 执行流程

访问对应资源，资源访问完成后，进程会回到 Filter 中，并且会回到 **放行后逻辑**，执行该部分代码。

通过上述的说明，我们就可以总结 Filter 的执行流程如下：

![](./assets/570.png)

以后我们可以将对请求进行处理的代码放在放行之前进行处理，而如果请求完资源后还要对响应的数据进行处理，则可以在放行后进行逻辑处理。

### Filter 的拦截路径配置

拦截路径表示 Filter 会对请求的哪些资源进行拦截，使用 `@WebFilter` 注解进行配置。如：`@WebFilter("拦截路径")` 

拦截路径有如下四种配置方式：

* 拦截具体的资源：/index.jsp：只有访问 index.jsp 时才会被拦截
* 目录拦截：/user/*：访问 /user 下的所有资源，都会被拦截
* 后缀名拦截：*.jsp：访问后缀名为jsp的资源，都会被拦截
* 拦截所有：/*：访问所有资源，都会被拦截

不难发现拦截路径的配置方式和 `Servlet` 的请求资源路径配置方式一样，但是表示的含义不同。

### 过滤器链

过滤器链是指在一个 Web 应用，可以配置多个过滤器，这多个过滤器称为过滤器链。

如下图就是一个过滤器链，我们学习过滤器链主要是学习过滤器链执行的流程：

![](./assets/571.png)

上图中的过滤器链执行是按照以下流程执行：

1. 执行 `Filter1` 的放行前逻辑代码
2. 执行 `Filter1` 的放行代码
3. 执行 `Filter2` 的放行前逻辑代码
4. 执行 `Filter2` 的放行代码
5. 访问到资源
6. 执行 `Filter2` 的放行后逻辑代码
7. 执行 `Filter1` 的放行后逻辑代码

以上流程串起来就像一条链子，故称之为过滤器链。

**注意**：

使用 **注解** 配置 Filter 时，这种配置方式的优先级是按照过滤器类名（字符串）的自然排序。

比如有如下两个名称的过滤器 ： `BFilterDemo` 和 `AFilterDemo` 。那一定是 `AFilterDemo` 过滤器先执行。

使用 **web.xml** 配置时，则按照配置的顺序来执行。

## Listener

### Listener 概述

Listener 表示监听器，是 JavaWeb 三大组件（Servlet、Filter、Listener）之一。

监听器可以监听 `application`，`session`，`request` 三个对象的创建、销毁或者往其中添加修改删除属性等事件。

当这些事件发生时，监听器可以自动执行一些代码。

request 和 session 我们学习过，而 `application` 是 ServletContext 类型的对象。

ServletContext 代表整个 Web 应用，在服务器启动的时候，Tomcat 会自动创建该对象，在服务器关闭时会自动销毁该对象。

### Listener 的常见应用场景

- 统计在线人数

- Web 应用启动起来的时候用来做一些初始化的工作

### Listener 的分类

JavaWeb 提供了8个监听器：

| 分类               | 名称                            | 作用                                           |
| ------------------ | ------------------------------- | ---------------------------------------------- |
| ServletContext监听 | ServletContextListener          | 用于对ServletContext对象进行监听（创建、销毁） |
|                    | ServletContextAttributeListener | 对ServletContext对象中属性的监听（增删改属性） |
| Session监听        | HttpSessionListener             | 对Session对象的整体状态的监听（创建、 销毁）   |
|                    | HttpSessionAttributeListener    | 对Session对象中的属性监听（增删改属性）        |
|                    | HttpSessionBindingListener      | 监听对象于Session的绑定和解除                  |
|                    | HttpSessionActivationListener   | 对Session数据的钝化和活化的监听                |
| Request监听        | ServletRequestListener          | 对Request对象进行监听（创建、销毁）            |
|                    | ServletRequestAttributeListener | 对Request对象中属性的监听（增删改属性）        |

这里面只有 `ServletContextListener` 这个监听器后期我们会接触到，`ServletContextListener` 是用来监听 ServletContext 对象的创建和销毁。

`ServletContextListener` 接口中有以下两个方法

* `void contextInitialized(ServletContextEvent sce)`：ServletContext 对象被创建了会自动执行的方法
* `void contextDestroyed(ServletContextEvent sce)`：ServletContext 对象被销毁时会自动执行的方法

### 如何创建 Listener

* 定义一个类，实现`ServletContextListener` 接口
* 重写所有的抽象方法
* 使用 `@WebListener` 进行配置（或者在 web.xml 中配置）
