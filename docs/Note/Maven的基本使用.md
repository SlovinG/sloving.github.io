---
title: Maven的基本使用
date: 2023-04-19
tags: 
 - Maven
categories:
 - 笔记
---

# Maven的基本使用

## Maven 简介

Apache Maven 是一款基于 Java 平台的项目管理和整合工具，它将项目的开发和管理过程抽象成一个项目对象模型（POM）。开发人员只需要做一些简单的配置，Maven 就可以自动完成项目的编译、测试、打包、发布以及部署等工作。

Maven 是使用 Java 语言编写的，因此它和 Java 一样具有跨平台性，这意味着无论是在 Windows ，还是在 Linux 或者 Mac OS 上，都可以使用相同的命令进行操作。

Maven 使用标准的目录结构和默认构建生命周期，因此开发者几乎不用花费多少时间就能够自动完成项目的基础构建工作。

### Maven 的好处

举个例子，在一般的电商项目中，代码分为订单、商品、商家、用户和营销模块，订单模块需要用到用户模块的代码，比如查询用户信息的接口，那是不是需要用户模块的同学把代码拷贝一份给订单模块呢？

可以，但这么做会有很多问题，首先是用户模块同学写的代码可能有bug，需要修复，另外模块的功能一直在迭代，比如原来接口里面只有按照 userId 查询，现在增加了姓名查询、手机号查询，**每次写完都需要重新拷贝一份代码，这样效率很低**。

聪明的工程师们想到了一个方法，把这些代码集中存储管理，用 **包+版本** 的方式，这个集中存储的地方叫 **仓库**，大家都以仓库为准，代码的变更通过版本号来维护，为了防止每个小改动都需要修改版本，也是把线下用的测试版本和线上生产环境的区分开，分为 Snapshot 包和 Release 包。

Maven 的好处：

- Maven 可以将项目过程 **规范化、自动化、高效化** 以及拥有强大的 **可扩展性**，利用 maven 自身及其插件还可以获得代码检查报告、单元测试覆盖率、实现持续集成等等。
- Maven 使得项目的管理变得容易，**构建项目的速度更快**，由于 Maven 提供了仓库的概念去管理 jar 包，所以用 git 或者 svn 的时候，存储构建的项目体积会更小。

### 约定优于配置

约定优于配置是 Maven 最核心的涉及理念之一 ，Maven对项目的目录结构、测试用例命名方式等内容都做了规定，凡是使用 Maven 管理的项目都必须遵守这些规则。

Maven 项目构建过程中，会自动创建默认项目结构，开发人员仅需要在相应目录结构下放置相应的文件即可。

例如，下表显示了项目源代码文件，资源文件和其他配置在 Maven 项目中的默认位置。 

| 文件         | 目录               |
| ------------ | ------------------ |
| Java 源代码  | src/main/java      |
| 资源文件     | src/main/resources |
| 测试源代码   | src/test/java      |
| 测试资源文件 | src/test/resources |
| 打包输出文件 | target             |
| 编译输出文件 | target/classes     |

### Maven 的特点

1. 设置简单。
2. 所有项目的用法一致。
3. 可以管理和自动更新依赖。
4. 庞大且不断增长的资源库。
5. 可扩展，使用 Java 或脚本语言可以轻松的编写插件。
6. 几乎无需额外配置即可访问新功能。
7. 基于模型的构建：Maven 能够将任意数量的项目构建为预定义的输出类型，例如 JAR，WAR。
8. 项目信息采取集中式的元数据管理：使用与构建过程相同的元数据，Maven 能够生成一个网站（site）和一个包含完整文档的 PDF。
9. 发布管理和发行发布：Maven 可以与源代码控制系统（例如 Git、SVN）集成并管理项目的发布。
10. 向后兼容性：您可以轻松地将项目从旧版本的 Maven 移植到更高版本的 Maven 中。
11. 并行构建：它能够分析项目依赖关系，并行构建工作，使用此功能，可以将性能提高 20%-50％。
12. 更好的错误和完整性报告：Maven 使用了较为完善的错误报告机制，它提供了指向 Maven Wiki 页面的链接，您将在其中获得有关错误的完整描述。

## Maven 下载与配置

Maven 是一个基于 Java 的项目管理工具，因此首先要在计算机上安装 JDK，配置环境变量。

之后同理从官网下载 Maven，并配置环境变量即可。

## Maven 仓库

在 Maven 中，任何一个依赖、插件或者项目构建的输出，都可以称为 **构件**。

Maven 在某个统一的位置存储所有项目的构件，这个统一的位置，我们就称之为 **仓库**。换言之，仓库就是存放依赖和插件的地方。

任何的构件都有唯一的 **坐标**，该坐标定义了构件在仓库中的 **唯一存储路径**。当 Maven 项目需要某些构件时，只要其 POM 文件中声明了这些构件的坐标，Maven 就会根据这些坐标找自动到仓库中找到并使用它们。

项目构建完成生成的构件，也可以安装或者部署到仓库中，供其他项目使用。

### 仓库的分类

Maven 仓库可以分为 2 个大类：

- 本地仓库
- 远程仓库

当 Maven 根据坐标寻找构件时，它会首先查看本地仓库，若本地仓库存在此构件，则直接使用。若本地仓库不存在此构件，Maven 就会去远程仓库查找，若发现所需的构件后，则下载到本地仓库使用。如果本地仓库和远程仓库都没有所需的构件，则 Maven 就会报错。

远程仓库还可以分为 3 个小类：中央仓库、私服、其他公共仓库。

- 中央仓库是由 Maven 社区提供的一种特殊的远程仓库，它包含了绝大多数流行的开源构件。在默认情况下，当本地仓库没有 Maven 所需的构件时，会首先尝试从中央仓库下载。
- 私服是一种特殊的远程仓库，很多公司自己会在局域网内搭建一个自己公司私有的仓库地址。
- 除了中央仓库和私服外，还有很多其他公共仓库，例如 JBoss Maven 库，Java.net Maven 库等等。

这里有个概念要区分一下，很多人会把私服和镜像（mirror）弄混，镜像是中央仓库的复制品，因为中央仓库在国外，你访问中央仓库的速度很慢，而镜像的服务器在国内，相当于弄了个缓存。

Maven 仓库的分类如下图：

![Maven 仓库分类](./assets/1420431Z2-0.png)

**私服在实际开发中十分的常用，也特别重要。**

### 本地仓库

Maven 本地仓库实际上就是本地计算机上的一个文件夹，它会在第一次执行 Maven 命令时被创建。

Maven 本地仓库可以储存本地所有项目所需的构件。当 Maven 项目第一次进行构建时，会自动从远程仓库搜索依赖项，并将其下载到本地仓库中。当项目再进行构建时，会直接从本地仓库搜索依赖项并引用，而不会再次向远程仓库获取。

Maven 本地仓库默认地址为 `~/.m2/repository` ，但出于某些原因（例如磁盘空间不够），我们通常会重新自定义本地仓库的位置。这时需要修改 `%MAVEN_HOME%/conf` 目录下的 `settings.xml` 文件，通过 `localRepository` 元素定义另一个本地仓库地址，例如：

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
   http://maven.apache.org/xsd/settings-1.0.0.xsd">
    <localRepository>~/myRepository/repository</localRepository>
</settings>
```

构件只有储存在本地仓库中，才能被其他的 Maven 项目使用。

构件想要进入本地仓库，除了从远程仓库下载到本地仓库外，还可以使用命令 `mvn install` **将本地项目的输出构件安装到本地仓库中**。

### 远程仓库（主要指私服）

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.biancheng.www</groupId>
    <artifactId>maven</artifactId>
    <version>0.0.1-SNAPSHOT</version>

    <dependencies>
        <dependency>
            <groupId>com.bangcheng.common-lib</groupId>
            <artifactId>common-lib</artifactId>
            <version>1.0.0</version>
        </dependency>
    </dependencies>

    <repositories>
        <repository>
            <id>bianchengbang.lib1</id>
            <url>http://download.bianchengbang.org/maven2/lib1</url>
        </repository>
        <repository>
            <id>bianchengbang.lib2</id>
            <url>http://download.bianchengbang.org/maven2/lib2</url>
        </repository>
    </repositories>
</project>
```

### 中央仓库

中央仓库是由 Maven 社区提供的一种特殊的远程仓库，它包含了绝大多数流行的开源构件。在默认情况下，当本地仓库没有 Maven 所需的构件时，会首先尝试从中央仓库下载。

中央仓库具有如下特点：

- 这个仓库由 Maven 社区管理
- **不需要配置**
- 需要通过网络才能访问

我们可以通过 Maven 社区提供的 URL：http://search.maven.org/#browse，浏览其中的构件。中央仓库包含了绝大多数流行的开源 Java 构件及其源码、作者信息和许可证信息等。一般来说，Maven 项目所依赖的构件都可以从中央仓库下载到。

虽然中央仓库属于远程仓库的范畴，但由于它的特殊性，一般会把它与其他远程仓库区分开。因此，我们常说的远程仓库，一般不包括中央仓库。

### Maven 依赖搜索顺序

当通过 Maven 构建项目时，Maven 按照如下顺序查找依赖的构件。

1. 从本地仓库查找构件，如果没有找到，跳到第 2 步，否则继续执行其他处理。
2. 从中央仓库查找构件，如果没有找到，并且已经设置其他远程仓库，然后移动到第 4 步；如果找到，那么将构件下载到本地仓库中使用。
3. 如果没有设置其他远程仓库，Maven 则会停止处理并抛出错误。
4. 在远程仓库查找构件，如果找到，则会下载到本地仓库并使用，否则 Maven 停止处理并抛出错误。

## Maven POM

POM（Project Object Model，项目对象模型）是 Maven 的基本组件，它是以 xml 文件的形式存放在项目的根目录下，名称为 pom.xml。

POM 中定义了项目的基本信息，用于描述项目如何构建、声明项目依赖等等。

当 Maven 执行一个任务时，它会先查找当前项目的 POM 文件，读取所需的配置信息，然后执行任务。在 POM 中可以设置如下配置：

- 项目依赖
- 插件
- 目标
- 构建时的配置文件
- 版本 
- 开发者
- 邮件列表

在创建 POM 之前，首先要确定工程组（groupId），及其名称（artifactId）和版本，在仓库中这些属性是项目的唯一标识。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>net.biancheng.www</groupId>
    <artifactId>maven</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</project>
```

所有的 Maven 项目都有一个 POM 文件，所有的 POM 文件都必须有 project 元素和 3 个必填字段：groupId、artifactId 以及 version。

| 节点       | 描述                                                         |
| ---------- | ------------------------------------------------------------ |
| groupId    | 项目组 ID，定义当前 Maven 项目隶属的组织或公司，通常是唯一的。它的取值一般是项目所属公司或组织的网址或 URL 的反写，例如 net.biancheng.www。 |
| artifactId | 项目 ID，通常是项目的名称。groupId 和 artifactId 一起定义了项目在仓库中的位置。 |
| version    | 项目版本。                                                   |

实际开发过程中，Maven 的 pom.xml 文件不需要手工编写，Maven 提供了大量的原型（Archetype）插件来创建项目，包括项目结构和 pom.xml。

## Maven 项目的创建

Maven 提供了大量不同类型的 Archetype 模板，通过它们可以帮助用户快速的创建 Java 项目，其中最简单的模板就是 maven-archetype-quickstart，它只需要用户提供项目最基本的信息，就能生成项目的基本结构及 POM 文件。

### 创建 Maven 项目

下面我们将通过 `maven-archetype-quickstart` 原型，在 D:\maven 目录中创建一个基于 Maven 的 Java 项目。

打开命令行窗口，跳转到 D:\maven 目录，执行以下 mvn 命令。

```
mvn archetype:generate -DgroupId=net.biancheng.www -DartifactId=helloMaven -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

参数说明：

- -DgroupId: 项目组 ID，通常为组织名或公司网址的反写。
- -DartifactId: 项目名。
- -DarchetypeArtifactId: 指定 ArchetypeId，maven-archetype-quickstart 用于快速创建一个简单的 Maven 项目。
- -DinteractiveMode: 是否使用交互模式。

Maven 会开始进行处理，并创建一套完整的 Maven 项目目录结构。

### 目录结构

进入 D:\maven 目录， 我们看到 Maven 已经创建了一个名为 helloMaven 的 Java 项目（在 artifactId 中指定的），该项目使用一套标准的目录结构，如下图所示。

![img](./assets/1120493U1-0.png)

Maven 创建项目时，还自动生成了两个Java 文件： App.java 和 AppTest.java。

## Maven坐标

在 Maven 中，任何一个依赖、插件或者项目构建的输出，都可以称为构件。

在 Maven 世界中存在着数十万甚至数百万构件，在引入坐标概念之前，当用户需要使用某个构件时，只能去对应的网站寻找，但各个网站的风格迥异，这使得用户将大量的时间浪费在搜索和寻找上，严重地影响了研发效率。为了解决这个问题，于是 Maven 引入了 Maven 坐标的概念。 

Maven 定义了一套规则，它规定：世界上任何一个构件都可以使用 Maven 坐标并作为其唯一标识，Maven 坐标包括 groupId、artifactId、version、packaging 等元素，只要用户提供了正确的坐标元素，Maven 就能找到对应的构件。 

任何一个构件都必须明确定义自己的坐标，这是 Maven 的强制要求，任何构件都不能例外。我们在开发 Maven 项目时，也需要为其定义合适的坐标，只有定义了坐标，其他项目才能引用该项目生成的构件。

以下是 helloMaven 项目的坐标定义：

```
<project> 
    <groupId>net.biancheng.www</groupId>
    <artifactId>helloMaven</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
</project>
```

Maven 坐标主要由以下元素组成：

- groupId： 项目组 ID，定义当前 Maven 项目隶属的组织或公司，通常是唯一的。它的取值一般是项目所属公司或组织的网址或 URL 的反写，例如 net.biancheng.www。
- artifactId： 项目 ID，通常是项目的名称。
- version：版本。
- packaging：项目的打包方式，默认值为 jar。

以上 4 个元素中 groupId、artifactId 和 version 是必须定义的，packaging 是可选的。

## Maven依赖

Maven 是一款优秀的依赖管理工具。

通俗的说，如果一个 Maven 构建所产生的构件被其他项目引用，那么该构件就是其他项目的依赖。

### 依赖声明

Maven 坐标是依赖的前提，所有 Maven 项目必须明确定义自己的坐标，只有这样，它们才可能成为其他项目的依赖。当一个项目的构件成为其他项目的依赖时，该项目的坐标才能体现出它的价值。

当 Maven 项目需要声明某一个依赖时，通常只需要在其 POM 中配置该依赖的坐标信息，Maven 会根据坐标自动将依赖下载到项目中。

例如，某个项目中使用 servlet-api 作为其依赖，其配置如下。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
...
    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>servlet-api</artifactId>
            <version>2.5</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</project>
```

dependencies 元素可以包含一个或者多个 dependency 子元素，用以声明一个或者多个项目依赖，每个依赖都可以包含以下元素：

- groupId、artifactId 和 version：依赖的基本坐标，对于任何一个依赖来说，基本坐标是最重要的，Maven 根据坐标才能找到需要的依赖。
- type：依赖的类型，对应于项目坐标定义的 packaging。大部分情况下，该元素不必声明，其默认值是 jar。
- scope：依赖的范围。
- optional：标记依赖是否可选。
- exclusions：用来排除传递性依赖。

大部分依赖声明只包含 groupId、artifactId 和 version 三个元素。

绝大部分依赖的 Maven 坐标都能在 https://mvnrepository.com/ 中获取。

## 构建生命周期

<img src="./assets/512.png" alt="图片" style="zoom:50%;" />

IDEA Maven Lifecycle的解读：

- clean（清理）：将编译得到的旧文件 class 字节码文件删除
- compile（编译）：将 java 源程序编译成 class 字节码文件，编译 resource 资源文件
- test（测试）：自动运行测试用例
- report（报告）：测试程序执行的结果
- package（打包）：动态Web工程打War包，java工程打jar包
- install（安装）：将打包得到的文件复制到“仓库”中的指定位置，比如我们多模块构建的时候使用install 将包安装到本地仓库
- deploy（部署）：将包部署到指定仓库，或者配置应用部署的运行目录

这些 Lifecycle 实际都是通过插件的形式来完成的，其实 Maven 的大部分功能都是通过插件来完成的。
