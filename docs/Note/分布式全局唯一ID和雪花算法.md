---
title: 分布式全局唯一ID和雪花算法
date: 2023-11-30
sidebar: auto
tags: 
 - 雪花算法
categories:
 - 笔记
---
# 分布式全局唯一ID和雪花算法

## 为什么需要分布式全局唯一ID以及分布式ID的业务需求

在复杂分布式系统中，往往需要对大量的数据和消息进行唯一标识，如在美团点评的金融、支付、餐饮、酒店等产品的系统中，数据逐渐增长，对数据库分库分表后需要有一个唯一 ID 来标识一条数据或信息。

此时一个能够生成全局唯一ID的系统是非常必要的。

![图片](./assets/9012.png)

## ID 生成规则的部分硬性要求

- **全局唯一**

- **趋势递增**：在 MySQL 的 InnoDB 引擎中使用的是聚集索引，由于多数 RDBMS 使用 Btree 的数据结构来存储索引，在主键的选择上面我们应该尽量使用有序的主键，保证写入的性能
- **单调递增**：保证下一个 ID 一定大于上一个 ID，满足事务版本号、IM 增量消息、排序等特殊需求
- **信息安全**：如果 ID 是连续，恶意用户的爬取工作就非常容易做了，直接按照顺序下载指定 URL 即可，如果是订单号就危险了，竞争对手可以直接知道我们一天的单量，所以在一些应用场景下，需要 ID 无明显规则，让竞争对手不好猜
- **含时间戳**：能够快速在开发中，了解这个分布式 ID 是什么时候生成的

## ID 号生成系统的可用性要求

**高可用**：发布一个获取分布式 ID 请求，服务器就要保证 99.999% 的情况下给我创建一个唯一分布式 ID

**低延迟**：发一个获取分布式 ID 的请求，服务器就要快，极速

**高 QPS**：例如并发一口气 10 万个创建分布式 ID 请求同时杀过来，服务器要顶得住且一下子成功创建 10 万个分布式 ID

## 常用的解决方案

### UUID

`UUID.randomUUID()`, UUID 的标准型包含 32 个 16 进制数字，以连字号分为五段，形式为 8-4-4-4-12 的 36 个字符，性能非常高，本地生成，没有网络消耗。

#### 存在的问题

**入数据库性能差，因为 UUID 是无序的**

无序，也就不能生成递增有序的数字。

首先分布式 id 一般都会作为主键，但是按照 MySQL 官方推荐主键尽量越短越好，UUID 每一个都很长，所以不是很推荐。**在特定的环境下会存在一些问题**

比如做 DB 主键的场景下，UUID 就非常不适用，MySQL 官方有明确的说明。

**索引，B+ 树索引的分裂**

既然分布式 ID 是主键，然后主键是包含索引的，而 MySQL 的索引是通过 B+ 树来实现的，每一次新的 UUID 数据的插入，为了查询的优化，都会对索引底层的B+树进行修改，因为 UUID 数据是无序的，所以每一次 UUID 数据的插入都会对主键的 B+ 树进行很大的修改，这一点很不好，插入完全无序，不但会导致一些中间节点产生分裂，也会白白创造出很多不饱和的节点，这样大大降低了数据库插入的性能。

### 数据库自增主键

#### 单机

在分布式里面，数据库的自增 ID 机制的主要原理是：数据库自增 ID 和 MySQL 数据库的 `replace into` 实现的，这里的 `replace into` 跟 insert 功能类似，不同点在于：`replace into` 首先尝试插入数据列表中，如果发现表中已经有此行数据（根据主键或唯一索引判断）则先删除，再插入，否则直接插入新数据。

`REPLACE INTO` 的含义是插入一条记录，如果表中唯一索引的值遇到冲突，则替换老数据：

```sql
CREATE TABLE t_test (
    id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    stub CHAR(1) NOT NULL DEFAULT '',
    UNIQUE KEY stub (stub)
)
```

```
REPLACE into t_test(stub) values('b');
select LAST_INSERT_ID();
```

我们每次插入的时候，发现都会把原来的数据给替换，并且 ID 也会增加

这就满足了

- 递增性
- 单调性
- 唯一性

在分布式情况下，并且并发量不多的情况，可以使用这种方案来解决，获得一个全局的唯一ID

#### 集群分布式集群

那数据库自增ID机制适合做分布式ID吗？答案是不太适合

系统水平扩展比较困难，比如定义好步长和机器台数之后，如果要添加机器该怎么办，假设现在有一台机器发号是：1,2,3,4,5,（步长是1），这个时候需要扩容机器一台，可以这样做：把第二胎机器的初始值设置得比第一台超过很多，貌似还好，但是假设线上如果有100台机器，这个时候扩容要怎么做，简直是噩梦，所以系统水平扩展方案复杂难以实现。

数据库压力还是很大，每次获取ID都得读写一次数据库，非常影响性能，不符合分布式ID里面的延迟低和高QPS的规则（在高并发下，如果都去数据库里面获取ID，那是非常影响性能的）

### 基于 Redis 生成全局 ID 策略

#### 单机版

因为 Redis 是单线程，天生保证原子性，可以使用原子操作 INCR 和 INCRBY 来实现

INCRBY：设置增长步长

#### 集群分布式

注意：在 Redis 集群情况下，同样和 MySQL 一样需要设置不同的增长步长，同时 key 一定要设置有效期，可以使用 Redis 集群来获取更高的吞吐量。

假设一个集群中有 5 台 Redis，可以初始化每台Redis的值分别是 1,2,3,4,5 ， 然后设置步长都是5

各个 Redis 生成的ID为：

```
A：1 6 11 16 21
B：2 7 12 17 22
C：3 8 13 18 23
D：4 9 14 19 24
E：5 10 15 20 25
```

但是存在的问题是，Redis 集群的维护和保养比较麻烦，配置麻烦。因为要设置单点故障，哨兵值守。

但是主要是的问题是，为了一个 ID，却需要引入整个 Redis 集群，有种杀鸡焉用牛刀的感觉。

## 雪花算法

### 简介

Snowflake 是 Twitter 的分布式自增 ID 算法，

最初 Twitter 把存储系统从 MySQL 迁移到 Cassandra（由 Facebook 开发的一套开源分布式 NoSQL 数据库系统）因为 Cassandra 没有顺序ID生成机制，所以开发了这样一套全局唯一 ID 生成服务。

Twitter 的分布式雪花算法 SnowFlake，经测试 SnowFlake 每秒可以产生 26 万个自增可排序的 ID

- twitter 的 SnowFlake 生成 ID 能够按照时间有序生成
- SnowFlake 算法生成 ID 的结果是一个64Bit大小的整数，为一个Long型（转换成字符串后长度最多19）
- 分布式系统内不会产生 ID 碰撞（由 datacenter 和 workerID 做区分）并且效率较高

### 结构

雪花算法的几个核心组成部分

![图片](./assets/640-1701342647717-2.png)

在 Java 中 64bit 的证书是 long 类型，所以在 SnowFlake 算法生成的 ID 就是 long 类存储的

### 第一部分

二进制中最高位是符号位，1 表示负数，0 表示正数。生成的 ID 一般都是用整数，所以最高位固定为 0。

#### 第二部分

第二部分是 41bit 时间戳位，用来记录时间戳，毫秒级

41 位可以表示 2^41 -1 个数字

如果只用来表示正整数，可以表示的范围是：0 - 2^41 -1，减1是因为可以表示的数值范围是从0开始计算的，而不是从1。

也就是说 41 位可以表示 2^41 - 1 毫秒的值，转换成单位年则是 69.73 年

#### 第三部分

第三部分为工作机器 ID，10Bit 用来记录工作机器ID

可以部署在 2^10 = 1024 个节点，包括5位 datacenterId（数据中心，机房） 和 5 位 workerID（机器码）

5 位可以表示的最大正整数是 2 ^ 5 = 31个数字，来表示不同的数据中心 和 机器码

#### 第四部分

12 位bit可以用来表示的正整数是 2^12 = 4095，即可以用0 1 2 … 4094 来表示同一个机器同一个时间戳内产生的4095个ID序号。

SnowFlake 可以保证所有生成的ID按时间趋势递增，整个分布式系统内不会产生重复ID，因为有 datacenterId 和 workerId 来做区分

### 实现

雪花算法是由 scala 算法编写的，使用 Java 实现的代码地址：https://github.com/beyondfengyu/SnowFlake/blob/master/SnowFlake.java

```java
/**
 * twitter的snowflake算法 -- java实现
 * 
 * @author beyond
 */
public class SnowFlake {

    /**
     * 起始的时间戳
     */
    private final static long START_STMP = 1480166465631L;

    /**
     * 每一部分占用的位数
     */
    private final static long SEQUENCE_BIT = 12; //序列号占用的位数
    private final static long MACHINE_BIT = 5;   //机器标识占用的位数
    private final static long DATACENTER_BIT = 5;//数据中心占用的位数

    /**
     * 每一部分的最大值
     */
    private final static long MAX_DATACENTER_NUM = -1L ^ (-1L << DATACENTER_BIT);
    private final static long MAX_MACHINE_NUM = -1L ^ (-1L << MACHINE_BIT);
    private final static long MAX_SEQUENCE = -1L ^ (-1L << SEQUENCE_BIT);

    /**
     * 每一部分向左的位移
     */
    private final static long MACHINE_LEFT = SEQUENCE_BIT;
    private final static long DATACENTER_LEFT = SEQUENCE_BIT + MACHINE_BIT;
    private final static long TIMESTMP_LEFT = DATACENTER_LEFT + DATACENTER_BIT;

    private long datacenterId;  //数据中心
    private long machineId;     //机器标识
    private long sequence = 0L; //序列号
    private long lastStmp = -1L;//上一次时间戳

    public SnowFlake(long datacenterId, long machineId) {
        if (datacenterId > MAX_DATACENTER_NUM || datacenterId < 0) {
            throw new IllegalArgumentException("datacenterId can't be greater than MAX_DATACENTER_NUM or less than 0");
        }
        if (machineId > MAX_MACHINE_NUM || machineId < 0) {
            throw new IllegalArgumentException("machineId can't be greater than MAX_MACHINE_NUM or less than 0");
        }
        this.datacenterId = datacenterId;
        this.machineId = machineId;
    }

    /**
     * 产生下一个ID
     *
     * @return
     */
    public synchronized long nextId() {
        long currStmp = getNewstmp();
        if (currStmp < lastStmp) {
            throw new RuntimeException("Clock moved backwards.  Refusing to generate id");
        }

        if (currStmp == lastStmp) {
            //相同毫秒内，序列号自增
            sequence = (sequence + 1) & MAX_SEQUENCE;
            //同一毫秒的序列数已经达到最大
            if (sequence == 0L) {
                currStmp = getNextMill();
            }
        } else {
            //不同毫秒内，序列号置为0
            sequence = 0L;
        }

        lastStmp = currStmp;

        return (currStmp - START_STMP) << TIMESTMP_LEFT //时间戳部分
                | datacenterId << DATACENTER_LEFT       //数据中心部分
                | machineId << MACHINE_LEFT             //机器标识部分
                | sequence;                             //序列号部分
    }

    private long getNextMill() {
        long mill = getNewstmp();
        while (mill <= lastStmp) {
            mill = getNewstmp();
        }
        return mill;
    }

    private long getNewstmp() {
        return System.currentTimeMillis();
    }

    public static void main(String[] args) {
        SnowFlake snowFlake = new SnowFlake(2, 3);

        for (int i = 0; i < (1 << 12); i++) {
            System.out.println(snowFlake.nextId());
        }

    }
}
```

### 工程落地经验

hutools工具包，地址：https://github.com/looly/hutool

### SpringBoot整合雪花算法

引入hutool工具类：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.3.1</version>
</dependency>
```

整合：

```java
/**
 * 雪花算法
 *
 * @author: 陌溪
 */
public class SnowFlakeDemo {
    private long workerId = 0;
    private long datacenterId = 1;
    private Snowflake snowFlake = IdUtil.createSnowflake(workerId, datacenterId);

    @PostConstruct
    public void init() {
        try {
            // 将网络ip转换成long
            workerId = NetUtil.ipv4ToLong(NetUtil.getLocalhostStr());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取雪花ID
     * @return
     */
    public synchronized long snowflakeId() {
        return this.snowFlake.nextId();
    }

    public synchronized long snowflakeId(long workerId, long datacenterId) {
        Snowflake snowflake = IdUtil.createSnowflake(workerId, datacenterId);
        return snowflake.nextId();
    }

    public static void main(String[] args) {
        SnowFlakeDemo snowFlakeDemo = new SnowFlakeDemo();
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                System.out.println(snowFlakeDemo.snowflakeId());
            }, String.valueOf(i)).start();
        }
    }
}
```

得到结果

```
1251350711346790400
1251350711346790402
1251350711346790401
1251350711346790403
1251350711346790405
1251350711346790404
1251350711346790406
1251350711346790407
1251350711350984704
1251350711350984706
1251350711350984705
1251350711350984707
1251350711350984708
1251350711350984709
1251350711350984710
1251350711350984711
1251350711350984712
1251350711355179008
1251350711355179009
1251350711355179010
```

### 优点

- 毫秒数在高维，自增序列在低位，整个ID都是趋势递增的
- 不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成ID的性能也是非常高的
- 可以根据自身业务特性分配bit位，非常灵活

### 缺点

- 依赖机器时钟，如果机器时钟回拨，会导致重复ID生成
- 在单机上是递增的，但由于涉及到分布式环境，每台机器上的时钟不可能完全同步，有时候会出现不是全局递增的情况，此缺点可以认为无所谓，一般分布式ID只要求趋势递增，并不会严格要求递增，90%的需求只要求趋势递增。

### 其它补充

- 为了解决时钟回拨问题，导致ID重复，后面有人专门提出了解决的方案
  - 百度开源的分布式唯一ID生成器 UidGenerator
  - Leaf - 美团点评分布式ID生成系统
