---
title: HTTP协议
date: 2020-03-21
tags: 
 - JSP
 - http
categories:
 - JavaWeb
---

::: tip 

协议：当我们跟别人合作的时候，需要先定义好双方要做的事情，解决利益怎么分配等问题，免得在合作的时候出现分歧。

:::
# HTTP协议

## 什么是 HTTP 协议

HTTP：HyperText Transfer Protocol，超文本传输协议，**规定了浏览器和服务器之间数据传输的规则**。换言之，它规定了我们在发起 HTTP 请求的时候，这个请求的数据包里面都包含了什么样的数据，以及数据按照什么样的先后顺序和格式存放在数据包里面。

如果想知道具体的格式，可以打开浏览器，按下 `F12` 打开开发者工具，点击 `Network` 来查看某一次请求的请求数据和响应数据具体的格式内容。

## HTTP 请求和 HTTP 响应过程

1. **建立 TCP 连接**
   在 HTTP 工作开始之前，Web 浏览器首先要通过网络与 Web 服务器建立连接，该连接是通过 TCP 来完成的，该协议与 IP 协议共同构建了 Internet，即著名的 TCP/IP 协议族，因此 Internet 又被称作是 TCP/IP 网络。

   HTTP 是比 TCP 更高层次的应用层协议，根据规则，**只有低层协议建立之后才能进行更高层协议的连接**，因此，首先要建立 TCP 连接，一般 TCP 连接的端口号是 80。

2. **Web 浏览器向 Web 服务器发送请求命令**
   一旦建立了 TCP 连接，Web 浏览器就会向 Web 服务器发送请求命令。例如：**GET/sample/hello.jsp HTTP/1.1**。

3. **Web 浏览器发送请求头信息**
   浏览器发送请求命令之后，还要以头信息的形式向 Web 服务器发送一些别的信息，而且之后浏览器还要发送一空白行来通知服务器表面自己已经结束了头信息的发送。

4. **Web 服务器应答**
   浏览器向服务器发出请求后，服务器会向浏览器回送应答， **HTTP/1.1 200 OK** ，应答的第一部分是协议的版本号和应答状态码。

5. **Web 服务器发送应答头信息**
   正如浏览器会随同请求发送关于自身的信息一样，服务器也会随同应答向用户发送关于它自己的数据及被请求的文档。

6. **Web 服务器向浏览器发送数据**
   Web 服务器向浏览器发送头信息后，它会发送一个空白行来表示头信息的发送到此为结束，接着，它就以 Content-Type 应答头信息所描述的格式发送用户所请求的实际数据。

7. **Web 服务器关闭 TCP 连接**

学习 HTTP 主要就是学习 **请求** 和 **响应数据** 的具体格式内容。

## HTTP 协议特点

HTTP 协议有它自己的一些特点：

* 基于 TCP 协议：面向连接，安全。

  TCP 是一种面向连接的（建立连接之前需要经过三次握手）、可靠的、基于字节流的传输层通信协议，在数据传输方面更安全。

* 基于 **请求-响应模型** 的：一次请求对应一次响应，请求和响应是一一对应的关系。

* HTTP协议是无状态协议：对于事物处理没有记忆能力，每次请求-响应都是独立的。


HTTP 协议 **无状态** 的特性：

- 无状态指的是客户端发送 HTTP 请求给服务端之后，服务端根据请求响应数据，响应完后，不会记录任何信息。

- 这种特性有优点也有缺点：

  缺点：多次请求间不能共享数据

  优点：

  * **简单易用**：由于每个请求都是独立的，所以实现起来非常简单
  * **可扩展性强**：由于没有状态信息需要保存，所以可以轻松地增加或减少服务器数量来满足需求变化
  * **更高的效率**：由于不需要维护状态信息，所以服务器的负载会更轻，响应速度更快

- 请求之间无法共享数据会引发一些问题，比如:
  - 购物网站里，**加入购物车** 和 **去购物车结算** 是两次独立的请求，而由于 HTTP 协议的无状态特性，加入购物车请求响应结束后，并未记录加入购物车是何商品，因此，发起去购物车结算的请求后，因为无法获取哪些商品加入了购物车，会导致此次请求无法正确展示数据。
  - 具体使用的时候，我们发现购物网站是可以正常展示数据的，原因是 Java 早已考虑到这个问题，并提出了使用 **会话技术(Cookie、Session)** 来解决这个问题。

刚才提到 HTTP 协议是规定了请求和响应数据的格式，那具体的格式是什么呢?

## 请求数据格式

请求数据总共分为三部分内容，分别是 **请求行**、**请求头**、**请求体**：

![1627050004221](./assets/503.png)

* **请求行**：HTTP 请求中的第一行数据，请求行包含三块内容，分别是 GET[**请求方式**]、 /[**请求URL路径**]、 HTTP/1.1[**HTTP协议及版本**]

  请求方式有七种，最常用的是 GET 和 POST

* **请求头**：第二行开始，格式为 **key: value** 形式

  请求头中会包含若干个属性，常见的 HTTP 请求头有：

  | 属性            | 内容                                                         |
  | --------------- | ------------------------------------------------------------ |
  | Host            | 表示请求的主机名                                             |
  | User-Agent      | 浏览器版本，例如Chrome浏览器的标识类似Mozilla/5.0 ...Chrome/79，IE浏览器的标识类似Mozilla/5.0 (Windows NT ...)like Gecko |
  | Accept          | 表示浏览器能接收的资源类型，如text/\*，image/\*或者\*/\*表示所有 |
  | Accept-Language | 表示浏览器偏好的语言，服务器可以据此返回不同语言的网页       |
  | Accept-Encoding | 表示浏览器可以支持的压缩类型，例如gzip、deflate等            |

  这些数据的作用：

  服务端可以根据请求头中的内容来获取客户端的相关信息，有了这些信息服务端就可以处理不同的业务需求，比如：

  不同浏览器解析 HTM L和 CSS 标签的结果会有不一致，所以就会导致相同的代码在不同的浏览器会出现不同的效果，服务端根据客户端请求头中的数据获取到客户端的浏览器类型，就可以根据不同的浏览器设置不同的代码来达到一致的效果，这就是我们常说的浏览器兼容问题。

* **请求体**：POST请求的最后一部分，存储请求参数

  ![1627050930378](./assets/502.png)

  如上图红线框的内容就是请求体的内容，请求体和请求头之间是有一个空行隔开。

  此时浏览器发送的是 POST 请求，为什么不能使用 GET 呢？这时就需要回顾 GET 和 POST 两个请求之间的区别了：

  * GET 请求的请求参数在请求行中，没有请求体，POST 请求的请求参数在请求体中。
  * GET 请求的请求参数大小有限制，POST 没有。

## 响应数据格式

### 格式介绍

响应数据总共分为三部分内容，分别是 **响应行**、**响应头**、**响应体**：

![1627053710214](./assets/501.png)

* **响应行**：响应数据的第一行，响应行包含三块内容，分别是 HTTP/1.1[**HTTP 协议及版本**]、 200[**响应状态码**]、 ok[**状态码的描述**]

* **响应头**：第二行开始，格式为 **key: value** 形式

  响应头中会包含若干个属性，常见的 HTTP 响应头有：

  | 属性             | 内容                                                         |
  | ---------------- | ------------------------------------------------------------ |
  | Content-Type     | 表示该响应内容的类型，例如 text/html，image/jpeg             |
  | Content-Length   | 表示该响应内容的长度（字节数）                               |
  | Content-Encoding | 表示该响应压缩算法，例如 gzip                                |
  | Cache-Control    | 指示客户端应如何缓存，例如 max-age=300 表示可以最多缓存300秒 |

* **响应体**： 最后一部分，存放响应数据。

  上图中\<html>...\</html>这部分内容就是响应体，它和响应头之间有一个空行隔开。

### 响应状态码

关于响应状态码，我们最常见的是以下三个状态码：

* 200  ok 客户端请求成功
* 404  Not Found 请求资源不存在
* 500 Internal Server Error 服务端发生不可预期的错误

#### 状态码大类

| 状态码分类 | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| 1xx        | **响应中**——临时状态码，表示请求已经接受，告诉客户端应该继续请求或者如果它已经完成则忽略它 |
| 2xx        | **成功**——表示请求已经被成功接收，处理已完成                 |
| 3xx        | **重定向**——重定向到其它地方：它让客户端再发起一个请求以完成整个处理 |
| 4xx        | **客户端错误**——处理发生错误，责任在客户端，如：客户端的请求一个不存在的资源，客户端未被授权，禁止访问等 |
| 5xx        | **服务器端错误**——处理发生错误，责任在服务端，如：服务端抛出异常，路由出错，HTTP版本不支持等 |

状态码大全：https://cloud.tencent.com/developer/chapter/13553 

#### 常见的响应状态码

| 状态码 | 英文描述                               | 解释                                                         |
| ------ | -------------------------------------- | ------------------------------------------------------------ |
| 200    | **`OK`**                               | 客户端请求成功，即**处理成功**，这是我们最想看到的状态码     |
| 302    | **`Found`**                            | 指示所请求的资源已移动到由`Location`响应头给定的 URL，浏览器会自动重新访问到这个页面 |
| 304    | **`Not Modified`**                     | 告诉客户端，你请求的资源至上次取得后，服务端并未更改，你直接用你本地缓存吧。隐式重定向 |
| 400    | **`Bad Request`**                      | 客户端请求有**语法错误**，不能被服务器所理解                 |
| 403    | **`Forbidden`**                        | 服务器收到请求，但是**拒绝提供服务**，比如：没有权限访问相关资源 |
| 404    | **`Not Found`**                        | **请求资源不存在**，一般是URL输入有误，或者网站资源被删除了  |
| 428    | **`Precondition Required`**            | **服务器要求有条件的请求**，告诉客户端要想访问该资源，必须携带特定的请求头 |
| 429    | **`Too Many Requests`**                | **太多请求**，可以限制客户端请求某个资源的数量，配合 Retry-After(多长时间后可以请求)响应头一起使用 |
| 431    | **` Request Header Fields Too Large`** | **请求头太大**，服务器不愿意处理请求，因为它的头部字段太大。请求可以在减少请求头域的大小后重新提交。 |
| 405    | **`Method Not Allowed`**               | 请求方式有误，比如应该用GET请求方式的资源，用了POST          |
| 500    | **`Internal Server Error`**            | **服务器发生不可预期的错误**。服务器出异常了，赶紧看日志去吧 |
| 503    | **`Service Unavailable`**              | **服务器尚未准备好处理请求**，服务器刚刚启动，还未初始化好   |
| 511    | **`Network Authentication Required`**  | **客户端需要进行身份验证才能获得网络访问权限**               |

## 自定义服务器

这里有一个 Server.java 类，这里面就是自定义的一个服务器代码，主要使用到的是 `ServerSocket` 和 `Socket`

```java
import sun.misc.IOUtils;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
/*
    自定义服务器
 */
public class Server {
    public static void main(String[] args) throws IOException {
        ServerSocket ss = new ServerSocket(8080); // 监听指定端口
        System.out.println("server is running...");
        while (true){
            Socket sock = ss.accept();
            System.out.println("connected from " + sock.getRemoteSocketAddress());
            Thread t = new Handler(sock);
            t.start();
        }
    }
}

class Handler extends Thread {
    Socket sock;

    public Handler(Socket sock) {
        this.sock = sock;
    }

    public void run() {
        try (InputStream input = this.sock.getInputStream()) {
            try (OutputStream output = this.sock.getOutputStream()) {
                handle(input, output);
            }
        } catch (Exception e) {
            try {
                this.sock.close();
            } catch (IOException ioe) {
            }
            System.out.println("client disconnected.");
        }
    }

    private void handle(InputStream input, OutputStream output) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(output, StandardCharsets.UTF_8));
        // 读取HTTP请求:
        boolean requestOk = false;
        String first = reader.readLine();
        if (first.startsWith("GET / HTTP/1.")) {
            requestOk = true;
        }
        for (;;) {
            String header = reader.readLine();
            if (header.isEmpty()) { // 读取到空行时, HTTP Header读取完毕
                break;
            }
            System.out.println(header);
        }
        System.out.println(requestOk ? "Response OK" : "Response Error");
        if (!requestOk) {
            // 发送错误响应:
            writer.write("HTTP/1.0 404 Not Found\r\n");
            writer.write("Content-Length: 0\r\n");
            writer.write("\r\n");
            writer.flush();
        } else {
            // 发送成功响应:

            //读取html文件，转换为字符串
            BufferedReader br = new BufferedReader(new FileReader("http/html/a.html"));
            StringBuilder data = new StringBuilder();
            String line = null;
            while ((line = br.readLine()) != null){
                data.append(line);
            }
            br.close();
            int length = data.toString().getBytes(StandardCharsets.UTF_8).length;

            writer.write("HTTP/1.1 200 OK\r\n");
            writer.write("Connection: keep-alive\r\n");
            writer.write("Content-Type: text/html\r\n");
            writer.write("Content-Length: " + length + "\r\n");
            writer.write("\r\n"); // 空行标识Header和Body的分隔
            writer.write(data.toString());
            writer.flush();
        }
    }
}
```

通过上述代码，可以了解到服务器能够使用 Java 编写，是可以接受页面发送的请求和响应数据给前端浏览器的。

平时真正用到的 Web 服务器，比这个例子要复杂很多，但我们不需要自己写，都是使用目前比较流行的 Web 服务器，比如 **Tomcat**。

Web 服务器的作用：

- 封装 HTTP 协议操作，简化开发。
- 可以将web项目部署到服务器中，对外提供网上浏览服务。

Tomcat 是一个轻量级的Web服务器，支持 Servlet/JSP 少量 JavaEE 规范，也称为 Web 容器，Servlet 容器。
