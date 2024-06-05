---
title: JDBC 各个类的详解
date: 2020-08-02
tags: 
 - Java
 - JDBC
categories:
 - Java
---

::: tip 

Java DateBase Connectivity （Java数据库连接， Java语言操作数据库）

JDBC **本质**是SUN公司定义的一套操作所有关系型数据库的规则，即 **接口**。各个数据库厂商去实现这套接口，提供数据库驱动jar包。我们可以使用这套接口编程，但真正执行的代码是 **驱动jar包中的实现类**。

:::

# JDBC各个类的详解

## 一、快速入门

### 我们为什么要使用JDBC

![284](./assets/284.png)

### 使用JDBC开发要使用的包

* **java.sql**：所有与 JDBC 访问数据库相关的接口和类

* **javax.sql**：数据库扩展包，提供数据库额外的功能。如：连接池

* **数据库的驱动**：由各大数据库厂商提供，需要额外去下载，是**实现 JDBC 接口的一些类**

### 具体步骤

1. 导入驱动jar包  `mysql-connector-java-5.1.37-bin.jar`
	1. 复制 `mysql-connector-java-5.1.37-bin.jar` 文件到项目的 `libs` 目录下

	2. 项目文件夹 右键 --> `Add As Library`
2. 注册驱动（让程序知道导入的是哪一个版本的jar包），`Class.forName`（数据库驱动实现类） 

3. 获取数据库连接对象 **Connection** （本地java代码和数据库之间的一个桥梁对象）
4. 定义 sql 语句
5. 获取执行 sql 语句的对象 **Statement** （因为 **Connection** 不能直接执行）
6. 执行 sql，接受返回结果
7. 处理结果
8. 释放资源（避免内存泄露）

### 代码实现

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 * JDBC快速入门
 */
public class JdbcDemo1 {
    public static void main(String[] args) throws Exception {

        //1. 导入所使用的数据库相对应的驱动jar包
        //2. 注册驱动
        Class.forName("com.mysql.jdbc.Driver");
	        /*
	        	Class.forName()
					装载一个类并且对其进行实例化的操作，
					装载过程中使用到的类加载器是当前类。
			*/
        //3. 获取数据库连接对象
        Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/db3", "root", "root");	
			/*
				DriverManager：驱动管理对象
				Connection：数据库连接对象
				Java DriverManager.getConnection() 方法用于获得试图建立到指定数据库 URL 的连接。 里面的参数为：数据库的url、用户名、密码
			*/
        //4. 定义sql语句
        String sql = "update account set balance = 500 where id = 1";
        //5. 获取一个可执行的sql的对象 Statement
        Statement stmt = conn.createStatement();
	        /*
				Statement：执行sql的对象
			*/
        //6. execute执行sql语句
        int count = stmt.executeUpdate(sql);
        //7. 处理结果
        System.out.println(count);
        //8. 按顺序释放资源
        stmt.close();
        conn.close();
    }
}
```

## 二、JDBC 各个类的功能详解

### DriverManager：驱动管理对象

#### **注册驱动**：告诉程序该使用哪一个数据库驱动 jar

驱动包里实现注册驱动的静态方法：

```java
static void registerDriver(Driver driver);
//注册与给定的驱动程序 DriverManager 。
```

而写代码时我们使用的是：

```java
Class.forName("com.mysql.jdbc.Driver");
```

**有一些类在加载进内存的时候会自动执行类中的某些方法。**

通过查看源码我们可以发现：在 `com.mysql.jdbc.Driver` 类中存在**静态代码块**，此代码块实现了**DriverManager** 中的方法，我们使用的写法只是更加简单而已：

```java
static {
    try {
        java.sql.DriverManager.registerDriver(new Driver());
    }catch (SQLException E){
        throw new RuntimeException("Can't register driver!");
    }
}
```

::: warning

MySQL 5.* 版本开始，**注册驱动**的步骤可以省去不写，因为驱动包会自动帮我们注册驱动。

当然你写了也没事，注意路径别写错就行。

:::

#### **获取数据库连接**

驱动包里的静态方法：

```java
static Commection getConnection(String url, String user, String password);
```

三个参数：

- **url**：指定连接的路径
  - 语法：**jdbc:mysql://ip地址(域名):端口号/数据库名称**
  - 例子：jdbc:mysql://localhost : 3306/db3
  - 细节：如果连接的是本机mysql服务器，并且mysql服务默认端口是3306，则ip地址和端口号可以省略不写，即url可以简写为：jdbc:mysql:///数据库名称

- **user**：用户名

- **password**：密码

### Connection：数据库连接对象

#### 获取执行 sql 的对象

```java
Statement createStatement( );
    
PrepareStatement prepareStatement(String sql);
```

#### 管理事务

- 开启事务：

  ```java
  void setAutoCommit(boolean autoCommit);  
  //调用该方法设置参数为false，即开启事务
  ```

- 提交事务：

  ```java
  void commit( );
  ```

- 回滚事物：

  ```java
  void rollback( );
  ```

### Statement：执行sql的对象

#### 执行 sql

- 可以执行任意的 sql 的方法。但使用并不多，了解即可：

  ```java
  boolean execute(String sql); 
  ```

- 可以执行DML（insert、update、dalete）语句、DDL（create、alter、drop）语句的方法。

  其返回值代表的是影响的行数，可以通过这个影响的行数来判断DML语句是否执行成功 ，返回值 >0 则执行成功，反之，则执行失败：

  ```java
  int executeUpdate(String sql);
  ```

* 可以执行DQL语句（select）语句的方法。

  ```java
  ResultSet executQuery(String sql);
  ```

### ResultSet：结果集对象，封装查询结果

* 游标向下移动一行，判断当前行是否是最后一行末尾（是否有数据），如果是，则返回false，如果不是则返回true：

  ```java
  boolean next();
  ```

* 获取数据：

  ```java
  getXxx(参数)
  ```

  * Xxx：代表数据类型   如：int getInt()，String getString()
  * 参数：
  	1. **int**: 代表表中列的编号，从 **1** 开始   如：getString(1)
  	2. **String**: 代表列名称， 如：getDouble("balance")

* 使用步骤：
  1. 游标向下移动一行
  2. 判断是否有数据
  3. 获取数据

### PreparedStatement：执行 sql 的对象

**PreparedStatement** 是 **Statement**的子接口，但功能更加强大

#### sql 注入的问题

在拼接sql时，有一些sql特殊关键字参与字符串的拼接，会造成安全问题！

随便输入用户，输入密码：`a' or 'a' = 'a` 即可实现成功登录：

```sql
select * from user where username = 'fhdsjkf' and password = 'a' or 'a' = 'a'; 
-- password将永远为true
```

#### 解决 sql 注入的问题：使用 PreparaedStatement 对象

1. 预编译SQL：参数使用 `?` 作为占位符

2. 步骤：

  1. 导入jar包  `mysql-connector-java-5.1.37-bin.jar`

  2. 注册驱动

  3. 获取数据库连接对象 `Connection`

  6. 定义sql：

     注意：sql的参数使用 `?` 作为占位符。如：
```sql
select * from user where username = ? and password = ?;
```

  5. 获取执行sql语句的对象   `PreparedStatement Connection.prepareStatement(String sql)`

  6. 给 `?` 赋值，需要两个参数：
```java
setXxx(参数1，参数2);
```
参数1：`?` 的位置编号，从1开始计数

参数2：`?` 的值

7. 执行sql，接受返回结果，不需要传递sql语句。

8. 处理结果

9. 释放资源

一般我们都会使用 `PreparedStatement` 来完成增删改查的所有操作，因为这样可以**防止SQL注入，而且效率更高**。
