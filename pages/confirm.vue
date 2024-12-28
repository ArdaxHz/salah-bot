<script lang="ts" setup>
definePageMeta({
  middleware: 'confirm',
})

useSeoMeta({
  title: formatPageTitle('Confirm Signup'),
  description: 'Confirm signing up to salah.bot'
})

const user = useSupabaseUser()
const cookieName = useRuntimeConfig().public.supabase.cookieName
const redirectPath = useCookie(`${cookieName}-redirect-path`).value

watch(
  user,
  () => {
    console.log(user)
    if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null
      // Redirect to path
      return navigateTo(redirectPath || '/')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div>Waiting for login...</div>
</template>
