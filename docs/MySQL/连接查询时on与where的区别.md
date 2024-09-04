---
title: 连接查询时on与where的区别
date: 2020-06-03
tags: 
 - MySQL
categories:
 - MySQL
---

::: tip

join过程可以这样理解：首先两个表做一个笛卡尔积，on后面的条件是对这个笛卡尔积做一个过滤形成一张临时表，如果没有where就直接返回结果，如果有where就对这个临时表再次进行过滤。

:::

# 连接查询时on与where的区别

## 一、在使用 left  jion 时，on和where条件的区别

1、on条件是在 **生成临时表时** 使用的条件，它不管on中的条件是否为真，都会返回左边表中的记录。

2、where条件是在 **临时表生成好后**，再对临时表进行过滤的条件。这时已经没有left  join的含义（必须返回左边表的记录）了，条件不为真的就全部过滤掉。

假设有两张表：

表1：tab1

| id   | size |
| ---- | ---- |
| 1    | 10   |
| 2    | 20   |
| 3    | 30   |

表2：tab2

| size | name |
| ---- | ---- |
| 10   | AAA  |
| 20   | BBB  |
| 20   | CCC  |

运行以下两个语句：

``` sql
-- NO.1
select * form tab1 left join tab2 on (tab1.size = tab2.size) where tab2.name=’AAA’
-- NO.2
select * form tab1 left join tab2 on (tab1.size = tab2.size and tab2.name=’AAA’)
```

第一条SQL的过程：

 1、中间表 on条件:  tab1.size = tab2.size

| tab1.id | tab1.size | tab2.size | tab2.name |
| ------- | --------- | --------- | --------- |
| 1       | 10        | 10        | AAA       |
| 2       | 20        | 20        | BBB       |
| 2       | 20        | 20        | CCC       |
| 3       | 30        | (null)    | (null)    |

 2、再对中间表过滤 where 条件：tab2.name = ’AAA’

| tab1.id | tab1.size | tab2.size | tab2.name |
| ------- | --------- | --------- | --------- |
| 1       | 10        | 10        | AAA       |

 第二条SQL的过程：

中间表 on条件:  tab1.size = tab2.size and tab2.name = ’AAA’（条件不为真也会返回左表中的记录）

| tab1.id | tab1.size | tab2.size | tab2.name |
| ------- | --------- | --------- | --------- |
| 1       | 10        | 10        | AAA       |
| 2       | 20        | (null)    | (null)    |
| 3       | 30        | (null)    | (null)    |

比较上面两个SQL运行的结果可以发现：

对于left join连接查询，左边的表作为主表，不管是否满足on条件，都会返回每条记录。这一点是连接查询（left/right/full join）的特殊性所在。因此，对于多个on条件的连接查询，我们可以换一种思路理解，即这些on条件先对次表进行筛选过滤，然后将过滤的结果和主表进行匹配关联（这种匹配也是基于on条件的匹配，比如tab1.size = tab2.size）。而on后面的where是对条件关联后的临时表从整体上进行条件筛选。

## 二、on、where、having 的区别

on、where、having这三个都可以加条件的子句中，on是最先执行，where次之，having最后。有时候如果这先后顺序不影响中间结果的话，那最终结果是相同的。但因为on是先把不符合条件的记录过滤后才进行统计，它就可以减少中间运算要处理的数据，按理说应该速度是最快的。  

根据上面的分析，可以知道where也应该比having快点的，因为它过滤数据后才进行sum，所以having是最慢的。但也不是说having没用，因为有时在步骤3还没出来都不知道那个记录才符合要求时，就要用having了。  

在两个表联接时才用on的，所以在一个表的时候，就剩下where跟having比较了。在这单表查询统计的情况下，如果要过滤的条件没有涉及到要计算字段，那它们的结果是一样的，只是where可以使用rushmore技术，而having就不能，在速度上后者要慢。  

如果要涉及到计算的字段，就表示在没计算之前，这个字段的值是不确定的，根据上篇写的工作流程，where的作用时间是在计算之前就完成的，而having就是在计算后才起作用的，所以在这种情况下，两者的结果会不同。  

在多表联接查询时，on比where更早起作用。系统首先根据各个表之间的联接条件，把多个表合成一个临时表后，再由where进行过滤，然后再计算，计算完后再由having进行过滤。由此可见，要想过滤条件起到正确的作用，首先要明白这个条件应该在什么时候起作用，然后再决定放在哪里。

## 三、注意

如果我们把连接条件on放在了where后面，那么所有的left,right,等这些操作将不起任何作用，对于这种情况，它的效果就完全等同于inner连接。如：

```sql
-- NO.1
select * form tab1 left join tab2 on (tab1.size = tab2.size)
-- NO.2
select * form tab1 left join tab2 where (tab1.size = tab2.size)
```

第一个SQL中进行的左连接查询，按size字段进行匹配，保留全部tab1记录；第二个SQL中left join不起作用的，实质是inner join，连接产生临时表后，再使用where条件进行筛选。
