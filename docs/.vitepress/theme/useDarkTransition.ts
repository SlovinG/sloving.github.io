import { nextTick, provide } from 'vue'
import { useData } from 'vitepress'

/**
 * 自定义暗黑模式过渡 Hook
 * 解决原主题在亮→暗切换时最后一帧闪白的问题
 * 
 * 核心改进：在动画期间添加 `dark-transitioning` 类，
 * 确保 z-index 层级在整个动画过程中保持稳定
 */
export function useCustomDarkTransition() {
  const { isDark } = useData()

  const enableTransitions = () =>
    'startViewTransition' in document
    && window.matchMedia('(prefers-reduced-motion: no-preference)').matches

  provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
    if (!enableTransitions()) {
      isDark.value = !isDark.value
      return
    }

    // 记录切换前的状态
    const willBeDark = !isDark.value

    // 在动画开始前添加过渡标记类
    // 这个类用于在 CSS 中固定 z-index，避免 .dark 类切换导致的层级变化
    document.documentElement.classList.add('dark-transitioning')
    if (willBeDark) {
      // 亮→暗：需要 old 在顶层
      document.documentElement.classList.add('to-dark')
    } else {
      // 暗→亮：需要 new 在顶层
      document.documentElement.classList.add('to-light')
    }

    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y)
      )}px at ${x}px ${y}px)`
    ]

    const transition = document.startViewTransition(async () => {
      isDark.value = !isDark.value
      await nextTick()
    })

    await transition.ready

    document.documentElement.animate(
      { clipPath: willBeDark ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${willBeDark ? 'old' : 'new'}(root)`
      }
    )

    // 动画完成后移除过渡标记类
    transition.finished.then(() => {
      document.documentElement.classList.remove('dark-transitioning', 'to-dark', 'to-light')
    })
  })
}
