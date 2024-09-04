---
title: JSON与AJAX总结
date: 2020-04-08
tags: 
 - AJAX
 - JSON
categories:
 - JavaWeb
---


# JSON和AJAX总结

## JSON 简介

- JSON JavaScript 对象表示法（**J**ava**S**cript **O**bject **N**otation） 是一种存储数据的方式。

- [**JSON官方文档**](http://www.json.org/json-zh.html)

- [**JSON在线解析及格式化验证**](http://www.baidu.com/link?url=PBcR_52qwPshS34XW9dLsgs3xgpA06G3tkRB4YqzYF3)

## 关于 JSON 对象

- JSON对象由 **名称 / 值 对** 组成
- 名称和值之间用冒号 **:** 隔开
- 名称必须用 **双引号 "** 包含起来
- 值可以是任意 javascript 数据类型，字符串，布尔，数字 ，数组甚至是对象
- 不同的 **名称/值 对** 之间用 逗号 **,** 隔开

  ```json
  var gareen = {
	    "name":"Micheal",
	    "age":19,
	    "sex":"男"
  };
  ```

- 通过 **点.** 访问 JSON 对象的属性

## JSON 的作用

由于其语法格式简单，层次结构鲜明，现多用于作为 **数据载体**，在网络中进行数据传输。

## JSON 数组

- 通过方括号[] 创建JSON 数组

  ```json
  var heros=
  [
      {"name":"盖伦","hp":616},
      {"name":"提莫","hp":313},
      {"name":"死歌","hp":432},
      {"name":"火女","hp":389}
  ]
  ```

- 访问 JSON 数组和访问普通数组一样，通过下标访问

## 使用 fastjson 解析JSON和序列化对象

`Fastjson` 使用也是比较简单的，分为以下三步完成

1. **导入坐标**

   ```xml
   <dependency>
       <groupId>com.alibaba</groupId>
       <artifactId>fastjson</artifactId>
       <version>1.2.62</version>
   </dependency>
   ```

2. **Java对象转JSON**

   ```java
   String jsonStr = JSON.toJSONString(obj);
   ```

   将 Java 对象转换为 JSON 串，只需要使用 `Fastjson` 提供的 `JSON` 类中的 `toJSONString()` 静态方法即可。

3. **JSON字符串转Java对象**

   ```java
   User user = JSON.parseObject(jsonStr, User.class);
   ```

   将 json 转换为 Java 对象，只需要使用 `Fastjson` 提供的 `JSON` 类中的 `parseObject()` 静态方法即可。


## AJAX简介及作用

- Ajax 即“Asynchronous Javascript And XML”（异步 JavaScript 和 XML），是指一种创建交互式、快速动态网页应用的网页开发技术，无需重新加载整个网页的情况下，能够更新部分网页的技术。
- 通过在后台与服务器进行少量数据交换，Ajax 可以使网页实现 **异步更新**。这意味着可以在不重新加载整个网页的情况下，对网页的某部分进行更新。
- **同步请求** 是指：浏览器页面发送请求给服务器后，在服务器处理请求的过程中，浏览器页面不能做其他的操作，只能等到服务器响应结束后，浏览器页面才能继续做其他的操作。
- **异步请求** 是指：浏览器页面发送请求给服务器后，在服务器处理请求的过程中，浏览器页面还可以做其他的操作。

## AJAX的应用领域及优点

- 应用领域：数据校验
- 优点：
  1.  用户体验比较好（不需要页面跳转，速度快）
  2. 服务器压力比较小

## 如何发起 AJAX 请求

### jQuery发起Ajax请求

```javascript
$.ajax({
	url:"xxxservlet",
	type:"post",
	data:{
		key:value,
		key:value
	},
	dataType:"json",
	success:function(msg){
		msg.key;
	}	
});
```

- 其他参数和用法可参照 [jQuery官方文档](http://api.jquery.com/jQuery.ajax/)

### JavaScript发起Ajax请求

```js
var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET","xxxservlet",true);
xmlhttp.send();
xmlhttp.onreadystatechange=function(){
	if (xmlhttp.readyState==4 && xmlhttp.status==200){
		//成功后的处理
	}
}
```

- 其他参数和用法可参照 [W3school-AJAX文档](https://www.w3school.com.cn/ajax/ajax_xmlhttprequest_send.asp)

## Axios

Axios 对原生的 AJAX 进行了封装，简化了书写，其官网是 https://www.axios-http.cn

### 基本使用

axios 使用是比较简单的，分为以下两步：

* 引入 axios 的 js 文件

  ```html
  <script src="js/axios-0.18.0.js"></script>
  ```

* 使用 axios 发送请求，并获取响应结果

  * 发送 get 请求

    ```js
    axios({
        method:"get",
        url:"http://localhost:8080/ajax-demo1/aJAXDemo1?username=zhangsan"
    }).then(function (resp){
        alert(resp.data);
    })
    ```

  * 发送 post 请求

    ```js
    axios({
        method:"post",
        url:"http://localhost:8080/ajax-demo1/aJAXDemo1",
        data:"username=zhangsan"
    }).then(function (resp){
        alert(resp.data);
    });
    ```

`axios()` 是用来发送异步请求的，小括号中使用 js 对象传递请求相关的参数：

* `method` 属性：用来设置请求方式的。取值为 `get` 或者 `post`。
* `url` 属性：用来书写请求的资源路径。如果是 `get` 请求，需要将请求参数拼接到路径的后面，格式为： `url?参数名=参数值&参数名2=参数值2`。
* `data` 属性：作为请求体被发送的数据。也就是说如果是 `post` 请求的话，数据需要作为 `data` 属性的值。

`then()` 需要传递一个匿名函数。我们将 `then()` 中传递的匿名函数称为 **回调函数**，意思是该匿名函数在发送请求时不会被调用，而是在成功响应后调用的函数。而该回调函数中的 `resp` 参数是对响应的数据进行封装的对象，通过 `resp.data` 可以获取到响应的数据。

### 请求方法别名

为了方便起见， Axios 已经为所有支持的请求方法提供了别名。如下：

* `get` 请求 ： `axios.get(url[,config])`

* `delete` 请求 ： `axios.delete(url[,config])`

* `head` 请求 ： `axios.head(url[,config])`

* `options` 请求 ： `axios.option(url[,config])`

* `post` 请求：`axios.post(url[,data[,config])`

* `put` 请求：`axios.put(url[,data[,config])`

* `patch` 请求：`axios.patch(url[,data[,config])`

而我们只关注 `get` 请求和 `post` 请求。

入门案例中的 `get` 请求代码可以改为如下：

```js
axios.get("http://localhost:8080/ajax-demo/axiosServlet?username=zhangsan").then(function (resp) {
    alert(resp.data);
});
```

入门案例中的 `post` 请求代码可以改为如下：

```js
axios.post("http://localhost:8080/ajax-demo/axiosServlet","username=zhangsan").then(function (resp) {
    alert(resp.data);
})
```
