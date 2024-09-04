---
title: Java 正则表达式
date: 2023-12-3
tags: 
 - Java
 - Pattern
 - Matcher
 - 正则表达式
categories:
 - Java
---

# Java 正则表达式

## 正则表达式简介

正则表达式（Regular Expression）又称正规表示法、常规表示法，在代码中常简写为 regex、regexp 或 RE，它是计算机科学的一个概念。

它是一个强大的字符串处理工具，可以对字符串进行查找、提取、分割、替换等操作，是一种可以用于模式匹配和替换的规范。一个正则表达式就是由普通的字符（如字符 a~z）以及特殊字符（元字符）组成的文字模式，它用以描述在查找文字主体时待匹配的一个或多个字符串。

## 正则表达式实例

一个字符串其实就是一个简单的正则表达式，例如 **Hello World** 正则表达式匹配 "Hello World" 字符串。

**.**（点号）也是一个正则表达式，它匹配任何一个字符如："a" 或 "1"。

下表列出了一些正则表达式的实例及描述：

| 正则表达式       | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| this is text     | 匹配字符串 "this is text"                                    |
| this\s+is\s+text | 注意字符串中的 **\s+**。匹配单词 "this" 后面的 **\s+** 可以匹配多个空格，之后匹配 is 字符串，再之后 **\s+** 匹配多个空格然后再跟上 text 字符串。可以匹配这个实例：this is text |
| ^\d+(\.\d+)?     | ^ 定义了以什么开始\d+ 匹配一个或多个数字? 设置括号内的选项是可选的\. 匹配 "."可以匹配的实例："5", "1.5" 和 "2.21"。 |

String 类里提供了如下几个特殊的方法来使用正则表达式。

- **boolean matches(String regex)**：判断该字符串是否匹配指定的正则表达式。
- **String replaceAll(String regex, String replacement)**：将该字符串中所有匹配 regex 的子串替换成 replacement。
- **String replaceFirst(String regex, String replacement)**：将该字符串中第一个匹配 regex 的子串替换成 replacement。
- **String[] split(String regex)**：以 regex 作为分隔符，把该字符串分割成多个子串。

上面这些特殊的方法都依赖于 Java 提供的正则表达式支持，除此之外，Java 还提供了一个用正则表达式所订制的模式来对字符串进行匹配工作的类库包 java.util.regex，它包括以下三个类：

- **Pattern**：是一个正则表达式编译后在内存中的表示形式。Pattern 类没有公共构造方法，因此要创建一个 Pattern 对象，你必须首先调用其公共静态编译方法，它返回一个 Pattern 对象。该方法接受一个正则表达式字符串作为它的第一个参数。
- **Matcher**：是对输入字符串进行解释和匹配操作的引擎。与Pattern 类一样，Matcher 也没有公共构造方法。你需要调用 Pattern 对象的 matcher 方法来获得一个 Matcher 对象。执行匹配所涉及的状态保留在 Matcher 对象中，多个 Matcher 对象可共享同一个 Pattern 对象。
- **PatternSyntaxException**：一个非强制异常类，它表示一个正则表达式模式中的语法错误。

因此，一个典型的调用顺序如下：

```java
// 将一个字符串编译成 Pattern 对象
Pattern p = Pattern.compile("a*b");
// 使用 Pattern 对象创建 Matcher 对象
Matcher m = p.matcher("aaaaab");
boolean b = m.matches(); // 返回 true
```

上面定义的 Pattern 对象可以多次重复使用。如果某个正则表达式仅需一次使用，则可直接使用 Pattern 类的静态 `matches()` 方法，此方法自动把指定字符串编译成匿名的 Pattern 对象，并执行匹配，如下所示:

```java
boolean b = Pattern.matches ("a*b","aaaaab");    // 返回 true
```

上面语句等效于前面的三条语句。但采用这种语句每次都需要重新编译新的 Pattern 对象，不能重复利用已编译的 Pattern 对象，所以效率不高。Pattern 是不可变类，可供多个并发线程安全使用。

Matcher 类提供了几个常用方法：

| 名称        | 说明                                                        |
| ----------- | ----------------------------------------------------------- |
| find()      | 返回目标字符串中是否包含与 Pattern 匹配的子串               |
| group()     | 返回上一次与 Pattern 匹配的子串                             |
| start()     | 返回上一次与 Pattern 匹配的子串在目标字符串中的开始位置     |
| end()       | 返回上一次与 Pattern 匹配的子串在目标字符串中的结束位置加 1 |
| lookingAt() | 返回目标字符串前面部分与 Pattern 是否匹配                   |
| matches()   | 返回整个目标字符串与 Pattern 是否匹配                       |
| reset()     | 将现有的 Matcher 对象应用于一个新的字符序列。               |

## 捕获组

捕获组是把多个字符当一个单独单元进行处理的方法，它通过对括号内的字符分组来创建。

例如，正则表达式 (dog) 创建了单一分组，组里包含"d"，"o"，和"g"。

捕获组通过从左至右计算其 **开括号** 来编号。例如，在表达式（（A）（B（C））），有四个这样的组：

- ((A)(B(C)))
- (A)
- (B(C))
- (C)

可以通过调用 `matcher` 对象的 `groupCount()` 方法来查看表达式有多少个分组。`groupCount()` 方法返回一个 int 值，表示matcher对象当前有多个捕获组。

还有一个特殊的组（group(0)），它总是代表整个表达式。该组不包括在 `groupCount()` 的返回值中。

下面的例子说明如何从一个给定的字符串中找到数字串：

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
public class RegexMatches{
    public static void main( String[] args ){
 
        // 按指定模式在字符串查找
        String line = "This order was placed for QT3000! OK?";
        String pattern = "(\\D*)(\\d+)(.*)";
 
        // 创建 Pattern 对象
        Pattern r = Pattern.compile(pattern);
 
        // 现在创建 matcher 对象
        Matcher m = r.matcher(line);
        if (m.find()) {
            System.out.println("Found value: " + m.group(0) );
            System.out.println("Found value: " + m.group(1) );
            System.out.println("Found value: " + m.group(2) );
            System.out.println("Found value: " + m.group(3) ); 
        } else {
            System.out.println("NO MATCH");
        }
     }
}
```

以上实例编译运行结果如下：

```
Found value: This order was placed for QT3000! OK?
Found value: This order was placed for QT
Found value: 3000
Found value: ! OK?
```

------

## 正则表达式语法

在其他语言中，**\\** 表示：**我想要在正则表达式中插入一个普通的（字面上的）反斜杠，请不要给它任何特殊的意义。**

在 Java 中，**\\** 表示：**我要插入一个正则表达式的反斜线，所以其后的字符具有特殊的意义。**

所以，在其他的语言中（如 Perl），一个反斜杠 **\** 就足以具有转义的作用，而在 Java 中正则表达式中则需要有两个反斜杠才能被解析为其他语言中的转义作用。也可以简单的理解在 Java 的正则表达式中，两个 **\\** 代表其他语言中的一个 **\**，这也就是为什么表示一位数字的正则表达式是 **\\d**，而表示一个普通的反斜杠是 **\\**。

```
System.out.print("\\");    // 输出为 \
System.out.print("\\\\");  // 输出为 \\
```

根据 Java Language Specification 的要求，Java 源代码的字符串中的反斜线被解释为 Unicode 转义或其他字符转义。

因此必须在字符串字面值中使用两个反斜线，表示正则表达式受到保护，不被 Java 字节码编译器解释。

例如，当解释为正则表达式时，字符串字面值 "\b" 与单个退格字符匹配，而 "\\b" 与单词边界匹配。字符串字面值 "\(hello\)" 是非法的，将导致编译时错误；要与字符串 (hello) 匹配，必须使用字符串字面值 "\\(hello\\)"。

## Matcher 类的方法

### 索引方法

索引方法提供了有用的索引值，精确表明输入字符串中在哪能找到匹配：

- **public int start()** 返回以前匹配的初始索引。
- **public int start(int group)**  返回在以前的匹配操作期间，由给定组所捕获的子序列的初始索引
- **public int end()** 返回最后匹配字符之后的偏移量。
- **public int end(int group)** 返回在以前的匹配操作期间，由给定组所捕获子序列的最后字符之后的偏移量。

### 查找方法

查找方法用来检查输入字符串并返回一个布尔值，表示是否找到该模式：

- **public boolean lookingAt()**  尝试将从区域开头开始的输入序列与该模式匹配。 
- **public boolean find()** 尝试查找与该模式匹配的输入序列的下一个子序列。 
- **public boolean find(int start)** 重置此匹配器，然后尝试查找匹配该模式、从指定索引开始的输入序列的下一个子序列。 
- **public boolean matches()** 尝试将整个区域与模式匹配。      

### 替换方法

替换方法是替换输入字符串里文本的方法：


-  **public Matcher appendReplacement(StringBuffer sb, String replacement)** 实现非终端添加和替换步骤。 
- **public StringBuffer appendTail(StringBuffer sb)** 实现终端添加和替换步骤。 
- **public String replaceAll(String replacement)**  替换模式与给定替换字符串相匹配的输入序列的每个子序列。 
- **public String replaceFirst(String replacement)**  替换模式与给定替换字符串匹配的输入序列的第一个子序列。 
- **public static String quoteReplacement(String s)** 返回指定字符串的字面替换字符串。这个方法返回一个字符串，就像传递给Matcher类的appendReplacement 方法一个字面字符串一样工作。 

## start() 和 end() 方法

下面是一个对单词 "cat" 出现在输入字符串中出现次数进行计数的例子：

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
public class RegexMatches{
    private static final String REGEX = "\\bcat\\b";
    private static final String INPUT = "cat cat cat cattie cat";
 
    public static void main( String[] args ){
       Pattern p = Pattern.compile(REGEX);
       Matcher m = p.matcher(INPUT); // 获取 matcher 对象
       int count = 0;
 
       while(m.find()) {
         count++;
         System.out.println("Match number "+count);
         System.out.println("start(): "+m.start());
         System.out.println("end(): "+m.end());
      }
   }
}
```

以上实例编译运行结果如下：

```
Match number 1
start(): 0
end(): 3
Match number 2
start(): 4
end(): 7
Match number 3
start(): 8
end(): 11
Match number 4
start(): 19
end(): 22
```

可以看到这个例子是使用单词边界，以确保字母 "c" "a" "t" 并非仅是一个较长的词的子串。它也提供了一些关于输入字符串中匹配发生位置的有用信息。

Start 方法返回在以前的匹配操作期间，由给定组所捕获的子序列的初始索引，end 方法最后一个匹配字符的索引加 1。

## matches() 和 lookingAt() 方法

`matches()` 和 `lookingAt()` 方法都用来尝试匹配一个输入序列模式。它们的不同是 `matches()` 要求整个序列都匹配，而 `lookingAt()` 不要求。

`lookingAt()` 方法虽然不需要整句都匹配，但是需要从第一个字符开始匹配。

这两个方法经常在输入字符串的开始使用。

我们通过下面这个例子，来解释这个功能：

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
public class RegexMatches{
    private static final String REGEX = "foo";
    private static final String INPUT = "fooooooooooooooooo";
    private static final String INPUT2 = "ooooofoooooooooooo";
    private static Pattern pattern;
    private static Matcher matcher;
    private static Matcher matcher2;
 
    public static void main( String[] args ){
       pattern = Pattern.compile(REGEX);
       matcher = pattern.matcher(INPUT);
       matcher2 = pattern.matcher(INPUT2);
 
       System.out.println("Current REGEX is: "+REGEX);
       System.out.println("Current INPUT is: "+INPUT);
       System.out.println("Current INPUT2 is: "+INPUT2);
 
 
       System.out.println("lookingAt(): "+matcher.lookingAt());
       System.out.println("matches(): "+matcher.matches());
       System.out.println("lookingAt(): "+matcher2.lookingAt());
   }
}
```

以上实例编译运行结果如下：

```
Current REGEX is: foo
Current INPUT is: fooooooooooooooooo
Current INPUT2 is: ooooofoooooooooooo
lookingAt(): true
matches(): false
lookingAt(): false
```

## replaceFirst() 和 replaceAll() 方法

`replaceFirst()` 和 `replaceAll()` 方法用来替换匹配正则表达式的文本。不同的是，`replaceFirst()` 替换首次匹配，`replaceAll()` 替换所有匹配。

下面的例子来解释这个功能：

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
public class RegexMatches{
    private static String REGEX = "dog";
    private static String INPUT = "The dog says meow. All dogs say meow.";
    private static String REPLACE = "cat";
 
    public static void main(String[] args) {
       Pattern p = Pattern.compile(REGEX);
       // get a matcher object
       Matcher m = p.matcher(INPUT); 
       INPUT = m.replaceAll(REPLACE);
       System.out.println(INPUT);
   }
}
```

以上实例编译运行结果如下：

```
The cat says meow. All cats say meow.
```

## appendReplacement() 和 appendTail() 方法

Matcher 类也提供了 appendReplacement() 和 appendTail() 方法用于文本替换：

看下面的例子来解释这个功能：

```java
import java.util.regex.Matcher;
import java.util.regex.Pattern;
 
public class RegexMatches{
   private static String REGEX = "a*b";
   private static String INPUT = "aabfooaabfooabfoobkkk";
   private static String REPLACE = "-";
   public static void main(String[] args) {
      Pattern p = Pattern.compile(REGEX);
      // 获取 matcher 对象
      Matcher m = p.matcher(INPUT);
      StringBuffer sb = new StringBuffer();
      while(m.find()){
         m.appendReplacement(sb,REPLACE);
      }
      m.appendTail(sb);
      System.out.println(sb.toString());
   }
}
```

以上实例编译运行结果如下：

```
-foo-foo-foo-kkk
```

## PatternSyntaxException 类的方法

PatternSyntaxException 是一个非强制异常类，它指示一个正则表达式模式中的语法错误。

PatternSyntaxException 类提供了下面的方法来帮助我们查看发生了什么错误。


-  **public String getDescription()** 获取错误的描述。          
- **public int getIndex()**  获取错误的索引。                  
- **public String getPattern()** 获取错误的正则表达式模式。    
- **public String getMessage()** 返回多行字符串，包含语法错误及其索引的描述、错误的正则表达式模式和模式中错误索引的可视化指示。 
