import { defineConfig } from 'vitepress'
// 导入主题的配置
import { blogTheme } from './blog-theme'
import { SponsorPlugin } from "vitepress-plugin-sponsor";

// 如果使用 GitHub/Gitee Pages 等公共平台部署
// 通常需要修改 base 路径，通常为“/仓库名/”
// const base = process.env.GITHUB_ACTIONS === 'true'
//   ? '/vitepress-blog-sugar-template/'
//   : '/'

// Vitepress 默认配置
// 详见文档：https://vitepress.dev/reference/site-config
export default defineConfig({
    // 忽略死链
    ignoreDeadLinks: true,
    // 继承博客主题(@sugarat/theme)
    extends: blogTheme,
    // 仓库名
    // base: '/sloving.github.io/',
    lang: 'zh-cn',
    title: 'SlovinG',
    description: '为学应尽毕生力，攀高须贵少年时',
    lastUpdated: false,
    // 详见：https://vitepress.dev/zh/reference/site-config#head
    head: [
        // 配置网站的图标（显示在浏览器的 tab 上）
        // ['link', { rel: 'icon', href: `${base}favicon.ico` }], // 修改了 base 这里也需要同步修改
        ['link', {rel: 'icon', href: 'img/favicon.svg'}],
        [
            'link',
            {rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web/style.css'}
        ]
    ],
    themeConfig: {
        // 展示 2,3 级标题在目录中
        outline: {
            level: [2, 3],
            label: '目录'
        },
        // 默认文案修改
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '相关文章',
        lastUpdated: {
            Text: '上次更新于'
        },
        // 设置logo
        logo: '/img/favicon.svg',
        // editLink: {
        //   pattern:
        //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
        //   text: '去 GitHub 上编辑内容'
        // },
        // 导航栏
        nav: [
            {text: '力扣每日一题', link: '/LeetCode/'},
            {text: 'Java', link: '/Java/'},
            {text: 'SpringBoot', link: '/SpringBoot/'},
            {text: 'SSM', link: '/SSM/'},
            {text: '笔记', link: '/Note/'},
            {text: 'MySQL', link: '/MySQL/'},
            {text: 'JavaWeb', link: '/JavaWeb/'},
            {text: 'Linux', link: '/Linux/'},
            {text: '生活随笔', link: '/Life/'}
        ],
        // 友链
        socialLinks: [
            {
                icon: 'github',
                link: 'https://github.com/SlovinG'
            }
        ],
        // 侧边栏
        sidebar: {
            "/Life/": [
                {text: '人间烟火气', link: '/Life/人间烟火气'},
                {text: '入冬以前', link: '/Life/入冬以前'},
                {text: '无名的人', link: '/Life/无名的人'},
                {text: '群山和人群', link: '/Life/群山和人群'},
                {text: '杀死那个一条腿的人', link: '/Life/杀死那个一条腿的人'},
                {text: '三体和蚁族', link: '/Life/三体和蚁族'},
                {text: '一起扛过枪', link: '/Life/一起扛过枪'},
                {text: '曲终，所以人散', link: '/Life/曲终，所以人散'},
                {text: '平凡生活，英雄梦想', link: '/Life/平凡生活，英雄梦想'},
                {text: '毕业生必看的薪资结构解析', link: '/Life/毕业生必看的薪资结构解析'},
                {text: '十年前的论坛', link: '/Life/十年前的论坛'},
                {text: '于道各努力，千里自同风', link: '/Life/于道各努力，千里自同风'},
                {text: '京城夜奔', link: '/Life/京城夜奔'},
                {text: '四月纪事', link: '/Life/四月纪事'},
                {text: '读研的另一种感受', link: '/Life/读研的另一种感受'},
                {text: '寒假结束', link: '/Life/寒假结束'},
                {text: '保护好眼睛', link: '/Life/保护好眼睛'},
                {text: '武汉的聚会', link: '/Life/武汉的聚会'},
                {text: '平平安安', link: '/Life/平平安安'},
                {text: '生日快乐', link: '/Life/生日快乐'},
                {text: '姐姐', link: '/Life/姐姐'},
                {text: '大学最后的暑假', link: '/Life/大学最后的暑假'},
                {text: '登上讲台', link: '/Life/登上讲台'},
                {text: '父亲节', link: '/Life/父亲节'},
                {text: '回家散心', link: '/Life/回家散心'},
                {text: '四年前的信', link: '/Life/四年前的信'},
                {text: '围炉夜话', link: '/Life/围炉夜话'},
                {text: '第三年', link: '/Life/第三年'},
                {text: '寒露将至', link: '/Life/寒露将至'},
                {text: '樱花节后', link: '/Life/樱花节后'},
                {text: '领证', link: '/Life/领证'},
                {text: '夜晚漫步', link: '/Life/夜晚漫步'},
                {text: '失恋后的那一天', link: '/Life/失恋后的那一天'},
                {text: '元旦', link: '/Life/元旦'},
                {text: '记忆和火锅', link: '/Life/记忆和火锅'},
                {text: '做你认为正确的事', link: '/Life/做你认为正确的事'},
                {text: '最重要的旅行', link: '/Life/最重要的旅行'},
                {text: '成都的雨', link: '/Life/成都的雨'},
                {text: '苦中苦', link: '/Life/苦中苦'},
                {text: '重男轻女', link: '/Life/重男轻女'},
                {text: '重读父母', link: '/Life/重读父母'},
                {text: '青少年恋爱手册', link: '/Life/青少年恋爱手册'},
                {text: '放假', link: '/Life/放假'},
                {text: '乌合之众', link: '/Life/乌合之众'},
                {text: '关于受害者有罪论', link: '/Life/关于受害者有罪论'},
                {text: '搬家', link: '/Life/搬家'},
                {text: '老歌', link: '/Life/老歌'},
                {text: '碎屏险', link: '/Life/碎屏险'},
                {text: '备胎生存法则', link: '/Life/备胎生存法则'},
                {text: '大学生心理健康', link: '/Life/大学生心理健康'},
                {text: '不规范翘课', link: '/Life/不规范翘课'},
            ],
            "/LeetCode/": [
                {
                    text: '数组',
                    collapsed: false,// 默认展开，true 为折叠
                    items: [
                        {text: '704.二分查找', link: '/LeetCode/704.二分查找'},
                        {text: '35.搜索插入位置', link: '/LeetCode/35.搜索插入位置'},
                        {
                            text: '34.在排序数组中查找元素的第一个和最后一个位置',
                            link: '/LeetCode/34.在排序数组中查找元素的第一个和最后一个位置'
                        },
                        {text: '69.x的平方根', link: '/LeetCode/69.x的平方根'},
                        {text: '367.有效的完全平方数', link: '/LeetCode/367.有效的完全平方数'},
                        {text: '27.移除元素', link: '/LeetCode/27.移除元素'},
                        {text: '26.删除有序数据中的重复项', link: '/LeetCode/26.删除有序数据中的重复项'},
                        {text: '80.删除有序数据中的重复项Ⅱ', link: '/LeetCode/80.删除有序数据中的重复项Ⅱ'},
                        {text: '283.移动零', link: '/LeetCode/283.移动零'},
                        {text: '844.比较含退格的字符串', link: '/LeetCode/844.比较含退格的字符串'},
                        {text: '977.有序数组的平方', link: '/LeetCode/977.有序数组的平方'},
                        {text: '3.无重复字符的最长子串', link: '/LeetCode/3.无重复字符的最长子串'},
                        {text: '209.长度最小的子数组', link: '/LeetCode/209.长度最小的子数组'},
                        {text: '904.水果成篮', link: '/LeetCode/904.水果成篮'},
                        {text: '76.最小覆盖子串', link: '/LeetCode/76.最小覆盖子串'},
                        {text: '59.螺旋矩阵Ⅱ', link: '/LeetCode/59.螺旋矩阵Ⅱ'},
                        {text: '54.螺旋矩阵', link: '/LeetCode/54.螺旋矩阵'},
                    ]
                },
                {
                    text: '链表',
                    collapsed: false,
                    items: [
                        {text: '203.移除链表元素', link: '/LeetCode/203.移除链表元素'},
                        {text: '707.设计链表', link: '/LeetCode/707.设计链表'},
                        {text: '206.反转链表', link: '/LeetCode/206.反转链表'},
                        {text: '24.两两交换链表中的节点', link: '/LeetCode/24.两两交换链表中的节点'},
                        {text: '19.删除链表的倒数第N个节点', link: '/LeetCode/19.删除链表的倒数第N个节点'},
                        {text: '160.相交链表', link: '/LeetCode/160.相交链表'},
                        {text: '142.环形链表Ⅱ', link: '/LeetCode/142.环形链表Ⅱ'},
                        {text: '146.LRU缓存', link: '/LeetCode/146.LRU缓存'}
                    ]
                },
                {
                    text: '哈希表',
                    collapsed: false,
                    items: [
                        {text: '242.有效的字母异位词', link: '/LeetCode/242.有效的字母异位词'},
                        {text: '383.赎金信', link: '/LeetCode/383.赎金信'},
                        {text: '49.字母异位词分组', link: '/LeetCode/49.字母异位词分组'},
                        {text: '438.找到字符串中所有字母异位词', link: '/LeetCode/438.找到字符串中所有字母异位词'},
                        {text: '349.两个数组的交集', link: '/LeetCode/349.两个数组的交集'},
                        {text: '350.两个数组的交集Ⅱ', link: '/LeetCode/350.两个数组的交集Ⅱ'},
                        {text: '202.快乐数', link: '/LeetCode/202.快乐数'},
                        {text: '1.两数之和', link: '/LeetCode/1.两数之和'},
                        {text: '454.四数相加Ⅱ', link: '/LeetCode/454.四数相加Ⅱ'},
                        {text: '15.三数之和', link: '/LeetCode/15.三数之和'},
                        {text: '18.四数之和', link: '/LeetCode/18.四数之和'},
                    ]
                },
                {
                    text: '字符串',
                    collapsed: false,
                    items: [
                        {text: '344.反转字符串', link: '/LeetCode/344.反转字符串'},
                        {text: '541.反转字符串Ⅱ', link: '/LeetCode/541.反转字符串Ⅱ'},
                        {text: '剑指Offer-05.替换空格', link: '/LeetCode/剑指Offer-05.替换空格'},
                        {text: '151.反转字符串中的单词', link: '/LeetCode/151.反转字符串中的单词'},
                        {text: '剑指Offer-58-Ⅱ.左旋转字符串', link: '/LeetCode/剑指Offer-58-Ⅱ.左旋转字符串'},
                        {
                            text: '28.找出字符串中第一个匹配项的下标',
                            link: '/LeetCode/28.找出字符串中第一个匹配项的下标'
                        },
                        {text: '459.重复的子字符串', link: '/LeetCode/459.重复的子字符串'},
                    ]
                },
                {
                    text: '栈与队列',
                    collapsed: false,
                    items: [
                        {text: '232.用栈实现队列', link: '/LeetCode/232.用栈实现队列'},
                        {text: '225.用队列实现栈', link: '/LeetCode/225.用队列实现栈'},
                        {text: '71.简化路径', link: '/LeetCode/71.简化路径'},
                        {text: '20.有效的括号', link: '/LeetCode/20.有效的括号'},
                        {
                            text: '1047.删除字符串中的所有相邻重复项',
                            link: '/LeetCode/1047.删除字符串中的所有相邻重复项'
                        },
                        {text: '150.逆波兰表达式求值', link: '/LeetCode/150.逆波兰表达式求值'},
                        {text: '155.最小栈', link: '/LeetCode/155.最小栈'},
                        {text: '239.滑动窗口最大值', link: '/LeetCode/239.滑动窗口最大值'},
                        {text: '347.前k个高频元素', link: '/LeetCode/347.前k个高频元素'}
                    ]
                },
                {
                    text: '二叉树',
                    collapsed: false,
                    items: [
                        {text: '144.二叉树的前序遍历', link: '/LeetCode/144.二叉树的前序遍历'},
                        {text: '145.二叉树的后序遍历', link: '/LeetCode/145.二叉树的后序遍历'},
                        {text: '94.二叉树的中序遍历', link: '/LeetCode/94.二叉树的中序遍历'},
                        {text: '102.二叉树的层序遍历', link: '/LeetCode/102.二叉树的层序遍历'},
                        {text: '107.二叉树的层序遍历Ⅱ', link: '/LeetCode/107.二叉树的层序遍历Ⅱ'},
                        {text: '199.二叉树的右视图', link: '/LeetCode/199.二叉树的右视图'},
                        {text: '637.二叉树的层平均值', link: '/LeetCode/637.二叉树的层平均值'},
                        {text: '429.N叉树的层序遍历', link: '/LeetCode/429.N叉树的层序遍历'},
                        {text: '515.在每个树行中找最大值', link: '/LeetCode/515.在每个树行中找最大值'},
                        {
                            text: '117.填充每个节点的下一个右侧节点指针Ⅱ',
                            link: '/LeetCode/117.填充每个节点的下一个右侧节点指针Ⅱ'
                        },
                        {text: '104.二叉树的最大深度', link: '/LeetCode/104.二叉树的最大深度'},
                        {text: '559.N叉树的最大深度', link: '/LeetCode/559.N叉树的最大深度'},
                        {text: '111.二叉树的最小深度', link: '/LeetCode/111.二叉树的最小深度'},
                        {text: '226.翻转二叉树', link: '/LeetCode/226.翻转二叉树'},
                        {text: '101.对称二叉树', link: '/LeetCode/101.对称二叉树'},
                        {text: '100.相同的树', link: '/LeetCode/100.相同的树'},
                        {text: '572.另一棵树的子树', link: '/LeetCode/572.另一棵树的子树'},
                        {text: '222.完全二叉树的节点个数', link: '/LeetCode/222.完全二叉树的节点个数'},
                        {text: '110.平衡二叉树', link: '/LeetCode/110.平衡二叉树'},
                        {text: '257.二叉树的所有路径', link: '/LeetCode/257.二叉树的所有路径'},
                        {text: '404.左叶子之和', link: '/LeetCode/404.左叶子之和'},
                        {text: '513.找树左下角的值', link: '/LeetCode/513.找树左下角的值'},
                        {text: '112.路径总和', link: '/LeetCode/112.路径总和'},
                        {text: '113.路径总和Ⅱ', link: '/LeetCode/113.路径总和Ⅱ'},
                        {
                            text: '106.从中序和后序遍历序列构造二叉树',
                            link: '/LeetCode/106.从中序和后序遍历序列构造二叉树'
                        },
                        {text: '654.最大二叉树', link: '/LeetCode/654.最大二叉树'},
                        {text: '617.合并二叉树', link: '/LeetCode/617.合并二叉树'},
                        {text: '700.二叉搜索树中的搜索', link: '/LeetCode/700.二叉搜索树中的搜索'},
                        {text: '98.验证二叉搜索树', link: '/LeetCode/98.验证二叉搜索树'},
                        {text: '530.二叉搜索树的最小绝对差', link: '/LeetCode/530.二叉搜索树的最小绝对差'},
                        {text: '501.二叉搜索树中的众数', link: '/LeetCode/501.二叉搜索树中的众数'},
                        {text: '236.二叉树的最近公共祖先', link: '/LeetCode/236.二叉树的最近公共祖先'},
                    ]
                }
            ],
            "/Java/": [
                {text: 'Java BufferedReader流', link: '/Java/Java BufferedReader流'},
                {text: 'Java IO', link: '/Java/Java IO'},
                {text: 'Java Optional类', link: '/Java/Java Optional类'},
                {text: 'Java Stream', link: '/Java/Java Stream'},
                {text: 'Java 双端队列 Deque', link: '/Java/Java 双端队列 Deque'},
                {text: 'Java 正则表达式', link: '/Java/Java 正则表达式'},
                {text: 'Java 泛型', link: '/Java/Java 泛型'},
                {
                    text: 'Java中为什么使用向上转型而不直接创建子类对象',
                    link: '/Java/Java中为什么使用向上转型而不直接创建子类对象'
                },
                {text: 'Java中实现POJO类的序列化', link: '/Java/Java中实现POJO类的序列化'},
                {text: 'Java的注解与反射机制', link: '/Java/Java的注解与反射机制'},
                {text: 'Java集合框架综述', link: '/Java/Java集合框架综述'},
                {text: 'JDBC各个类的详解', link: '/Java/JDBC各个类的详解'},
                {text: '初识多线程', link: '/Java/初识多线程'}
            ],
            "/JavaWeb/": [
                {text: 'xml总结', link: '/JavaWeb/xml总结'},
                {text: 'Web概述', link: '/JavaWeb/Web概述'},
                {text: 'HTTP协议', link: '/JavaWeb/HTTP协议'},
                {text: '会话技术', link: '/JavaWeb/会话技术'},
                {
                    text: 'HTTP协议无状态中的【状态】到底指的是什么？！',
                    link: '/JavaWeb/HTTP协议无状态中的【状态】到底指的是什么？！'
                },
                {
                    text: 'Cookie和Session、SessionID的那些事儿',
                    link: '/JavaWeb/Cookie和Session、SessionID的那些事儿'
                },
                {text: 'Servlet总结', link: '/JavaWeb/Servlet总结'},
                {text: 'Request和Response', link: '/JavaWeb/Request和Response'},
                {text: 'Tomcat深入理解', link: '/JavaWeb/Tomcat深入理解'},
                {text: 'JSP总结', link: '/JavaWeb/JSP总结'},
                {text: 'JSTL和EL表达式', link: '/JavaWeb/JSTL和EL表达式'},
                {text: 'MVC模式和三层架构', link: '/JavaWeb/MVC模式和三层架构'},
                {text: 'JSON和AJAX总结', link: '/JavaWeb/JSON和AJAX总结'},
                {text: 'Filter和Listener总结', link: '/JavaWeb/Filter和Listener总结'},
                {
                    text: 'J2EE开发开发中PO,BO,VO,DTO,POJO,DAO的概念及其作用',
                    link: '/JavaWeb/J2EE开发开发中PO,BO,VO,DTO,POJO,DAO的概念及其作用'
                },
                {text: 'Java开发的主流框架演变', link: '/JavaWeb/Java开发的主流框架演变'},
            ],
            "/MySQL/": [
                {text: '初识MySQL', link: '/MySQL/初识MySQL'},
                {text: '数据库操作', link: '/MySQL/数据库操作'},
                {text: 'DML语言', link: '/MySQL/DML语言'},
                {text: '数据库中为什么不推荐使用外键约束', link: '/MySQL/数据库中为什么不推荐使用外键约束'},
                {text: '使用DQL查询数据', link: '/MySQL/使用DQL查询数据'},
                {
                    text: 'MySQL中的关联查询（内连接、外连接、自连接）',
                    link: '/MySQL/MySQL中的关联查询（内连接、外连接、自连接）'
                },
                {text: '连接查询时on与where的区别', link: '/MySQL/连接查询时on与where的区别'},
                {text: 'MySQL函数', link: '/MySQL/MySQL函数'},
                {text: 'sql语句的执行顺序', link: '/MySQL/sql语句的执行顺序'},
                {text: '事务和索引', link: '/MySQL/事务和索引'},
                {text: '权限及如何设计数据库', link: '/MySQL/权限及如何设计数据库'},
                {text: 'MySQL数据库设计规范', link: '/MySQL/MySQL数据库设计规范'},
                {text: 'MySQL主从复制', link: '/MySQL/MySQL主从复制'},
                {text: '一文详解数据库连接池', link: '/MySQL/一文详解数据库连接池'}
            ],
            "/Linux/": [
                {text: 'Linux 概述及环境搭建', link: '/Linux/Linux概述及环境搭建'},
                {text: 'Linux 常用的基本命令', link: '/Linux/Linux常用的基本命令'},
                {text: 'Vim 使用及账号用户管理', link: '/Linux/Vim使用及账号用户管理'},
                {text: '三种软件安装方式及服务器基本环境搭建', link: '/Linux/三种软件安装方式及服务器基本环境搭建'},
            ],
            "/SSM/": [
                {
                    text: 'SSM框架',
                    collapsed: false,
                    items: [
                        {text: '初识SSM框架', link: '/SSM/初识SSM框架'},
                    ]
                },
                {
                    text: 'MyBatis',
                    collapsed: false,
                    items: [
                        {text: '初识MyBatis', link: '/SSM/初识MyBatis'},
                        {text: 'MyBatis-CRUD操作及配置解析', link: '/SSM/MyBatis-CRUD操作及配置解析'},
                        {text: 'MyBatis-ResultMap及分页', link: '/SSM/MyBatis-ResultMap及分页'},
                        {text: 'MyBatis-使用注解开发', link: '/SSM/MyBatis-使用注解开发'},
                        {text: 'MyBatis-一对多和多对一处理', link: '/SSM/MyBatis-一对多和多对一处理'},
                        {text: 'MyBatis-动态SQL', link: '/SSM/MyBatis-动态SQL'},
                        {text: 'MyBatis-缓存', link: '/SSM/MyBatis-缓存'},
                        {text: 'MyBatis-${}和#{}的区别及应用场景', link: '/SSM/MyBatis-dollar和的well区别及应用场景'},
                    ]
                },
                {
                    text: 'Spring',
                    collapsed: false,
                    items: [
                        {text: '初识Spring', link: '/SSM/初识Spring'},
                        {text: '快速上手Spring', link: '/SSM/快速上手Spring'},
                        {text: 'Spring-依赖注入', link: '/SSM/Spring-依赖注入'},
                        {text: 'Spring-自动装配', link: '/SSM/Spring-自动装配'},
                        {text: 'Spring-使用注解开发', link: '/SSM/Spring-使用注解开发'},
                        {text: 'Spring中Bean的配置和Bean的注入', link: '/SSM/Spring中Bean的配置和Bean的注入'},
                        {text: 'Spring-代理模式', link: '/SSM/Spring-代理模式'},
                        {text: 'Spring-AOP', link: '/SSM/Spring-AOP'},
                        {text: 'Spring-整合MyBatis', link: '/SSM/Spring-整合MyBatis'},
                        {text: 'Spring-声明式事务', link: '/SSM/Spring-声明式事务'},
                    ]
                },
                {
                    text: 'SpringMVC',
                    collapsed: false,
                    items: [
                        {text: '初识SpringMVC', link: '/SSM/初识SpringMVC'},
                        {text: '第一个SpringMVC程序', link: '/SSM/第一个SpringMVC程序'},
                        {text: 'SpringMVC-RestFul和控制器', link: '/SSM/SpringMVC-RestFul和控制器'},
                        {text: 'SpringMVC-参数接收处理和结果跳转', link: '/SSM/SpringMVC-参数接收处理和结果跳转'},
                        {text: '整合SSM框架', link: '/SSM/整合SSM框架'},
                        {text: 'SpringMVC-JSON交互处理', link: '/SSM/SpringMVC-JSON交互处理'},
                        {text: 'SpringMVC-AJAX研究', link: '/SSM/SpringMVC-AJAX研究'},
                        {text: 'SpringMVC-表现层数据封装和异常处理', link: '/SSM/SpringMVC-表现层数据封装和异常处理'},
                        {text: 'SpringMVC-拦截器+文件上传下载', link: '/SSM/SpringMVC-拦截器+文件上传下载'},
                    ]
                }
            ],
            "/SpringBoot/": [
                {
                    text: 'SpringBoot',
                    collapsed: false,
                    items: [
                        {text: '迈入前后端分离时代', link: '/SpringBoot/迈入前后端分离时代'},
                        {text: 'Maven的进阶使用', link: '/SpringBoot/Maven的进阶使用'},
                        {text: '初识SpringBoot', link: '/SpringBoot/初识SpringBoot'},
                        {
                            text: '启动剖析之pom.xml、@SpringBootApplication',
                            link: '/SpringBoot/启动剖析之pom.xml、@SpringBootApplication'
                        },
                        {text: '启动剖析之SpringApplication.run', link: '/SpringBoot/启动剖析之SpringApplication.run'},
                        {text: 'yaml配置注入', link: '/SpringBoot/yaml配置注入'},
                        {text: '多环境开发配置', link: '/SpringBoot/多环境开发配置'},
                        {text: '自动配置原理', link: '/SpringBoot/自动配置原理'},
                        {text: '自定义Starter', link: '/SpringBoot/自定义Starter'},
                        {text: 'SpringBootTest详解', link: '/SpringBoot/SpringBootTest详解'},
                        {text: '整合JDBC', link: '/SpringBoot/整合JDBC'},
                        {text: '整合Druid', link: '/SpringBoot/整合Druid'},
                        {text: '整合MyBatis', link: '/SpringBoot/整合MyBatis'},
                        {
                            text: '全局统一响应格式、参数校验、异常处理',
                            link: '/SpringBoot/全局统一响应格式、参数校验、异常处理'
                        },
                        {text: 'Redis的基本使用', link: '/SpringBoot/Redis的基本使用'},
                        {text: '缓存注解Spring-Cache', link: '/SpringBoot/缓存注解Spring-Cache'},
                        {text: '分库分表与Sharding-JDBC', link: '/SpringBoot/分库分表与Sharding-JDBC'},
                        {text: 'Nginx的使用教程', link: '/SpringBoot/Nginx的使用教程'},
                        {text: '集成Swagger与Springdoc', link: '/SpringBoot/集成Swagger与Springdoc'},
                        {text: 'WebClient的基本使用', link: '/SpringBoot/WebClient的基本使用'},
                        {text: '定时任务框架XXL-Job', link: '/SpringBoot/定时任务框架XXL-Job'}
                    ]
                }
            ],
            "/Note/": [
                {
                    text: 'Maven',
                    collapsed: false,
                    items: [
                        {text: 'Maven 的基本使用', link: '/Note/Maven的基本使用'},
                        {text: 'Maven 插件', link: '/Note/Maven插件'},
                        {text: 'Maven 导入本地jar包', link: '/Note/Maven导入本地jar包'},
                        {text: 'Maven SNAPSHOT', link: '/Note/Maven SNAPSHOT'},
                        {text: 'Maven 依赖', link: '/Note/Maven依赖'},
                        {text: 'Maven 继承与聚合', link: '/Note/Maven继承与聚合'},
                        {text: 'Maven settings.xml 配置文件解读', link: '/Note/Maven settings.xml 配置文件解读'}
                    ]
                },
                {
                    text: '计算机网络',
                    collapsed: false,
                    items: [
                        {text: '物理层、数据链路层、网络层', link: '/Note/物理层、数据链路层、网络层'},
                        {text: '一文详解TCP', link: '/Note/一文详解TCP'},
                        {text: '一文详解Socket', link: '/Note/一文详解Socket'},
                    ]
                },
                {
                    text: 'Elasticsearch',
                    collapsed: false,
                    items: [
                        {text: 'Elasticsearch 入门', link: '/Note/Elasticsearch入门'},
                        {text: 'Elasticsearch 分页查询', link: '/Note/Elasticsearch分页查询'}
                    ]
                },
                {
                    text: 'RabbitMQ',
                    collapsed: false,
                    items: [
                        {text: 'RabbitMQ 入门', link: '/Note/RabbitMQ入门'},
                        {text: 'RabbitMQ 进阶', link: '/Note/RabbitMQ进阶'}
                    ]
                },
                {
                    text: 'Docker',
                    collapsed: false,
                    items: [
                        {text: 'Docker 入门', link: '/Note/Docker入门'}
                    ]
                },
                {
                    text: 'Kubernetes',
                    collapsed: false,
                    items: [
                        {text: 'Kubernetes 基础概念', link: '/Note/Kubernetes基础概念'}
                    ]
                },
                {
                    text: 'Others',
                    collapsed: false,
                    items: [
                        {text: '分布式中的 CAP 理论', link: '/Note/分布式中的CAP理论'},
                        {text: 'JUnit4 的使用教程', link: '/Note/JUnit4的使用教程'},
                        {text: '一文详解回调地狱', link: '/Note/一文详解回调地狱'},
                        {text: '初识 JWT', link: '/Note/初识JWT'},
                        {text: '浅谈 CSRF 攻击', link: '/Note/浅谈CSRF攻击'},
                        {text: '浅谈 XSS 攻击', link: '/Note/浅谈XSS攻击'},
                        {text: '负载均衡集群中的 Session 解决方案', link: '/Note/负载均衡集群中的Session解决方案'},
                        {text: '项目开发和管理流程', link: '/Note/项目开发和管理流程'},
                        {text: '电商架构演进之路', link: '/Note/电商架构演进之路'},
                        {text: '初识微服务', link: '/Note/初识微服务'},
                    ]
                }
            ],
        },
    },
    vite: {
        plugins: [
            // 打赏插件
            SponsorPlugin({
                /**
                 * 打赏模块样式
                 */
                type: 'simple',
                aliPayQR: 'https://sloving.top/img/aliPayQR.jpg',
                weChatQR: 'https://sloving.top/img/weChatQR.png'
            })
        ]
    }
})
