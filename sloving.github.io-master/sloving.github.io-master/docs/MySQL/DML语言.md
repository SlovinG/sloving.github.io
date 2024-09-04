---
title: DML语言
date: 2020-05-20
tags: 
 - MySQL
categories:
 - MySQL
---

::: tip

数据操作语言（**DML：Data Manipulation Language**）：其语句包括动词INSERT、UPDATE和DELETE。它们分别用于添加、修改和删除

:::

# DML语言

## 一、外键

### 1、外键概念

如果公共关键字在一个关系中是主关键字，那么这个公共关键字被称为另一个关系的外键。由此可见，外键表示了两个关系之间的相关联系。以另一个关系的外键作主关键字的表被称为**主表**，具有此外键的表被称为主表的**从表**

在实际操作中，将一个表的值放入第二个表来表示关联，所使用的值是第一个表的主键值(在必要时可包括复合主键值)。此时，第二个表中保存这些值的属性称为外键(**foreign key**)。

### 2、外键作用

保持数据**一致性**，**完整性**，主要目的是控制存储在外键表中的数据,**约束**。使两张表形成关联，外键只能引用外表中的列的值或使用空值。

### 3、创建外键

建表时指定外键约束

```sql
-- 创建外键的方式一 : 创建子表同时创建外键

-- 年级表 (id\年级名称)
CREATE TABLE `grade` (
`gradeid` INT(10) NOT NULL AUTO_INCREMENT COMMENT '年级ID',
`gradename` VARCHAR(50) NOT NULL COMMENT '年级名称',
PRIMARY KEY (`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

-- 学生信息表 (学号,姓名,性别,年级,手机,地址,出生日期,邮箱,身份证号)
CREATE TABLE `student` (
`studentno` INT(4) NOT NULL COMMENT '学号',
`studentname` VARCHAR(20) NOT NULL DEFAULT '匿名' COMMENT '姓名',
`sex` TINYINT(1) DEFAULT '1' COMMENT '性别',
`gradeid` INT(10) DEFAULT NULL COMMENT '年级',
`phoneNum` VARCHAR(50) NOT NULL COMMENT '手机',
`address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
`borndate` DATETIME DEFAULT NULL COMMENT '生日',
`email` VARCHAR(50) DEFAULT NULL COMMENT '邮箱',
`idCard` VARCHAR(18) DEFAULT NULL COMMENT '身份证号',
PRIMARY KEY (`studentno`),
KEY `FK_gradeid` (`gradeid`),
CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade` (`gradeid`)
) ENGINE=INNODB DEFAULT CHARSET=utf8
```

建表后修改

```sql
-- 创建外键方式二 : 创建子表完毕后,修改子表添加外键
ALTER TABLE `student`
ADD CONSTRAINT `FK_gradeid` FOREIGN KEY (`gradeid`) REFERENCES `grade` (`gradeid`);
```

### 4、删除外键

操作：删除 grade 表，发现报错

<img src="./assets/201.png" style="zoom:50%;" />

**注意**：删除具有主外键关系的表时，要先删子表，后删主表

```sql
-- 删除外键
ALTER TABLE student DROP FOREIGN KEY FK_gradeid;
-- 发现执行完上面的,索引还在,所以还要删除索引
-- 注:这个索引是建立外键的时候默认生成的
ALTER TABLE student DROP INDEX FK_gradeid;
```

## 二、DML语言

**数据库意义** ： 数据存储、数据管理

**管理数据库数据的方法：**

- 通过 SQLyog 等管理工具管理数据库数据
- 通过**DML语句**管理数据库数据

**DML语言**  ：数据操作语言

- 用于操作数据库对象中所包含的数据

- 包括 :

  - INSERT (添加数据语句)

  - UPDATE (更新数据语句)
  - DELETE (删除数据语句)


## 三、添加数据

### 1、INSERT命令

**语法：**

```sql
INSERT INTO 表名[(字段1,字段2,字段3,...)] VALUES('值1','值2','值3')
```

**注意 :** 

- 字段或值之间用英文逗号隔开
- **' 字段1,字段2...'** 该部分可省略 , 但添加的值务必与表结构，数据列，顺序相对应，且数量一致
- 可同时插入多条数据 , values 后用英文逗号隔开

```sql
-- 使用语句如何增加语句?
-- 语法 : INSERT INTO 表名[(字段1,字段2,字段3,...)] VALUES('值1','值2','值3')
INSERT INTO grade(gradename) VALUES ('大一');

-- 主键自增,那能否省略呢?
INSERT INTO grade VALUES ('大二');

-- 查询:INSERT INTO grade VALUE ('大二')错误代码：1136
Column count doesn`t match value count at row 1

-- 结论:'字段1,字段2...'该部分可省略,但添加的值务必与表结构,数据列,顺序相对应,且数量一致.

-- 一次插入多条数据
INSERT INTO grade(gradename) VALUES ('大三'),('大四');
```

## 四、修改数据

### 1、update命令

语法：

```sql
UPDATE 表名 SET column_name=value [,column_name2=value2,...] [WHERE condition];
```

**注意 :** 

- column_name 为要更改的数据列
- value 为修改后的数据，可以为变量、具体值、表达式或者嵌套的 SELECT 结果
- condition 为筛选条件，如不指定则修改该表的 **所有列数据**

### 2、where条件子句

可以简单的理解为：有条件地从表中筛选数据

![](./assets/233.png)

测试：

```sql
-- 修改年级信息
UPDATE grade SET gradename = '高中' WHERE gradeid = 1;
```

## 五、删除数据

### 1、DELETE命令

语法：

```sql
DELETE FROM 表名 [WHERE condition];
```

注意：condition为筛选条件 , 如不指定则删除该表的所有列数据

```sql
-- 删除最后一个数据
DELETE FROM grade WHERE gradeid = 5
```

### 2、TRUNCATE命令

作用：用于完全清空表数据 , 但表结构、索引 、约束等不变 ;

语法：

```sql
TRUNCATE [TABLE] table_name;

-- 清空年级表
TRUNCATE grade
```

**注意：区别于DELETE命令**

- 相同：都能删除数据，不删除表结构，但TRUNCATE速度更快

- 不同：

  - 使用 `TRUNCATE TABLE` 会重新设置 `AUTO_INCREMENT` 计数器

  - 使用 `TRUNCATE TABLE` 不会对事务有影响


测试：

```sql
-- 创建一个测试表
CREATE TABLE `test` (
`id` INT(4) NOT NULL AUTO_INCREMENT,
`coll` VARCHAR(20) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8

-- 插入几个测试数据
INSERT INTO test(coll) VALUES('row1'),('row2'),('row3');

-- 删除表数据(不带where条件的delete)
DELETE FROM test;
-- 结论:如不指定Where则删除该表的所有列数据,自增当前值依然从原来基础上进行,会记录日志.

-- 删除表数据(truncate)
TRUNCATE TABLE test;
-- 结论:truncate删除数据,自增当前值会恢复到初始值重新开始;不会记录日志.

-- 同样使用DELETE清空不同引擎的数据库表数据.重启数据库服务后
-- InnoDB : 自增列从初始值重新开始 (因为是存储在内存中,断电即失)
-- MyISAM : 自增列依然从上一个自增数据基础上开始 (存在文件中,不会丢失)
```
