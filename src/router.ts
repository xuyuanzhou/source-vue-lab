import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由工厂：装配态由壳注入基址（`/desktop/source-vue-lab`），独立运行取 `/`。
 * 两形态共用同一张路由表——地址栏里多不多一层前缀，是唯一差别。
 */
export default function createLabRouter(basePath: string) {
  return createRouter({
    history: createWebHistory(basePath),
    routes: [
      { path: '/', name: 'home', component: () => import('./views/HomeView.vue') },
      { path: '/learn/:id', name: 'learn', component: () => import('./views/ArticleView.vue'), props: true },
      { path: '/labs', name: 'labs', component: () => import('./views/LabsView.vue') },
      { path: '/saved', name: 'saved', component: () => import('./views/SavedView.vue') },
      { path: '/:pathMatch(.*)*', redirect: '/' },
    ],
    scrollBehavior: () => ({ top: 0 }),
  })
}
