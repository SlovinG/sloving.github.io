---
title: Cookie和Session、SessionID的那些事儿
date: 2020-09-11
sidebar: auto
tags: 
 - Cookie
 - Session
categories:
 - JavaWeb
---

# Cookie和Session、SessionID的那些事儿

## 为什么需要 Cookie 和 Session 

在 Web 发展史中，我们知道浏览器与服务器间采用的是 `http` 协议，而这种协议是 **无状态** 的，所以这就导致了服务器无法知道是谁在浏览网页，但很明显，一些网页需要知道用户的状态，例如登陆，购物车等。

所以为了解决这一问题，先后出现了四种技术，分别是 **隐藏表单域**、**URL 重写**、**cookie**、**session**，而用的最多也是比较重要的就是 cookie 和 session 了。

## Cookie 是什么

Cookie 是浏览器 **保存在用户电脑上** 的一小段文本，通俗的来讲就是当一个用户通过 `http` 访问到服务器时，服务器会将一些 `Key/Value` 键值对返回给客户端浏览器，并给这些数据加上一些限制条件（有时候还会对数据进行加密），在条件符合时这个用户下次访问这个服务器时，该数据通过请求头可以完整地被带回给服务器，服务器根据这些信息可以来判断不同的用户。

也就是说如果知道一个用户的 Cookie，并且在 Cookie 有效的时间内，就可以利用 Cookie 以这个用户的身份登录这个网站（Cookie劫持）。

## Cookie 的创建

当前 Cookie 有两个版本，分别对应两种设置响应头：`Set-Cookie`和 `Set-Cookie2`。

然而在 Servlet 中并不支持 `Set-Cookie2`，所以我们来看看 `Set-Cookie` 的属性项：

| 属性项     | 属性项介绍                                                   |
| ---------- | ------------------------------------------------------------ |
| NAME=VALUE | 键值对，可以设置保存的 Key/Value，这里 NAME 不能和其他属性项名字一样 |
| Expires    | 有效时间，在这个时间点后 Cookie 可以自动失效                 |
| Domain     | 生成 Cookie 域名                                             |
| Path       | 该 Cookie 是在当前那个路径下生成的                           |
| Secure     | 加密设置，设置之后，只会在 SSH 连接时才会回传该 Cookie       |

这些属性项，其他的都说的很清楚了，我们来看看 **Domain** 有什么用：

现在，我们假设这里有两个域名：

域名 A：`a.b.f.com.cn`

域名 B：`c.d.f.com.cn`

显然，域名 A 和域名 B 都是 `f.com.cn` 的子域名。

- 如果我们在域名A中的 Cookie 的 domain 设置为 `f.com.cn`，那么 `f.com.cn` 及其子域名都可以获取这个 Cookie，即域名 A 和域名 B 都可以获取这个 Cookie
- 如果域名 A 和域名 B 同时设置 Cookie 的 domain 为 `f.com.cn`，那么将出现覆盖的现象
- 如果域名 A 没有显式设置 Cookie 的 domain 方法，那么 domain 就为 `a.b.f.com.cn`，不一样的是，这时，域名 A 的子域名将无法获取这个 Cookie

好的，现在了解完了 Set-Cookie 的属性项，开始创建 Cookie

Web 服务器通过发送一个称为 Set-Cookie 的 http 消息来创建一个 Cookie：

```
Set-Cookie: value[; expires=date][; domain=domain][; path=path][; secure]
```

这里我们思考一个问题，当我们在服务器创建多个 Cookie 时，这些 Cookie 最终是在一个 Header 项中还是以独立的 Header 存在的呢？

![](./assets/407.png)

我们可以看到，构建 http 返回字节流时是将 Header 中所有的项顺序写出，而没有进行任何修改。

所以可以想象在浏览器在接收 http 返回的数据时是分别解析每一个 Header 项。

接着，在客户端进行保存，如何保存呢？这里又要对 Cookie 的分类进行进一步的了解。

## 会话 Cookie 和持久 Cookie 的区别

- **会话级别 Cookie**：所谓会话级别 Cookie，就是在浏览器关闭之后 Cookie 就会失效。

- **持久级别 Cookie**：保存在硬盘的 Cookie，只要设置了过期时间就是硬盘级别 Cookie。

如果不设置过期时间，则表示这个 Cookie 的生命周期为浏览器会话期间，只要关闭浏览器窗口，Cookie 就消失了，这种生命期的 Cookie 被称为 **会话Cookie**。

会话 Cookie 一般不保存在硬盘上而是保存在内存里。

如果设置了过期时间，浏览器就会把 Cookie 保存到硬盘上，关闭后再次打开浏览器，这些 Cookie 依然有效直到超过设定的过期时间。

**存储在硬盘上的 Cookie 可以在不同的浏览器进程间共享，比如两个 IE 窗口。**

而对于保存在内存的 Cookie，不同的浏览器有不同的处理方式。

## 如何利用 Cookie 实现自动登录

当用户在某个网站注册后，就会收到一个惟一用户 ID 的 Cookie。

客户后来重新连接时，这个用户 ID 会自动返回，服务器再对它进行检查，确定它是否为注册用户且选择了自动登录。

这样，用户无需给出明确的用户名和密码，就可以访问服务器上的资源。

## 如何根据 Cookie 保存用户的爱好来定制站点

网站可以使用 Cookie 简单记录用户的意愿或者喜好（例如网页布局）。

对于简单的设置，网站可以直接将页面的设置存储在 Cookie 中完成定制。

然而对于更复杂的定制，网站只需仅将一个惟一的标识符发送给用户，由服务器端的数据库存储每个标识符对应的页面设置。

## Cookie 的发送

1. 创建 Cookie 对象

2. 设置最大时效

3. 将 Cookie 放入到HTTP响应报头

如果你创建了一个 Cookie，并将他发送到浏览器，默认情况下它是一个**会话级别的 Cookie：存储在浏览器的内存中，用户退出浏览器之后被删除**。

如果你希望浏览器将该 Cookie 存储在磁盘上，则需要使用 maxAge ，并给出一个以秒为单位的时间。将最大时效设为 0 则是命令浏览器删除该 Cookie。

发送 Cookie 需要使用 `HttpServletResponse` 的 `addCookie` 方法，将 Cookie 插入到一个 `Set-Cookie HTTP` 请求报头中。由于这个方法并不修改任何之前指定的 `Set-Cookie` 报头，而是创建新的报头，因此我们将这个方法称为是 `addCookie` ，而非 `setCookie`。同样要记住响应报头必须在任何文档内容发送到客户端之前设置。

## Cookie 的读取

1. 调用 `request.getCookie`

要获取有浏览器发送来的 Cookie，需要调用 `HttpServletRequest` 的 `getCookies` 方法，这个调用返回 Cookie 对象的数组，对应由 HTTP 请求中 Cookie 报头输入的值。

2. 对数组进行循环，调用每个 Cookie 的 `getName` 方法，直到找到感兴趣的 Cookie 为止

Cookie 与你的主机（域）相关，而非你的 servlet 或 JSP 页面。因此，尽管你的 servlet 可能只发送了单个 Cookie，你也可能会得到许多不相关的 Cookie 。

例如：

```java
String CookieName = “userID”;
Cookie Cookies[] = request.getCookies();
if (Cookies!=null){
    for(int i=0;i<Cookies.length;i++){
        Cookie Cookie = Cookies[i];
        if (CookieName.equals(Cookie.getName())){
            doSomethingWith(Cookie.getValue());
        }
    }
}
```

## 如何使用 Cookie 检测初访者

1. 调用 `HttpServletRequest.getCookies()` 获取 Cookie 数组

2. 在循环中检索指定名字的 Cookie 是否存在以及对应的值是否正确
3. 如果是则退出循环并设置区别标识
4. 根据区别标识判断用户是否为初访者从而进行不同的操作

## 使用 Cookie 检测初访者的常见错误

不能仅仅因为 Cookie 数组中不存在在特定的数据项就认为用户是个初访者。

如果 Cookie 数组为 null，客户可能是一个初访者，也可能是由于用户将 Cookie 删除或禁用造成的结果。

但是，如果数组非 null，也不过是显示客户曾经到过你的网站或域，并不能说明他们曾经访问过你的 servlet。

其它 servlet、JSP 页面以及非 Java Web 应用都可以设置 Cookie，依据路径的设置，其中的任何 Cookie 都有可能返回给用户的浏览器。

正确的做法是判断 Cookie 数组是否为空且是否存在指定的 Cookie 对象且值正确。

## 使用 Cookie 属性的注意问题

属性是从服务器发送到浏览器的报头的一部分，但它们不属于由浏览器返回给服务器的报头。

因此除了名称和值之外，Cookie 属性只适用于从服务器输出到客户端的 Cookie，服务器端来自于浏览器的 Cookie 并没有设置这些属性。

因而不要期望通过 `request.getCookies` 得到的 Cookie 中可以使用这个属性。

这意味着，你不能仅仅通过设置 Cookie 的最大时效，发出它，在随后的输入数组中查找适当的 Cookie，读取它的值，修改它并将它存回 Cookie，从而实现不断改变的 Cookie 值。

## 如何使用 Cookie 记录各个用户的访问计数

1. 获取 Cookie 数组中专门用于统计用户访问次数的 Cookie 的值

2. 将值转换成 int 型

3. 将值加 1 并用原来的名称重新创建一个 Cookie 对象

4. 重新设置最大时效

5. 将新的 Cookie 输出

## Session 在不同环境下的不同含义

Session，中文经常翻译为会话，其本来的含义是指有始有终的一系列动作/消息，比如打电话是从拿起电话拨号到挂断电话这中间的一系列过程可以称之为一个 Session。

然而当 Session 一词与网络协议相关联时，它又往往隐含了“面向连接”和/或“保持状态”这样两个含义。

Session 在 Web 开发环境下的语义又有了新的扩展，它的含义是指一类用来在客户端与服务器端之间保持状态的解决方案。有时候 Session 也用来指这种解决方案的存储结构。

## Session 的机制（下面会细说）

Session 机制是一种服务器端的机制，服务器使用一种类似于散列表的结构（也可能就是使用散列表）来保存信息。但程序需要为某个客户端的请求创建一个 Session 的时候，服务器首先检查这个客户端的请求里是否包含了一个 Session 标识 —— 称为 **Session Id**。

如果已经包含一个 Session Id 则说明以前已经为此客户创建过 Session ，服务器就按照 Session Id 把这个 Session 检索出来使用（如果检索不到，可能会新建一个，这种情况可能出现在服务端已经删除了该用户对应的 Session 对象，但用户人为地在请求的 URL 后面附加上一个 JSession 的参数）。

如果客户请求不包含 Session Id，则为此客户创建一个 Session 并且生成一个与此 Session 相关联的 Session Id，这个 Session Id 将在本次响应中返回给客户端保存。

## Cookie 机制和 Session 机制的区别

Cookie 机制采用的是在客户端保持状态的方案，而 Session 机制采用的是在服务器端保持状态的方案。 

同时我们也看到，由于在服务器端保持状态的方案在客户端也需要保存一个标识，所以 **Session 机制可能需要借助于 Cookie 机制来达到保存标识的目的，但实际上还有其他选择**。

## 保存 Session Id 的几种方式

1. 保存 Session Id 的方式可以采用 Cookie，这样在交互过程中浏览器可以自动的按照规则把这个标识发送给服务器。

2. 由于 Cookie 可以被人为的禁止，必须有其它的机制以便在 Cookie 被禁止时仍然能够把 Session Id 传递回服务器，经常采用的一种技术叫做 URL 重写，就是把 Session Id 附加在 URL 路径的后面，附加的方式也有两种，一种是作为 URL 路径的附加信息，另一种是作为查询字符串附加在 URL 后面。网络在整个交互过程中始终保持状态，就必须在每个客户端可能请求的路径后面都包含这个 Session Id 。

3. 另一种技术叫做表单隐藏字段。就是客户端会自动修改表单，添加一个隐藏字段，以便在表单提交时能够把 Session Id 传递回服务器。

## Session 什么时候被创建

一个常见的错误是以为 Session 在有客户端访问时就被创建，然而事实是直到某 server 端程序（如Servlet）调用 `HttpServletRequest.getSession(true)` 这样的语句时才会被创建。  

在创建了 Session 的同时，服务器会为该 Session 生成唯一的 Session Id，而这个 Session Id 在随后的请求中会被用来重新获得已经创建的 Session。

在 Session 被创建之后，就可以调用 Session 相关的方法往 Session 中增加内容了，而这些内容只会保存在服务器中，发到客户端的只有 Session Id。

当客户端再次发送请求的时候，会将这个 Session Id 带上，服务器接受到请求之后就会依据 Session Id 找到相应的 Session，从而再次使用。

## Session 存放在哪里？

服务器端的内存中。

不过 Session 可以通过特殊的方式做持久化管理（memcache，redis）。

## Session 何时被删除

Session 在下列情况下被删除：

1. 程序调用 `HttpSession.invalidate()`

2. 距离上一次收到客户端发送的 Session Id 时间间隔超过了 Session 的最大有效时间

3. 服务器进程被停止

注意：

- 客户端只保存 SessionID 到 Cookie 中，而不会保存 Session。
- 关闭浏览器只会使存储在客户端浏览器内存中的 Session Cookie 失效，不会使服务器端的 Session 对象失效，同样也不会使已经保存到硬盘上的持久化 Cookie 消失。

## URL 重写有什么缺点

对所有的 URL 使用URL重写，包括超链接，form 的 action，和重定向的 URL。

每个引用你的站点的 URL，以及那些返回给用户的 URL（即使通过间接手段，比如服务器重定向中的 Location 字段）都要添加额外的信息。

这意味着在你的站点上不能有任何静态的 HTML 页面（至少静态页面中不能有任何链接到站点动态页面的链接）。因此，每个页面都必须使用 servlet 或 JSP 动态生成。

即使所有的页面都动态生成，如果用户离开了会话并通过书签或链接再次回来，会话的信息都会丢失，因为存储下来的链接含有错误的标识信息－该URL后面的 Session Id 已经过期了。　　

## 使用隐藏的表单域有什么缺点

仅当每个页面都是有表单提交而动态生成时，才能使用这种方法。

单击常规的 `<a href..>` 超文本链接并不产生表单提交，因此隐藏的表单域不能支持通常的会话跟踪，只能用于一系列特定的操作中，比如在线商店的结账过程。

## 会话跟踪的基本步骤

1. 访问与当前请求相关的会话对象

2. 查找与会话相关的信息

3. 存储会话信息

4. 废弃会话数据

## getSession()/getSession(true)、getSession(false)的区别

**getSession()/getSession(true)**：当 Session 存在时返回该 Session，否则新建一个 Session 并返回该对象

**getSession(false)**：当 Session 存在时返回该 Session，否则不会新建 Session，而是返回 null

## 如何将信息于会话关联起来

setAttribute() 会替换任何之前设定的值。如果想要在不提供任何代替的情况下移除某个值，则应使用 removeAttribute()。

这个方法会触发所有实现了 HttpSessionBindingListener 接口的值的 valueUnbound() 方法。

## 会话属性的类型有什么限制吗

通常会话属性的类型只要是 Object 就可以了。除了 null 或基本类型，如 int、double、boolean。

如果要使用基本类型的值作为属性，必须将其转换为相应的封装类对象。

## 如何废弃会话数据

1. **只移除自己编写的 servlet 创建的数据**：调用 `removeAttribute(“key”)` 将指定键关联的值废弃

2. **删除整个会话（在当前 Web 应用中）**：调用 `invalidate` ，将整个会话废弃掉。这样做会丢失该用户的所有会话数据，而非仅仅由我们 servlet 或 JSP 页面创建的会话数据

3. **将用户从系统中注销并删除所有属于他（或她）的会话**：调用 `logOut` ，将客户从 Web 服务器中注销，同时废弃所有与该用户相关联的会话（每个 Web 应用至多一个）。这个操作有可能影响到服务器上多个不同的 Web 应用

## 使用isNew来判断用户是否为新旧用户的错误做法

`public boolean isNew()` 方法如果会话尚未和客户程序（浏览器）发生任何联系，则这个方法返回 true，这一般是因为会话是新建的，不是由输入的客户请求所引起的。

但如果 isNew 返回 false，只不过是说明他之前曾经访问该 Web 应用，并不代表他们曾访问过我们的 servlet 或 JSP 页面。

因为 Session 是与用户相关的，在用户之前访问的每一个页面都有可能创建了会话。因此 isNew 为 false 只能说用户之前访问过该 Web 应用，Session 可以是当前页面创建，也可能是由用户之前访问过的页面创建的。

正确的做法是判断某个 Session 中是否存在某个特定的 key 且其 value 是否正确

## Cookie 的过期和 Session 的超时有什么区别

会话的超时由服务器来维护，它不同于 Cookie 的失效日期。

首先，会话一般基于驻留内存的 Cookie，而不是持续性的 Cookie，因而也就没有截至日期。

即使截取到 JSessionID Cookie，并为它设定一个失效日期发送出去，浏览器会话和服务器会话也会截然不同。

## Session Cookie 和 Session 对象的生命周期是一样的吗

当用户关闭了浏览器虽然 Session Cookie 已经消失，但 Session 对象仍然保存在服务器端

## 是否只要关闭浏览器，Session就消失了

程序一般都是在用户做 log off 的时候发个指令去删除 Session，然而浏览器从来不会主动在关闭之前通知服务器它将要被关闭，因此服务器根本不会有机会知道浏览器已经关闭。

**事实上，服务器会一直保留这个会话对象直到它处于非活动状态超过设定的间隔为止。**

之所以会有这种错觉，是因为大部分 Session 机制都使用会话 Cookie 来保存 Session Id，而关闭浏览器后这个 Session Id 就消失了，再次连接到服务器时也就无法找到原来的Session。

如果服务器设置的 Cookie 被保存到硬盘上，或者使用某种手段改写浏览器发出的 HTTP 请求报头，把原来的 Session Id 发送到服务器，则再次打开浏览器仍然能够找到原来的 Session。

**恰恰是由于关闭浏览器不会导致 Session 被删除，迫使服务器为 Session 设置了一个失效时间，当距离客户上一次使用 Session 的时间超过了这个失效时间时，服务器就可以认为客户端已经停止了活动，才会把 Session 删除以节省存储空间。**

由此我们可以得出如下结论：

**关闭浏览器，只会是浏览器端内存里的 Session Cookie 消失，但不会使保存在服务器端的 Session 对象消失，同样也不会使已经保存到硬盘上的持久化 Cookie 消失。**

## 打开两个浏览器窗口访问应用程序会使用同一个 Session 还是不同的 Session

通常 Session Cookie 是不能跨窗口使用的，当你新开了一个浏览器窗口进入相同页面时，系统会赋予你一个新的 Session Id，这样我们信息共享的目的就达不到了。

此时我们可以先把 Session Id 保存在 Persistent Cookie 中（通过设置 Session 的最大有效时间），然后在新窗口中读出来，就可以得到上一个窗口的 Session Id 了，这样通过 Session Cookie 和 Persistent Cookie 的结合我们就可以实现了跨窗口的会话跟踪。

## 如何使用会话显示每个客户的访问次数

由于客户的访问次数是一个整型的变量，但 Session 的属性类型中不能使用 int，double，boolean 等基本类型的变量，所以我们要用到这些基本类型的封装类型对象作为 Session 对象中属性的值

但像 Integer 是一种不可修改（Immutable）的数据结构：构建后就不能更改。这意味着每个请求都必须创建新的 Integer 对象，之后使用 setAttribute() 来代替之前存在的老的属性的值。例如：

```java
HttpSession Session = request.getSession();
SomeImmutalbeClass value = (SomeImmutableClass)Session.getAttribute(“SomeIdentifier”);
if (value= =null){
    value = new SomeImmutableClass(…);　// 新创建一个不可更改对象
}else{
    value = new SomeImmutableClass(calculatedFrom(value)); // 对value重新计算后创建新的对象
}
Session.setAttribute(“someIdentifier”,value); // 使用新创建的对象覆盖原来的老的对象
```

## 如何使用会话累计用户的数据

使用可变的数据结构，比如数组、List、Map或含有可写字段的应用程序专有的数据结构。通过这种方式，除非首次分配对象，否则不需要调用 `setAttribute`。例如

```java
HttpSession Session = request.getSession();
SomeMutableClass value = (SomeMutableClass)Session.getAttribute(“someIdentifier”);
if(value = = null){
    value = new SomeMutableClass(…);
    Session.setAttribute(“someIdentifier”,value);
}else{
    value.updateInternalAttribute(…);   // 如果已经存在该对象则更新其属性而不需重新设置属性
}
```

## 不可更改对象 和 可更改对象 在会话数据更新时的不同处理

不可更改对象因为一旦创建之后就不能更改，所以每次要修改会话中属性的值的时候，都需要调用 `setAttribute(“someIdentifier”,newValue)` 来代替原有的属性的值，否则属性的值不会被更新。

可更改对象因为其自身一般提供了修改自身属性的方法，所以每次要修改会话中属性的值的时候，只要调用该可更改对象的相关修改自身属性的方法就可以了，这意味着我们就不需要调用 `setAttribute` 方法了

## Cookie 和 Session、SessionID的关系

SessionID 是一个会话的 key，浏览器第一次访问服务器会在服务器端生成一个 Session，有一个 SessionID 和它对应，并返回给浏览器，这个 SessionID 会被保存在浏览器的会话 Cookie 中。

Tomcat 生成的 SessionID 叫做 jSessionID

SessionID 在访问 Tomcat 服务器 `HttpServletRequest` 的 `getSession(true)` 的时候创建，Tomcat 的 ManagerBase 类提供创建SessionID 的方法：随机数+时间+jvmid。

Tomcat 的 StandardManager 类将 Session 存储在内存中，也可以持久化到 file，数据库，memcache，Redis等。

客户端只保存 SessionID 到 Cookie 中，而不会保存 Session。Session 不会因为浏览器的关闭而删除，只能通过程序调用 `HttpSession.invalidate()` 或超时才能销毁。

## 客户端用 Cookie 保存了 SessionID 时

客户端用 Cookie 保存了 SessionID，当我们请求服务器的时候，会把这个 SessionID 一起发给服务器，服务器会到内存中搜索对应的SessionID，如果找到了对应的 SessionID，说明我们处于登录状态，有相应的权限。

如果没有找到对应的 SessionID，这说明：要么是我们把浏览器关掉了（后面会说明为什么），要么 Session 超时了（没有请求服务器超过20分钟），Session 被服务器清除了，则服务器会给你分配一个新的 SessionID。你得重新登录并把这个新的 SessionID 保存在 Cookie中。

在没有把浏览器关掉的时候（这个时候假如已经把 SessionID 保存在 Cookie 中了）这个 SessionID 会一直保存在浏览器中，每次请求的时候都会把这个 SessionID 提交到服务器，所以服务器认为我们是登录的。

当然，如果太长时间没有请求服务器，服务器会认为我们已经所以把浏览器关掉了，这个时候服务器会把该 SessionID 从内存中清除掉，这个时候如果我们再去请求服务器，SessionID 已经不存在了，所以服务器并没有在内存中找到对应的 SessionID，所以会再产生一个新的 SessionID，这个时候一般我们又要再登录一次。 

## 客户端没有用 Cookie 保存 SessionID 时

这个时候如果我们请求服务器，因为没有提交 SessionID 上来，服务器会认为你是一个全新的请求，服务器会给你分配一个新的SessionID，这就是为什么我们每次打开一个新的浏览器的时候（无论之前我们有没有登录过）都会产生一个新的 SessionID（或者是会让我们重新登录）。

当我们一旦把浏览器关掉后，再打开浏览器再请求该页面，它会让我们登录，这是为什么？我们明明已经登录了，而且还没有超时，SessionID 肯定还在服务器上的，为什么现在我们又要再一次登录呢？这是因为我们关掉浏览再请求的时候，我们提交的信息没有把刚才的 SessionID 一起提交到服务器，所以服务器不知道我们是同一个人，所以这时服务器又为我们分配一个新的 SessionID。

打个比方：浏览器就好像一个要去银行开户的人，而服务器就好比银行， 这个要去银行开户的人这个时候显然没有帐号（SessionID），所以到银行后，银行工作人员问有没有帐号，他说没有，这个时候银行就会为他开通一个帐号（SessionID）。

所以可以这么说，每次打开一个新的浏览器去请求的一个页面的时候，服务器都会认为，这是一个新的请求，他为你分配一个新的SessionID。
