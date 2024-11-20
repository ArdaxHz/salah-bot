<script setup>
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const rootContainer = ref(null)
const windowWidth = ref(0)
const windowHeight = ref(0)
const is_mobile = ref(true)
const mobile_break = ref(true)
const smaller_mobile = ref(true)

useResizeObserver(rootContainer, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  windowWidth.value = width
  windowHeight.value = height

  is_mobile.value = windowWidth.value < 1023
  mobile_break.value = windowWidth.value >= 640
  smaller_mobile.value = windowWidth.value < 380
})

const expandedMenu = ref(!(windowWidth.value < 1023))
const expandedMenuVal = ref(1)

function ToggleMenu(toggledMenu) {
  expandedMenu.value = toggledMenu
  expandedMenuVal.value += 1
}
</script>

<template>
  <NuxtLayout
    ref="rootContainer"
    :expanded-menu="expandedMenu"
    :expanded-menu-val="expandedMenuVal"
    :is_mobile="is_mobile"
    :is_smaller_mobile="smaller_mobile"
    @toggle-menu="ToggleMenu"
  >
    <NuxtPage :mobile_break="mobile_break" />
  </NuxtLayout>
</template>
