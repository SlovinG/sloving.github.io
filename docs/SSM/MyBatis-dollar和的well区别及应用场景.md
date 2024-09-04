---
date: 2020-08-02
sidebar: auto
tags: 
 - MyBatis
categories:
 - SSM
---

# MyBatis-${}和#{}的区别及应用场景

动态 sql 是 Mybatis 的主要特性之一，在 mapper 中定义的参数传到 xml 中之后，在查询之前 Mybatis 会对其进行动态解析

Mybatis 提供了两种支持动态 sql 的语法：#{} 、${}

```sql
select * from t_user where username = '${username}';
select * from t_user where username = #{username};
```

username 传参一致的话,这两种执行的结果是一样的，但是这两种方式在动态 sql 解析阶段的处理是不一样的

## #{}

**#{变量名}** 会进行预编译、类型匹配等操作，传入参数会转化为 jdbc 的类型。

例如：

```sql
select * from tablename where id = #{id}；
```

假设 id 的值为12，其中如果数据库字段 id 为字符型，那么 `#{id}`表示的就是`'12'`，如果id为整型，那么id就是 `12`。

MyBatis会将 `#{id}` 解析为一个 JDBC 预编译语句的参数标记符，把参数部分用占位符`?`代替。动态解析为：

```sql
select * from tablename where id = ?；
```

而传入的参数将会经过 `PreparedStatement` 方法的强制类型检查和安全检查等处理，最后作为一个合法的字符串传入。

## ${}

**${变量名}** 不会进行数据类型匹配，直接替换。

例如：

```sql
select * from tablename where id = ${id}；
```

如果字段id为整型，sql语句就不会出错，但是如果字段id为字符型， 那么sql语句应该写成

```sql
select * from table where id = '${id}'
```

MyBatis只会做简单的字符串替换，在动态SQL解析阶段将会进行变量替换，动态解析为：

```sql
select * from tablename where id = 12；
```

## 二者的对比

**#{变量名}** 预处理之后可以预防 SQL 注入，而 **${变量名}** 在预编译之前就已经被替换，有被注入的风险

如果传入的 **username** 为 **a' or '1=1**，那么使用 ${} 处理后直接替换字符串的 sql 就解析为：

```sql
select * from t_user where username = a' or '1=1' ;
```

这样的话所有的用户数据就被查出来了，这样就属于 SQL 注入。

如果使用 `#{}`，经过sql动态解析和预编译，会把单引号转义为 `\'` 那么sql最终解析为：

```sql
select * from t_user where username = "a\' or \'1=1 ";
```

这样会查不出任何数据，有效阻止sql注入。

有的业务场景经常用到模糊查询，也就是 like 处理，推荐使用以下处理方式：

```sql
t_user.username like #username#
```

java代码里：

```java
if (!StringUtil.isEmpty(this.username)) {
	table.setUsername("%" + this.username + "%");
}
```

或者也可以使用数据库函数进行连接处理：

```sql
select * from t_user u where username like CONCAT('%', #username#, '%');
```

## 只可使用${变量名}的场景

如 order by 后的 `排序字段`，`表名`、`列名`,因为需要替换为不变的常量，则只可使用 `${}`

例：

```sql
select * from #{tablename} where id = ${id}；
```

如果表名中使用 `#{}`的话传参为 `t_user`，会变成 `select * from 't_user'`，没有这样的表名，这样的话就会报错了，`order by` 同理。

## 性能考虑

因为预编译语句对象可以重复利用，把一个sql预编译后产生的 `PreparedStatement` 对象缓存下来，下次对于同一个 sql，可以直接使用缓存的 `PreparedStatement` 对象，mybatis默认情况下，对所有的sql进行预编译，这样的话 `#{}` 的处理方式性能会相对高些。

## 总结

- 能使用 #{} 的时候尽量使用 #{} 

- 表名、order by 的排序字段作为变量时，使用${}
