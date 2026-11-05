import { definePortalModule, type SlotModule } from 'servumi-web-commons'
import './source-vue-lab.css'

/**
 * 模块出口：端入口由目录决定（`src/<端>/index.ts` 在即占该槽位），故这里只交扫描结果。
 *
 * 样式在模块根引入，而不是在 `main.ts` 里——被壳加载的是 `src/desktop/index.ts` 这条链，
 * `main.ts` 不在其中；样式必须挂在这条链上才会随模块产出，并被联邦注入插件汇总进
 * `<style id="servumi-module-style-source-vue-lab">`。
 */
export default definePortalModule(import.meta.glob<SlotModule>('./*/index.ts', { eager: true }))
