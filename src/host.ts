import { inject, type InjectionKey } from 'vue'
import type { PortalPageProps } from 'servumi-web-commons'

/**
 * 宿主上下文：装配态由 `src/desktop/index.ts` 注入，独立运行时取不到（为 null）。
 * 模块据此切换形态——装配态不渲染自己的顶栏（壳已有）、不改整页标题（那是壳的）。
 */
export const HOST_KEY: InjectionKey<PortalPageProps> = Symbol('servumi-host')

export const useHost = () => inject<PortalPageProps | null>(HOST_KEY, null)
