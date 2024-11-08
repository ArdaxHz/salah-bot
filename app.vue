<script setup>
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const rootContainer = ref(null)
const PageContentRef = ref(null)
const windowWidth = ref(0)
const windowHeight = ref(0)
const is_mobile = ref(true)
const salahTimesToday = ref(null)

useResizeObserver(rootContainer, (entries) => {
  const entry = entries[0]
  const { width, height } = entry.contentRect
  windowWidth.value = width
  windowHeight.value = height

  is_mobile.value = windowWidth.value < 1023
})

const expandedMenu = ref(!(windowWidth.value < 1023))
const expandedMenuVal = ref(1)

function ToggleMenu(toggledMenu) {
  expandedMenu.value = toggledMenu
  expandedMenuVal.value += 1
}

function handleMouseDown() {
  if (expandedMenu.value && is_mobile.value) {
    expandedMenu.value = false
    expandedMenuVal.value += 1
  }
}
</script>

<template>
  <div ref="rootContainer" class="flex flex-grow h-full">
    <NuxtLayout
      class="hidden lg:flex !fixed lg:!sticky top-0 z-10 !h-[100dvh] left-0" name="sidebar-logged-out" :expanded-menu="expandedMenu" :expanded-menu-val="expandedMenuVal"
      @toggle-menu="ToggleMenu"
    />
    <div class="flex flex-col items-center justify-start w-full" @mousedown="handleMouseDown">
      <div class="!sticky top-0 leading-[0] z-[9] w-full">
        <NuxtLayout
          name="header-logged-out" :is_mobile="is_mobile" :expanded-menu="expandedMenu"
          :expanded-menu-val="expandedMenuVal"@toggle-menu="ToggleMenu"
        />
      </div>
      <div ref="PageContentRef" class="w-full max-w-7xl px-6 lg:px-8 py-2 page z-0 mt-4 sm:mt-6">
        <NuxtLoadingIndicator color="#9081d3" />
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style>
.page {
  transition: 0.2s ease-in-out;
}

:root {
  --sidebar-width: 15.5rem;
  --sidebar-width-collapse: 4rem;
  --navbar-height: 4rem;
}

html.dark {
    background-color: theme('colors.flax.950');
}
html.light {
    background-color: white;
}
</style>
