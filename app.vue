<script setup>
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const optionsStore = useOptionsStore()

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

function isPwa() {
  return (window.matchMedia('(display-mode: standalone)').matches)
}

onMounted(() => {
  optionsStore.pwa = isPwa()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <VitePwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>
