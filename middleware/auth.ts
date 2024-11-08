export default defineNuxtRouteMiddleware((to, _from) => {
  const user = useSupabaseUser()

  watch(user, () => {
    if (user.value) {
      return navigateTo('/')
    }
  }, { immediate: true })
})
