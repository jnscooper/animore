import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'

const router = createRouter({
  history: createWebHistory(),
  routes: setupLayouts(routes as RouteRecordRaw[]),
})

router.afterEach(async (_, __, failure) => {
  if (!failure)
    setTimeout(() => {
      window.HSStaticMethods?.autoInit()
    }, 100)
})

export default router
