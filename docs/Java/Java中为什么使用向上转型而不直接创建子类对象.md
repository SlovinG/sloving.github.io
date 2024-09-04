---
title: Java中为什么使用向上转型而不直接创建子类对象
date: 2023-04-25
tags: 
 - Java
 - 多态
categories:
 - Java
---

# Java中为什么使用向上转型而不直接创建子类对象

初学者在学习向上转型可能会很难理解，向上转型并不能调用子类特有属性和方法，我们必须先生成子类实例再赋值给父类引用（向上转型），然后将父类引用向下强制转换给子类引用（向下转型），这样才能调用子类中的所有成员。这看起来像是多此一举，还不如直接创建子类实例。

随着技术的提升，我们在学习其它开源项目时会发现很多地方都用了向上转型和向下转型的技术。本节将带大家了解向上转型和向下转型的意义及使用场景。

定义父类 Animal，代码如下：

```java
public class Animal {
    public void sleep() {
        System.out.println("小动物在睡觉");
    }
    public static void doSleep(Animal animal) {
        // 此时的参数是父类对象，但是实际调用时传递的是子类对象，就是向上转型。
        animal.sleep();
    }
    public static void main(String[] args) {
        animal.doSleep(new Cat());
        animal.doSleep(new Dog());
    }
}
```

子类 Cat 代码如下：

```java
public class Cat extends Animal {
    @Override
    public void sleep() {
        System.out.println("猫正在睡觉");
    }
}
```

子类 Dog 代码如下：

```java
public class Dog extends Animal {
    @Override
    public void sleep() {
        System.out.println("狗正在睡觉");
    }
}
```

输出结果为：

```shell
猫正在睡觉
狗正在睡觉
```

如果不用向上转型则必须写两个 doSleep 方法，一个传递 Cat 类对象，一个传递 Dog 类对象。这还是两个子类，如果有多个子类就要写很多相同的方法，造成重复。可以看出向上转型更好的体现了类的多态性，增强了程序的间接性以及提高了代码的可扩展性。当需要用到子类特有的方法时可以向下转型，这也就是为什么要向下转型。

比如设计一个父类 FileRead 用来读取文件，ExcelRead 类和 WordRead 类继承 FileRead 类。在使用程序的时候，往往事先不知道我们要读入的是 Excel 还是 Word。所以我们向上转型用父类去接收，然后在父类中实现自动绑定，这样无论你传进来的是 Excel 还是 Word 就都能够完成文件读取。

总结如下：

1. 把子类对象直接赋给父类引用是向上转型，向上转型自动转换。如 Father father = new Son();
2. 指向子类对象的父类引用赋给子类引用是向下转型，要强制转换。使用向下转型，必须先向上转型，为了安全可以用 instanceof 运算符判断。 如 father 是一个指向子类对象的父类引用，把 father 赋给子类引用 son，即Son son =（Son）father;。其中 father 前面的(Son)必须添加，进行强制转换。
3. 向上转型不能使用子类特有的属性和方法，只能引用父类的属性和方法，但是子类重写父类的方法是有效的。
4. 向上转型时会优先使用子类中重写父类的方法，如例 1 中调用的 sleep 方法。
5. 向上转型的作用是减少重复代码，可以将父类作为参数，这样使代码变得简洁，也更好的体现了多态。
