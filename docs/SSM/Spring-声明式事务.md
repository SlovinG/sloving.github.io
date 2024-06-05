---
title: Spring-声明式事务
date: 2020-04-21
tags: 
 - SSM 
 - Spring
categories:
 - SSM
---

# Spring-声明式事务

## 一、回顾事务

- 事务在项目开发过程非常重要，涉及到数据的一致性的问题，不容马虎！
- 事务管理是企业级应用程序开发中必备技术，用来确保数据的完整性和一致性。

<font color='red'>**事务就是把一系列的动作当成一个独立的工作单元，这些动作要么全部完成，要么全部不起作用。**</font>

### 事务的四个属性 ACID

1. 原子性（atomicity）

   事务是原子性操作，由一系列动作组成，事务的原子性确保动作要么全部完成，要么完全不起作用

2. 一致性（consistency）

   一旦所有事务动作完成，事务就要被提交。数据和资源处于一种满足业务规则的一致性状态中

3. 隔离性（isolation）

   可能多个事务会同时处理相同的数据，因此每个事务都应该与其他事务隔离开来，防止数据损坏

7. 持久性（durability）

   事务一旦完成，无论系统发生什么错误，结果都不会受到影响。通常情况下，事务的结果被写到持久化存储器中


## 二、测试

将上面的代码拷贝到一个新项目中

在之前的案例中，我们给userDao接口新增两个方法，删除和增加用户；

```java
//添加一个用户
int addUser(User user);

//根据id删除用户
int deleteUser(int id);
```

mapper文件，我们故意把 delete 写错成 deletes，测试！

```xml
<insert id="addUser" parameterType="com.kuang.pojo.User">
	insert into user (id,name,pwd) values (#{id},#{name},#{pwd})
</insert>

<delete id="deleteUser" parameterType="int">
	deletes from user where id = #{id}
</delete>
```

编写接口的实现类，在实现类中，我们去操作一波

```java
public class UserDaoImpl extends SqlSessionDaoSupport implements UserMapper {

   //增加一些操作
   public List<User> selectUser() {
       User user = new User(4,"小明","123456");
       UserMapper mapper = getSqlSession().getMapper(UserMapper.class);
       mapper.addUser(user);
       mapper.deleteUser(4);
       return mapper.selectUser();
  }

   //新增
   public int addUser(User user) {
       UserMapper mapper = getSqlSession().getMapper(UserMapper.class);
       return mapper.addUser(user);
  }
   //删除
   public int deleteUser(int id) {
       UserMapper mapper = getSqlSession().getMapper(UserMapper.class);
       return mapper.deleteUser(id);
  }
}
```

测试：

```java
@Test
public void test2(){
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   UserMapper mapper = (UserMapper) context.getBean("userDao");
   List<User> user = mapper.selectUser();
   System.out.println(user);
}
```

报错：sql 异常，delete 写错了

结果 ：插入成功！

没有进行事务的管理；我们想让他们都成功才算成功，有一个失败，就都算失败，我们就应该需要 **事务！**

以前我们都需要自己手动管理事务，十分麻烦！

但是 Spring 给我们提供了事务管理，我们只需要配置即可；

## 三、Spring 中的事务管理

Spring 在不同的事务管理 API 之上定义了一个抽象层，使得开发人员不必了解底层的事务管理 API 就可以使用 Spring 的事务管理机制。Spring 支持编程式事务管理和声明式的事务管理。

### 1、编程式事务管理

- 将事务管理代码嵌到业务方法中来控制事务的提交和回滚
- 缺点：必须在每个事务操作业务逻辑中包含额外的事务管理代码

### 2、声明式事务管理

- 一般情况下比编程式事务好用。
- 将事务管理代码从业务方法中分离出来，以声明的方式来实现事务管理。
- 将事务管理作为横切关注点，通过 aop 方法模块化。Spring 中通过 Spring AOP 框架支持声明式事务管理。

### 3、使用 Spring 管理事务，注意头文件的约束导入 : tx

```
xmlns:tx="http://www.springframework.org/schema/tx"

http://www.springframework.org/schema/tx
http://www.springframework.org/schema/tx/spring-tx.xsd">
```

### 4、事务管理器

- 无论使用 Spring 的哪种事务管理策略（编程式或者声明式）事务管理器都是必须的。
- **事务管理器** 就是 Spring 的核心事务管理抽象，管理封装了一组独立于技术的方法。

### 5、JDBC 事务

```xml
<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>
```

### 6、配置好事务管理器后我们需要去配置事务的通知

```xml
<!--配置事务通知-->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
   <tx:attributes>
       <!--配置哪些方法使用什么样的事务,配置事务的传播特性-->
       <tx:method name="add" propagation="REQUIRED"/>
       <tx:method name="delete" propagation="REQUIRED"/>
       <tx:method name="update" propagation="REQUIRED"/>
       <tx:method name="search*" propagation="REQUIRED"/>
       <tx:method name="get" read-only="true"/>
       <tx:method name="*" propagation="REQUIRED"/>
   </tx:attributes>
</tx:advice>
```

### 7、spring 事务传播特性

事务传播行为就是多个事务方法相互调用时，事务如何在这些方法间传播。spring 支持 7 种事务传播行为：

- propagation_requierd：如果当前没有事务，就新建一个事务，如果已存在一个事务中，加入到这个事务中，这是最常见的选择。
- propagation_supports：支持当前事务，如果没有当前事务，就以非事务方法执行。
- propagation_mandatory：使用当前事务，如果没有当前事务，就抛出异常。
- propagation_required_new：新建事务，如果当前存在事务，把当前事务挂起。
- propagation_not_supported：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
- propagation_never：以非事务方式执行操作，如果当前事务存在则抛出异常。
- propagation_nested：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则执行与propagation_required类似的操作

Spring 默认的事务传播行为是 PROPAGATION_REQUIRED，它适合于绝大多数的情况。

假设 ServiveX#methodX() 都工作在事务环境下（即都被 Spring 事务增强了），假设程序中存在如下的调用链：Service1#method1()->Service2#method2()->Service3#method3()，那么这 3 个服务类的 3 个方法通过 Spring 的事务传播机制都工作在同一个事务中。

就好比，我们刚才的几个方法存在调用，所以会被放在一组事务当中！

### 8、配置 AOP

导入aop的头文件！

```xml
<!--配置aop织入事务-->
<aop:config>
   <aop:pointcut id="txPointcut" expression="execution(* com.kuang.dao.*.*(..))"/>
   <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointcut"/>
</aop:config>
```

### 9、进行测试

删掉刚才插入的数据，再次测试！

```java
@Test
public void test2(){
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   UserMapper mapper = (UserMapper) context.getBean("userDao");
   List<User> user = mapper.selectUser();
   System.out.println(user);
}
```

## 五、Spring 的事务角色

- 事务管理员：发起事务方，在 Spring 中通常指代业务层开启事务的方法
- 事务协调员：加入事务方，在 Spring 中通常指代数据层方法，也可以是业务层方法

## 六、Spring 事务相关配置

什么样的异常，Spring 事务默认是不进行回滚的？

### 1. 事务配置

| 属性                   | 作用                         | 示例                                      |
| ---------------------- | ---------------------------- | ----------------------------------------- |
| read0nly               | 设置是否为只读事务           | read0nly=true（只读事务）                 |
| timeout                | 设置事务超时时间             | timeout = -1（永不超时）                  |
| **rollbackFor**        | 设置事务回滚异常（Class）    | rollbackFor={NullPointException. class}   |
| rollbackForClassName   | 设置事务回滚异常（String）   | 同上格式为字符串                          |
| noRollbackFor          | 设置事务不回滚异常（Class）  | noRollbackFor={NullPointException. class} |
| noRollbackForClassName | 设置事务不回滚异常（String） | 同上格式为字符串                          |
| isolation              | 设置事务隔离级别             | isolation = Isolation.DEFAULT             |
| propagation            | 设置事务传播行为             | ……                                        |

注意：

- 对于 RuntimeException 类型异常或者 Error 错误，Spring 事务能够进行回滚操作。
- 但是对于编译器异常，Spring 事务是不进行回滚的，所以需要使用 rollbackFor 来设置要回滚的异常。

### 2. 事务传播行为

**事务传播行为**：事务协调员对事物管理员所携带的事物的处理态度。

![image-20210802153014296](./assets/007.png)
