---
title: Spring-AOP
date: 2020-04-21
tags: 
 - SSM 
 - Spring
categories:
 - SSM
---

# Spring-AOP

## 一、什么是 AOP

AOP（Aspect Oriented Programming）意为：面向切面编程，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。AOP 是 OOP（Object Oriented Programming，面向对象编程）的延续，是软件开发中的一个热点，也是 Spring 框架中的一个重要内容，是函数式编程的一种衍生范型。利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

<img src="./assets/174.jpg" style="zoom:67%;" />

## 二、AOP 在 Spring 中的作用

<font color='red'>**提供声明式事务，允许用户自定义切面**</font>

以下名词需要了解：

- 横切关注点：跨越应用程序多个模块的方法或功能。与我们业务逻辑无关的，但是我们需要关注的部分，就是横切关注点。如日志 , 安全 , 缓存 , 事务等等 ....
- 切面（Aspect）：横切关注点 **被模块化** 的特殊对象。它是一个类。
- 通知（Advice）：切面必须要完成的工作。它是类中的一个方法。
- 目标（Target）：被通知对象。
- 代理（Proxy）：向目标对象应用通知之后创建的对象。
- 切入点（PointCut）：切面通知 执行的 “地点”的定义。
- 连接点（JointPoint）：与切入点匹配的执行点。

![](./assets/61.png)

![](./assets/175.jpg)

## 三、Advice 的类型

SpringAOP 中，通过 Advice 定义横切逻辑，Spring 中支持 5 种类型的 Advice：

| 通知类型     | 连接点                 | 实现接口                                        |
| ------------ | ---------------------- | ----------------------------------------------- |
| 前置通知     | 方法前                 | org.springframework.aop.MethodBeforeAdvice      |
| 后置通知     | 方法后                 | org.springframework.aop.AfterReturningAdvice    |
| 环绕通知     | 方法前后               | org,apalliance.intercept.MethodInterceptor      |
| 异常抛出通知 | 方法抛出异常           | org.springframework.aop.ThrowsAdvice            |
| 引介通知     | 类中增加新的方法、属性 | org.springframework.aop.IntroductionInterceptor |

即 AOP 在不改变原有代码的情况下，去增加新的功能。

## 四、使用 Spring 实现 AOP

【重点】使用AOP织入，需要导入一个依赖包：

```xml
<!-- https://mvnrepository.com/artifact/org.aspectj/aspectjweaver -->
<dependency>
    <groupId>org.aspectj</groupId>
    <artifactId>aspectjweaver</artifactId>
    <version>1.9.4</version>
</dependency>
```

### 第一种方式：通过 Spring API 实现

首先编写我们的业务接口和实现类：

```java
public interface UserService {
   public void add();
   public void delete();
   public void update();
   public void search();
}

public class UserServiceImpl implements UserService{

   @Override
   public void add() {
       System.out.println("增加用户");
  }

   @Override
   public void delete() {
       System.out.println("删除用户");
  }

   @Override
   public void update() {
       System.out.println("更新用户");
  }

   @Override
   public void search() {
       System.out.println("查询用户");
  }
}
```

然后去写我们的增强类，我们编写两个，一个前置增强、一个后置增强

```java
public class Log implements MethodBeforeAdvice {

    //method 要执行的目标对象的方法
    //args 被调用的方法的参数
    //target 目标对象
    @Override
    public void before(Method method, Object[] args, @Nullable Object target) throws Throwable {
        System.out.println(target.getClass().getName() + "的" + method.getName() + "方法即将被执行");
    }
}

public class AfterLog implements AfterReturningAdvice {
    //returnValue 返回值
    //method 被调用的方法
    //args 被调用的方法的对象的参数
    //target 被调用的目标对象
    @Override
    public void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable {
        System.out.println("执行了" + target.getClass().getName()
                           + "的" + method.getName()
                           + "方法," + "返回值为：" + returnValue);
    }
}
```

最后去 spring 的文件中注册，并实现 aop 切入实现，注意导入约束。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xmlns:aop="http://www.springframework.org/schema/aop"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.springframework.org/schema/aop
       http://www.springframework.org/schema/aop/spring-aop.xsd">

   <!--注册bean-->
   <bean id="userService" class="com.kuang.service.UserServiceImpl"/>
   <bean id="log" class="com.kuang.log.Log"/>
   <bean id="afterLog" class="com.kuang.log.AfterLog"/>

   <!--aop的配置-->
   <aop:config>
       <!--切入点 expression:表达式匹配要执行的方法-->
       <aop:pointcut id="pointcut" expression="execution(* com.kuang.service.UserServiceImpl.*(..))"/>
       <!--执行环绕; advice-ref执行方法 . pointcut-ref切入点-->
       <aop:advisor advice-ref="log" pointcut-ref="pointcut"/>
       <aop:advisor advice-ref="afterLog" pointcut-ref="pointcut"/>
   </aop:config>

</beans>
```

测试

```java
public class MyTest {
   @Test
   public void test(){
       ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
       //注意代理的是接口
       UserService userService = (UserService) context.getBean("userService");
       userService.search();
  }
}
```

AOP 的重要性：很重要。一定要理解其中的思路，主要是思想的理解这一块。

Spring 的 AOP 就是将公共的业务（日志 , 安全等）和领域业务结合起来，当执行领域业务时，将会把公共业务加进来。实现公共业务的重复利用。领域业务更纯粹 , 程序猿专注领域业务 , 其本质还是动态代理。

### 第二种方式：自定义类来实现 AOP

目标业务类不变依旧是 userServiceImpl

第一步：写我们自己的一个切入类

```java
public class DiyPointcut {
    public void before(){
        System.out.println("---------方法执行前---------");
    }
    public void after(){
        System.out.println("---------方法执行后---------");
    }
}
```

去 spring 中配置

```xml
<!--第二种方式自定义实现-->
<!--注册bean-->
<bean id="diy" class="com.kuang.config.DiyPointcut"/>

<!--aop的配置-->
<aop:config>
   <!--第二种方式：使用AOP的标签实现-->
   <aop:aspect ref="diy">
       <aop:pointcut id="diyPonitcut" expression="execution(* com.kuang.service.UserServiceImpl.*(..))"/>
       <aop:before pointcut-ref="diyPonitcut" method="before"/>
       <aop:after pointcut-ref="diyPonitcut" method="after"/>
   </aop:aspect>
</aop:config>
```

测试：

```java
public class MyTest {
   @Test
   public void test(){
       ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
       UserService userService = (UserService) context.getBean("userService");
       userService.add();
  }
}
```

### 第三种方式：使用注解实现

第一步：编写一个注解实现的增强类

```java
package com.kuang.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;

@Aspect
public class AnnotationPointcut {
   @Before("execution(* com.kuang.service.UserServiceImpl.*(..))")
   public void before(){
       System.out.println("---------方法执行前---------");
  }

   @After("execution(* com.kuang.service.UserServiceImpl.*(..))")
   public void after(){
       System.out.println("---------方法执行后---------");
  }

   @Around("execution(* com.kuang.service.UserServiceImpl.*(..))")
   public void around(ProceedingJoinPoint jp) throws Throwable {
       System.out.println("环绕前");
       System.out.println("签名:"+jp.getSignature());
       //执行目标方法proceed
       Object proceed = jp.proceed();
       System.out.println("环绕后");
       System.out.println(proceed);
  }
}
```

第二步：在 Spring 配置文件中，注册 bean，并增加支持注解的配置

```xml
<!--第三种方式:注解实现-->
<bean id="annotationPointcut" class="com.kuang.config.AnnotationPointcut"/>
<aop:aspectj-autoproxy/>
```

aop:aspectj-autoproxy：说明

- 通过 aop 命名空间的 `<aop:aspectj-autoproxy />` 声明自动为 spring 容器中那些配置 `@aspectJ` 切面的 bean 创建代理，织入切面。当然，spring 在内部依旧采用 `AnnotationAwareAspectJAutoProxyCreator`进行自动代理的创建工作，但具体实现的细节已经被 `<aop:aspectj-autoproxy />` 隐藏起来了

-  `<aop:aspectj-autoproxy />` 有一个 `proxy-target-class` 属性，默认为false，表示使用 jdk 动态代理织入增强，当配为 `<aop:aspectj-autoproxy  poxy-target-class="true"/>` 时，表示使用 CGLib 动态代理技术织入增强。不过即使 `proxy-target-class` 设置为 false，如果目标类没有声明接口，则 spring 将自动使用 CGLib 动态代理

## 五、AOP 切入点表达式

### 1. 语法格式

- 切入点表达式：要进行增强的方法的描述方式

  - 描述方式一：增强 com.itheima.dao 包下的 BookDao 接口中的无参数 update 方法

  ```java
  execution(void com.itheima.dao.BookDao.update())
  ```

  - 描述方式二：增强 com.itheima.dao.impl 包下的 BookDaoImpl 类中的无参数 update 方法

  ```java
  execution(void com.itheima.dao.impl.BookDaoImpl.update())
  ```

- 切入点表达式的标准格式：**动作关键字(访问修饰符  返回值  包名.类/接口名.方法名(参数) 异常名)**

  ```java
  execution(public User com.itheima.service.UserService.findById(int))
  ```

  - 动作关键字：描述切入点的行为动作，例如 execution 表示执行到指定切入点
  - 访问修饰符：public，private 等，可以省略
  - 返回值：写返回值类型
  - 包名：多级包使用点连接
  - 类/接口名：
  - 方法名：
  - 参数：直接写参数的类型，多个类型用逗号隔开
  - 异常名：方法定义中抛出指定异常，可以省略

### 2. 通配符

可以使用通配符来实现快速描述切入点：

* `*`：单个独立的任意符号，可以独立出现，也可以作为前缀或者后缀的匹配符出现

  例如，想匹配 com.itheima 包下的任意包中的 UserService 类或接口中所有 find 开头的带有一个参数的方法：

  ```java
  execution( public * com.itheima.*.UserService.find*(*) )
  ```

- `..` ：多个连续的任意符号，可以独立出现，常用于简化包名与参数的书写

  例如，想匹配 com 包下的任意包中的 UserService 类或接口中所有名称为 findById 的方法：

  ```java
  execution(public User com..UserService.findById(..) )
  ```

- `+`：专用于匹配子类类型

  ```java
  execution(* *..*Service+.*(..))
  ```

### 3. 书写技巧

- 所有代码按照标准规范开发，否则以下技巧全部失效
- 描述切入点通常 **描述接口**，而不描述实现类
- 访问控制修饰符针对接口开发均采用public描述（**可省略访问控制修饰符描述**）
- 返回值类型对于增删改类使用精准类型加速匹配，对于查询类使用\*通配快速描述
- **包名 **书写 **尽量不使用..匹配**，效率过低，常用\*做单个包描述匹配，或精准匹配
- **接口名/类名**书写名称与模块相关的 **采用\*匹配**，例如UserService书写成\*Service，绑定业务层接口名
- **方法名 **书写以 **动词** 进行 **精准匹配**，名词采用\*匹配，例如getById书写成getBy\*,selectAll书写成selectAll
- 参数规则较为复杂，根据业务方法灵活调整
- 通常 **不使用异常** 作为 **匹配** 规则

## 六、AOP 切入点数据获取

获取切入点方法的参数：

- JoinPoint：适用于前置、后置、返回后、抛出异常后通知
- ProceedJointPoint：适用于环绕通知

获取切入点方法返回值：

- 返回后通知
- 环绕通知

获取切入点方法运行异常信息：

- 抛出异常后通知
- 环绕通知

### 1. 获取参数

在 **前置通知** 和 **环绕通知** 中都可以获取到连接点方法的参数。

- JoinPoint 对象描述了连接点方法的运行状态，可以获取到原始方法的调用参数：

  ```java
  @Before("pt()")
  public void before(JoinPoint jp) {
      Object[] args = jp.getArgs(); //获取连接点方法的参数们
      System.out.println(Arrays.toString(args));
  }
  ```

- ProccedJointPoint 是 JoinPoint 的子类：

  ```java
  @Around("pt()")
  public Object around(ProceedingJoinPoint pjp) throws Throwable {
      Object[] args = pjp.getArgs(); //获取连接点方法的参数们
      System.out.println(Arrays.toString(args));
      Object ret = pjp.proceed();
      return ret;
  }
  ```

### 2. 获取返回值

在返回后通知和环绕通知中都可以获取到连接点方法的返回值。

- 抛出异常后通知可以获取切入点方法中出现的异常信息，使用形参可以接收对应的异常对象：

  ```java
  @AfterReturning(value = "pt()",returning = "ret")
  public void afterReturning(String ret) { //变量名要和returning="ret"的属性值一致
      System.out.println("afterReturning advice ..."+ret);
  }
  ```

- 环绕通知中可以手动书写对原始方法的调用，得到的结果即为原始方法的返回值：

  ```java
  @Around("pt()")
  public Object around(ProceedingJoinPoint pjp) throws Throwable {
      // 手动调用连接点方法，返回值就是连接点方法的返回值
      Object ret = pjp.proceed();
      return ret;
  }
  ```

### 2. 获取异常

在抛出异常后通知和环绕通知中都可以获取到连接点方法中出现的异常。

- 抛出异常后通知可以获取切入点方法中出现的异常信息，使用形参可以接收对应的异常对象：

  ```java
  @AfterThrowing(value = "pt()",throwing = "t")
  public void afterThrowing(Throwable t) {//变量名要和throwing = "t"的属性值一致
      System.out.println("afterThrowing advice ..."+ t);
  }
  ```

- 抛出异常后通知可以获取切入点方法运行的异常信息，使用形参可以接收运行时抛出的异常对象：

  ```java
  @Around("pt()")
  public Object around(ProceedingJoinPoint pjp)  {
      Object ret = null;
      //此处需要try...catch处理，catch中捕获到的异常就是连接点方法中抛出的异常
      try {
          ret = pjp.proceed();
      } catch (Throwable t) {
          t.printStackTrace();
      }
      return ret;
  }
  ```

  

