---
title: xml总结
date: 2020-03-19
tags: 
 - XML
categories:
 - JavaWeb
---

# xml总结

## xml 简介

xml 的全称为EXtensible Markup Language，是一种可扩展的标记语言。

**标记语言** 是通过标签来描述数据的一门语言，标签有时我们也将其称之为元素。

**可扩展** 是指标签的名字是可以自定义的，XML文件是由很多标签组成的，而标签名是可以自定义的。

html 也是标记语言，但 html 里面的标记是固定的，每个标记有自己的功能。

xml 用于进行存储数据和传输数据，也常常作为软件的配置文件，按照 xml 规则编写的文本文件称为 xml 文件。

## xml 作为配置文件的优势

在 web 开发中的很多配置文件都使用 xml 来编写，是因为使用 xml 编写配置文件结构清晰、配置清楚，而且代码的可维护性更高。

## xml 的作用

- 编写配置文件
- 数据传输
- 假设有一个手机 APP 客户端，是一个网上商城的软件，打开软件需要显示商品列表，那么这个商品列表的数据就可以使用 xml 来传输。

## xml语法特点

- 大小写敏感：`<Message></Message> `与`<message></message>`是两个不同的标签
- 有开始标记必须有结束标记（标记是成套的）
- 标记可以是单标记，但必须自己闭合 `<xxxx/>`
- 标记可以包含标记（可以嵌套，嵌套成对嵌套）
- 标记可以有自己的属性（属性值必须加引号）
- 标记里面可以有内容
- 必须有根标记，也叫做根元素。（根元素是其他元素的父元素）

- xml文档声明 `<?xml version="1.0" encoding="UTF-8"?>` 必须放在第一行

- 标记不能使用空格和冒号，不建议使用 XML xml Xml 等跟 xml 相关的名字
  
- xml中特殊符号的表示一般采用**实体引用**：

|实体引用|代表符号|含义|
| :---: | :--: |:-:|
| `&lt;`   | <    | 小于   |
| `&gt;`   | >    | 大于   |
| `&amp;`  | &    | 和号   |
| `&apos;` | '    | 单引号 |
| `&quot;` | "    | 引号   |

- 注释 `<!-- 注释内容 -->`

## 对 XML 的约束

- 平时编写 xml 文件的时候，是没有固定规则的，标记名，属性名，属性值我们可以按照我们的需求随意来开发。
- 但是当我们使用别人的框架的时候，一般需要提供一个配置文档，来配置我们使用这个框架的时候的一些属性。这个时候，这个配置文档就需要按照框架的要求来编写。框架的要求就是对 xml 文档的约束。我们可以通过 DTD 和 Schema 文档来编写对文档的约束。

- DTD，Schema

  ```java
  java.util.Date
  java.sql.Date
  
  Date d = null;
  
  java.util.Date d = null;
  ```

- 定义了约束之后，可以防止我们写错文档。比如某个配置文件，按照相同的约束来书写，更容易让别人阅读或者让别的程序来读取。

## DTD是什么

- DTD用来约束 xml 文档，规定 xml 文档中元素的名称，子元素的名称和顺序，元素的属性。
- 一般来说我们很少编写自己的 DTD 文档约束，我们一般会遵循框架提供的 DTD 约束文档来编写配置文件。
- 当我们编写的xml不符合 DTD 约束规则的时候，程序会报错，方便我们找错。

## 怎么引入DTD约束

1. 内部引入

2. 外部引入（本地）	

3. 外部引入（网络）

   比如 Struts 框架的配置文档的首行：

   ```dtd
   <!DOCTYPE validators PUBLIC "-//Apache Struts//XWork Validator 1.0.3//EN" "http://struts.apache.org/dtds/xwork-validator-1.0.3.dtd">
   ```

- 详见 [DTD引用-w3school文档](http://www.w3school.com.cn/dtd/dtd_intro.asp)

## schema 约束（比 DTD 厉害，可以替代DTD）

- schema 约束文档本身也是一个 xml 文档，后缀为`.xsd`
- schema 的优点：
  - 语法更加容易阅读，更加友好
  - 功能更加强大，类型更加完善
  - 有命名空间
- 同样，我们也不需要写schema约束文档，我们只需要直接使用框架提供给我们的约束文档即可。
- 详见 [schema文档的使用](http://www.w3school.com.cn/schema/schema_howto.asp)

## xml 的解析方式

xml 的解析就是从 xml 中获取到数据。

xml 的解析采用 DOM（Document Object Model / 文档对象模型）方式。

DOM 文档对象模型为树形结构

DOM 方式解析，就是把 xml 文档加载到内存中，形成树形结构，可以进行增删改的操作。

xml 里面的 dom 和 html 里面的 dom 差不多，都是用来解析标签的，解析成一个树，并得到一个document 对象。

![452](./assets/452.png)

常见的解析工具：

+ JAXP：SUN 公司提供的一套 XML 的解析的 API
+ JDOM：开源组织提供了一套 XML 的解析的 API-jdom
+ DOM4J：开源组织提供了一套 XML 的解析的 API-dom4j，全称：Dom For Java
+ pull：主要应用在 Android 手机端解析 XML

## 解析的流程

1. 解析根元素

2. 解析根元素下的子元素
3. 解析一个元素有哪些属性
4. 得到元素的文本内容
5. 修改、添加、删除某个元素节点
6. 修改、添加、删除某个属性

如何用dom4j解析xml代码详见 [DOM4J的用法](https://blog.csdn.net/qq_24065713/article/details/77970469)

本篇的内容，会在后面的开发过程中慢慢接触到，需要有所了解。

