---
title: SpringMVC-表现层数据封装和异常处理
date: 2023-08-23
tags: 
 - SSM 
 - Spring
 - SpringMVC
categories:
 - SSM
---

# SpringMVC-表现层数据封装和异常处理

## 表现层数据的封装

### 表现层响应数据的问题

问题引入：表现层的增、删、改方法会返回 true 或者false表示是否成功，getById()方法会返回一个 json 对象，getAll() 方法会返回一个 json 对象数组，这里就出现了三种不同格式的响应结果，极其不利于前端人员对数据的解析。

![image-20210805170157483](./assets/008.png)

解决方案：我们需要统一响应结果的格式。

### 定义 Result 类封装响应结果

#### Result 类封装响应结果

```java
public class Result {
    //描述统一格式中的编码，用于区分操作，可以简化配置0或1表示成功失败
    private Integer code;
    //描述统一格式中的数据
    private Object data;
    //描述统一格式中的消息，可选属性
    private String msg;

    public Result() {
    }
    public Result(Integer code,Object data) {
        this.code = code; 
        this.data = data;
    }
    public Result(Integer code, Object data, String msg) {
       
        this.code = code;
        this.data = data;
        this.msg = msg;
    }
    //我们自己添加 getter、setter、toString()方法
}
```

**注意事项**：

- Result 类中的字段并不是固定的，可以根据需要自行增减。

- 提供若干个构造方法，方便操作。

#### Code 类封装响应码

```java
//状态码
public class Code {
    public static final Integer SAVE_OK = 20011;
    public static final Integer DELETE_OK = 20021;
    public static final Integer UPDATE_OK = 20031;
    public static final Integer GET_OK = 20041;

    public static final Integer SAVE_ERR = 20010;
    public static final Integer DELETE_ERR = 20020;
    public static final Integer UPDATE_ERR = 20030;
    public static final Integer GET_ERR = 20040;
}
```

**注意事项**：

- Code 类的常量设计也不是固定的，可以根据需要自行增减，例如将查询再进行细分为 GET_OK，GET_ALL_OK，GET_PAGE_OK

### 表现层数据封装返回 Result 对象

```java
@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping
    public Result save(@RequestBody Book book) {
        boolean flag = bookService.save(book);
        return new Result(flag ? Code.SAVE_OK:Code.SAVE_ERR,flag);
    }

    @PutMapping
    public Result update(@RequestBody Book book) {
        boolean flag = bookService.update(book);
        return new Result(flag ? Code.UPDATE_OK:Code.UPDATE_ERR,flag);
    }

    @DeleteMapping("/{id}")
    public Result delete(@PathVariable Integer id) {
        boolean flag = bookService.delete(id);
        return new Result(flag ? Code.DELETE_OK:Code.DELETE_ERR,flag);
    }

    @GetMapping("/{id}")
    public Result getById(@PathVariable Integer id) {
        Book book = bookService.getById(id);
        Integer code = book != null ? Code.GET_OK : Code.GET_ERR;
        String msg = book != null ? "" : "数据查询失败，请重试！";
        return new Result(code,book,msg);
    }

    @GetMapping
    public Result getAll() {
        List<Book> bookList = bookService.getAll();
        Integer code = bookList != null ? Code.GET_OK : Code.GET_ERR;
        String msg = bookList != null ? "" : "数据查询失败，请重试！";
        return new Result(code,bookList,msg);
    }
}
```

## 异常处理器 

### 异常介绍

在程序的开发过程中，不可避免的会遇到运行异常的现象，我们不希望让用户看到这样的页面展示：

<img src="./assets/014.png" alt="image-20210805172011686" style="zoom: 50%;" />

出现异常现象的常见位置与常见诱因：
- 框架内部抛出的异常：使用框架时不符合规范所导致
- 数据层抛出的异常：外部服务器故障所导致（例如：服务器访问超时）
- 业务层抛出的异常：业务逻辑书写错误所导致（例如：遍历业务书写操作，导致索引异常等）
- 表现层抛出的异常：数据收集、校验等规则所导致（例如：不匹配的数据类型间导致异常）
- 工具类抛出的异常：工具类书写不严谨不够健壮所导致（例如：必要释放的连接长期未释放等）

### 异常处理器

问题引入1：项目的各个层级均可能出现异常，那么负责异常处理的代码应该书写在哪一层？

解决方案：所有的异常均应该抛出到 **表现层** 进行处理。

问题引入2：表现层处理异常，如果在每个方法中单独书写 try catch，代码书写量巨大且意义不强，如何解决？

解决方案：AOP。

#### 编写异常处理器

```java
@RestControllerAdvice  //用于标识当前类为 REST 风格对应的异常处理器
public class ProjectExceptionAdvice {
    //集中地、统一地处理所有的 Exception 异常
    @ExceptionHandler(Exception.class)
    public Result doOtherException(Exception ex){
        return new Result(666,null);
    }
}
```

使用异常处理器之后的效果：

<img src="./assets/015.png" alt="image-20210805171924452" style="zoom: 50%;" />

#### @RestControllerAdvice 注解

- 注解类型：**类注解**

- 使用位置：Rest 风格开发的控制器增强类定义上方
- 注解作用：为 Rest 风格开发的控制器类做增强
- 注解说明：此注解自带 @ResponseBody 注解与 @Component 注解，具备对应的功能

#### @ExceptionHandler 注解

- 注解类型：**方法注解**
- 使用位置：专用于异常处理的控制器方法上方
- 注解作用：设置指定异常的处理方案，功能等同于控制器方法，出现异常后终止原始控制器执行，并转入当前方法执行
- 注解说明：此类方法可以根据处理的异常不同，创建多个方法分别处理对应的异常

## 项目异常的处理方案

问题引入：请说出项目当前异常的分类以及对应类型的异常该如何处理？

### 项目异常分类

- 业务异常（BusinessException）
  - 规范的用户行为产生的异常
  - 不规范的用户行为操作产生的异常
- 系统异常（SystemException）
  - 项目运行过程中可预计且无法避免的异常
- 其他异常（Exception）
  - 编程人员未预期到的异常

### 项目异常处理方案

- 业务异常（BusinessException）
  - **发送对应消息传递给用户，提醒规范操作**
- 系统异常（SystemException）
  - **发送固定消息传递给用户，安抚用户**
  - 发送特定消息给运维人员，提醒维护
  - 记录日志
- 其他异常（Exception）
  - **发送固定消息传递给用户，安抚用户**
  - 发送特定消息给编程人员，提醒维护（纳入预期范围内）
  - 记录日志

### 项目异常处理代码实现

#### 根据异常分类自定义异常类

注意：RuntimeException 异常出现之后，可以不用手动处理，而它自己会主动向上抛异常。

1. 自定义 **项目系统级异常**

   ```java
   //自定义异常处理器，用于封装异常信息，对异常进行分类
   public class SystemException extends RuntimeException{
       private Integer code;
   
       public Integer getCode() {
           return code;
       } 
   
       public void setCode(Integer code) {
           this.code = code;
       }
   
       public SystemException(Integer code, String message) {
           super(message);
           this.code = code;
       }
   
       public SystemException(Integer code, String message, Throwable cause) {
           super(message, cause);
           this.code = code;
       }
   }
   ```

2. 自定义 **项目业务级异常**

   ```java
   //自定义异常处理器，用于封装异常信息，对异常进行分类
   public class BusinessException extends RuntimeException{
       private Integer code;
   
       public Integer getCode() {
           return code;
       }
   
       public void setCode(Integer code) {
           this.code = code;
       }
   
       public BusinessException(Integer code, String message) {
           super(message);
           this.code = code;
       }
   
       public BusinessException(Integer code,String message,Throwable cause) {
           super(message, cause);
           this.code = code;
       }
   }
   ```

#### 自定义异常编码（持续补充）

```java
public class Code {

	//之前其他状态码省略没写，以下是新补充的状态码，可以根据需要自己补充
    
    public static final Integer SYSTEM_ERR = 50001;
    public static final Integer SYSTEM_TIMEOUT_ERR = 50002;
    public static final Integer SYSTEM_UNKNOW_ERR = 59999;
    public static final Integer BUSINESS_ERR = 60002;
    
}
```

#### 触发自定义异常

```java
@Service
public class BookServiceImpl implements BookService {
    @Autowired
    private BookDao bookDao;

	//在getById演示触发异常，其他方法省略没有写进来
    public Book getById(Integer id) {
        //模拟业务异常，包装成自定义异常
        if(id <0){
            throw new BusinessException(Code.BUSINESS_ERR,"请不要使用你的技术挑战我的耐性!");
        }
    }
}
```

#### 在异常通知类中拦截并处理异常

```java
@RestControllerAdvice //用于标识当前类为REST风格对应的异常处理器
public class ProjectExceptionAdvice {
    //@ExceptionHandler用于设置当前处理器类对应的异常类型
    @ExceptionHandler(SystemException.class)
    public Result doSystemException(SystemException ex){
        //记录日志
        //发送消息给运维
        //发送邮件给开发人员,ex对象发送给开发人员
        return new Result(ex.getCode(),null,ex.getMessage());
    }

    @ExceptionHandler(BusinessException.class)
    public Result doBusinessException(BusinessException ex){
        return new Result(ex.getCode(),null,ex.getMessage());
    }

    //除了自定义的异常处理器，保留对Exception类型的异常处理，用于处理非预期的异常
    @ExceptionHandler(Exception.class)
    public Result doOtherException(Exception ex){
        //记录日志
        //发送消息给运维
        //发送邮件给开发人员,ex对象发送给开发人员
        return new Result(Code.SYSTEM_UNKNOW_ERR,null,"系统繁忙，请稍后再试！");
    }
}
```

测试：在postman中发送请求访问 getById 方法，传递参数-1，得到以下结果：

![image-20210805173815730](./assets/597.png)

## 关于异常的思想认识

我们应该认识到，一切异常，对系统来说，都是不正常的表现，都是属于缺陷，都属于 BUG，尽管有些异常是我们主动抛出的。

我们要做的，是应该尽量提高系统可用性，最大限度避免任何异常的出现，而不是去指望完善异常处理来完善系统。

异常处理，是异常无法避免的出现了而采取的一种应急措施，主要目的是对外增加友好性，对内提供补救线索。

不要认为完善的异常处理是系统核心，他不是，不要指望异常处理尽善尽美，不要指望异常处理来给系统缺陷擦屁股。

如果系统异常过多，那么你要做的不是去完善异常处理机制，而是要好好去反思：系统架构设计是否合理，系统逻辑设计是否合理。
