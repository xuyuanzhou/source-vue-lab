import { federation } from '@module-federation/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { moduleGuard } from '@servumi/module-contract/vite'
import {
  createPortalRemoteFederationOptions,
  definePortalRemoteViteConfig,
  portalModuleEntry,
  readPortalPackageManifest,
} from '../servumi/scripts/frontend/remote-vite.mjs'

/**
 * package.json.servumiModule 是模块自述真相源；门禁与发布链路都直接从这份自述推导。
 * Federation 名不再手写——它与 remote.scope 同源，避免「改了名字漏改 scope」这类只在运行时才暴露的漂移。
 */
const { federationName } = readPortalPackageManifest()

// 5173 壳、5174 personal-notes、5175 learn-lesson、5176 learn-progress、5177 learn-task、
// 5178 sys-identity、5179 sys-application、5180 learn-practice、5181 sys-org、5182 sys-audit 已占。
const devPort = 5183

export default defineConfig(
  definePortalRemoteViteConfig({
    port: devPort,
    // 样式写在 SFC 的 <style> 与一份全局表里，会被抽成独立 CSS asset，
    // 走「构建产物汇总」模式注入（见 servumi/scripts/frontend/remote-vite.mjs）。
    styleInjection: 'bundled',
    plugins: [
      portalModuleEntry(),
      moduleGuard({ federationName }),
      vue(),
      federation(
        createPortalRemoteFederationOptions({
          federationName,
          // Vue Remote 不参与 React 单例共享：宿主不提供 Vue 运行时，
          // 声明成 singleton 只会换来一个无 provider 的警告与不确定的加载分支。
          // vue / vue-router / lucide / markdown-it / highlight.js 一律打进本模块 chunk。
          shared: {},
        }),
      ),
    ],
    // v1 不发任何业务请求：课文与实验数据都在本仓静态文件与 localStorage 里。
    proxy: {},
  }),
)
