---
title: 浅谈CSRF攻击
date: 2020-09-24
sidebar: auto
tags: 
 - Cookie
 - CSRF
categories:
 - 笔记
---

# 浅谈CSRF攻击

## 一、CSRF是什么

CSRF（Cross-site request forgery），中文名称：跨站请求伪造，也被称为：one click attack/session riding，缩写为：CSRF/XSRF。

## 二、CSRF可以做什么

你这可以这么理解 CSRF 攻击：**攻击者盗用了你的身份，以你的名义发送恶意请求**。

CSRF 能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账......造成的问题包括：个人隐私泄露以及财产安全。

## 三、CSRF漏洞现状

CSRF 这种攻击方式在2000年已经被国外的安全人员提出，但在国内，直到06年才开始被关注。

08年，国内外的多个大型社区和交互网站分别爆出 CSRF 漏洞，如：NYTimes.com（纽约时报）、Metafilter（一个大型的 BLOG 网站），YouTube 和百度HI……

而现在，互联网上的许多站点仍对此毫无防备，以至于安全业界称 CSRF 为“沉睡的巨人”。

## 四、CSRF的原理

下图简单阐述了 CSRF 攻击的思想：

![](./assets/406.jpg)

从上图可以看出，要完成一次 CSRF 攻击，**受害者必须依次完成两个步骤**：

1. **登录受信任网站A，并在本地生成 Cookie**。

2. **在不登出A的情况下，访问危险网站B**。

看到这里，你也许会问：“**如果我不满足以上两个条件中的一个，我就不会受到CSRF的攻击吗？**”

是的，的确如此。

但你不能保证以下情况不会发生：

1. 你不能保证你登录了一个网站后，不再打开一个 tab 页面并访问另外的网站。

2. 你不能保证你关闭浏览器之后，你本地的 Cookie 立刻过期、你上次的会话立刻结束。（事实上，关闭浏览器不能结束一个会话，但大多数人都会错误的认为关闭浏览器就等于退出登录/结束会话了......）
3. 上图中所谓的攻击网站，可能是一个存在其他漏洞的、可信任的、经常被人访问的网站。

上面大概地讲了一下CSRF攻击的思想，下面我将用几个例子详细说说具体的CSRF攻击，这里我以一个银行转账的操作作为例子（仅仅是例子，真实的银行网站没这么傻）

### 示例1

银行网站A，它以 GET 请求来完成银行转账的操作，如：`http://www.mybank.com/Transfer.php?toBankId=11&money=1000`

危险网站B，它里面有一段 HTML 的代码如下：

```html
<img src="http://www.mybank.com/Transfer.php?toBankId=11&money=1000">
```

假设，你先登录了银行网站A，然后访问危险网站B，偶买噶！这时你会发现你的银行账户少了1000块诶！

为什么会这样呢？

原因是银行网站A违反了 HTTP 规范，使用了 GET 请求去更新资源。

在访问危险网站B之前，你已经登录了银行网站A，而B中的 `<img>` 以 GET 的方式请求第三方资源（这里的第三方就是指银行网站了，原本这是一个合法的请求，但这里被不法分子利用了），所以你的浏览器会带上你的银行网站A的 Cookie 发出 GET 请求，去获取资源 `http://www.mybank.com/Transfer.php?toBankId=11&money=1000`。

结果银行网站服务器收到请求后，认为这是一个更新资源操作（转账操作），所以就立刻进行了转账操作。

### 示例2

为了杜绝上面的问题，银行决定改用 POST 请求完成转账操作。

银行网站A的WEB表单如下：

```html
<form action="Transfer.php" method="POST">
    <p>ToBankId: <input type="text" name="toBankId" /></p>
    <p>Money: <input type="text" name="money" /></p>
    <p><input type="submit" value="Transfer" /></p>
</form>
```

后台处理页面 `Transfer.php` 如下：

```php
<?php
    session_start();
	if (isset($_REQUEST['toBankId'] && isset($_REQUEST['money'])){
        buy_stocks($_REQUEST['toBankId'],　$_REQUEST['money']);　　　　
    }　　
?>
```

危险网站B，仍然只是包含那句 HTML 代码：

```html
<img src="http://www.mybank.com/Transfer.php?toBankId=11&money=1000">
```

和示例1中的操作一样，你首先登录了银行网站A，然后访问危险网站B，结果.....

和示例1一样，你再次没了1000块。

这次事故的原因是：银行后台使用了 `$_REQUEST` 去获取请求的数据，而 `$_REQUEST` 既可以获取 GET 请求的数据，也可以获取 POST 请求的数据，这就造成了在后台处理程序无法区分这到底是 GET 请求的数据还是 POST 请求的数据。在 PHP 中，可以使用 `$_GET` 和 `$_POST` 分别获取 GET 请求和 POST 请求的数据。在JAVA中，用于获取请求数据 request 一样存在不能区分 GET 请求数据和 POST 数据的问题。

### 示例3

经过前面2个惨痛的教训，银行决定把获取请求数据的方法也改了，改用 `$_POST`，只获取 POST 请求的数据，后台处理页面 `Transfer.php` 代码如下：

```php
<?php
    session_start();
	if (isset($_POST['toBankId'] &&　isset($_POST['money'])){
        buy_stocks($_POST['toBankId'],　$_POST['money']);
    }
?>
```

然而，危险网站B与时俱进，它也改了一下代码：

```html
<html>
    <head>
        <script type="text/javascript">
            function steal(){
                iframe = document.frames["steal"];　　
                iframe.document.Submit("transfer");　
            }　　　
        </script>　
    </head>　
    
    <body onload="steal()">　
        <iframe name="steal" display="none">　　　　　
            <form method="POST" name="transfer" action="http://www.myBank.com/Transfer.php">　
                <input type="hidden" name="toBankId" value="11">　　　　　　
                <input type="hidden" name="money" value="1000">　　
            </form>　　
        </iframe>　
    </body>
</html>
```

如果用户仍是继续上面的操作，很不幸，结果将会是再次丢失1000块......

因为在这里，危险网站B暗地里也发送了 POS T请求到银行！

总结一下上面3个例子，CSRF 主要的攻击模式基本上是以上的3种，其中以第1，2种最为严重，因为触发条件很简单，一个 `<img>` 就可以了。而第3种比较麻烦，需要使用 JavaScript，所以使用的机会会比前面的少很多，但无论是哪种情况，只要触发了 CSRF 攻击，后果都有可能很严重。

理解上面的3种攻击模式，其实可以看出，CSRF 攻击是源于 WEB 的隐式身份验证机制！

WEB 的身份验证机制虽然可以保证一个请求是来自于某个用户的浏览器，但却**无法保证该请求是用户批准发送的！**

## 五、CSRF的特征

- 攻击一般发起在第三方网站，而不是被攻击的网站，被攻击的网站无法防止攻击发生。


- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作，而不是直接窃取数据。
- 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是 **冒用**。
- 跨站请求可以用各种方式：图片URL、超链接、CORS、Form提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪。
- CSRF通常是跨域的，因为外域通常更容易被攻击者掌控。但是如果本域下有容易被利用的功能，比如可以发图和链接的论坛和评论区，攻击可以直接在本域下进行，而且这种攻击更加危险。

## 六、CSRF的防御

针对 CSRF 的防御，可以从服务端和客户端两方面着手，但防御效果更好的方案是从服务端着手，现在一般的 CSRF 防御也都在服务端进行。

我们知道，CSRF 通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对 CSRF 的防护能力来提升安全性。在上文中我们讲了 CSRF的两个特点：

1. CSRF（通常）发生在第三方域名

2. CSRF 攻击者不能获取到 Cookie 等信息，只是使用

针对这两点，我们有如下常用的防护策略：

1. 同源检测

2. CSRF Token
3. 双重 Cookie 验证

### 1、同源检测

这属于**在提交时要求附加本域才能获取的信息**的方式，这是因为 CSRF 大多来自第三方网站，通过直接禁止外域（或者不受信任的域名）对我们发起请求，来防护攻击。

那如何来实现这种方式呢？

在 HTTP 协议中，有一个 Header 叫 Referer，用于标记**来源域名**（浏览器向服务器表明自己是从哪个网页 URL 获得点击当前请求中的网址）。

在浏览器发起请求时，大多数情况会自动带上这个 Header，并且前端并不能自定义其内容，所以服务器可以通过解析这个 Header 中的域名，确定请求的来源域。

对于 Ajax 请求，图片和 script 等资源请求，Referer 为发起请求的页面地址。对于页面跳转，Referer 为打开页面历史记录的前一个页面地址。因此通过 Referer 中链接的 Origin 部分就可以得知请求的来源域名。

但这种方法并非万无一失，Referer 的值是由浏览器提供的，虽然 HTTP 协议上有明确的要求，但是每个浏览器对于 Referer 的具体实现可能有差别，我们**并不能保证浏览器自身没有安全漏洞**。

使用验证 Referer 值的方法，就是把安全性都依赖于第三方（即浏览器）来保障，从理论上来讲，这样并不是很安全。因为**在某些情况下，攻击者可以隐藏，甚至修改自己请求的 Referer**。

前面说过，CSRF 大多数情况下来自第三方域名，但并不能排除本域发起。如果攻击者有权限在本域发布评论（含链接、图片等，统称UGC），那么它可以直接在本域发起攻击，这种情况下同源策略无法达到防护的作用。

::: tip 总结

同源验证是一个相对简单的防范方法，能够防范绝大多数的 CSRF 攻击。

但这并不是万无一失的，对于安全性要求较高，或者有较多用户输入内容的网站，我们就要对关键的接口做额外的防护措施。

:::

### 2、CSRF Token 校验

CSRF 的另一个特征是，攻击者**无法直接窃取到用户的信息（Cookie，Header，网站内容等）**，仅仅是冒用Cookie 中的信息。

而 CSRF 攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个 CSRF 攻击者无法获取到的 Token。

服务器通过校验请求是否携带正确的 Token 来把正常的请求和攻击的请求区分开，这也可以防范 CSRF 的攻击。

基于 CSRF Token 的防护策略大致分为三个步骤：

#### 1）将 CSRF Token 输出到页面中

首先，用户打开页面的时候，服务器需要给这个用户生成一个 Token，该 Token 通过加密算法对数据进行加密生成，一般 Token 都包括随机字符串和时间戳的组合。

显然在提交时 Token 不能再放在 Cookie 中了，否则又会被攻击者冒用。因此，为了安全起见 Token 最好还是存在服务器的 Session 中，之后在每次页面加载时，使用 JS 遍历整个 DOM 树，对于 DOM 中所有的 a 和 form 标签后加入 Token。

这样可以解决大部分的请求，但是对于在页面加载之后动态生成的 HTML 代码，这种方法就没有作用，还需要程序员在编码时手动添加 Token。

#### 2）页面提交的请求携带这个 Token

对于 GET 请求，Token 将附在请求地址之后，这样URL就变成 `http://url?csrftoken=tokenvalue`。而对于  POST 请求来说，要在 form 的最后加上：

```html
<input type="hidden" name="csrftoken" value="tokenvalue"/>
```

#### 3）服务器验证 Token 是否正确

当用户从客户端得到了 Token，再次提交给服务器的时候，服务器需要判断 Token 的有效性，验证过程是先解密Token，对比加密字符串以及时间戳，如果加密字符串一致且时间未过期，那么这个 Token 就是有效的。

这种方法要比之前检查 Referer 或者 Origin 要安全一些，Token 可以在产生并放于 Session 之中，然后在每次请求时把 Token 从 Session 中拿出，与请求中的 Token 进行比对，但这种方法的比较麻烦的在于如何把 Token 以参数的形式加入请求。 

下面将以 Java 为例，介绍一些 CSRF Token 的服务端校验逻辑，代码如下：

```java
HttpServletRequest req = (HttpServletRequest)request;
HttpSession s = req.getSession();
// 从sesion中得到csrftoken属性
String sToken = (String)s.getAttribute("csrftoken");
if(sToken == null){
    // 产生新的token放入session中
    sToken = generateToken();
    s.setAttribute("csrftoken",sToken);
    chain.doFilter(request,response);
}else{
    // 从HTTP头中取得csrftoken
    String xhrToken = req.getHeader("csrftoken");
    // 从请求参数中取得csrftoken
    String pToken = req.getParameter("csrftoken");
    if(sToken != null && xhrToken != null && sToken.equals(xhrToken)){
        chain.doFilter(request,response);
    }else if(sToken != null & pToken != null && sToken.equals(pToken)){
        chain.doFilter(request,response);
    }else{
        request.getRequestDispatcher("error.jsp").forward(request,response);
    }
}
```

::: tip 总结

Token 是一个比较有效的 CSRF 防护方法，只要页面没有 XSS 漏洞泄露 Token，那么接口的 CSRF 攻击就无法成功。

但是此方法的实现比较复杂，需要给每一个页面都写入 Token（前端无法使用纯静态页面），每一个 Form 及 Ajax 请求都携带这个 Token，后端对每一个接口都进行校验，并保证页面 Token 及请求 Token 一致。

这就使得这个防护策略不能在通用的拦截上统一拦截处理，而需要每一个页面和接口都添加对应的输出和校验。这种方法工作量巨大，且有可能遗漏。

:::

### 3、双重Cookie验证

在会话中存储 CSRF Token 比较繁琐，而且不能在通用的拦截上统一处理所有的接口。

那么另一种防御措施是使用双重提交 Cookie。利用 CSRF 攻击不能获取到用户 Cookie 的特点，我们可以要求 Ajax 和表单请求携带一个 Cookie 中的值。　　

双重 Cookie 采用以下流程：

- 在用户访问网站页面时，向请求域名注入一个 Cookie，内容为随机字符串（例如 `csrfcookie=v8g9e4ksfhw` ）。

- 在前端向后端发起请求时，取出 Cookie，并添加到URL的参数中（接上例 POST `https://www.a.com/comment?csrfcookie=v8g9e4ksfhw`）。
- 后端接口验证 Cookie 中的字段与 URL 参数中的字段是否一致，不一致则拒绝。

此方法相对于 CSRF Token 就简单了许多。可以直接通过前后端拦截的的方法自动化实现。后端校验也更加方便，只需进行请求中字段的对比，而不需要再进行查询和存储 Token。

当然，此方法并没有大规模应用，其在大型网站上的安全性还是没有 CSRF Token 高，原因我们举例进行说明。

由于任何跨域都会导致前端无法获取 Cookie 中的字段（包括子域名之间），于是发生了如下情况：

- 如果用户访问的网站为 **www.a.com**，而后端的 api 域名为 **api.a.com**。那么在 **www.a.com** 下，前端拿不到 **api.a.com** 的 Cookie，也就无法完成双重 Cookie 认证。
- 于是这个认证 Cookie 必须被种在 **a.com** 下，这样每个子域都可以访问。
- 任何一个子域都可以修改 **a.com** 下的 Cookie。

- 某个子域名存在漏洞被XSS攻击（例如 **upload.a.com**）。虽然这个子域下并没有什么值得窃取的信息。但攻击者修改了 **a.com** 下的Cookie。
- 攻击者可以直接使用自己配置的Cookie，对XSS中招的用户再向 **www.a.com** 下，发起CSRF攻击。

::: tip 总结

使用双重 Cookie 防御 CSRF 的优点：

- 无需使用 Session，适用面更广，易于实施。
- Token 储存于客户端中，不会给服务器带来压力。
- 相对于 Token，实施成本更低，可以在前后端统一拦截校验，而不需要一个个接口和页面添加。

缺点：

- Cookie 中增加了额外的字段。
- 如果有其他漏洞（例如XSS），攻击者可以注入 Cookie，那么该防御方式失效。
- 难以做到子域名的隔离。
- 为了确保 Cookie 传输安全，采用这种防御方式的最好确保用整站 HTTPS 的方式，如果还没切 HTTPS 的使用这种方式也会有风险。

:::

## 5. 总结

本文简单总结了一下CSRF的防护策略：

- CSRF自动防御策略：**同源检测**（Origin 和 Referer 验证）；
- CSRF主动防御措施：**Token 验证** 或者 **双重 Cookie 验证**；

除此之外，保证页面的幂等性，后端接口不要在 GET 页面中做用户操作。

为了更好的防御CSRF，最佳实践应该是结合上面总结的防御措施方式中的优缺点来综合考虑，结合当前Web应用程序自身的情况做合适的选择，才能更好的预防CSRF的发生。

 
