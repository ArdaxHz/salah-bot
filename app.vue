<script setup>
import { calculateAdhanToday, calculateNextSalah } from '~/composables/adhantimes'

const rootContainer = ref(null)
const PageContentRef = ref(null)
const windowWidth = ref(0)
const windowHeight = ref(0)
const is_mobile = ref(true)
const userLocation = ref({ latitude: 0, longitude: 0 })
const latitude = ref(null)
const longitude = ref(null)
const salahTimesToday = ref(null)
const nextSalah = ref(null)

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

function updateUserLocation(updatedLocation) {
  userLocation.value = Object.assign(userLocation.value, updatedLocation)
  updateSalahTimesToday()
}

onMounted(() => {
  if (userLocation.value.latitude) {
    updateSalahTimesToday()
  }
})

function updateSalahTimesToday() {
  salahTimesToday.value = calculateAdhanToday(userLocation.value.latitude, userLocation.value.longitude, { fajrAngle: 18, madhab: 'shafi', CalculationMethod: 'MuslimWorldLeague' })
}
</script>

<template>
  <div ref="rootContainer" class="bg-white dark:bg-flax-950">
    <!-- <NuxtPwaManifest /> -->
    <div class="flex flex-grow">
      <div class="flex flex-row flex-grow">
        <AppSidebar
          class="hidden lg:flex !fixed lg:!sticky top-0 z-10 !h-screen" :window-width="windowWidth"
          :window-height="windowHeight" :expanded-menu="expandedMenu" :expanded-menu-val="expandedMenuVal"
          @toggle-menu="ToggleMenu"
        />
        <div class="flex flex-col w-full !h-screen" @mousedown="handleMouseDown">
          <div class="items-center sticky top-0 leading-[0]">
            <AppHeader
              class="px-6 lg:px-8 py-4" :is_mobile="is_mobile" :expanded-menu="expandedMenu"
              :expanded-menu-val="expandedMenuVal" :salah-times-today="salahTimesToday" @toggle-menu="ToggleMenu"
              @update-user-location="updateUserLocation"
            />
          </div>
          <div ref="PageContentRef" class="container mx-auto max-w-7xl px-6 lg:px-8 py-2 page overflow-y-auto">
            <NuxtLoadingIndicator color="#9081d3" />
            <NuxtPage />
          </div>
        </div>
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
  --sidebar-width-collapse: calc(2rem + 32px);
  --navbar-height: 4rem;
}

@media (prefers-color-scheme: dark) {
    html {
        background-color: theme('colors.flax.950');
    }
}
@media (prefers-color-scheme: light) {
    html {
        background-color: white;
    }
}
</style>
