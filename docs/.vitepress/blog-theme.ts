// 主题独有配置
import type { Theme } from '@sugarat/theme'
import { getThemeConfig } from '@sugarat/theme/node'

// 开启RSS支持（RSS配置）
// import type { Theme } from '@sugarat/theme'

const baseUrl = 'https://sloving.top'
const RSS: Theme.RSSOptions = {
   title: 'SlovinG\'s Blog',
   baseUrl,
   copyright: 'Copyright (c) 2019-present, SlovinG',
   description: '来日放榜簪花在春衫，一朝等闲驰马到江南',
}

// 所有配置项，详见文档: https://theme.sugarat.top/
const blogTheme = getThemeConfig({
    // 开启RSS支持
    RSS,

    // 搜索
    // 默认开启pagefind离线的全文搜索支持（如使用其它的可以设置为false）
    // 如果npx pagefind 时间过长，可以手动将其安装为项目依赖 pnpm add pagefind
    search: {
        pageResultCount: 5,
        btnPlaceholder: '搜索',
        placeholder: '搜索文章',
        emptyText: '没有找到相关文章',
        heading: '结果数: {{searchResult}} 条。',
        toSelect: '选择',
        toClose: '关闭',
        toNavigate: '移动',
        searchBy: 'Powered by',
        locales: {
            en: {
                btnPlaceholder: 'Search',
                placeholder: 'Search Docs',
                emptyText: 'No results found',
                heading: 'Total: {{searchResult}} search results.',
                toSelect: 'to select',
                toClose: 'to close',
                toNavigate: 'to navigate',
                searchBy: 'Search by',
            }
        }
    },

    // 页脚
    footer: {
        // message 字段支持配置为HTML内容，配置多条可以配置为数组
        // message: '下面 的内容和图标都是可以修改的噢（当然本条内容也是可以隐藏的）',
        copyright: 'MIT License | SlovinG',
        // icpRecord: {
        //   name: '蜀ICP备19011724号',
        //   link: 'https://beian.miit.gov.cn/'
        // },
        // securityRecord: {
        //   name: '公网安备xxxxx',
        //   link: 'https://www.beian.gov.cn/portal/index.do'
        // },
    },

    // 主题色修改
    themeColor: 'el-blue',

    // 文章默认作者
    author: 'SlovinG',

    // 友链
    friend: [
        {
            nickname: '书灏',
            des: '最爱湖东行不足，绿杨阴里白沙提',
            avatar: 'https://zhaowuya.s3.bitiful.net/avatar.png',
            url: 'https://zhaowuya.top/',
        },
        {
            nickname: '粥里有勺糖',
            des: '你的指尖用于改变世界的力量',
            avatar: 'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
            url: 'https://sugarat.top',
        },
        {
            nickname: 'Vitepress',
            des: 'Vite & Vue Powered Static Site Generator',
            avatar: 'https://vitepress.dev/vitepress-logo-large.webp',
            url: 'https://vitepress.dev/',
        },
    ],

    // 公告
    popover: {
        title: '公告',
        duration: -1,
        mobileMinify: false,
        reopen: true,
        twinkle: true,
        body: [
            {type: 'text', content: '👇 我的微信 👇----👇 我的 QQ 👇'},
            {
                type: 'image',
                src: 'https://sloving.top/img/wechat.png',
                style: 'display: inline-block;width:46%;padding-right:6px'
            },
            {
                type: 'image',
                src: 'https://sloving.top/img/qq.png',
                style: 'display: inline-block;width:46%;padding-left:6px'
            },
            {
                type: 'text',
                content: '欢迎大家私信交流'
            }
        ],
    },

    // 热门文章
    hotArticle: {
        title: '🔥 精选文章',
        nextText: '换一组',
        pageSize: 9,
        empty: '暂无精选内容'
    },

    // 推荐文章的展示卡片
    recommend: false,

    // 首页标签配置
    homeTags: {
        title: '🏷 标签',
        limit: 26,
        sort: 'desc',
        showCount: true

    },

    // 评论插件
    comment: {
        repo: 'SlovinG/sloving.github.io',
        repoId: 'MDEwOlJlcG9zaXRvcnkyNDY1MTEyOTQ=',
        category: 'Announcements',
        categoryId: 'DIC_kwDODrF2vs4CgAF8',
        inputPosition: 'top'
    }
})

export {blogTheme}
