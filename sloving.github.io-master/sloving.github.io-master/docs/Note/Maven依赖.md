---
title: Maven依赖
sidebar: auto
tags: 
 - Maven
categories:
 - 笔记
---

# Maven依赖

Maven 依赖传递是 Maven 的核心机制之一，它能够一定程度上简化 Maven 的依赖配置。本节我们将详细介绍依赖传递及其相关概念。

## 依赖传递

如下图所示，项目 A 依赖于项目 B，B 又依赖于项目 C，此时 B 是 A 的直接依赖，C 是 A 的间接依赖。

![依赖传递](./assets/1212441G0-0.png)

Maven 的依赖传递机制是指：不管 Maven 项目存在多少间接依赖，POM 中都只需要定义其直接依赖，不必定义任何间接依赖，Maven 会动读取当前项目各个直接依赖的 POM，将那些必要的间接依赖以传递性依赖的形式引入到当前项目中。Maven 的依赖传递机制能够帮助用户一定程度上简化 POM 的配置。

基于 A、B、C 三者的依赖关系，根据 Maven 的依赖传递机制，我们只需要在项目 A 的 POM 中定义其直接依赖 B，在项目 B 的 POM 中定义其直接依赖 C，Maven 会解析 A 的直接依赖 B的 POM ，将间接依赖 C 以传递性依赖的形式引入到项目 A 中。

通过这种依赖传递关系，可以使依赖关系树迅速增长到一个很大的量级，很有可能会出现依赖重复，依赖冲突等情况，Maven 针对这些情况提供了如下功能进行处理。

- 依赖范围（Dependency scope）
- 依赖调解（Dependency mediation）
- 可选依赖（Optional dependencies）
- 排除依赖（Excluded dependencies）
- 依赖管理（Dependency management）

## 依赖范围

首先，我们要知道 Maven 在对项目进行编译、测试和运行时，会分别使用三套不同的 classpath。Maven 项目构建时，在不同阶段引入到 classpath 中的依赖时不同的。例如编译时，Maven 会将与编译相关的依赖引入到编译 classpath 中；测试时，Maven 会将与测试相关的的依赖引入到测试 classpath 中；运行时，Maven 会将与运行相关的依赖引入到运行 classpath 中。

我们可以在 POM 的依赖声明使用 scope 元素来控制依赖与三种 classpath（编译 classpath、测试 classpath、运行 classpath ）之间的关系，这就是依赖范围。

Maven 具有以下 6 中常见的依赖范围，如下表所示。

| 依赖范围 | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| compile  | 编译依赖范围，scope 元素的缺省值。使用此依赖范围的 Maven 依赖，对于三种 classpath 均有效，即该 Maven 依赖在上述三种 classpath 均会被引入。例如，log4j 在编译、测试、运行过程都是必须的。 |
| test     | 测试依赖范围。使用此依赖范围的 Maven 依赖，只对测试 classpath 有效。例如，Junit 依赖只有在测试阶段才需要。 |
| provided | 已提供依赖范围。使用此依赖范围的 Maven 依赖，只对编译 classpath 和测试 classpath 有效。例如，servlet-api 依赖对于编译、测试阶段而言是需要的，但是运行阶段，由于外部容器已经提供，故不需要 Maven 重复引入该依赖。 |
| runtime  | 运行时依赖范围。使用此依赖范围的 Maven 依赖，只对测试 classpath、运行 classpath 有效。例如，JDBC 驱动实现依赖，其在编译时只需 JDK 提供的 JDBC 接口即可，只有测试、运行阶段才需要实现了 JDBC 接口的驱动。 |
| system   | 系统依赖范围，其效果与 provided 的依赖范围一致。其用于添加非 Maven 仓库的本地依赖，通过依赖元素 dependency 中的 systemPath 元素指定本地依赖的路径。鉴于使用其会导致项目的可移植性降低，一般不推荐使用。 |
| import   | 导入依赖范围，该依赖范围只能与 dependencyManagement 元素配合使用，其功能是将目标 pom.xml 文件中 dependencyManagement 的配置导入合并到当前 pom.xml 的 dependencyManagement 中。 |

依赖范围与三种 classpath 的关系一览表，如下所示。

| 依赖范围 | 编译 classpath | 测试 classpath | 运行 classpath | 例子                    |
| -------- | -------------- | -------------- | -------------- | ----------------------- |
| compile  | √              | √              | √              | log4j                   |
| test     | -              | √              | -              | junit                   |
| provided | √              | √              | -              | servlet-api             |
| runtime  | -              | √              | √              | JDBC-driver             |
| system   | √              | √              | -              | 非 Maven 仓库的本地依赖 |

## 依赖范围对传递依赖的影响

项目 A 依赖于项目 B，B 又依赖于项目 C，此时我们可以将 A 对于 B 的依赖称之为第一直接依赖，B 对于 C 的依赖称之为第二直接依赖。

B 是 A 的直接依赖，C 是 A 的间接依赖，根据 Maven 的依赖传递机制，间接依赖 C 会以传递性依赖的形式引入到 A 中，但这种引入并不是无条件的，它会受到依赖范围的影响。

传递性依赖的依赖范围受第一直接依赖和第二直接依赖的范围影响，如下表所示。

|          | compile  | test | provided | runtime  |
| -------- | -------- | ---- | -------- | -------- |
| compile  | compile  | -    | -        | runtime  |
| test     | test     | -    | -        | test     |
| provided | provided | -    | provided | provided |
| runtime  | runtime  | -    | -        | runtime  |

注：上表中，左边第一列表示第一直接依赖的依赖范围，上边第一行表示第二直接依赖的依赖范围。交叉部分的单元格的取值为传递性依赖的依赖范围，若交叉单元格取值为“-”，则表示该传递性依赖不能被传递。

通过上表，可以总结出以下规律：

- 当第二直接依赖的范围是 compile 时，传递性依赖的范围与第一直接依赖的范围一致；
- 当第二直接依赖的范围是 test 时，传递性依赖不会被传递；
- 当第二直接依赖的范围是 provided 时，只传递第一直接依赖的范围也为 provided 的依赖，且传递性依赖的范围也为 provided；
- 当第二直接依赖的范围是 runtime 时，传递性依赖的范围与第一直接依赖的范围一致，但 compile 例外，此时传递性依赖的范围为 runtime。

## 依赖调节

Maven 的依赖传递机制可以简化依赖的声明，用户只需要关心项目的直接依赖，而不必关心这些直接依赖会引入哪些间接依赖。但当一个间接依赖存在多条引入路径时，为了避免出现依赖重复的问题，Maven 通过依赖调节来确定间接依赖的引入路径。

依赖调节遵循以下两条原则：

1. 引入路径短者优先
2. 先声明者优先

以上两条原则，优先使用第一条原则解决，第一条原则无法解决，再使用第二条原则解决。

### 引入路径短者优先

引入路径短者优先，顾名思义，当一个间接依赖存在多条引入路径时，引入路径短的会被解析使用。

例如，A 存在这样的依赖关系：
A->B->C->D(1.0)
A->X->D(2.0)

D 是 A 的间接依赖，但两条引入路径上有两个不同的版本，很显然不能同时引入，否则造成重复依赖的问题。根据 Maven 依赖调节的第一个原则：引入路径短者优先，D（1.0）的路径长度为 3，D（2.0）的路径长度为 2，因此间接依赖 D（2.0）将从 A->X->D(2.0) 路径引入到 A 中。

### 先声明者优先

先声明者优先，顾名思义，在引入路径长度相同的前提下，POM 文件中依赖声明的顺序决定了间接依赖会不会被解析使用，顺序靠前的优先使用。

例如，A 存在以下依赖关系：
A->B->D(1.0)
A->X->D(2.0)

D 是 A 的间接依赖，其两条引入路径的长度都是 2，此时 Maven 依赖调节的第一原则已经无法解决，需要使用第二原则：先声明者优先。

A 的 POM 文件中配置如下。

```xml
<dependencies>
    ...      
    <dependency>
        ...
        <artifactId>B</artifactId>       
        ...
    </dependency>
    ...
    <dependency>
        ...
        <artifactId>X</artifactId>
        ...
    </dependency>
    ...
</dependencies>
```

有以上配置可以看出，由于 B 的依赖声明比 X 靠前，所以间接依赖 D（1.0）将从 A->B->D(1.0) 路径引入到 A 中。

我们知道 Maven 依赖具有传递性，例如 A 依赖于 B，B 依赖于 C，在不考虑依赖范围等因素的情况下，Maven 会根据依赖传递机制，将间接依赖 C 引入到 A 中。但如果 A 出于某种原因，希望将间接依赖 C 排除，那该怎么办呢？Maven 为用户提供了两种解决方式：排除依赖（Dependency Exclusions）和可选依赖（Optional Dependencies）。

## 排除依赖

假设存在这样的依赖关系，A 依赖于 B，B 依赖于 X，B 又依赖于 Y。B 实现了两个特性，其中一个特性依赖于 X，另一个特性依赖于 Y，且两个特性是互斥的关系，用户无法同时使用两个特性，所以 A 需要排除 X，此时就可以在 A 中将间接依赖 X 排除。

排除依赖是通过在 A 中使用 exclusions 元素实现的，该元素下可以包含若干个 exclusion 子元素，用于排除若干个间接依赖，示例代码如下。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.biancheng.www</groupId>
    <artifactId>A</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>net.biancheng.www</groupId>
            <artifactId>B</artifactId>
            <version>1.0-SNAPSHOT</version>
            <exclusions>
                <!-- 设置排除 -->
                <!-- 排除依赖必须基于直接依赖中的间接依赖设置为可以依赖为 false -->
                <!-- 设置当前依赖中是否使用间接依赖 -->
                <exclusion>
                    <!--设置具体排除-->
                    <groupId>net.biancheng.www</groupId>
                    <artifactId>X</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
    </dependencies>
</project>
```

关于 exclusions 元素及排除依赖说明如下：

- 排除依赖是控制当前项目是否使用其直接依赖传递下来的接间依赖；
- exclusions 元素下可以包含若干个 exclusion 子元素，用于排除若干个间接依赖；
- exclusion 元素用来设置具体排除的间接依赖，该元素包含两个子元素：groupId 和 artifactId，用来确定需要排除的间接依赖的坐标信息；
- exclusion 元素中只需要设置 groupId 和 artifactId 就可以确定需要排除的依赖，无需指定版本 version。

## 可选依赖

与上文的应用场景相同，也是 A 希望排除间接依赖 X，我们还可以在 B 中将 X 设置为可选依赖。

### 设置可选依赖

在 B 的 POM 关于 X 的依赖声明中使用 optional 元素，将其设置成可选依赖，示例配置如下。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.biancheng.www</groupId>
    <artifactId>B</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>net.biancheng.www</groupId>
            <artifactId>X</artifactId>
            <version>1.0-SNAPSHOT</version>
            <!--设置可选依赖  -->
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
```

关于 optional 元素及可选依赖说明如下：

- 可选依赖用来控制当前依赖是否向下传递成为间接依赖；
- optional 默认值为 false，表示可以向下传递称为间接依赖；
- 若 optional 元素取值为 true，则表示当前依赖不能向下传递成为间接依赖。

## 排除依赖 VS 可选依赖 

排除依赖和可选依赖都能在项目中将间接依赖排除在外，但两者实现机制却完全不一样。

- 排除依赖是控制当前项目是否使用其直接依赖传递下来的接间依赖；
- 可选依赖是控制当前项目的依赖是否向下传递；
- 可选依赖的优先级高于排除依赖；
- 若对于同一个间接依赖同时使用排除依赖和可选依赖进行设置，那么可选依赖的取值必须为 false，否则排除依赖无法生效。

![](./assets/573.png)