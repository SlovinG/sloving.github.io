---
title: 初识MyBatis
date: 2020-04-10
tags: 
 - SSM
 - MyBatis 
categories:
 - SSM 
---

::: tip MyBatis的前世今生

MyBatis 的前身是 iBATIS ，是Clinton Begin在2001年发起的一个开源项目，最初侧重于密码软件的开发，后来发展成为一款基于Java的持久层框架。2004年，Clinton将iBATIS的名字和源码捐赠给了Apache软件基金会。2010年，核心开发团队决定离开Apache软件基金会，并且将 iBATIS该名为MyBatis。

:::

# 初识MyBatis

## MyBatis 概述

MyBatis 是一款优秀的 <font color="red">**持久层框架**</font>

MyBatis是一个 <font color="red">**轻量级简化数据库操作的框架**</font>

MyBatis是支持定制化 SQL、存储过程以及高级映射的优秀的持久层框架。

MyBatis 避免了几乎所有的 JDBC 代码和手动设置参数以及获取结果集。MyBatis 可以对配置和原生Map使用简单的 XML 或注解，将接口和 Java 的 POJOs（Plain Old Java Objects，普通的 Java对象）映射成数据库中的记录

[**mybatis 官方网站 - The MyBatis Blog**](http://www.baidu.com/link?url=NMPCU7y09gbsVvgILRV6GuvAeSx9gXqAKWt_LcbGmp494TcRkB0PmTjy-MafjWPe)

## 持久化

**持久化是将程序数据在持久状态和瞬时状态间转换的机制：**

- 即把数据（如内存中的对象）保存到可永久保存的存储设备中（如磁盘）。持久化的主要应用是将内存中的对象存储在数据库中，或者存储在磁盘文件中、XML数据文件中等等。
- JDBC 是一种持久化机制，文件 IO 也是一种持久化机制。
- 在生活中 : 将鲜肉冷藏，吃的时候再解冻的方法也是，将水果做成罐头的方法也是。

**为什么需要持久化服务呢？那是由于内存本身的缺陷引起的：**

- 内存断电后数据会丢失，但有一些对象是无论如何都不能丢失的，比如银行账号等，遗憾的是，人们还无法保证内存永不掉电。
- 内存过于昂贵，与硬盘、光盘等外存相比，内存的价格要高2~3个数量级，而且维持成本也高，至少需要一直供电吧。所以即使对象不需要永久保存，也会因为内存的容量限制不能一直呆在内存中，需要持久化来缓存到外存。

## 持久层

**什么是持久层？**

- 完成持久化工作的代码块 -> dao层 【DAO (Data Access Object)  数据访问对象】
- 大多数情况下特别是企业级应用，数据持久化往往也就意味着将内存中的数据保存到磁盘上加以固化，而持久化的实现过程则大多通过各种 **关系型数据库** 来完成。
- 不过这里有一个字需要特别强调，也就是所谓的“层”。对于应用系统而言，数据持久功能大多是必不可少的组成部分。也就是说，我们的系统中，已经天然的具备了“持久层”概念？也许是，但也许实际情况并非如此。之所以要独立出一个“持久层”的概念,而不是“持久模块”，“持久单元”，也就意味着，我们的系统架构中，应该有一个相对独立的逻辑层面，专注于数据持久化逻辑的实现.
- 与系统其他部分相对而言，这个层面应该具有一个较为清晰和严格的逻辑边界。【说白了就是用来操作数据库存在的！】

## 为什么要使用MyBatis?

平时我们都用 JDBC 访问数据库，除了需要自己写SQL之外，还必须操作 Connection、Statement、ResultSet 这些其实只是手段的辅助类，不仅如此，访问不同的表，还会写很多雷同的代码，显得繁琐和枯燥：

<img src="./assets/580.png" style="zoom: 80%;" />

MyBatis 是一个半自动化的 **ORM框架 (Object Relationship Mapping) -->对象关系映射**

那么用了 Mybatis 之后，只需要自己提供 SQL 语句，其他的工作，诸如建立连接，Statement， JDBC相关异常处理等等都交给 Mybatis去做了，那些重复性的工作 Mybatis 也给做掉了，我们只需要关注在增删改查等操作层面上，而把技术细节都封装在了我们看不见的地方：

<img src="./assets/577.png" style="zoom:80%;" />

为了解决 JDBC 存在的问题和简化数据库操作，MyBatis 提供了较为优秀的解决方案：

- 可以通过主配置文件配置连接池解决频繁创建、释放数据库连接造成的性能影响 

动态 SQL 解决 JDBC 中硬编码的问题：
- Where 条件改变
- 占位符位置变化

可通过包装类方便的获取数据库查询结果集对象，使 Dao 层业务逻辑和数据库访问分离更易维护和测试。

MyBatis 的优点：


- 简单易学：本身就很小且简单。没有任何第三方依赖，最简单的安装过程只要两个 jar 文件 + 配置几个 sql 映射文件就可以了，易于学习，易于使用，通过文档和源代码，可以比较完全的掌握它的设计思路和实现。
- 灵活：Mybatis 不会对应用程序或者数据库的现有设计强加任何影响。sql 写在 xml 里，便于统一管理和优化。通过 sql 语句可以满足操作数据库的所有需求。
- 解除 sql 与程序代码的耦合：通过提供 DAO 层，将业务逻辑和数据访问逻辑分离，使系统的设计更清晰，更易维护，更易单元测试。sql 和代码的分离，提高了可维护性。
- 提供 xml 标签，支持编写动态 sql。
- .......

最重要的一点，使用的人多！公司需要！

## MyBatis 架构图

![](./assets/031.png)

## MyBatis 的工作原理

1. 读取 MyBatis 配置文件 `mybatis-config.xml` 。这是 MyBatis 的全局配置文件，配置了 MyBatis 的运行环境等信息，其中主要的内容是获取数据库连接。


2. 加载映射配置文件 `Mapper.xml` ，即 SQL 映射文件，该文件配置了操作数据库的 SQL 语句，需要在 `mybatis-config.xml` 中加载才能执行。`mybatis-config.xml` 可以加载多个配置文件，每个配置文件对应数据库中的一张表。
3. 通过 MyBatis 的环境等配置信息构建会话工厂 `SqlSessionFactory`。
4. 由会话工厂创建 `SqlSession` 对象，该对象中包含了执行 SQL 的所有方法。
5. MyBatis 底层定义了一个 `Executor` 接口来操作数据库，它会根据 `SqlSession` 传递的参数动态地生成需要执行的 SQL 语句，同时负责查询缓存的维护。
6. 在 `Executor` 接口的执行方法中，包含一个 `MappedStatement ` 类型的参数，该参数是对映射信息的封装，用于存储要映射的 SQL 语句的 id、参数等…… `Mapper.xml ` 文件中一个 SQL 对应一个 MappedStatement 对象，SQL 的 id 即是 MappedStatement 的 id。
7. 输入参数映射，其过程类似于 JDBC 编程中对 preparedStatement 对象设置参数的过程。
8. 输出参数映射，其过程类似于 JDBC 编程中对结果的解析处理过程。

## MyBatis 第一个程序

**思路流程：搭建环境--->导入Mybatis--->编写代码--->测试**

### 搭建实验数据库

```sql
CREATE DATABASE `mybatis`;

USE `mybatis`;

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
    `id` int(20) NOT NULL,
    `name` varchar(30) DEFAULT NULL,
    `pwd` varchar(30) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert  into `user`(`id`,`name`,`pwd`) values (1,'狂神','123456'),(2,'张三','abcdef'),(3,'李四','987654');
```

### 导入MyBatis相关 jar 包

- GitHub上找

```xml
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.47</version>
</dependency>
```

### 编写MyBatis核心配置文件

- 查看帮助文档

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
       PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
       "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
   <environments default="development">
       <environment id="development">
           <transactionManager type="JDBC"/>
           <dataSource type="POOLED">
               <property name="driver" value="com.mysql.jdbc.Driver"/>
               <property name="url" value="jdbc:mysql://localhost:3306/mybatis?useSSL=true&amp;useUnicode=true&amp;characterEncoding=utf8"/>
               <property name="username" value="root"/>
               <property name="password" value="123456"/>
           </dataSource>
       </environment>
   </environments>
   <mappers>
       <mapper resource="com/kuang/dao/userMapper.xml"/>
   </mappers>
</configuration>
```

### 编写MyBatis工具类

- 查看帮助文档

```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import java.io.IOException;
import java.io.InputStream;

public class MybatisUtils {

    private static SqlSessionFactory sqlSessionFactory;
    
    static {
        try {
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //获取SqlSession连接
    public static SqlSession getSession(){
        return sqlSessionFactory.openSession();
    }
}
```

### 创建实体类

```java
public class User {
   
    private int id;  //id
    private String name;   //姓名
    private String pwd;   //密码
   
    //构造,有参,无参
    //set/get
    //toString()
    
}
```

### 编写Mapper接口类

```java
import com.kuang.pojo.User;
import java.util.List;

public interface UserMapper {
    List<User> selectUser();
}
```

### 编写Mapper.xml配置文件

- namespace 十分重要，不能写错！

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
       PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
       "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.kuang.dao.UserMapper">
    <select id="selectUser" resultType="com.kuang.pojo.User">
        select * from user
    </select>
</mapper>
```

### 编写测试类

- Junit 包测试

```java
public class MyTest {
   @Test
   public void selectUser() {
       SqlSession session = MybatisUtils.getSession();
       //方法一:
       //List<User> users = session.selectList("com.kuang.mapper.UserMapper.selectUser");
       //方法二:
       UserMapper mapper = session.getMapper(UserMapper.class);
       List<User> users = mapper.selectUser();

       for (User user: users){
           System.out.println(user);
      }
       session.close();
  }
}
```

### 运行测试，成功的查询出来的我们的数据，ok！

## 问题说明

**可能出现的问题说明：Maven静态资源过滤问题**

```xml
<resources>
   <resource>
       <directory>src/main/java</directory>
       <includes>
           <include>**/*.properties</include>
           <include>**/*.xml</include>
       </includes>
       <filtering>false</filtering>
   </resource>
   <resource>
       <directory>src/main/resources</directory>
       <includes>
           <include>**/*.properties</include>
           <include>**/*.xml</include>
       </includes>
       <filtering>false</filtering>
   </resource>
</resources>
```

有了 MyBatis 以后再也不用写原生的 JDBC 代码了，舒服！
