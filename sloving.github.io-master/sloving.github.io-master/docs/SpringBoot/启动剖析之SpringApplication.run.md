---
title: 启动剖析之SpringApplication.run
date: 2020-05-13
tags: 
 - SpringBoot
categories:
 - SpringBoot
---

# 启动剖析之SpringApplication.run

我们看这段启动代码：

``` java
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## SpringApplication.run 分析

分析该方法主要分两部分，一是 `SpringApplication` 实例化，二是run方法的执行。

```java
//该方法返回一个ConfigurableApplicationContext对象
SpringApplication.run(MySpringConfigurationApp.class, args);//参数1-应用入口的类，参数2-命令行参数
```

## SpringApplication 实例化

在 SpringApplication 实例初始化的时候，它会做 4 件有意义的事情：

1、推断应用的类型是普通的项目还是 Web 项目，可能会出现三种结果 `REACTIVE` 、`NONE`、`SERVLET` ：

```java
this.webApplicationType = this.deduceWebApplicationType();
//该行代码位于构造器中
```

2、查找并加载所有可用初始化器，设置到 `initializers ` 属性中

```java
this.setInitializers(this.getSpringFactoriesInstances(ApplicationContextInitializer.class));
//spring.factories处读取
```

3、找出所有的应用程序监听器，设置到 `listeners` 属性中

```java
this.setListeners(this.getSpringFactoriesInstances(ApplicationListener.class));
//该行代码位于构造器中
```

4、推断并设置 main() 方法的定义类，意思就是找出运行的主类

```java
this.mainApplicationClass = this.deduceMainApplicationClass();
//该行代码位于构造器中
```

至此，对于 `SpringApplication` 实例的初始化过程就结束了，接下来进入方法调用环节

## SpringApplication.run 方法调用

### 执行流程图

![](./assets/137.png)

流程图对应的代码如下：

``` java
public ConfigurableApplicationContext run(String... args) {
        //计时工具
        StopWatch stopWatch = new StopWatch();
        stopWatch.start();

        ConfigurableApplicationContext context = null;
        Collection<SpringBootExceptionReporter> exceptionReporters = new ArrayList();

        // step1  设置java.awt.headless系统属性为true - 没有图形化界面
        this.configureHeadlessProperty();

        //step2  初始化监听器
        SpringApplicationRunListeners listeners = this.getRunListeners(args);

        //step3  启动已准备好的监听器，发布应用启动事件
        listeners.starting();

        Collection exceptionReporters;
        try {

            //step4  根据SpringApplicationRunListeners以及参数来装配环境，如java -jar xx.jar --server.port=8000
            ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
            ConfigurableEnvironment environment = this.prepareEnvironment(listeners, applicationArguments);
            this.configureIgnoreBeanInfo(environment);

            //step5  打印Banner 就是启动Spring Boot的时候打印在console上的ASCII艺术字体
            Banner printedBanner = this.printBanner(environment);

            //step6  创建Spring ApplicationContext()上下文
            context = this.createApplicationContext();

            //step7  准备异常报告器
            exceptionReporters = this.getSpringFactoriesInstances(SpringBootExceptionReporter.class, 
             new Class[]{ConfigurableApplicationContext.class}, context);

            //step8  装配Context，上下文前置处理
            this.prepareContext(context, environment, listeners, applicationArguments, printedBanner);

            //step9  Spring上下文刷新处理
            this.refreshContext(context);

            //step10  Spring上下文后置结束处理 
            this.afterRefresh(context, applicationArguments);

            // 停止计时器监控
            stopWatch.stop();

            //输出日志记录执行主类名、时间信息
            if (this.logStartupInfo) {
                (new StartupInfoLogger(this.mainApplicationClass)).logStarted(this.getApplicationLog(), stopWatch);
            }

            //step11  发布应用上下文启动完成事件
            listeners.started(context);

            //step12  执行所有 Runner 运行器
            this.callRunners(context, applicationArguments);
        } catch (Throwable var10) {
            this.handleRunFailure(context, var10, exceptionReporters, listeners);
            throw new IllegalStateException(var10);
        }

        try {
            //step13  发布应用上下文就绪事件
            listeners.running(context);

            //step14  返回应用上下文
            return context;
        } catch (Throwable var9) {
            this.handleRunFailure(context, var9, exceptionReporters, (SpringApplicationRunListeners)null);
            throw new IllegalStateException(var9);
        }
    }
```

### 代码解析

### step1 java.awt.headless系统属性设置

```java
this.configureHeadlessProperty();
```

Headless模式是系统的一种配置模式。设置该默认值为：true，`Java.awt.headless = true` 有什么作用？

::: tip

对于一个 Java 服务器来说经常要处理一些图形元素，例如地图的创建或者图形和图表等。这些API基本上总是需要运行一个X-server以便能使用AWT（`Abstract Window Toolkit`，抽象窗口工具集）。然而运行一个不必要的 X-server 并不是一种好的管理方式。有时你甚至不能运行 X-server,因此最好的方案是运行 headless 服务器，来进行简单的图像处理

:::

方法声明如下：

```java
private void configureHeadlessProperty() {
    System.setProperty("java.awt.headless", System.getProperty("java.awt.headless",Boolean.toString(this.headless)));
}
```

### step2 初始化监听器

``` java
SpringApplicationRunListeners listeners = this.getRunListeners(args);
```

该方法最终落到了`loadSpringFactories`方法上，加载了`META-INF/spring.factories`这个配置文件下的所有资源，并放入缓存，然后再获取了`org.springframework.context.ApplicationListener`定义的资源列表。这些也就是SpringBoot的自动装配资源，然后获取到后存放到list中，并调用`createSpringFactoriesInstances`函数创建了SpringFactories的实例。

方法声明如下：

``` java
private SpringApplicationRunListeners getRunListeners(String[] args) {
    Class<?>[] types = new Class[]{SpringApplication.class, String[].class};
    return new SpringApplicationRunListeners(logger, 
    this.getSpringFactoriesInstances(SpringApplicationRunListener.class, types, this, args));
}
```

META-INF/spring.factories文件部分：

``` 
# Run Listeners
org.springframework.boot.SpringApplicationRunListener=\
org.springframework.boot.context.event.EventPublishingRunListener
```

### step3 启动已准备好的监听器

```java
listeners.starting();
```

通过step2操作拿到监听器集合了之后，再统一遍历出来后，为每个Listener都分配了一个任务线程去启动它们

方法声明如下：

``` java
public void starting() {
    this.initialMulticaster.multicastEvent(new ApplicationStartingEvent(this.application, this.args));
}
public void multicastEvent(ApplicationEvent event, @Nullable ResolvableType eventType) {
    ResolvableType type = eventType != null ? eventType : this.resolveDefaultEventType(event);
    Iterator var4 = this.getApplicationListeners(event, type).iterator();

    while(var4.hasNext()) {
        ApplicationListener<?> listener = (ApplicationListener)var4.next();
        Executor executor = this.getTaskExecutor();
        if (executor != null) {
            executor.execute(() -> {
                this.invokeListener(listener, event);
            });
        } else {
            this.invokeListener(listener, event);
        }
    }
}
```

### step4 装配环境参数

```java
ApplicationArguments applicationArguments = new DefaultApplicationArguments(args);
```

我们来看一下 `new DefaultApplicationArguments(args)` 这个构造函数，跟踪进去发现调用的 `SimpleCommandLineArgsParser.parse`函数，从下面代码中，可以看到该方法读取了命令行参数：

方法声明如下：

``` java
public CommandLineArgs parse(String... args) {
    CommandLineArgs commandLineArgs = new CommandLineArgs();
    String[] var3 = args;
    int var4 = args.length;

    //省略读取命令行代码...
    return commandLineArgs;
}
```

那到这里你是否会联想到：`java -jar xx.jar --server.port=8000` 后面的参数呢?
接着我们看下一行：

```java
ConfigurableEnvironment environment = this.prepareEnvironment(listeners, applicationArguments);
```

通过这行代码我们可以看到spring boot把前面创建出来的listeners和命令行参数，传递到`prepareEnvironment`函数中来准备运行环境。来看一下`prepareEnvironment`函数的真面目：

``` java
private ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners,ApplicationArguments applicationArguments) {
    // Create and configure the environment
    ConfigurableEnvironment environment = this.getOrCreateEnvironment();
    this.configureEnvironment((ConfigurableEnvironment) environment, applicationArguments.getSourceArgs());
    listeners.environmentPrepared((ConfigurableEnvironment) environment);
    this.bindToSpringApplication((ConfigurableEnvironment) environment);
    if (this.webApplicationType == WebApplicationType.NONE) {
        environment = (new EnvironmentConverter(this.getClassLoader())).convertToStandardEnvironmentIfNecessary(
            (ConfigurableEnvironment) environment);
    }

ConfigurationPropertySources.attach((Environment) environment);
    return (ConfigurableEnvironment) environment;
}
```

在这里我们看到了环境是通过`getOrCreateEnvironment`创建出来的，再深挖一下`getOrCreateEnvironment`的源码：

``` java
private ConfigurableEnvironment getOrCreateEnvironment() {
    //如果environment 已经存在，则直接返回当前的环境。思考：究竟什么情况下回存在呢？
    if (this.environment != null) {
        return this.environment;
    } else {
        //判断webApplicationType是不是SERVLET，如果是，则创建Servlet的环境，否则创建基本环境
        return (ConfigurableEnvironment)(this.webApplicationType == WebApplicationType.SERVLET
         ? new StandardServletEnvironment() : new StandardEnvironment());
    }
}
```

接着我们看下一行：

``` java
this.configureIgnoreBeanInfo(environment);
private void configureIgnoreBeanInfo(ConfigurableEnvironment environment) {
    //如果System中的spring.beaninfo.ignore属性为空，就把当前环境中的属性覆盖上去
    //spring.beaninfo.ignore= true 跳过搜索BeanInfo类
    if (System.getProperty("spring.beaninfo.ignore") == null) {
        Boolean ignore = (Boolean)environment.getProperty("spring.beaninfo.ignore", Boolean.class, Boolean.TRUE);
        System.setProperty("spring.beaninfo.ignore", ignore.toString());
    }
}
```

### step5 打印Banner

```java
Banner printedBanner = this.printBanner(environment);
```

spring boot启动的时候，控制台显示的那个艺术字体图案

### step6 创建Spring上下文

```java
context = this.createApplicationContext();
```

spring boot是根据不同的 `webApplicationType` 的类型，来创建不同的 `ApplicationContext`

代码声明如下：

``` java
protected ConfigurableApplicationContext createApplicationContext() {
    Class<?> contextClass = this.applicationContextClass;
    if (contextClass == null) {
        try {
            switch(this.webApplicationType) {
            case SERVLET:
                contextClass = Class.forName("org.springframework.boot.web.servlet.context.AnnotationConfigServletWebServerApplicationContext");
                break;
            case REACTIVE:
                contextClass = Class.forName("org.springframework.boot.web.reactive.context.AnnotationConfigReactiveWebServerApplicationContext");
                break;
            default:
                contextClass = Class.forName("org.springframework.context.annotation.AnnotationConfigApplicationContext");
            }
        } catch (ClassNotFoundException var3) {
            throw new IllegalStateException("Unable create a default ApplicationContext, please specify an ApplicationContextClass", var3);
        }
    }

    return (ConfigurableApplicationContext)BeanUtils.instantiateClass(contextClass);
}
```

### step7 准备异常报告器

继续来看下一步，准备异常报告，又特么是这个 `getSpringFactoriesInstances`

```java
exceptionReporters = getSpringFactoriesInstances(
    SpringBootExceptionReporter.class,
    new Class[] { ConfigurableApplicationContext.class }, context);
```

大家可以再仔细看看META-INF/spring.factories文件

```
# Error Reporters
org.springframework.boot.SpringBootExceptionReporter=\
org.springframework.boot.diagnostics.FailureAnalyzers
```

### step8 装配Context，上下文前置处理

```java
this.prepareContext(context, environment, listeners, applicationArguments,printedBanner);
```

这行代码是把上面已经创建好的对象，传递给prepareContext来准备上下文

``` java
prepareContext()声明如下：
private void prepareContext(ConfigurableApplicationContext context, ConfigurableEnvironment environment, 
    SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments, Banner printedBanner) {
        //这里传入的是 StandardServletEnvironment
        context.setEnvironment(environment);
        //设置上下文的beanNameGenerator(bean生成器)和resourceLoader(资源加载器)
        this.postProcessApplicationContext(context);
        //拿到之前实例化SpringApplication对象的时候设置的ApplicationContextInitializer，调用它们的initialize方法，对上下文做初始化
        this.applyInitializers(context);
        //调用listeners#contextPrepared,该方法是一个空实现，以后我们可以扩展的地方
        listeners.contextPrepared(context);
        //打印启动日志
        if (this.logStartupInfo) {
            this.logStartupInfo(context.getParent() == null);
            this.logStartupProfileInfo(context);
        }
        //往上下文的beanFactory中注册一个singleton的bean，bean的名字是springApplicationArguments，bean的实例是之前实例化的ApplicationArguments对象
        context.getBeanFactory().registerSingleton("springApplicationArguments", applicationArguments);

        //如果之前获取的printedBanner不为空
        if (printedBanner != null) {
        //往上下文的beanFactory中注册一个singleton的bean，bean的名字是springBootBanner，bean的实例就是这个printedBanner.这里默认是SpringBootBanner.
            context.getBeanFactory().registerSingleton("springBootBanner", printedBanner);
        }
        //获取所有资源
        Set<Object> sources = this.getAllSources();
        Assert.notEmpty(sources, "Sources must not be empty");
        //调用load方法注册启动类的bean定义，也就是调用SpringApplication.run(Application.class, args);的类
        //SpringApplication的load方法内会创建BeanDefinitionLoader的对象，并调用它的load()方法
        this.load(context, sources.toArray(new Object[0]));
        //上下文已经加载，该方法先找到所有的ApplicationListener，遍历这些listener
        //如果该listener继承了ApplicationContextAware类，这一步会调用它的setApplicationContext方法，设置context
        listeners.contextLoaded(context);
    }
```

### step9 Spring上下文刷新 refreshContext

```java
this.refreshContext(context);
```

在`refreshContext`函数中，第一行调用了`refresh(context);`跳转了一下，下面的代码是注册了一个应用关闭的函数钩子，如下：

``` java
private void refreshContext(ConfigurableApplicationContext context) {
        this.refresh(context);
        if (this.registerShutdownHook) {
            try {
                context.registerShutdownHook();
            } catch (AccessControlException var3) {
                ;
            }
        }

}
```

通过代码跟踪分析发现，其实是调用了`AbstractApplicationContext`中的refresh方法。
在`ServletWebServerApplicationContext和ReactiveWebServerApplicationContext`的refresh函数中都是调用了`super.refresh();`

代码如下：

``` java
public void refresh() throws BeansException, IllegalStateException {
        Object var1 = this.startupShutdownMonitor;
        //同步快执行刷新操作
        synchronized(this.startupShutdownMonitor) {
            //准备刷新上下文
            this.prepareRefresh();
            //获取了bean工厂以后，设置bean工厂的环境
            ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();
            this.prepareBeanFactory(beanFactory);

            try {
                //发送了一个bean工厂的处理信号，紧接着回调处理器，注册到bean工厂
                this.postProcessBeanFactory(beanFactory);
                this.invokeBeanFactoryPostProcessors(beanFactory);
                this.registerBeanPostProcessors(beanFactory);
                //初始化监听器
                this.initMessageSource();
                //初始化监听管理器
                this.initApplicationEventMulticaster();
                this.onRefresh();
                //把spring容器内的listener和beanfactory的listener都添加到广播器中：
                this.registerListeners();
                //实例化BeanFactory 中已经被注册但是没被实例化的所有实例。初始化的过程中各种BeanPostProcessor已经开始生效
                this.finishBeanFactoryInitialization(beanFactory);
                //收尾，刷新产生的缓存、初始化生命周期处理器LifecycleProcessor，并调用其onRefresh()方法、发布事件、调用LiveBeansView的registerApplicationContext注册context。
                this.finishRefresh();
            } catch (BeansException var9) {
                if (this.logger.isWarnEnabled()) {
                    this.logger.warn("Exception encountered during context initialization - cancelling refresh attempt: " + var9);
                }

                this.destroyBeans();
                this.cancelRefresh(var9);
                throw var9;
            } finally {
                this.resetCommonCaches();
            }

        }
    }
```

### step10 Spring上下文后置结束处理 afterRefresh

在刷新完context后，调用了一个`afterRefresh`函数，这个函数前面已经说过了，是为了给`ApplicationContext`的子类留下的一个扩展点

```java
this.afterRefresh(context, applicationArguments);
```

然后调用了`listeners.started(context);`，把监听器设置成了已经启动的状态。
最后调用了`callRunners`函数，获取所有的`ApplicationRunner`和`CommandLineRunner`然后调用他们的run方法

### step11 发布应用上下文启动完成事件

把监听器设置成了已经启动的状态

```java
listeners.started(context);
```

### step12 执行所有Runner运行器

调用了 `callRunners` 函数，获取所有的 `ApplicationRunner` 和 `CommandLineRunner` 然后调用他们的run方法

### step13 发布应用上下文就绪事件

```java
listeners.running(context);
```

触发所有 `SpringApplicationRunListener` 监听器的 running 事件方法。

### step14 返回上下文

## 总结

本文分析了 Spring Boot 启动 run 方法，看得真的是让人头痛，但又不得不看，主要分为以下2步进行分析

1. SpringApplication实例的构建过程

   其中主要涉及到了初始化器(Initializer)以及监听器(Listener)这两大概念，它们都通过 `META-INF/spring.factories` 完成定义

2. SpringApplication实例run方法的执行过程

   其中主要有一个 `SpringApplicationRunListeners` 的概念，它作为Spring Boot容器初始化时各阶段事件的中转器，将事件派发给感兴趣的Listeners(在SpringApplication实例的构建过程中得到的)。这些阶段性事件将容器的初始化过程给构造起来，提供了比较强大的可扩展性。

如果从可扩展性的角度出发，应用开发者可以在Spring Boot容器的启动阶段，扩展哪些内容呢：

- 初始化器(Initializer)

- 监听器(Listener)
- 容器刷新后置Runners( `ApplicationRunner` 或者 `CommandLineRunner` 接口的实现类)
- 启动期间在Console打印Banner的具体实现类
