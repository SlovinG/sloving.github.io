---
title: Servlet总结
date: 2020-03-22
tags: 
 - Servlet
categories:
 - JavaWeb
---

# Servlet总结

## Servlet 简介

Servlet（Server Applet）是 Java Servlet的简称，称为小服务程序或服务连接器，是用 Java编写的服务器端程序，具有独立于平台和协议的特性，主要功能在于交互式地浏览和生成数据，生成动态 Web 内容。

Servlet 是 JavaWeb 最为核心的内容，它是 Java 提供的一门 **动态** web资源开发技术。

使用 Servlet 就可以实现：根据不同的登录用户在页面上动态显示不同内容。

Servlet 是 JavaEE 规范之一，其实就是一个接口，将来我们需要定义 Servlet 类实现 Servlet 接口，并由 Web 服务器运行 Servlet。

![465](./assets/465.png)

## Servlet 和 JSP 的关系

如果一个 jsp 页面只是用来单纯地处理逻辑，而不用做页面显示的话，这个时候可以把这个请求交给 Servlet 来处理。

## Servlet 快速入门

需求分析：编写一个 Servlet 类，并使用 IDEA 中 Tomcat 插件进行部署，最终通过浏览器访问所编写的 Servlet 程序。

实现步骤：

1. 创建 Web 项目 `web-demo`，导入 Servlet 依赖坐标：

   此处需要添加 `<scope>provided</scope>` 标签。

   provided 指的是在编译和测试过程中有效，最后生成的 war 包时不会加入。

   因为 Tomcat 的 lib 目录中已经有 servlet-api 这个 jar 包，如果在生成 war 包的时候生效，就会和 Tomcat 中的 jar 包起冲突，导致报错。

```xml
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>
```

2. 创建：定义一个类 ServletDemo1，实现 Servlet 接口，并重写接口中所有方法，并在 service 方法中输入一句话

```java
package com.itheima.web;

import javax.servlet.*;
import java.io.IOException;

public class ServletDemo1 implements Servlet {
    
    public void service(ServletRequest servletRequest, ServletResponse servletResponse) throws ServletException, IOException {
        System.out.println("servlet hello world~");
    }
    
    public void init(ServletConfig servletConfig) throws ServletException {
        
    }
    
    public ServletConfig getServletConfig() {
        return null;
    }
    
    public String getServletInfo() {
        return null;
    }
    
    public void destroy() {
        
    }
}
```

3. 配置：在类 ServletDemo1 上使用 **@WebServlet** 注解，配置该 Servlet 的访问路径

```java
@WebServlet("/demo1")
```

4. 访问：启动 Tomcat，浏览器中输入 URL 地址访问该 Servlet

```
http://localhost:8080/web-demo/demo1
```

5. 浏览器访问后，在控制台会打印 `servlet hello world~` 说明 Servlet 程序已经成功运行。

至此，Servlet 的入门案例就已经完成。

## Servlet 执行流程

Servlet 程序已经能正常运行，但是我们需要思考一个问题：我们并没有创建 ServletDemo1 类的对象，也没有调用对象中的 service 方法，为什么在控制台就打印了 `servlet hello world~` 这句话呢？

要想回答上述问题，我们就需要了解 Servlet 的执行流程：

![](./assets/500.png)

1. 浏览器发出 `http://localhost:8080/web-demo/demo1` 请求，从请求中可以解析出三部分内容，分别是 `localhost:8080`、`web-demo`、`demo1`
   - 根据 `localhost:8080` 可以找到要访问的 Tomcat Web 服务器。
   - 根据 `web-demo` 可以找到部署在 Tomcat 服务器上的 web-demo 项目。
   - 根据 `demo1` 可以找到要访问的是项目中的哪个 Servlet 类，根据 @WebServlet 后面的值进行匹配。

2. 找到 ServletDemo1 这个类后，Tomcat Web 服务器就会为 ServletDemo1 这个类创建一个对象，然后调用对象中的 service 方法
   - ServletDemo1 实现了 Servlet 接口，所以类中必然会重写 service 方法供 Tomcat Web 服务器进行调用。
   - service 方法中有 ServletRequest 和 ServletResponse 两个参数，ServletRequest 封装的是请求数据，ServletResponse 封装的是响应数据，后期我们可以通过这两个参数实现前后端的数据交互。

了解了 Servlet 的执行流程，需要掌握两个问题：

1. Servlet 由谁创建，Servlet 方法由谁调用？
   - Servlet 由 Web 服务器创建，Servlet 方法由 Web 服务器调用。

2. 服务器怎么知道 Servlet 中一定有 service 方法?
   - 因为我们自定义的 Servlet，必须实现 Servlet 接口并复写其方法，而 Servlet 接口中有 service 方法。

## Servlet 生命周期

了解了 Servlet 的执行流程后，我们知道 Servlet 是由 Tomcat Web 服务器帮我们创建的。

接下来再来思考一个问题：Tomcat 什么时候创建的 Servlet 对象？要想回答这个问题，我们就需要了解 Servlet 的生命周期。

**生命周期**：对象的生命周期指一个对象从被创建到被销毁的整个过程。

Servlet 运行在 Servlet 容器（Web 服务器）中，其生命周期由容器来管理，分为 4 个阶段：

1. **加载和实例化**：默认情况下，当 Servlet 第一次被访问时，由容器创建 Servlet 对象

   默认情况，Servlet 会在第一次访问被容器创建，但是如果创建 Servlet 比较耗时的话，那么第一个访问的人等待的时间就比较长，用户的体验就比较差，那么我们能不能把 Servlet 的创建放到服务器启动的时候来创建呢?

   答案是可以，只需要在配置路径的时候加一个参数，如下：

   ```java
   @WebServlet(urlPatterns = "/demo1",loadOnStartup = 1)
   ```

   **loadOnstartup** 的取值有两类情况：

   - 负整数：第一次访问时创建 Servlet 对象（默认值就是 -1）
   - 0或正整数：服务器启动时创建 Servlet 对象，数字越小优先级越高

2. **初始化**：在 Servlet 实例化之后，容器将调用 Servlet 的 **init()** 方法初始化这个对象，完成一些如加载配置文件、创建连接等初始化的工作，该方法只会被 **调用一次**
3. **请求处理**：**每次** 请求 Servlet 时，Servlet 容器都会调用 Servlet 的 **service()** 方法对请求进行处理
4. **服务终止**：当需要释放内存或者容器关闭时，容器就会调用 Servlet 实例的 **destroy()** 方法完成资源的释放。在 **destroy()** 方法调用之后，容器会释放这个 Servlet 实例，该实例随后会被 Java 的垃圾收集器所回收

以下案例演示了上述的生命周期：

```java
package com.itheima.web;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import java.io.IOException;
/**
* Servlet生命周期方法
*/
@WebServlet(urlPatterns = "/demo2",loadOnStartup = 1)
public class ServletDemo2 implements Servlet {

    /**
     *  初始化方法
     *  1.调用时机：默认情况下，Servlet被第一次访问时会调用
     *            loadOnStartup: 默认为-1，修改为0或者正整数，则会在服务器启动的时候就被调用
     *  2.调用次数: 1次
     * @param config
     * @throws ServletException
     */
    public void init(ServletConfig config) throws ServletException {
        System.out.println("init...");
    }

    /**
     * 提供服务
     * 1.调用时机: 每一次 Servlet 被访问时，调用
     * 2.调用次数: 多次
     * @param req
     * @param res
     * @throws ServletException
     * @throws IOException
     */
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        System.out.println("servlet hello world~");
    }

    /**
     * 销毁方法
     * 1.调用时机: 释放或者服务器关闭的时候，Servlet对象会被销毁，调用
     * 2.调用次数: 1次
     */
    public void destroy() {
        System.out.println("destroy...");
    }
    public ServletConfig getServletConfig() {
        return null;
    }

    public String getServletInfo() {
        return null;
    }


}
```

**注意：如何才能让 Servlet 中的 destroy 方法被执行？**

![](./assets/466.png)

在 Terminal 命令行中，先使用 `mvn tomcat7:run` 启动项目，然后再使用 `ctrl+c` 关闭 Tomcat。

了解了 Servlet 的生命周期，需要掌握两个问题：

1. Servlet 对象在什么时候被创建的？
   - 默认是第一次访问的时候被创建，可以使用 `@WebServlet(urlPatterns = "/demo2",loadOnStartup = 1)` 的 loadOnStartup 修改成在服务器启动的时候创建。

2. Servlet 生命周期中涉及到的三个方法，这三个方法是什么？什么时候被调用？调用几次？
   - 涉及到三个方法，分别是 init()、service()、destroy()
   - init 方法在 Servlet 对象被创建的时候执行，只执行1次
   - service 方法在 Servlet 被访问的时候调用，每访问1次就调用1次
   - destroy 方法在 Servlet 对象被销毁的时候调用，只执行1次

## Servlet 方法介绍

Servlet 中总共有5个方法，我们已经介绍过其中的三个，剩下的两个方法作用分别是什么？

我们先来回顾下前面讲的三个方法，分别是：

* 初始化方法，在 Servlet 被创建时执行，只执行一次

  ```java
  void init(ServletConfig config) 
  ```

* 提供服务方法， 每次 Servlet 被访问，都会调用该方法

  ```java
  void service(ServletRequest req, ServletResponse res)
  ```

* 销毁方法，当 Servlet 被销毁时，调用该方法。在内存释放或服务器关闭时销毁 Servlet

  ```java
  void destroy() 
  ```

剩下的两个方法是：

* 返回 Servlet 的相关信息，没有什么太大的用处，一般我们返回一个空字符串即可

  ```java
  String getServletInfo()
  ```

* 获取 ServletConfig 对象

  ```java
  ServletConfig getServletConfig()
  ```

ServletConfig 对象，在 init() 方法的参数中有，而 Tomcat Web 服务器在创建 Servlet 对象的时候会调用 init() 方法，必定会传入一个ServletConfig 对象，我们只需要将服务器传过来的 ServletConfig 进行返回即可。

具体操作：

```java
package com.itheima.web;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import java.io.IOException;

/**
 * Servlet方法介绍
 */
@WebServlet(urlPatterns = "/demo3",loadOnStartup = 1)
public class ServletDemo3 implements Servlet {

    private ServletConfig servletConfig;
    
    public void init(ServletConfig config) throws ServletException {
        this.servletConfig = config;
        System.out.println("init...");
    }
    public ServletConfig getServletConfig() {
        return servletConfig;
    }
    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        System.out.println("servlet hello world~");
    }
    public void destroy() {
        System.out.println("destroy...");
    }
    public String getServletInfo() {
        return "";
    }
}
```

**getServletInfo()** 和 **getServletConfig()** 这两个方法使用的不是很多，仅作了解。

## Servlet 体系结构

通过上面的学习，我们知道要想编写一个 Servlet 就必须要实现 Servlet 接口，重写接口中的5个方法。

虽然已经能完成要求，但是编写起来还是比较麻烦的，因为我们更关注的其实只有 service() 方法，那有没有更简单方式来创建 Servlet 呢？

要想解决上面的问题，我们需要先对 Servlet 的体系结构进行了解：

![1627240593506](./assets/467.png)

因为我们将来开发 B/S 架构的 Web 项目，都是针对 HTTP 协议，所以我们自定义的 Servlet，都会继承 **HttpServlet**

具体的编写格式如下：

```java
@WebServlet("/demo4")
public class ServletDemo4 extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //TODO GET 请求方式处理逻辑
        System.out.println("get...");
    }
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //TODO Post 请求方式处理逻辑
        System.out.println("post...");
    }
}
```

* 要想发送一个 GET 请求，请求该 Servlet，只需要通过浏览器发送 `http://localhost:8080/web-demo/demo4` ，就能看到 doGet() 方法被执行了
* 要想发送一个 POST 请求，请求该 Servlet，单单通过浏览器是无法实现的，这个时候就需要编写一个 form 表单来发送请求，在 webapp 下创建一个 `a.html `页面，内容如下:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <form action="/web-demo/demo4" method="post">
        <input name="username"/><input type="submit"/>
    </form>
</body>
</html>
```

启动测试，即可看到 doPost() 方法被执行了。

Servlet 的简化编写就介绍完了，接着需要思考两个问题:

1. HttpServlet 中为什么要根据请求方式的不同，调用不同的方法呢？
2. 如何调用？

针对问题一，我们需要回顾之前的知识点 **前端发送 GET 和 POST 请求的时候，参数的位置不一致，GET 请求参数在请求行中，POST 请求参数在请求体中**，为了能处理不同的请求方式，我们得在 **service()** 方法中进行判断，然后写不同的业务处理：

```java
package com.itheima.web;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@WebServlet("/demo5")
public class ServletDemo5 implements Servlet {

    public void init(ServletConfig config) throws ServletException {

    }

    public ServletConfig getServletConfig() {
        return null;
    }

    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        //如何调用?
        //获取请求方式，根据不同的请求方式进行不同的业务处理
        HttpServletRequest request = (HttpServletRequest)req;
       //1. 获取请求方式
        String method = request.getMethod();
        //2. 判断
        if("GET".equals(method)){
            // get方式的处理逻辑
        }else if("POST".equals(method)){
            // post方式的处理逻辑
        }
    }

    public String getServletInfo() {
        return null;
    }

    public void destroy() {

    }
}

```

这样能实现，但是每个 Servlet 类中都将有相似的代码，针对这个问题，有什么可以优化的策略么？

要解决上述问题，我们可以对 Servlet 接口进行继承封装，来简化代码的开发。

```java
package com.itheima.web;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class MyHttpServlet implements Servlet {
    public void init(ServletConfig config) throws ServletException {

    }

    public ServletConfig getServletConfig() {
        return null;
    }

    public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
        HttpServletRequest request = (HttpServletRequest)req;
        //1. 获取请求方式
        String method = request.getMethod();
        //2. 判断
        if("GET".equals(method)){
            // get方式的处理逻辑
            doGet(req,res);
        }else if("POST".equals(method)){
            // post方式的处理逻辑
            doPost(req,res);
        }
    }

    protected void doPost(ServletRequest req, ServletResponse res) {
    }

    protected void doGet(ServletRequest req, ServletResponse res) {
    }

    public String getServletInfo() {
        return null;
    }

    public void destroy() {

    }
}

```

现在，有了 MyHttpServlet 这个类，以后我们再编写 Servlet 类的时候，只需要继承 MyHttpServlet，重写父类中的 doGet() 和 doPost() 方法，就可以用来处理 GET 和 POST 请求的业务逻辑。接下来，可以把 ServletDemo5 代码进行改造:

```java
@WebServlet("/demo5")
public class ServletDemo5 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("get...");
    }

    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
        System.out.println("post...");
    }
}

```

将来页面发送的是 GET 请求，则会进入到 doGet() 方法中进行执行，如果是 POST 请求，则进入到 doPost() 方法。这样代码在编写的时候就相对来说更加简单快捷。

类似 MyHttpServlet 这样的类，Servlet 中已经为我们提供好了，就是 HttpServlet，翻开源码，大家可以搜索 `service()` 方法，你会发现 HttpServlet 做的事更多，不仅可以处理 GET 和 POST 还可以处理其他五种请求方式。

```java
protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException{
        String method = req.getMethod();

        if (method.equals(METHOD_GET)) {
            long lastModified = getLastModified(req);
            if (lastModified == -1) {
                // servlet doesn't support if-modified-since, no reason
                // to go through further expensive logic
                doGet(req, resp);
            } else {
                long ifModifiedSince = req.getDateHeader(HEADER_IFMODSINCE);
                if (ifModifiedSince < lastModified) {
                    // If the servlet mod time is later, call doGet()
                    // Round down to the nearest second for a proper compare
                    // A ifModifiedSince of -1 will always be less
                    maybeSetLastModified(resp, lastModified);
                    doGet(req, resp);
                } else {
                    resp.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
                }
            }

        } else if (method.equals(METHOD_HEAD)) {
            long lastModified = getLastModified(req);
            maybeSetLastModified(resp, lastModified);
            doHead(req, resp);

        } else if (method.equals(METHOD_POST)) {
            doPost(req, resp);
            
        } else if (method.equals(METHOD_PUT)) {
            doPut(req, resp);
            
        } else if (method.equals(METHOD_DELETE)) {
            doDelete(req, resp);
            
        } else if (method.equals(METHOD_OPTIONS)) {
            doOptions(req,resp);
            
        } else if (method.equals(METHOD_TRACE)) {
            doTrace(req,resp);
            
        } else {
            //
            // Note that this means NO servlet supports whatever
            // method was requested, anywhere on this server.
            //

            String errMsg = lStrings.getString("http.method_not_implemented");
            Object[] errArgs = new Object[1];
            errArgs[0] = method;
            errMsg = MessageFormat.format(errMsg, errArgs);
            
            resp.sendError(HttpServletResponse.SC_NOT_IMPLEMENTED, errMsg);
        }
}
```

通过这一节的学习，我们掌握了:

1. HttpServlet 的使用步骤
   - 继承 HttpServlet
   - 重写 doGet() 和 doPost() 方法

2. HttpServlet 原理
   - 获取请求方式，并根据不同的请求方式，调用不同的 doXxx() 方法

## urlPattern 配置

Servlet 类编写好后，要想被访问到，就需要配置其访问路径（**urlPattern**）

**一个 Servlet，可以配置多个 urlPattern**：

```java
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebServlet;

/**
* urlPattern: 一个Servlet可以配置多个访问路径
*/
@WebServlet(urlPatterns = {"/demo7","/demo8"})
public class ServletDemo7 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo7 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}
```

在浏览器上输入`http://localhost:8080/web-demo/demo7`，`http://localhost:8080/web-demo/demo8 `这两个地址都能访问到ServletDemo7 的 doGet() 方法。

### urlPattern 的配置规则

#### 精确匹配

```java
/**
 * UrlPattern:
 * 精确匹配
 */
@WebServlet(urlPatterns = "/user/select")
public class ServletDemo8 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo8 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}
```

访问路径 `http://localhost:8080/web-demo/user/select`

#### 目录匹配

```java
/**
 * UrlPattern:
 * 目录匹配: /user/*
 */
@WebServlet(urlPatterns = "/user/*")
public class ServletDemo9 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo9 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}
```

访问路径 `http://localhost:8080/web-demo/user/任意`

**思考**：

1. 访问路径 `http://localhost:8080/web-demo/user` 是否能访问到 demo9 的 doGet() 方法?
2. 访问路径 `http://localhost:8080/web-demo/user/a/b` 是否能访问到 demo9 的 doGet() 方法?
3. 访问路径 `http://localhost:8080/web-demo/user/select` 是否能访问到 demo9 还是 demo8 的 doGet() 方法?

答案是：能、能、demo8。

进而我们可以得到的结论是 `/user/*` 中的 `/*` 代表的是零或多个层级访问目录，同时 **精确匹配** 优先级要高于 **目录匹配**。

#### 扩展名匹配

```java
/**
 * UrlPattern:
 * 扩展名匹配: *.do
 */
@WebServlet(urlPatterns = "*.do")
public class ServletDemo10 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo10 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}
```

访问路径 `http://localhost:8080/web-demo/任意.do`

**注意**：

1. 如果路径配置的不是扩展名，那么在路径的前面就必须要加 `/` 否则会报错。

2. 如果路径配置的是 `*.do`，那么在 *.do 的前面不能加 `/`，否则会报错。

#### 任意匹配

```java
/**
 * UrlPattern:
 * 任意匹配： /
 */
@WebServlet(urlPatterns = "/")
public class ServletDemo11 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo11 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}
```

访问路径 `http://localhost:8080/demo-web/任意`

```java
/**
 * UrlPattern:
 * * 任意匹配：/*
 */
@WebServlet(urlPatterns = "/*")
public class ServletDemo12 extends MyHttpServlet {

    @Override
    protected void doGet(ServletRequest req, ServletResponse res) {
        System.out.println("demo12 get...");
    }
    @Override
    protected void doPost(ServletRequest req, ServletResponse res) {
    }
}

```

访问路径 `http://localhost:8080/demo-web/任意`

**注意 `/` 和 `/*` 的区别**：

1. 当我们的项目中的Servlet配置了 "/"，会覆盖掉 Tomcat 中的 DefaultServlet，当其他的 url-pattern 都匹配不上时都会走这个 Servlet

2. 当我们的项目中配置了"/*"，意味着匹配任意访问路径

3. DefaultServlet 是用来处理静态资源，如果配置了"/"会把默认的覆盖掉，就会引发请求静态资源的时候没有走默认的而是走了自定义的 Servlet 类，最终 **导致静态资源无法被正常访问**

**小结**

1. urlPattern 总共有四种配置方式，分别是精确匹配、目录匹配、扩展名匹配、任意匹配。

2. 五种配置的优先级为 **精确匹配 > 目录匹配> 扩展名匹配 > /* > /** ，无需刻意记忆，以最终运行结果为准。

## XML 配置

前面对应 Servlet 的配置，我们都使用的是注解 @WebServlet，这个是 Servlet 从 3.0 版本后开始支持注解配置，3.0 版本前只支持 XML 配置文件的配置方法。

对于 XML 的配置步骤有两步：

* 编写 Servlet 类：

  ```java
  package com.itheima.web;
  
  import javax.servlet.ServletRequest;
  import javax.servlet.ServletResponse;
  import javax.servlet.annotation.WebServlet;
  
  public class ServletDemo13 extends MyHttpServlet {
      @Override
      protected void doGet(ServletRequest req, ServletResponse res) {
          System.out.println("demo13 get...");
      }
      @Override
      protected void doPost(ServletRequest req, ServletResponse res) {
      }
  }
  ```

* 在 web.xml 中配置该 Servlet：

  ```xml
  <?xml version="1.0" encoding="UTF-8"?>
  <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
           version="4.0">
      
      
      <!-- 
          Servlet 全类名
      -->
      <servlet>
          <!-- servlet的名称，名字任意-->
          <servlet-name>demo13</servlet-name>
          <!--servlet的类全名-->
          <servlet-class>com.itheima.web.ServletDemo13</servlet-class>
      </servlet>
  
      <!-- 
          Servlet 访问路径
      -->
      <servlet-mapping>
          <!-- servlet的名称，要和上面的名称一致-->
          <servlet-name>demo13</servlet-name>
          <!-- servlet的访问路径-->
          <url-pattern>/demo13</url-pattern>
      </servlet-mapping>
  </web-app>
  ```

这种配置方式和注解比起来，确认麻烦很多，所以建议平时使用注解来开发。

但是仍然要认识上面这种配置方式，因为并不是所有的项目都是基于注解开发的。

## Servlet 两种配置方式的优缺点

- 注解方式配置路径：

  项目发布之后路径无法修改，想修改只能重新发布。

  开发项目的时候方便，但后期维护项目的时候更加麻烦。

  但一般情况下，访问路径在项目发布后都是不会轻易修改的。

- 配置文件配置路径：

  可以随时修改 Servlet 的访问路径，便于项目的维护。

## ServletContext（Servlet环境，就是 JSP 的内置对象之一）

- 整个工程可以认为是一个 `ServletContext`对象（我们在jsp页面获取到的 `application`），可以认为 `ServletContext` 管理着生成的所有的Servlet（`ServletContext` 里面都可以存放东西，在其他任意地方都可以取）。

- 怎么获取？

  - jsp里面：`application` 内置

  - servlet里面：`this.getServlet.Context()`
  

