import { createApp } from 'vue'
import type { PortalPageProps } from 'servumi-web-commons'
import App from '../App.vue'
import createLabRouter from '../router'
import { HOST_KEY } from '../host'
import { syncTheme } from '../composables/useWorkspace'

/**
 * 槽位入口：交回运行时描述符而非 React 组件（见 ADR-0020）。
 * 壳只在这个节点里挂一套 Vue 运行时，卸载即整树拆除。
 */
export default {
  framework: 'vue',
  mount(el: HTMLElement, props: PortalPageProps) {
    el.classList.add('vue-lab-root')
    syncTheme(el)
    const app = createApp(App)
    app.config.errorHandler = (error) => reportFatal(el, error)
    app.provide(HOST_KEY, props)
    app.use(createLabRouter(props.basePath))
    try {
      app.mount(el)
    } catch (error) {
      reportFatal(el, error)
    }
    return () => app.unmount()
  },
}

/** 运行时异常落到一条可见提示：白屏之外至少留下线索（Vue 的错误不经过 React 错误边界）。 */
function reportFatal(el: HTMLElement, error: unknown) {
  console.error('[source-vue-lab]', error)
  if (el.querySelector('.vue-lab-fatal') !== null) return
  const tip = document.createElement('p')
  tip.className = 'vue-lab-fatal'
  tip.textContent = `Vue 源码实验场运行出错：${error instanceof Error ? error.message : String(error)}`
  el.prepend(tip)
}
