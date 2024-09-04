---
title: 初识SpringBoot
date: 2020-05-12
tags: 
 - SpringBoot
categories:
 - SpringBoot
---

::: tip Spring Boot 的前世今生

SpringBoot 是由 Pivotal 团队在 2013 年开始研发、2014年4月发布第一个版本的全新开源的轻量级框架。它基于 Spring4.0 设计，不仅继承了 Spring 框架原有的优秀特性，而且还通过简化配置来进一步简化了 Spring 应用的整个搭建和开发过程。另外 SpringBoot 通过集成大量的框架使得依赖包的版本冲突，以及引用的不稳定性等问题得到了很好的解决

:::

# 初识SpringBoot

## 回顾什么是 Spring

Spring 是 2003 年兴起的一个轻量级的 Java 开发框架，是为了解决企业级应用开发的复杂性而创建的。

## Spring 是如何简化 Java开发的

为了降低 Java 开发的复杂性，Spring 采用了以下 4 种关键策略：

1. 基于 POJO 的轻量级和最小侵入性编程，所有东西都是 bean；
2. 通过IOC，依赖注入（DI）和面向接口实现松耦合；
3. 基于切面（AOP）和惯例进行声明式编程；
4. 通过切面和模版减少样式代码，RedisTemplate，xxxTemplate；

## 什么是 SpringBoot

学过 JavaWeb 后我们发现，开发一个 Web 应用，从最初开始接触 Servlet 结合 Tomcat，跑出一个 Hello World 程序，要经历特别多的步骤。

后来就用了框架 Struts，再后来是 SpringMVC，到了现在的 SpringBoot，过一两年又会有其他 Web 框架出现。后端开发经历过框架不断的演进，然后自己开发项目所用的技术也在不断的变化、改造。建议都可以去经历一遍。

言归正传，什么是 SpringBoot 呢，就是一个 JavaWeb的开发框架，和 SpringMVC 类似，对比其他 JavaWeb 框架的好处，官方说是简化开发，约定大于配置，  you can "just run"，能迅速的开发 Web 应用，几行代码开发一个 http 接口。

所有的技术框架的发展似乎都遵循了一条主线规律：

1. 从一个复杂的应用场景衍生一种规范框架，人们只需要进行各种配置而不需要自己去实现它，这时候强大的配置功能成了优点
2. 发展到一定程度之后，人们根据实际生产应用情况，选取其中实用功能和设计精华，重构出一些轻量级的框架
3. 之后为了提高开发效率，嫌弃原先的各类配置过于麻烦，于是开始提倡“约定大于配置”，进而衍生出一些一站式的解决方案。

这就是：Java企业级应用 -> J2EE -> Spring -> SpringBoot的过程。

随着 Spring 不断的发展，涉及的领域越来越多，项目整合开发需要配合各种各样的文件，慢慢变得不那么易用简单，违背了最初的理念，甚至被称为 **配置地狱**。Spring Boot 正是在这样的一个背景下被抽象出来的开发框架，目的为了让大家更容易的使用 Spring 、更容易的集成各种常用的中间件、开源软件；

SpringBoot 基于 Spring 开发，SpirngBoot 本身并不提供 Spring 框架的核心特性以及扩展功能，只是用于快速、敏捷地开发新一代基于 Spring 框架的应用程序。也就是说，它并不是用来替代 Spring 的解决方案，而是和 Spring 框架紧密结合用于提升 Spring 开发者体验的工具。SpringBoot 以 **约定大于配置** 的核心思想，默认帮我们进行了很多设置，多数 SpringBoot 应用只需要很少的 Spring 配置。同时它集成了大量常用的第三方库配置（例如 Redis、MongoDB、Jpa、RabbitMQ、Quartz 等等），SpringBoot 应用中这些第三方库几乎可以零配置的开箱即用。

简单来说就是，SpringBoot 其实不是什么新的框架，它默认配置了很多框架的使用方式，就像 maven 整合了所有的 jar 包，Springboot 整合了所有的框架。

Spring Boot 出生名门，从一开始就站在一个比较高的起点，又经过这几年的发展，生态足够完善，SpringBoot 已经当之无愧成为 Java 领域最热门的技术

## SpringBoot 的主要优点

- 为所有 Spring 开发者更快的入门

- **开箱即用**，提供各种默认配置来简化项目配置
- 内嵌式容器简化 Web 项目
- 没有冗余代码生成和 XML 配置的要求

真的很爽，我们快速去体验一下开发个接口的感觉吧！

## 开始第一个 Spring Boot 应用

### 准备工作

我们将学习如何快速的创建一个 Spring Boot 应用，并且实现一个简单的 Http 请求处理。通过这个例子对 Spring Boot 有一个初步的了解，并体验其结构简单、开发快速的特性。

环境准备：

- java version "1.8.0_181"
- Maven-3.6.1
- SpringBoot 2.x 最新版

开发工具：

- IDEA

### 创建基础项目说明

Spring 官方提供了非常方便的工具让我们快速构建应用：**Spring Initializr**，访问地址：[https://start.spring.io/](https://start.spring.io/)

**项目创建方式一：使用Spring Initializr 的 Web页面创建项目**

1. 打开  [https://start.spring.io/](https://start.spring.io/)
2. 填写项目信息
3. 点击”Generate Project“按钮生成项目；下载此项目
4. 解压项目包，并用IDEA以Maven项目导入，一路下一步即可，直到项目导入完毕
5. 如果是第一次使用，可能速度会比较慢，包比较多、需要耐心等待一切就绪。

**项目创建方式二：使用 IDEA 直接创建项目**

1. 创建一个新项目
2. 选择 spring initalizr ， 可以看到默认就是去官网的快速构建工具那里实现
3. 填写项目信息
4. 选择初始化的组件（初学勾选 Web 即可）
5. 填写项目路径
6. 等待项目构建成功

**项目结构分析**：

通过上面步骤完成了基础项目的创建。就会自动生成以下文件。

- `DemoApplication.java`：应用程序启动入口，可直接 Run 启动服务，类似于 Tomcat 的 start.sh
- `DemoApplicationTests.java`：Junit 测试类，已自动注入加载了 SpringBoot 容器的上下文
- `application.properties`：配置属性空文件，可改为 application.yml 文件，SpringBoot 都能识别
  - `@SpringBootApplication`是 Sprnig Boot 项目的核心注解，主要目的是开启自动配置
  - main 方法这是一个标准的 Java 应用的 main 的方法，主要作用是作为项目启动的入口
- `pom.xml`：maven 工程定义文件，表明该项目的 maven 坐标信息

### 对 pom.xml 进行分析

打开 pom.xml，看看 Spring Boot 项目的依赖：

``` xml
<!-- 父依赖 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.5.RELEASE</version>
    <relativePath/>
</parent>

<dependencies>
    <!-- web场景启动器 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <!-- springboot单元测试 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
        <!-- 排除依赖 -->
        <exclusions>
            <exclusion>
                <groupId>org.junit.vintage</groupId>
                <artifactId>junit-vintage-engine</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
</dependencies>

<build>
    <plugins>
        <!-- 打包插件 -->
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

看起来与普通的 maven 项目下的 pom.xml 无太多差异，如下：

![](./assets/138.png)

**pom 差异解析**

- **差异一** 引入了该 parent 说明具备了 SpringBoot 的基本功能，可直接依赖其父工程（SpringBoot）的包，如差异二（无需声明版本号）
- **差异二** web 应用启动核心 jar，解压出来里面除了些依赖什么都没有，所以 Starter 主要用来简化依赖用的，比如我们之前做 MVC 时要引入日志组件，那么需要去找到 log4j 的版本，然后引入，现在有了 Starter 之后，直接用这个之后，log4j 就自动引入了，也不用关心版本这些问题，**注：若想更改其下某一个jar（如 log4j）的版本，则可自行进行升降**

- **差异三** 能够将 Spring Boot 应用打包为可执行的 jar 或 war 文件，然后以通常的方式运行 Spring Boot 应用

**独特实现（不常用）**

如果你不想使用 `spring-boot-starter-parent`，或您自己有一套 parent 依赖标准，您仍然可以通过使用 scope = import 依赖关系来保持依赖关系管理：

``` xml
<dependencyManagement>
     <dependencies>
        <dependency>
            <!-- Import dependency management from Spring Boot -->
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.0.4.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

该设置不允许您使用如上所述的属性（properties）覆盖各个依赖项，要实现相同的结果，您需要在 `spring-boot-dependencies` 项之前的项目的 `dependencyManagement` 中添加一个配置，例如，要升级到另一个 Spring Data 版本系列，您可以将以下内容添加到自己的 pom.xml 中：

``` xml
<dependencyManagement>
    <dependencies>
        <!-- Override Spring Data release train provided by Spring Boot -->

        <!--Spring Data版本更改至Kay-SR9 |变更部分  start-->
        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-releasetrain</artifactId>
            <version>Kay-SR9</version>
            <scope>import</scope>
            <type>pom</type>
        </dependency>
        <!--注意：需啊哟在spring-boot-dependencies之前加入需更改的   |变更部分 end -->

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-dependencies</artifactId>
            <version>2.0.4.RELEASE</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>


    </dependencies>
</dependencyManagement>
```

此处详见官方文档：[https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config-yaml-shortcomings](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config-yaml-shortcomings) 模块：13.2.2 Using Spring Boot without the Parent POM

**常用依赖模块**

Spring Boot 提供了很多已封装好的模块，类似于插件，拿来即用，大多都是 spring-boot-starter-xx 风格，如果要用直接引入即可，就像组装电脑，组装 i3 还是装 i5 的 CPU 看你 自己，下面我们随便举例几个：

``` xml
<!--快速web应用开发-->
<artifactId>spring-boot-starter-web</artifactId>

<!--redis缓存服务-->
<artifactId>spring-boot-starter-redis</artifactId>

<!--应用日志-->
<artifactId>spring-boot-starter-logging</artifactId>

<!--容器层约定和定制-->
<artifactId>spring-boot-starter-jetty</artifactId>
<artifactId>spring-boot-starter-undertow</artifactId>

<!--数据库访问-->
<artifactId>spring-boot-starter-jdbc</artifactId>

<!--面向切面-->
<artifactId>spring-boot-starter-aop</artifactId>

<!--应用安全-->
<artifactId>spring-boot-starter-security</artifactId>
```

### 编写一个 http 接口

1. 在主程序的同级目录下，新建一个 controller 包，一定要在同级目录下，否则识别不到
2. 在包中新建一个 HelloController 类

``` java
@RestController
public class HelloController {
    
    @RequestMapping("/hello")
    public String hello() {
        return "Hello World";
    }
}
```

- `@RestController` 注解等价于 `@Controller + @ResponseBody` 的结合，使用这个注解的类里面的方法都以 json 格式输出

3. 编写完毕后，从主程序启动项目，浏览器发起请求，看页面返回；同时可以看到控制台输出了 Tomcat 访问的端口号

![](./assets/130.png)

简单几步，就完成了一个 Web 接口的开发，SpringBoot 就是这么简单。所以我们常用它来建立我们的微服务项目！

### 开启热部署

工欲善其事，必先利其器。在开发的时候，难免会反复进行修改调试，就目前而言，修改了代码后是无法直接编译生效，所以需要我们添加以下依赖，添加后一定要确保已经依赖噢

1. 添加以下依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

2. plugin中加入以下：

``` xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <!--加入部分 start-->
            <configuration>
                <fork>true</fork>
            </configuration>
            <!--加入部分 end-->
        </plugin>
    </plugins>
</build>
```

3. 第三步修改IDE

![](./assets/139.png)

![](./assets/140.png)

设置完成后重启 IDEA 即可，本操作在修改代码之后只会做到自动启动服务。

### 将项目打成 jar 包

jar 支持命令行启动需要依赖 maven 插件支持，请确认打包时是否具有 SpringBoot 对应的 maven 插件。

点击 maven 的 package：

![](./assets/131.png)

如果遇到以上错误，可以配置打包时 跳过项目运行测试用例

``` xml
<!--
    在工作中，很多情况下我们打包是不想执行测试用例的
    可能是测试用例不完善，或者是测试用例影响了数据库数据
    跳过测试用例执行
    -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <!--跳过项目运行测试用例-->
        <skipTests>true</skipTests>
    </configuration>
</plugin>
```

打成了 jar 包后，就可以在任何地方运行了：

![](./assets/132.png)

完全OK！

## 总结

会使用 SpringBoot 之后，再也不用担心我写代码的速度，总结下来就是简单、快速、方便！平时如果我们需要搭建一个 Spring Web 项目的时候准备依赖包都要很大一部分时间，现在都不用了

## 彩蛋

如何更改启动时显示的字符拼成的字母，SpringBoot呢？也就是 banner 图案；

只需一步：到项目下的 resources 目录下新建一个banner.txt 即可。

图案可以到：[https://www.bootschool.net/ascii](https://www.bootschool.net/ascii) 这个网站生成，然后拷贝到文件中即可！

![](./assets/133.png)

**SpringBoot这么简单的东西背后一定有故事，赶快去进行一波源码分析！**
