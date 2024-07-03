---
title: 快速上手Spring
date: 2020-04-18
tags: 
 - SSM 
 - Spring
categories:
 - SSM
---

::: tip 

理解了 IOC 的基本思想，我们现在来看下 Spring 的应用

:::

# 快速上手Spring

## 一、HelloSpring

### 1、导入 Jar 包

注 : spring 需要导入 commons-logging 进行日志记录。

我们利用maven，他会自动下载对应的依赖项。

```xml
<dependency>
   <groupId>org.springframework</groupId>
   <artifactId>spring-webmvc</artifactId>
   <version>5.1.10.RELEASE</version>
</dependency>
```

### 2、编写代码

1. 编写一个 Hello 实体类

   ```java
   public class Hello {
      private String name;
   
      public String getName() {
          return name;
     }
      public void setName(String name) {
          this.name = name;
     }
   
      public void show(){
          System.out.println("Hello,"+ name );
     }
   }
   ```

2. 编写我们的 spring 文件 , 这里我们命名为 beans.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd">
   
      <!--bean就是java对象 , 由Spring创建和管理-->
      <bean id="hello" class="com.kuang.pojo.Hello">
          <property name="name" value="Spring"/>
      </bean>
   
   </beans>
   ```

3. 进行测试

   ```java
   @Test
   public void test(){
      //解析 beans.xml 文件,生成管理相应的 Bean 对象
      ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      //getBean : 参数即为 spring 配置文件中 bean 的id .
      Hello hello = (Hello) context.getBean("hello");
      hello.show();
   }
   ```

### 3、思考

- Hello 对象是谁创建的 ?  【hello 对象是由 Spring 创建的】
- Hello 对象的属性是怎么设置的 ?  【hello 对象的属性是由 Spring 容器设置的】

这个过程就叫控制反转：

- 控制：谁来控制对象的创建 , 传统应用程序的对象是由程序本身控制创建的 , 使用 Spring 后 , 对象是由 Spring 来创建的
- 反转：程序本身不创建对象 , 而变成被动的接收对象

依赖注入：就是利用 set 方法来进行注入的。

**IOC 是一种编程思想，由主动的编程变成被动的接收**

可以通过 **new ClassPathXmlApplicationContext()** 去浏览一下底层源码。

### 4、修改案例一

我们在案例一中， 新增一个 Spring 配置文件 beans.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.springframework.org/schema/beans
       http://www.springframework.org/schema/beans/spring-beans.xsd">

   <bean id="MysqlImpl" class="com.kuang.dao.impl.UserDaoMySqlImpl"/>
   <bean id="OracleImpl" class="com.kuang.dao.impl.UserDaoOracleImpl"/>

   <bean id="ServiceImpl" class="com.kuang.service.impl.UserServiceImpl">
       <!--注意: 这里的 name 并不是属性 , 而是 set 方法后面的那部分,首字母小写-->
       <!--引用另外一个 bean,不是用 value 而是用 ref-->
       <property name="userDao" ref="OracleImpl"/>
   </bean>

</beans>
```

测试：

```java
@Test
public void test2(){
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   UserServiceImpl serviceImpl = (UserServiceImpl) context.getBean("ServiceImpl");
   serviceImpl.getUser();
}
```

OK , 到了现在 , 我们彻底不用再程序中去改动了 , 要实现不同的操作 , 只需要在 xml 配置文件中进行修改 , 所谓的 IoC,一句话搞定 : 对象由Spring 来创建 , 管理 , 装配 ! 

## 二、IOC 创建对象方式（Bean 的实例化）

### 1、通过无参构造方法来创建

1. User.java

   ```java
   public class User {
       private String name;
       public User() {
           System.out.println("user无参构造方法");
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public void show(){
           System.out.println("name="+ name );
       }
   }
   ```

2. beans.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans
          http://www.springframework.org/schema/beans/spring-beans.xsd">
   
      <bean id="user" class="com.kuang.pojo.User">
          <property name="name" value="kuangshen"/>
      </bean>
   
   </beans>
   ```

3. 测试类

   ```java
   @Test
   public void test(){
      ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
      //在执行 getBean 的时候, user 已经创建好了,通过无参构造
      User user = (User) context.getBean("user");
      //调用对象的方法
      user.show();
   }
   ```

结果可以发现，在调用 show 方法之前，User 对象已经通过无参构造初始化了！

### 2、通过有参构造方法来创建

1、UserT . java

```java
public class UserT {

   private String name;

   public UserT(String name) {
       this.name = name;
  }

   public void setName(String name) {
       this.name = name;
  }

   public void show(){
       System.out.println("name="+ name );
  }

}
```

2、beans.xml 有三种方式编写

```xml
<!-- 第一种根据index参数下标设置 -->
<bean id="userT" class="com.kuang.pojo.UserT">
   <!-- index指构造方法 , 下标从0开始 -->
   <constructor-arg index="0" value="kuangshen2"/>
</bean>
<!-- 第二种根据参数名字设置 -->
<bean id="userT" class="com.kuang.pojo.UserT">
   <!-- name指参数名 -->
   <constructor-arg name="name" value="kuangshen2"/>
</bean>
<!-- 第三种根据参数类型设置 -->
<bean id="userT" class="com.kuang.pojo.UserT">
   <constructor-arg type="java.lang.String" value="kuangshen2"/>
</bean>
```

3、测试

```java
@Test
public void testT(){
   ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
   UserT user = (UserT) context.getBean("userT");
   user.show();
}
```

结论：在配置文件加载的时候，其中管理的对象都已经在初始化了！

## 三、Spring 配置

### 1、别名

alias 定义 bean 的别名， 可定义多个，使用逗号、分号、空格来分隔

```xml
<!--设置别名：在获取Bean的时候可以使用别名获取-->
<alias name="userT" alias="userNew"/>
```

### 2、Bean 的基础配置

```xml
<!--bean 就是 Java 对象,由 Spring 创建和管理-->

<!--
   id 是 bean 的标识符,要唯一,如果没有配置 id , 那么name 就是默认标识符
   如果配置 id,又配置了 name ,那么 name 是别名
   name 可以设置多个别名,可以用逗号,分号,空格隔开
   如果不配置 id 和 name,可以根据 applicationContext.getBean(.class) 获取对象;
   class 是bean 的全限定名 = 包名 + 类名
-->
<bean id="hello" name="hello2 h2,h3;h4" class="com.kuang.pojo.Hello">
   <property name="name" value="Spring"/>
</bean>
```

### 3、Bean 的作用范围配置

scope 定义 bean 的作用范围，可选范围有：

- singleton：单例（默认）
- prototype：多例

```xml
<bean id="book" class="com.kuang.pojo.book" scope="prototype"/>
```

扩展：scope 的取值不仅仅只有 singleton 和 prototype，还有 request、session、application、 websocket ，表示创建出的对象放置在 Web 容器（tomcat）对应的位置。比如：request 表示保存到 request 域中。

在我们的实际开发当中，绝大部分的 bean 是单例的，也就是说绝大部分 bean 不需要配置 scope 属性。

### 4、import

团队的合作通过 import 来实现 

```xml
<import resource="{path}/beans.xml"/>
```
