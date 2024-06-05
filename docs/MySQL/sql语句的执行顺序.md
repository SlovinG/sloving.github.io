---
title: sql语句的执行顺序
date: 2020-06-15
tags: 
 - MySQL
categories:
 - MySQL
---

::: tip 为什么要了解sql语句的执行顺序
了解一个sql语句的执行顺序，可以让我们清楚到sql执行时的操作顺序，进而有利于我们更好的优化自己的sql语句，提升程序性能。
:::

# sql语句的执行顺序

## 一、举例

```sql
--sql 1
select a.* from table_a a left join table_b b on a.id = b.a_id where b.name = 'john';
 
--sql 2
select * from table_a where id = (select a_id from table_b where name = 'john');
```

倘若说 table_a 和 table_b 都是几十几百万数据的表，而 `name = ‘john’` 这个过滤字段可以查到 table_b 的唯一数据。

那么此时，一定是sql2的执行效率要高于sql1的。为什么？通过sql语句的执行顺序可以知道，table_a 和 table_b 会优先执行联表操作。两个都是大表，其查询出来的结果集虚拟表也会很大。而sql2中，table_a 只用通过 table_b 查询出来的唯一数据更快的获取到指定结果。

所以，如果你不知道sql执行顺序，同样的业务需求，也许，你就使用了性能不够好的sql1了。

## 二、sql语句定义时的顺序

```sql
(1)SELECT
(2)DISTINCT<select_list>
(3)FROM <left_table>
(4)<join_type> JOIN <right_table>
(5)ON <join_condition>
(6)WHERE <where_condition>
(7)GROUP BY <group_by_list>
(8)WITH {CUBE|ROLLUP}
(9)HAVING <having_condition>
(10)ORDER BY <order_by_condition>
(11)LIMIT <limit_number>
```

## 三、sql语句执行时的顺序

```sql
(8)SELECT
(9)DISTINCT<select_list>
(1)FROM <left_table>
(3)<join_type> JOIN <right_table>
(2)ON <join_condition>
(4)WHERE <where_condition>
(5)GROUP BY <group_by_list>
(6)WITH {CUBE|ROLLUP}
(7)HAVING <having_condition>
(10)ORDER BY <order_by_list>
(11)LIMIT <limit_number>
```

**可以看到，在这十一个步骤中，最先执行的是FROM操作，最后执行的是LIMIT操作**

<font color='red'>**每个操作都会产生一个虚拟表，该虚拟表将作为下一个处理的输入**</font>

执行顺序：

**(1) FROM**：对 FROM 子句中的左表 `<left_table>` 和右表 `<right_table>` 执行笛卡儿积，产生虚拟表 VT1

**(2) ON**：对虚拟表 VT1 进行 ON 筛选，只有那些符合 `<join_condition>` 的行才被插入虚拟表 VT2

**(3) JOIN**：如果指定了 `OUTER JOIN` （如 LEFT OUTER JOIN、RIGHT OUTER JOIN），那么保留表中未匹配的行作为外部行添加到虚拟表 VT2 ，产生虚拟表 VT3 。如果FROM子句包含两个以上的表，则对上一个连接生成的结果表 VT3 和下一个表重复执行步骤1~步骤3，直到处理完所有的表

**(4) WHERE**：对虚拟表 VT3 应用 WHERE 过滤条件，只有符合 `<where_condition>` 的记录才会被插入虚拟表VT4

**(5) GROUP By**：根据 GROUP BY 子句中的列，对 VT4 中的记录进行分组操作，产生 VT5

**(6) CUBE|ROllUP**：对 VT5 进行 CUBE 或 ROLLUP 操作，产生表 VT6

**(7) HAVING**：对虚拟表 VT6 应用 HAVING 过滤器，只有符合 `<having_condition>` 的记录才会被插入到 VT7

**(8) SELECT**：第二次执行 SELECT 操作，选择指定的列，插入到虚拟表 VT8 中

**(9) DISTINCT**：去除重复，产生虚拟表 VT9

**(10) ORDER BY**：将虚拟表 VT9 中的记录按照 `<order_by_list>` 进行排序操作，产生虚拟表 VT10

**(11) LIMIT**：取出指定几行的记录，产生虚拟表 VT11 ，并返回给查询用户
