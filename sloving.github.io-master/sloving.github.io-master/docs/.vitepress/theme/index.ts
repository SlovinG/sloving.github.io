import BlogTheme from '@sugarat/theme'

// 自定义样式重载
import './style.scss'
import LockedPage from "./components/LockedPage.vue";

// 自定义主题色
// import './user-theme.css'

export default {
    extends: BlogTheme,
    enhanceApp({ app }) {
        // 注册自定义全局组件
        app.component('LockedPage', LockedPage);
    }
}
