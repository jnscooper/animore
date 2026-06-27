import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes as RouteRecordRaw[]),
  scrollBehavior: (_, __, saved) => {
    return (
      saved || {
        top: 0,
        behavior: 'instant',
      }
    )
  },
})

router.afterEach(async (_, __, failure) => {
  if (!failure)
    setTimeout(() => {
      window.HSStaticMethods?.autoInit()
    }, 100)
})

export default router
