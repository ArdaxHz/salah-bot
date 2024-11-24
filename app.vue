<script setup>
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <VitePwaManifest />
    <NuxtPage />
  </NuxtLayout>
</template>
