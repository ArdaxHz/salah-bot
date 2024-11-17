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
const mobile_break = ref(true)
const smaller_mobile = ref(true)
const is_announcement = ref(false)

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

function handleMouseDown() {
  if (expandedMenu.value && is_mobile.value) {
    expandedMenu.value = false
    expandedMenuVal.value += 1
  }
}
</script>

<template>
  <div ref="rootContainer" class="flex h-full">
    <NuxtLayout
      :class="`${
        is_announcement
          ? '!h-[calc(100dvh - var(--announcement-height))]'
          : '!h-[100dvh]'
      }`"
      :expanded-menu="expandedMenu"
      :expanded-menu-val="expandedMenuVal"
      :is_mobile="is_mobile"
      :is_smaller_mobile="smaller_mobile"
      class="hidden lg:flex !fixed lg:!sticky top-0 z-10 left-0"
      name="sidebar-logged-out"
      @focusout="handleMouseDown"
      @toggle-menu="ToggleMenu"
    />
    <div
      class="flex flex-col items-center justify-start w-full h-full"
      @focusin="handleMouseDown"
    >
      <header
        class="!sticky top-0 leading-[0] z-[9] w-full h-[var(--header-height)]"
      >
        <NuxtLayout
          :expanded-menu="expandedMenu"
          :expanded-menu-val="expandedMenuVal"
          :is_mobile="is_mobile"
          name="header-logged-out"
          @toggle-menu="ToggleMenu"
        />
      </header>
      <main
        ref="PageContentRef"
        class="w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-2 page z-0 mt-4 sm:mt-6 mb-8 sm:mb-12"
      >
        <NuxtLoadingIndicator color="#9081d3" />
        <NuxtPage :mobile_break="mobile_break" />
      </main>
    </div>
  </div>
</template>
