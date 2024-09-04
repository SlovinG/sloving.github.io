---
title: Spring中Bean的配置和Bean的注入
date: 2020-05-13
tags: 
 - SSM 
 - Spring
categories:
 - SSM
---

# Spring中Bean的配置和Bean的注入

## 一、bean与spring容器的关系

<img src="./assets/134.jpg" style="zoom:80%;" />

Bean 配置信息定义了 Bean 的实现及依赖关系，Spring 容器根据各种形式的 Bean 配置信息在容器内部建立 Bean 定义注册表，然后根据注册表加载、实例化 Bean，并建立 Bean 和 Bean 的依赖关系，最后将这些准备就绪的 Bean 放到 Bean 缓存池中，以供外层的应用程序进行调用。

## 二、Bean的配置

Bean的配置有三种方法：

- 基于 xml 配置 Bean
- 使用注解定义 Bean
- 基于 java 类提供 Bean 定义信息

### 1、基于xml配置Bean

对于基于 XML 的配置，Spring 2.0以后使用 Schema 的格式，使得不同类型的配置拥有了自己的命名空间，是配置文件更具扩展性

![](./assets/135.jpg)

①默认命名空间：它没有空间名，用于Spring Bean的定义；

②xsi命名空间：这个命名空间用于为每个文档中命名空间指定相应的Schema样式文件，是标准组织定义的标准命名空间；

③aop命名空间：这个命名空间是Spring配置AOP的命名空间，是用户自定义的命名空间。

命名空间的定义分为两个步骤：第一步指定命名空间的名称；第二步指定命名空间的Schema文档样式文件的位置，用空格或回车换行进行分分隔

#### 1.1 Bean的基本配置

在Spring容器的配置文件中定义一个简要Bean的配置片段如下所示：

![](./assets/136.jpg)

一般情况下，Spring IOC容器中的一个Bean即对应配置文件中的一个 `<bean>` ,这种镜像对应关系应该容易理解。其中id为这个Bean的名称，通过容器的getBean("foo")即可获取对应的Bean，在容器中起到定位查找的作用，是外部程序和Spring IOC容器进行交互的桥梁。class属性指定了Bean对应的实现类。

下面是基于XML的配置文件定义了两个简单的Bean：

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans   xmlns="http://www.springframework.org/schema/beans" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
    
     <bean id="car" name="#car1" class="com.baobaotao.simple.Car"></bean>  
     <bean id="boss" class="com.baobaotao.simple.Boss"></bean>
    
</beans>
```

#### 1.2 依赖注入

1. 属性注入
2. 构造函数注入
3. 工厂方式注入

### 2、使用注解定义Bean

我们知道，Spring容器成功启动的三大要件分别是：Bean定义信息、Bean实现类以及Spring本身。如果采用基于XML的配置，Bean定义信息和Bean实现类本身是分离的，而采用基于注解的配置方式时，Bean定义信息即通过在Bean实现类上标注注解实现

下面是使用注解定义一个DAO的Bean：

``` java
package com.baobaotao.anno;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
// ①通过Repository定义一个DAO的Bean

@Component("userDao")
public class UserDao {

}
```

在①处，我们使用@Component注解在UserDao类声明处对类进行标注，它可以被Spring容器识别，Spring容器自动将POJO转换为容器管理的Bean

它和以下的XML配置是等效的：

``` xml
<bean id="userDao" class="com.baobaotao.anno.UserDao"/>
```

除了@Component以外，Spring提供了3个功能基本和@Component等效的注解，它们分别用于对DAO、Service及Web层的Controller进行注解，所以也称这些注解为Bean的衍型注解：<font color='BlueViolet'>**类似于xml文件中定义Bean\<bean id=" " class=" "/>**</font>

- @Repository：用于对DAO实现类进行标注；
- @Service：用于对Service实现类进行标注；
- @Controller：用于对Controller实现类进行标注；

之所以要在@Component之外提供这三个特殊的注解，是**为了让注解类本身的用途清晰化**，此外Spring将赋予它们一些特殊的功能

#### 2.1 使用注解配置信息启动spring容器

Spring提供了一个context的命名空间，它提供了通过扫描类包以应用注解定义Bean的方式：

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<!--①声明context的命名空间-->
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
         http://www.springframework.org/schema/context
         http://www.springframework.org/schema/context/spring-context-3.0.xsd"
         >
    <!--②扫描类包以应用注解定义的Bean-->
   <context:component-scan base-package="com.baobaotao.anno"/>
   <bean class="com.baobaotao.anno.LogonService"></bean>
   <!-- context:component-scan base-package="com.baobaotao" resource-pattern="anno/*.class"/ -->
   <!-- context:component-scan base-package="com.baobaotao">
       <context:include-filter type="regex" expression="com\.baobaotao\.anno.*Dao"/>
       <context:include-filter type="regex" expression="com\.baobaotao\.anno.*Service"/>
       <context:exclude-filter type="aspectj" expression="com.baobaotao..*Controller+"/>
   </context:component-scan -->
</beans>
```

在①处声明context命名空间，在②处即可通过context命名空间的 `component-scan` 的 `base-package` 属性指定一个需要扫描的基类包，Spring容器将会扫描这个基类包里的所有类，并从类的注解信息中获取Bean的定义信息。

如果仅希望扫描特定的类而非基包下的所有类，你们可以使用resource-pattern属性过滤特定的类，如下所示：

```xml
<context:component-scan base-package="com.baobaotao" resource-pattern="anno/*.class"/>
```

这里我们将基类包设置为 `com.baobaotao`，默认情况下 `resource-pattern` 属性的值为 `**/*.class`，即基类包里的所有类。这里我们设置为 `anno/*.class` ,则Spring仅会扫描基包里anno子包中的类

### 3、基于java类提供Bean定义

在普通的 POJO 类中只要标注 @Configuration注解，就可以为 spring 容器提供 Bean 定义的信息了，每个标注了 @Bean 的类方法都相当于提供了一个 Bean 的定义信息

``` java
package com.baobaotao.conf;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//①将一个POJO标注为定义Bean的配置类
@Configuration
public class AppConf {
        //②以下两个方法定义了两个Bean，以提供了Bean的实例化逻辑
    @Bean
    public UserDao userDao(){
       return new UserDao();    
    }
    
    @Bean
    public LogDao logDao(){
        return new LogDao();
    }
    //③定义了logonService的Bean
    @Bean
    public LogonService logonService(){
        LogonService logonService = new LogonService();
                //④将②和③处定义的Bean注入到LogonService Bean中
        logonService.setLogDao(logDao());
        logonService.setUserDao(userDao());
        return logonService;
    }
}
```

①处在APPConf类的定义处标注了 `@Configuration` 注解，说明这个类可用于为Spring提供Bean的定义信息。类的方法处可以标注 `@Bean` 注解，Bean的类型由方法返回值类型决定，名称默认和方法名相同，也可以通过入参显示指定Bean名称，如 `@Bean(name="userDao")` .直接在@Bean所标注的方法中提供Bean的实例化逻辑。

在②处userDao()和logDao()方法定义了一个UserDao和一个LogDao的Bean，它们的Bean名称分别是userDao和logDao。在③处，又定义了一个logonService Bean，并且在④处注入②处所定义的两个Bean。

因此，以上的配置和以下XML配置时等效 的：

```xml
<bean id="userDao" class="com.baobaotao.anno.UserDao"/>
<bean id="logDao" class="com.baobaotao.anno.LogDao"/>
<bean id="logService" class="com.baobaotao.conf.LogonService"
    p:logDao-ref="logDao" p:userDao-ref="userDao"/>
```

基于java类的配置方式和基于XML或基于注解的配置方式相比，前者通过代码的方式更加灵活地实现了Bean的实例化及Bean之间的装配，但后面两者都是通过配置声明的方式，在灵活性上要稍逊一些，但是配置上要更简单一些

## 三、Bean的注入

Bean注入的方式有两种，一种是在XML中配置，此时分别有属性注入、构造函数注入和工厂方法注入；另一种则是使用注解的方式注入 @Autowired, @Resource, @Required

### 1、在xml文件中配置依赖注入

#### 1.1 属性注入

属性注入即通过setXxx()方法注入Bean的属性值或依赖对象，由于属性注入方式具有可选择性和灵活性高的优点，因此属性注入是实际应用中最常采用的注入方式

属性注入要求Bean提供一个默认的构造函数，并为需要注入的属性提供对应的Setter方法。Spring先调用Bean的默认构造函数实例化Bean对象，然后通过反射的方式调用Setter方法注入属性值

``` java
package com.baobaotao.anno;

import org.springframework.beans.factory.BeanNameAware;

public class LogonService implements BeanNameAware{

    private LogDao logDao;

    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void setLogDao(LogDao logDao) {
        this.logDao = logDao;
    }
    
    public LogDao getLogDao() {
        return logDao;
    }
    public UserDao getUserDao() {
        return userDao;
    }
    
    public void setBeanName(String beanName) {
        System.out.println("beanName:"+beanName);        
    }
    
    public void initMethod1(){
        System.out.println("initMethod1");
    }
    public void initMethod2(){
        System.out.println("initMethod2");
    }
    
}
```

bean.xml配置

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
         http://www.springframework.org/schema/context
         http://www.springframework.org/schema/context/spring-context-3.0.xsd"
       default-autowire="byName"
         >
    <bean id="logDao" class="com.baobaotao.anno.LogDao"/>
    <bean id="userDao" class="com.baobaotao.anno.UserDao"/>
   <bean class="com.baobaotao.anno.LogonService">
       <property name="logDao" ref="logDao"></property>
       <property name="userDao" ref="userDao"></property>
   </bean>
</beans>
```

#### 1.2 构造方法注入

使用构造函数注入的前提是Bean必须提供带参数的构造函数。例如

``` java
package com.baobaotao.anno;

import org.springframework.beans.factory.BeanNameAware;

public class LogonService implements BeanNameAware{

    public LogonService(){}

    public LogonService(LogDao logDao, UserDao userDao) {
        this.logDao = logDao;
        this.userDao = userDao;
    }

    private LogDao logDao;

    private UserDao userDao;

    public void setUserDao(UserDao userDao) {
        this.userDao = userDao;
    }

    public void setLogDao(LogDao logDao) {
        this.logDao = logDao;
    }
    
    public LogDao getLogDao() {
        return logDao;
    }
    public UserDao getUserDao() {
        return userDao;
    }
    
    public void setBeanName(String beanName) {
        System.out.println("beanName:"+beanName);        
    }
    
    public void initMethod1(){
        System.out.println("initMethod1");
    }
    public void initMethod2(){
        System.out.println("initMethod2");
    }
    
}
```

bean.xml配置

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
         http://www.springframework.org/schema/context
         http://www.springframework.org/schema/context/spring-context-3.0.xsd"
       default-autowire="byName">

    <bean id="logDao" class="com.baobaotao.anno.LogDao"/>
    <bean id="userDao" class="com.baobaotao.anno.UserDao"/>
    <bean class="com.baobaotao.anno.LogonService">
        <constructor-arg  ref="logDao"></constructor-arg>
        <constructor-arg ref="userDao"></constructor-arg>
    </bean>
</beans>
```

#### 1.3 工厂方法注入

非静态工厂方法：

有些工厂方法是非静态的，即必须实例化工厂类后才能调用工厂方法

``` java
package com.baobaotao.ditype;

public class CarFactory {
   public Car createHongQiCar(){
       Car car = new Car();
       car.setBrand("红旗CA72");
       return car;
   }
   
   public static Car createCar(){
       Car car = new Car();
       return car;
   }
}
```

工厂类负责创建一个或多个目标类实例，工厂类方法一般以接口或抽象类变量的形式返回目标类实例，工厂类对外屏蔽了目标类的实例化步骤，调用者甚至不用知道具体的目标类是什么

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <!-- 工厂方法-->
    <bean id="carFactory" class="com.baobaotao.ditype.CarFactory" />
    <bean id="car5" factory-bean="carFactory" factory-method="createHongQiCar">
    </bean>

</beans>
```

静态工厂方法：

很多工厂类都是静态的，这意味着用户在无须创建工厂类实例的情况下就可以调用工厂类方法，因此，静态工厂方法比非静态工厂方法的调用更加方便

``` xml
<?xml version="1.0" encoding="UTF-8" ?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:p="http://www.springframework.org/schema/p"
    xsi:schemaLocation="http://www.springframework.org/schema/beans 
         http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <bean id="car6" class="com.baobaotao.ditype.CarFactory"
        factory-method="createCar"></bean>

</beans>
```

### 2、使用注解的方式注入

Spring通过@Autowired注解实现Bean的依赖注入，下面是一个例子：

``` java
package com.baobaotao.anno;

import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
//① 定义一个Service的Bean（不需要在XML中定义Bean）
@Service
public class LogonService implements BeanNameAware{
        //② 分别注入LogDao及UserDao的Bean（不需要在XML中定义property属性注入）
    @Autowired(required=false)
    private LogDao logDao;
    @Autowired
    @Qualifier("userDao")
    private UserDao userDao;
    
    public LogDao getLogDao() {
        return logDao;
    }
    public UserDao getUserDao() {
        return userDao;
    }
    
    public void setBeanName(String beanName) {
        System.out.println("beanName:"+beanName);        
    }
    
    public void initMethod1(){
        System.out.println("initMethod1");
    }
    public void initMethod2(){
        System.out.println("initMethod2");
    }
    
}
```

在①处，我们使用@Service将LogonService标注为一个Bean，在②处，通过@Autowired注入LogDao及UserDao的Bean。@Autowired默认按类型匹配的方式，在容器查找匹配的Bean，当有且仅有一个匹配的Bean时，Spring将其注入到@Autowired标注的变量中。

#### 2.2 使用@Autowired的required属性

如果容器中没有一个和标注变量类型匹配的Bean，Spring容器启动时将报NoSuchBeanDefinitionException的异常。如果希望Spring即使找不到匹配的Bean完成注入也不用抛出异常，那么可以使用@Autowired(required=false)进行标注：

``` java
@Service
public class LogonService implements BeanNameAware{
    @Autowired(required=false)
    private LogDao logDao;
        ...
}
```

默认情况下，@Autowired的required属性的值为true，即要求一定要找到匹配的Bean，否则将报异常。

#### 2.3 使用@Qualifier指定注入Bean的名称

如果容器中有一个以上匹配的Bean时，则可以通过@Qualifier注解限定Bean的名称，如下所示：

``` java
@Service
public class LogonService implements BeanNameAware{
    @Autowired(required=false)
    private LogDao logDao;
    //①注入名为UserDao，类型为UserDao的Bean
    @Autowired
    @Qualifier("userDao")
    private UserDao userDao;
}
```

这里假设容器有两个类型为UserDao的Bean，一个名为userDao，另一个名为otherUserDao，则①处会注入名为userDao的Bean

#### 2.4 对类方法进行标注

@Autowired可以对类成员变量及方法的入参进行标注，下面我们在类的方法上使用@Autowired注解：

``` java
package com.baobaotao.anno;

import org.springframework.beans.factory.BeanNameAware;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class LogonService implements BeanNameAware{
    
    private LogDao logDao;
    private UserDao userDao;
    
    @Autowired
    public void setLogDao(LogDao logDao) {
        this.logDao = logDao;
    }
    
    @Autowired
    @Qualifier("userDao")
    public void setUserDao(UserDao userDao) {
        System.out.println("auto inject");
        this.userDao = userDao;
    }
    
}
```

如果一个方法拥有多个入参，在默认情况下，Spring自动选择匹配入参类型的Bean进行注入。Spring允许对方法入参标注@Qualifier以指定注入Bean的名称，如下所示：

``` java
@Autowired
    public void init(@Qualifier("userDao")UserDao userDao,LogDao logDao){
        System.out.println("multi param inject");
        this.userDao = userDao;
        this.logDao =logDao;
    }
```

在以上例子中，UserDao的入参注入名为userDao的Bean，而LogDao的入参注入LogDao类型的Bean。

一般情况下，在Spring容器中大部分的Bean都是单实例的，所以我们一般都无须通过@Repository、@Service等注解的value属性为Bean指定名称，也无须使用@Qualifier按名称进行注入。

#### 2.5 对标准注解的支持

此外，Spring还支持@Resource和@Inject注解，这两个标准注解和@Autowired注解的功能类型，都是对类变量及方法入参提供自动注入的功能。@Resource要求提供一个Bean名称的属性，如果属性为空，则自动采用标注处的变量名或方法名作为Bean的名称

``` java
package com.baobaotao.anno;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.annotation.Resource;

import org.springframework.stereotype.Component;

@Component
public class Boss {
    
    private Car car;
    
    public Boss(){
        System.out.println("construct...");
    }

//    @Autowired
//    private void setCar(Car car){
//        System.out.println("execute in setCar");
//        this.car = car;
//    }
    
    @Resource("car")
    private void setCar(Car car){
        System.out.println("execute in setCar");
        this.car = car;
    }
    
    @PostConstruct
    private void init1(){
        System.out.println("execute in init1");
    }
    
    @PostConstruct
    private void init2(){
        System.out.println("execute in init1");
    }
    
    @PreDestroy
    private void destory1(){
        System.out.println("execute in destory1");
    }
    
    @PreDestroy
    private void destory2(){
        System.out.println("execute in destory2");
    }

}
```

这时，如果@Resource未指定"car"属性，则也可以根据属性方法得到需要注入的Bean名称。可见@Autowired默认按类型匹配注入Bean，@Resource则按名称匹配注入Bean。而@Inject和@Autowired一样也是按类型匹配注入的Bean的，只不过它没有required属性。可见不管是@Resource还是@Inject注解，其功能都没有@Autowired丰富，因此除非必须，大可不必在乎这两个注解。

<font color='BlueViolet'>**类似于Xml中使用\<constructor-arg ref="logDao">\</constructor-arg>或者\<property name="logDao" ref="logDao">\</property>进行注入，如果使用了@Autowired或者Resource等，这不需要在定义Bean时使用属性注入和构造方法注入了**</font>

#### 2.6 关于Autowired和@Resource

- @Autowired注入是**按照类型注入**的，只要配置文件中的bean类型和需要的bean类型是一致的，这时候注入就没问题。但是如果相同类型的bean不止一个，此时注入就会出现问题，Spring容器无法启动
- @Resourced标签是**按照bean的名字来进行注入**的，如果我们没有在使用@Resource时指定bean的名字，同时Spring容器中又没有该名字的bean，这时候@Resource就会退化为@Autowired即按照类型注入，这样就有可能违背了使用@Resource的初衷。所以建议在使用@Resource时都显示指定一下bean的名字@Resource(name="xxx") 

#### 2.7 让@Resource和@Autowired生效的几种方式

1、在xml配置文件中显式指定 

``` xml
<!-- 为了使用Autowired标签，我们必须在这里配置一个bean的后置处理器 -->  
    <bean class="org.springframework.beans.factory.annotation.AutowiredAnnotationBeanPostProcessor" />   
      
    <!-- 为了使用@Resource标签，这里必须配置一个后置处理器 -->  
    <bean class="org.springframework.context.annotation.CommonAnnotationBeanPostProcessor" />   
```

2、在xml配置文件中使用context:annotation-config

``` xml
<context:annotation-config />
```

3、在xml配置文件中使用context:component-scan 

``` xml
<context:component-scan base-package="com.baobaotao.anno"/>
```

4、重写Spring容器的Context,在自定义BeanFactory时调用`AnnotationConfigUtils.registerAnnotationConfigProcessors()`把这两个注解处理器增加到容器中

一开始使用框架的时候发现可以在web层使用@Resource以及@Autowired来注入一些bean,首先这个注解是Spring提供的，自己把这部分代码抽出来写了小例子，发现要想使用Spring的这两个注解，必须直接或者间接的引入 `AutowiredAnnotationBeanPostProcesso` 以及 `CommonAnnotationBeanPostProcessor` 这两个注解处理器引入到BeanDefinitions中,否则不会实现注入的，但是仔细阅读框架代码后发现没有地方直接或间接引入这两个注解处理器，发现一个细节，框架所依赖的Spring版本是2.5.6而我使用的Spring版本是2.5.5，当初的结论是高版本的Spring在容器启动的时候，自动把这两个注解处理器加入到BeanDefinitions中，这几天仔细看了看Spring的源代码，发现Spring2.5.6并没有这样做。然后仔细DEBUG了一下框架的源代码，最后发现原来框架有一个自己的`XmlWebApplicationContext` ，·在这个context中重写 `customizeBeanFactory()`，在这个方法中调用了`AnnotationConfigUtils.registerAnnotationConfigProcessors()` 方法把这两自动注解处理器加入到BeanDefinitions中，这样框架在web层就支持@Resource和@Autowired进行自动注入了

``` java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.alibaba.citrus.springext.support.context;

import com.alibaba.citrus.springext.ResourceLoadingExtendable;
import com.alibaba.citrus.springext.ResourceLoadingExtender;
import com.alibaba.citrus.springext.support.context.InheritableListableBeanFactory;
import com.alibaba.citrus.springext.support.resolver.XmlBeanDefinitionReaderProcessor;
import java.io.IOException;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.beans.factory.xml.XmlBeanDefinitionReader;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.AnnotationConfigUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourcePatternResolver;

public class XmlWebApplicationContext extends org.springframework.web.context.support.XmlWebApplicationContext implements ResourceLoadingExtendable {
    private ResourceLoadingExtender resourceLoadingExtender;
    private boolean parentResolvableDependenciesAccessible = true;

    public XmlWebApplicationContext() {
    }

    public boolean isParentResolvableDependenciesAccessible() {
        return this.parentResolvableDependenciesAccessible;
    }

    public void setParentResolvableDependenciesAccessible(boolean parentResolvableDependenciesAccessible) {
        this.parentResolvableDependenciesAccessible = parentResolvableDependenciesAccessible;
    }

    public void setResourceLoadingExtender(ResourceLoadingExtender resourceLoadingExtender) {
        if(this.resourceLoadingExtender != null) {
            this.getApplicationListeners().remove(this.resourceLoadingExtender);
        }

        this.resourceLoadingExtender = resourceLoadingExtender;
        if(resourceLoadingExtender instanceof ApplicationListener) {
            this.addApplicationListener((ApplicationListener)resourceLoadingExtender);
        }

    }

    protected void initBeanDefinitionReader(XmlBeanDefinitionReader beanDefinitionReader) {
        (new XmlBeanDefinitionReaderProcessor(beanDefinitionReader)).addConfigurationPointsSupport();
    }

    protected void customizeBeanFactory(DefaultListableBeanFactory beanFactory) {
        super.customizeBeanFactory(beanFactory);
　　　　//AnnotationConfigUtils.registerAnnotationConfigProcessors()方法把这两自动注解处理器加入到BeanDefinitions中,这样公司框架在web层就支持@Resource和@Autowired进行自动注入
        AnnotationConfigUtils.registerAnnotationConfigProcessors(beanFactory, (Object)null);
    }

    protected DefaultListableBeanFactory createBeanFactory() {
        return (DefaultListableBeanFactory)(this.isParentResolvableDependenciesAccessible()?new InheritableListableBeanFactory(this.getInternalParentBeanFactory()):super.createBeanFactory());
    }

    protected Resource getResourceByPath(String path) {
        Resource resource = null;
        if(this.resourceLoadingExtender != null) {
            resource = this.resourceLoadingExtender.getResourceByPath(path);
        }

        if(resource == null) {
            resource = super.getResourceByPath(path);
        }

        return resource;
    }

    protected ResourcePatternResolver getResourcePatternResolver() {
        final ResourcePatternResolver defaultResolver = super.getResourcePatternResolver();
        return new ResourcePatternResolver() {
            public Resource[] getResources(String locationPattern) throws IOException {
                ResourcePatternResolver resolver = null;
                if(XmlWebApplicationContext.this.resourceLoadingExtender != null) {
                    resolver = XmlWebApplicationContext.this.resourceLoadingExtender.getResourcePatternResolver();
                }

                if(resolver == null) {
                    resolver = defaultResolver;
                }

                return resolver.getResources(locationPattern);
            }

            public ClassLoader getClassLoader() {
                return defaultResolver.getClassLoader();
            }

            public Resource getResource(String location) {
                return defaultResolver.getResource(location);
            }
        };
    }
}
```

## 四、Bean的生命周期

问题1：多例的 Bean 如何配置并执行销毁的方法？

问题2：如何做才执行 Bean 销毁的方法？

### 1、生命周期相关概念

- 生命周期：从创建到消亡的完整过程
- bean 的生命周期：bean 从创建到销毁的整体过程
- bean 的生命周期控制：在 bean 创建后到销毁前做一些事情

### 2、代码演示

#### 2.1 使用 xml 的 Bean 生命周期控制

提供生命周期控制方法：

```java
public class BookDaoImpl implements BookDao {
    public void save() {
        System.out.println("book dao save ...");
    }
    //表示bean初始化对应的操作
    public void init(){
        System.out.println("init...");
    }
    //表示bean销毁前对应的操作
    public void destory(){
        System.out.println("destory...");
    }
}
```

applicationContext.xml 配置：

```xml
<!--init-method：设置 bean 初始化生命周期的回调函数,此处填写 init 方法名-->
<!--destroy-method：设置 bean 销毁生命周期的回调函数，仅适用于单例对象，此处填写 destory 方法名-->
<bean id="bookDao" class="com.itheima.dao.impl.BookDaoImpl" init-method="init" destroy-method="destory"/>
```

测试类：

```java
public class AppForLifeCycle {
    public static void main( String[] args ) {
        //此处需要使用实现类类型，接口类型没有close方法
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        BookDao bookDao = (BookDao) ctx.getBean("bookDao");
        bookDao.save();
        //关闭容器，执行销毁的方法
        ctx.close();
    }
}
```

#### 2.2 基于 Java 接口的 Bean 生命周期控制

实现 InitializingBean，DisposableBean 接口

```java
public class BookServiceImpl implements BookService, InitializingBean, DisposableBean {
    private BookDao bookDao;
    public void setBookDao(BookDao bookDao) {
        System.out.println("set .....");
        this.bookDao = bookDao;
    }
    public void save() {
        System.out.println("book service save ...");
        bookDao.save();
    }
    public void destroy() throws Exception {
        System.out.println("service destroy");
    }
    public void afterPropertiesSet() throws Exception {
        System.out.println("service init");
    }
}
```

### 3、Bean 销毁时机

容器关闭前触发 bean 的销毁。

关闭容器方式：

- 手工关闭容器，暴力关闭：`ConfigurableApplicationContext   `接口 `close()` 操作
- 注册关闭钩子，在虚拟机退出前先关闭容器再退出虚拟机：`ConfigurableApplicationContext` 接口 `registerShutdownHook() `操作

```java
public class AppForLifeCycle {
    public static void main( String[] args ) {
        //此处需要使用实现类类型，接口类型没有close方法
        ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");

        BookDao bookDao = (BookDao) ctx.getBean("bookDao");
        bookDao.save();
        //注册关闭钩子函数，在虚拟机退出之前回调此函数，关闭容器
        ctx.registerShutdownHook();
        //关闭容器
        //ctx.close();
    }
}
```

