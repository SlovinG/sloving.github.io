---
title: JUnit4的使用教程
date: 2020-08-02
tags: 
 - Java
 - JUnit
categories:
 - 笔记
---

::: tip

JUint 是 Java 编程语言的单元测试框架，用于编写和运行可重复的自动化测试

:::

# JUnit4的使用教程

## 测试分类

- 黑盒测试：不需要写代码，给输入值，看程序是否能够输出期望的值。
- 白盒测试（比如 JUnit 测试）：需要写代码的，关注程序具体的执行流程。

![](./assets/282.jpg)

### 什么是单元测试

- 单元测试是针对最小的功能单位编写测试代码
- Java 程序的最小功能单元是方法
- 单元测试就是针对单个 Java 方法的测试

### 使用 main() 方法测试的缺点

![](./assets/283.png)

- 只能有一个 main() 方法，不能分离测试代码
- 没有打印出 **测试结果** 和 **期望结果**
  例如，expected: 3628800, but actual: 123456

### 单元测试的好处

- 确保单个方法运行正常
- 如果修改了方法代码，只需确保其对应的单元测试通过
- 测试代码本身就可以作为示例代码
- 可以自动化运行所有测试并获得报告

## JUnit 特点

- JUnit 是一个开源的 Java 语言的单元测试框架
- 专门针对 Java 语言设计，使用最广泛
- JUnit 是事实上的标准单元测试框架
- 提供 **注解** 来识别测试方法
- 提供 **断言** 来测试预期结果
- 可以方便地组织和运行测试
- 可以方便地查看测试结果
- 常用 IDE（例如 Eclipse）都集成了 JUnit
- 可以方便地集成到 Maven

## JUnit 基本使用

### 导入 JUnit 依赖环境

```xml
<!-- 添加junit4依赖 -->
<dependency>
    <groupId>junit</groupId>
    <artifactId>junit</artifactId>
    <version>4.11</version>
    <!-- 指定范围，在测试时才会加载 -->
    <scope>test</scope>
</dependency>
```

### 定义一个测试类（测试用例）

建议：
* 测试类名：被测试的类名 Test，例如 `CalculatorTest`
* 包名：xxx.xxx.xx.test，例如 `cn.itcast.test`

### 定义测试方法（可以独立运行）

建议：
* 方法名：test 测试的方法名，例如 `testAdd()`
* 返回值：void
* 参数列表：空参

### 给方法加上 @Test 注解

```java
public class MyTest {
    @Test
    public void selectUser() {
        SqlSession session = MybatisUtils.getSession();
        UserMapper mapper = session.getMapper(UserMapper.class);
        List<User> users = mapper.selectUser();
        for (User user: users){
            System.out.println(user);
        }
        session.close();
    }
}
```

## JUnit 常用注解

| 注解          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| @Test         | 测试注解，标记一个方法可以作为一个测试用例                   |
| @Before       | 该方法必须在类中的每个测试之前执行，以便执行某些必要的先决条件 |
| @BeforeClass  | 指出这是附着在 **静态方法** 必须执行一次并在类的所有测试之前，这种情况一般用于测试计算、共享配制方法（如数据库连接） |
| @After        | 表示该方法在每项测试后执行（如执行每一个测试后重置某些变量，删除临时变量等） |
| @AfterClass   | 当需要执行所有测试在 JUnit 测试用例类后执行，AlterClass 注解可以使用以清理一些资源（如数据库连接），注意：方法必须为 **静态方法** |
| @Ignore       | 当想暂时禁用特定的测试执行可以使用这个注解，每个被注解为 @Ignore 的方法将不再执行 |
| @Runwith      | 放在测试类名之前，用来确定这个类使用什么运行器来运行，不标注时会使用默认运行器 |
| @Parameters   | 用于使用参数化功能                                           |
| @SuiteClasses | 用于套件测试                                                 |

## 断言

一般我们会使用 **断言** 操作来处理结果：

| 断言                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| void assertEquals([String message], expected value, actual value) | 断言两个值相等；<br/>值类型可能是int，short，long，byte，char，Object；<br/>第一个参数是一个可选字符串信息，第三个参数为误差值，可为空 |
| void assertTrue([String message], boolean condition)         | 断言一个条件为真                                             |
| void assertFalse([String message], boolean condition)        | 断言一个条件为假                                             |
| void assertNotNull([String message], java.lang.Object object) | 断言一个对象不为空（null）                                   |
| void assertNull([String message], java.lang.Object object)   | 断言一个对象为空（null）                                     |
| void assertSame([String message], java.lang.Object expected,java.lang.Object actual) | 断言两个对象引用相同的对象                                   |
| void assertNotSame([String message], java.lang.Object unexpected,java.lang.Object actual) | 断言两个对象不是引用同一个对象                               |
| void assertArrayEquals([String message],expectedArray,resultArray) | 断言预期数组和结果数组相等；<br/>数组类型可能是 int，short，long，byte，char，Object |

## JUnit执行过程

测试用例：

```java
public class JunitTest {

    @BeforeClass
    public static void beforeClass() {
        System.out.println("in before class");
    }

    @AfterClass
    public static void afterClass() {
        System.out.println("in after class");
    }

    @Before
    public void before() {
        System.out.println("in before");
    }

    @After
    public void after() {
        System.out.println("in after");
    }

    @Test
    public void testCase1() {
        System.out.println("in test case 1");
    }

    @Test
    public void testCase2() {
        System.out.println("in test case 2");
    }

}
```

输出为：

```
in before class
in before
in test case 1
in after
in before
in test case 2
in after
in after class
```

## 异常测试

JUnit 使用 `@Test 注释` 和 `expected 参数` 来测试不同的异常类型：

```java
@Test(expected = ArithmeticException.class)
public void testCase3() {
    System.out.println("in test case 3");
    int a = 0;
    int b = 1 / a;
}
```

单独执行 testCase3() 方法，由于得到了一个预期异常，所以测试通过，结果为：

```
in before class
in before
in test case 3
in after
in after class
```

如果没有得到预期异常：

```
in before class
in before
in test case 3
in after

java.lang.AssertionError: Expected exception: java.lang.ArithmeticException

in after class
```

## 参数化测试

**参数化测试允许开发人员使用不同的测试数据来反复运行同一个测试方法**

我们一般会遵循 5 个步骤来创建参数化测试：

1. 为准备使用参数化测试的测试类指定特殊的运行器 `org.junit.runners.Parameterized`
2. 为测试类声明几个变量，分别用于存放期望值和测试所用数据

3. 为测试类声明一个带有参数的公共构造函数，并在其中为第二个环节中声明的几个变量赋值
4. 为测试类声明一个使用注解 `org.junit.runners.Parameterized.Parameters` 修饰的，返回值为 `java.util.Collection` 的公共静态方法，并在此方法中初始化所有需要测试的参数对
5. 编写测试方法，使用定义的变量作为参数进行测试。

## 超时测试

如果一个测试用例比起指定的毫秒数花费了更多的时间，那么 JUnit 将自动将它标记为失败。

利用 `@Test注解` 和 `timeout参数` 一起使用，例如 `@Test(timeout=1000)`

继续使用刚才的例子，现在将testCase1的执行时间延长到5000毫秒，并加上时间参数,设置超时为1000毫秒，然后执行测试类

```java
@Test(timeout = 1000)
public void testCase1() throws InterruptedException {
    TimeUnit.SECONDS.sleep(5000);
    System.out.println("in test case 1");
}
```

testCase1 被标记为失败，并且抛出异常，执行结果：

```
in before class
in before
in after

org.junit.runners.model.TestTimedOutException: test timed out after 1000 milliseconds

	at java.lang.Thread.sleep(Native Method)
	at java.lang.Thread.sleep(Thread.java:340)
	at java.util.concurrent.TimeUnit.sleep(TimeUnit.java:386)
	at com.lxs.JUnit.JunitTest.testCase1(JunitTest.java:35)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.junit.runners.model.FrameworkMethod$1.runReflectiveCall(FrameworkMethod.java:50)
	at org.junit.internal.runners.model.ReflectiveCallable.run(ReflectiveCallable.java:12)
	at org.junit.runners.model.FrameworkMethod.invokeExplosively(FrameworkMethod.java:47)
	at org.junit.internal.runners.statements.InvokeMethod.evaluate(InvokeMethod.java:17)
	at org.junit.internal.runners.statements.FailOnTimeout$CallableStatement.call(FailOnTimeout.java:298)
	at org.junit.internal.runners.statements.FailOnTimeout$CallableStatement.call(FailOnTimeout.java:292)
	at java.util.concurrent.FutureTask.run(FutureTask.java:266)
	at java.lang.Thread.run(Thread.java:748)

in before
in test case 2
in after
in after class
```

**注意，超时测试不能取代性能测试和压力测试。**
