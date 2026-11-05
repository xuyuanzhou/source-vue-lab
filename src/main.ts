import { createApp } from 'vue'
import App from './App.vue'
import createLabRouter from './router'
import './source-vue-lab.css'

/** 独立运行入口：仅在 `npm run dev` / `vite preview` 下生效，不进 Remote 构建入口。 */
createApp(App).use(createLabRouter('/')).mount('#app')
