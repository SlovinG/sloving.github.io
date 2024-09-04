---
title: Maven SNAPSHOT
sidebar: auto
tags: 
 - Maven
categories:
 - 笔记
---

# Maven SNAPSHOT

我们知道，Maven 项目第一次构建时，会自动从远程仓库搜索依赖项，并将其下载到本地仓库中。当项目再进行构建时，会直接从本地仓库搜索依赖项并引用，而不会再次向远程仓库获取。这样的设计能够避免项目每次构建时都去远程仓库下载依赖，减轻了网络带宽的压力，但也带来了问题。

大型的应用软件通常由多个功能模块组成，这些模块一般分别于不同的团队负责开发。假设有两个团队，他们分别负责项目中的 app-ui（前端） 和 data-service（数据服务） 两个模块，且 app-ui 需要依赖 data-service 项目作为数据服务来源。

基于以上假设，若 data-service 团队正在进行快节奏的 bug 修复及功能增强，会在短时间内高频率地更新代码以及发布版本。就会出现以下情况：

1. data-service 团队每次发布新版本更新代码时，都应该通知 app-ui 团队。
2. app-ui 团队则需要定期更新其 pom.xml 以获得最新的版本。

这样，势必会影响开发效率，甚至会影响项目的验收及投产。要解决这个问题，其实很简单，那就是使用 SNAPSHOT（快照）版本。

## SNAPSHOT 是什么

SNAPSHOT（快照）是一种特殊的版本，它表示当前开发进度的副本。

与常规版本不同，快照版本的构件在发布时，Maven 会自动为它打上一个时间戳，有了这个时间戳后，当依赖该构件的项目进行构建时，Maven 就能从仓库中找到最新的 SNAPSHOT 版本文件。

定义一个组件或模块为快照版本，只需要在其 pom.xml 中版本号（version 元素的值）后加上 -SNAPSHOT 即可，例如：

```xml
<groupId>net.biancheng.www</groupId>
<artifactId>helloMaven</artifactId>
<packaging>jar</packaging>
<version>1.0-SNAPSHOT</version>
```

要解决上面的问题，现在就十分简单了：data-servcie 团队每次更新代码都使用快照版本发布到仓库中，app-ui 团队则引用快照版本的依赖，这样 app-ui 不再需要重复修改 pom.xml 中的配置，每次构建时都会自动从仓库中获取最新的构件。

默认情况下对于快照本本的构件，Maven 会每天从仓库中获取一次更新，用户也可以在任何 Maven 命令中使用 -U 参数强制 Maven 检查更新。命令如下：

```
mvn clean package -U
```

## SNAPSHOT 版本 VS RELEASE 版本 

Maven 仓库分为两种，Snapshot 快照仓库和 Release 发行仓库。

Snapshot 快照仓库用于保存开发过程中的不稳定 SNAPSHOT 版本，Release 发行仓库则用来保存稳定的 RELEASE 版本。

Maven 会根据模块的版本号（pom.xml 文件中的 version 元素）中是否带有 -SNAPSHOT 来判断是 SNAPSHOT 版本还是正式 RELEASE 版本。带有 -SNAPSHOT 是SNAPSHOT（快照）版本，不带 -SNAPSHOT 的就是正式 RELEASE（发布）版本。

SNAPSHOT 版本和 RELEASE 版本区别如下表：

| 区别                       | SNAPSHOT 版本                                                | RELEASE 版本                                                 |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 定义                       | 版本号中带有 -SNAPSHOT                                       | 版本号中不带有 -SNAPSHOT                                     |
| 发布仓库                   | Snapshot 快照仓库                                            | Release 发行仓库                                             |
| 是否从远程仓库自动获取更新 | 在不更改版本号的前提下，直接编译打包时，Maven 会自动从远程仓库上下载最新的快照版本。 | 在不更改版本号的前提下，直接编译打包时，如果本地仓库已经存在该版本的模块，则 Maven 不会主动去远程仓库下载。 |
| 稳定性                     | 快照版本往往对应了大量带有时间戳的构件，具有不稳定性。       | 发布版本只对应了唯一的构件，具有稳定性。                     |
| 使用场景                   | 快照版本只应该在组织内部的项目中依赖使用。                   | Maven 项目使用的组织外的依赖项都应该时发布版本的，不应该使用任何的快照版本依赖，否则会造成潜在的风险。 |
| 发布前是否需要修改         | 当项目经过完善的测试后，需要上线时，应该将项目从快照版本更改为发布版本 | 不需要修改                                                   |

## 示例

打开命令行窗口，跳转到 D:\maven\secondMaven 目录，执行以下 mvn 命令。

```
mvn clean package -U
```

命令执行结果如下。

```
[INFO] Scanning for projects...
[WARNING]
[WARNING] Some problems were encountered while building the effective model for net.biancheng.www:secondMaven:jar:1.0-SNAPSHOT
[WARNING] 'dependencies.dependency.systemPath' for net.biancheng.www:helloMaven:jar should use a variable instead of a hard-coded path D:\maven\helloMaven\target\helloMaven-1.0-SNAPSHOT.jar @ line 37, column 16
[WARNING]
[WARNING] It is highly recommended to fix these problems because they threaten the stability of your build.
[WARNING]
[WARNING] For this reason, future Maven versions might no longer support building such malformed projects.
[WARNING]
[INFO]
[INFO] -------------------< net.biancheng.www:secondMaven >--------------------
[INFO] Building secondMaven 1.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ secondMaven ---
[INFO] Deleting D:\maven\secondMaven\target
[INFO]
[INFO] --- maven-resources-plugin:2.6:resources (default-resources) @ secondMaven ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory D:\maven\secondMaven\src\main\resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:compile (default-compile) @ secondMaven ---
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO] Compiling 1 source file to D:\maven\secondMaven\target\classes
[INFO]
[INFO] --- maven-resources-plugin:2.6:testResources (default-testResources) @ secondMaven ---
[WARNING] Using platform encoding (GBK actually) to copy filtered resources, i.e. build is platform dependent!
[INFO] skip non existing resourceDirectory D:\maven\secondMaven\src\test\resources
[INFO]
[INFO] --- maven-compiler-plugin:3.1:testCompile (default-testCompile) @ secondMaven ---
[INFO] Changes detected - recompiling the module!
[WARNING] File encoding has not been set, using platform encoding GBK, i.e. build is platform dependent!
[INFO] Compiling 1 source file to D:\maven\secondMaven\target\test-classes
[INFO]
[INFO] --- maven-surefire-plugin:2.12.4:test (default-test) @ secondMaven ---
[INFO] Surefire report directory: D:\maven\secondMaven\target\surefire-reports
-------------------------------------------------------
T E S T S
-------------------------------------------------------
Running net.biancheng.www.AppTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.008 sec
Results :
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] --- maven-jar-plugin:2.4:jar (default-jar) @ secondMaven ---
[INFO] Building jar: D:\maven\secondMaven\target\secondMaven-1.0-SNAPSHOT.jar
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  2.413 s
[INFO] Finished at: 2021-03-04T10:24:32+08:00
[INFO] ------------------------------------------------------------------------
```

