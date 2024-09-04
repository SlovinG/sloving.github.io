---
title: 剑指Offer-58-Ⅱ.左旋转字符串
date: 2023-09-06
tags: 
 - 数学
 - 双指针
 - 字符串
categories:
 - 力扣每日一题
---

# 剑指Offer-58-Ⅱ.左旋转字符串

**难度：容易**

字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串 "abcdefg" 和数字 2，该函数将返回左旋转两位得到的结果 "cdefgab"。

**示例 1：**

```
输入: s = "abcdefg", k = 2
输出: "cdefgab"
```

**示例 2：**

```
输入: s = "lrloseumgh", k = 6
输出: "umghlrlose"
```

**限制：**

- `1 <= k < s.length <= 10000`

## 解题思路

我的思路：

1. 新建一个 StringBuilder，记为 sb
2. 先向 sb 添加 “第 n+1 位至末位的字符” 
3. 再向 sb 添加 “首位至第 n 位的字符” 
4. 将 sb 转化为字符串并返回

## 我的代码

```java
public String reverseLeftWords(String s, int n) {
    StringBuilder sb = new StringBuilder();
    // 向 sb 添加 “第 n+1 位至末位的字符” 
    for(int i = n; i < s.length(); i++){
        sb.append(s.charAt(i)); 
    }
    // 向 sb 添加 “首位至第 n 位的字符” 
    for(int i = 0; i < n; i++){
        sb.append(s.charAt(i));   
    }   
    return sb.toString();
}
```

两个 for 循环的形式太相似了，甚至内部操作都一模一样，那么考虑是否可以简化一下代码。

事实上，利用 **取模** 运算就可以简化上述代码为：

```java
public String reverseLeftWords(String s, int n) {
    StringBuilder sb = new StringBuilder();
    // 从索引n开始遍历，一直到字符串长度加上n
    for (int i = n; i < s.length() + n; i++) {
        // 这里i % s.length()计算实际在s中的索引位置
        sb.append(s.charAt(i % s.length()));
    }
    return sb.toString();
}
```

时间复杂度: O(n)

空间复杂度: O(n)

## 原地算法

### 思路详解

1. 反转区间为 0 到 n 的子串
2. 反转区间为 n 到末尾的子串
3. 反转整个字符串

最后就可以达到左旋 n 的目的，而不用定义新的字符串，完全在本串上操作。

### 代码展示

```java
public String reverseLeftWords(String s, int n) {
    char[] chars = s.toCharArray();
    reverseString(chars, 0, chars.length - 1);
    reverseString(chars, 0, chars.length - 1 - n);
    reverseString(chars, chars.length - n, chars.length - 1);
    return new String(chars);
}

//反转字符串[left,right]区间的部分
public void reverseString(char[] str, int left, int right) {
    while (left < right) {
        char temp = str[left];
        str[left++] = str[right];
        str[right--] = temp;
    }
}
```

时间复杂度: O(n)

空间复杂度: O(1)

## 总结

交换两个元素的三种方法都需要掌握。
