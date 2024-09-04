---
title: JSTL和EL表达式
date: 2020-04-06
tags: 
 - JSP
categories:
 - JavaWeb
---

# JSTL和EL表达式

## EL表达式简介

- **EL**（Expression Language） 是**为了使JSP写起来更加简单**。它提供了在 JSP 中**简化表达式**的方法，让Jsp的代码更加简化。

## EL表达式能干什么

- 可以从域对象（request、session、application、pageContext）中取得数据

- 如果4个作用域都有同一个（同名）属性怎么办？

  EL会按照从高到低的**优先级顺序**获取数据： **pageContext>request>session>application**

## EL表达式取值

- 不同版本的tomcat是否默认开启对EL表达式的支持，是不一定的。所以为了保证EL表达式能够正常使用，需要在`<%@page` 标签里加上`isELIgnored="false"`

- 使用EL表达式，非常简单，比如使用JSTL输出要写成

``` jsp
<c:out value="${name}" /> 
```

- 但是用EL只需要

```
${name}
```

## EL表达式语法结构

- `${expression}`
```
${requestScope.key}
${pageContextScope.key}
${sessionScope.key}
${applicationScope.key}

${key} 如果不指定域，那么会依次从域中搜索key属性
```

- `${username}` 取得request里面名字为username的属性值（如果不存在返回空字符串）

```
${pageContext.request.contextPath} 返回根路径
${10+89} 支持放置表达式运算
${age>10} 支持做基础判断
${empty user} 判断是否是null对象
```

## JSTL简介

- JSTL：**JSP Standard Tag Library**标准标签库

  什么是标签库？可以使用一些具有**自定义功能**的标签。


- JSTL允许开发人员可以像使用HTML标签那样在JSP中开发Java功能
- JSTL库有core、i18n、fmt、sql 等等
- i18n和sql用的很少，core和fmt在工作中会用到
- JSTL和EL表达式是合作关系，一起使用可以让JSP写起来更加简单优雅

## 如何使用JSTL

1. 导入jar包

2. 引入jstl对应的标签库 taglib

   ```jsp
   <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
   ```

   prefix="c" 表示后续的标签使用都会以 **<c:** 开头
### 跟储存相关的标签（set、out、remove）
- 在作用域request中设置name,相当于`<%request.setAttribute("name","gareen")%>`

  ```jsp
  <c:set var="name" value="${'gareen'}" scope="request" />
  ```

- `<%=request.getAttribute("name")%>`可以写成：

  ```jsp
  <c:out value="${name}" />
  ```

- 在作用域request中删掉name,相当于`<%request.removeAttribute("name")%>`

  ```jsp
  <c:remove var="name" scope="request" />
  ```


### 条件标签（if、choose）

- JSTL通过`<c:if tesr=""`进行条件判断

  ```jsp
  <c:if test="${age>=19 }">
  <font color="green">你是成年人</font>
  </c:if>
  ```

- 但是 JSTL 没有`<c:else`，所以常用的办法是在`<c:if`的条件里取反，用`<c:if test="!"`来表示else

- 配合if使用的还有通过**empty**进行为空判断

- **empty**可以判断对象是否为null,字符串长度是否为0，集合长度是否为0

- 虽然JSTL没有提供else标签，但是提供了一个具有else功能的标签`choose`

  ```jsp
  <c:choose>
  	<c:when test="${age>=19 }">
  		<font color="green">你是成年人</font>
  	</c:when>
  	<c:otherwise>
  		<font color="red">未成年</font>
  	</c:otherwise>
  </c:choose>
  ```

### 循环标签

- 可以在JSP中使用for循环，但是其可读性很差。 借助JSTL的`c:forEach`标签，可以很好的改善可读性。

  ```jsp
  <c:forEach items="${lists }" var="user">
  	${user.username }:${user.age } <br/>
  </c:forEach>
  <c:forEach items="${map }" var="kv">
  	${kv.key }:${kv.value } <br/>
  </c:forEach>
  ```

- <font color="red">**一定要给属性提供get方法！**</font>

