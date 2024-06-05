---
title: 剑指Offer-05.替换空格
date: 2023-09-06
tags: 
 - 模拟
 - 字符串
categories:
 - 力扣每日一题
---

# 剑指Offer-05.替换空格

**难度：容易**

请实现一个函数，把字符串 `s` 中的每个空格替换成"%20"。

**示例 1：**

```
输入：s = "We are happy."
输出："We%20are%20happy."
```

**限制：**

```
0 <= s 的长度 <= 10000
```

## 解题思路

如果直接使用 Java 内置的字符串函数 `s.replace(" ","%20")` ，那么一行代码就可以了，但是如果不用内置函数呢？

在 Java 语言中，字符串 String 被设计成 **不可变** 的类型，即无法直接修改字符串的某一位字符，需要新建一个字符串实现。

我的思路：

1. 初始化一个 可变字符串对象 StringBuilder，记为 sb
2. 遍历列表 s 中的每个字符 c 
   - 当 c 为空格时：向 sb 中添加字符串 "%20"
   - 当 c 不为空格时：向 sb 后添加字符 c 

3. 将列表 sb 转化为字符串并返回

## 我的代码

```java
public String replaceSpace(String s) {
    // 选用 StringBuilder 单线程情况下比较快，仅此而已
    StringBuilder sb = new StringBuilder();
    // 使用 sb 逐个复制 s ，碰到空格则替换，否则直接复制
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) == ' ') {
            sb.append("%20");
        } else if (s.charAt(i) != ' ') {
            sb.append(s.charAt(i));
        }
    }
    return sb.toString();
}
```

时间复杂度: O(n)

空间复杂度: O(1) 或 O(n)，取决于使用的语言中字符串是否可以修改

## 总结

使用 Java 刷这道题一定要使用辅助空间，因为 Java 里的 String 不能修改
