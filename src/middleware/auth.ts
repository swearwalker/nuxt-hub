import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const user = useSupabaseUser()

  if (user.value && to.path === '/') {
    return navigateTo('/chat')
  }
})
