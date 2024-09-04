---
title: Maven导入本地jar包
date: 2023-04-19
tags: 
 - Maven
categories:
 - 笔记
---

# Maven导入本地jar包

Maven 是通过仓库对依赖进行管理的，当 Maven 项目需要某个依赖时，只要其 POM 中声明了依赖的坐标信息，Maven 就会自动从仓库中去下载该构件使用。但在实际的开发过程中，经常会遇到一种情况：某一个项目需要依赖于存储在本地的某个 jar 包，该 jar 包无法从任何仓库中下载的，这种依赖被称为外部依赖或本地依赖。那么这种依赖是如何声明的呢？

下面我们通过一个实例实例来介绍如何导入本地 jar 包。

1. 打开命令行窗口，跳转到 D:\maven 目录下，执行以下 mvn 命令，创建一个名为 secondMaven 的项目。

   ```
   mvn archetype:generate -DgroupId=net.sloving.www -DartifactId=secondMaven -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
   ```

2. 更新 secondMaven 中 App 类的代码：

   ```java
   package net.sloving.www;
   import net.sloving.www.Util;
   public class App {
       public static void main(String[] args) {
           Util.printMessage("secondMaven");
       }
   }
   ```

   由以上代码可以看出，secondMaven 中的 App 类需要使用 helloMaven 中独有的 Util 类，即 secondMaven 需要依赖于 helloMaven。

3. 跳转到 helloMaven 所在的目录，执行以下 mvn 命令， 将该项目打包成 jar 文件。

   ```
   mvn clean package
   ```

4. 命令执行完成后，进入 D:\maven\helloMaven\target 目录，可以看到 Maven 已经将 helloMaven 项目打包成 helloMaven-1.0-SNAPSHOT.jar。

5. 修改 secondMaven 中 pom.xml 的配置如下：

   ```xml
   <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
       <modelVersion>4.0.0</modelVersion>
       <groupId>net.sloving.www</groupId>
       <artifactId>secondMaven</artifactId>
       <packaging>jar</packaging>
       <version>1.0-SNAPSHOT</version>
       <name>secondMaven</name>
       <url>http://maven.apache.org</url>
       <dependencies>
           <dependency>
               <groupId>junit</groupId>
               <artifactId>junit</artifactId>
               <version>3.8.1</version>
               <scope>test</scope>
           </dependency>
           <!--外部依赖-->
           <dependency>
               <groupId>net.sloving.www</groupId>
               <artifactId>helloMaven</artifactId>
                <!--依赖范围-->
               <scope>system</scope>
               <version>1.0-SNAPSHOT</version>
               <!--依赖所在位置-->
               <systemPath>D:\maven\helloMaven\target\helloMaven-1.0-SNAPSHOT.jar</systemPath>
           </dependency>
       </dependencies>
   </project>
   ```

   在以上配置中，除了依赖的坐标信息外，外部依赖还使用了 scope 和 systemPath 两个元素。

   - scope 表示依赖范围，这里取值必须是 system，即系统。
   - systemPath 表示依赖的本地构件的位置。

6. 打开命令行窗口，跳转到 secondMaven 所在目录，执行以下 mvn 命令，进行编译：

   ```
   mvn clean compile
   ```

7. 编译完成后，执行以下命令，设置临时环境变量。

   ```
   set classpath=%classpath%;D:\maven\helloMaven\target\helloMaven-1.0-SNAPSHOT.jar
   ```

8. 执行以下 Java 命令：

   ```
   java net.sloving.www.App
   ```