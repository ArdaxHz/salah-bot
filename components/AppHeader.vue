<script setup>
import { capitalizeFirstLetter } from '~/composables/helpers'

const props = defineProps({
  is_mobile: Boolean,
  expandedMenu: Boolean,
  expandedMenuVal: Number,
  salahTimesToday: Object
})
const emits = defineEmits(['ToggleMenu', 'updateUserLocation'])
const is_expanded = ref(props.expandedMenu)
function ToggleMenu() {
  is_expanded.value = !is_expanded.value
  emits('ToggleMenu', is_expanded.value)
}

watch(() => props.expandedMenuVal, (newValue, _) => {
  if (newValue) {
    if (newValue % 2 == 0) {
      is_expanded.value = true
    }

    if (Math.abs(newValue % 2) == 1) {
      is_expanded.value = false
    }
  }
})

function updateUserLocation(updatedLocation) {
  emits('updateUserLocation', updatedLocation)
}
</script>

<template>
  <div class="flex flex-grow flex-row w-full justify-between bg-white dark:bg-flax-950 ring-2 ring-mulled-500 header h-18">
    <div class="container mx-auto max-w-7xl flex flex-grow flex-row w-full">
      <div class="flex flex-row gap-3 sm:gap-6 items-center">
        <div class="flex lg:hidden">
          <button class="menu-toggle flex lg:hidden" @click="ToggleMenu">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-8"
            >
              <path
                stroke-linecap="round" stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <NuxtLink to="/">
          <RootTodayAdhanTimings :salah-times-today="salahTimesToday" />
        </NuxtLink>
        <!-- <p class="text-2xl font-bold whitespace-normal">Assalamu Alaikum</p>
                <NuxtLink class="text-2xl font-bold whitespace-normal" v-if="nextSalah" to="/">
                    Next Salah: {{ capitalizeFirstLetter(nextSalah) }}
                </NuxtLink> -->
      </div>
      <div class="hidden sm:flex flex-end ml-auto flex-row gap-2 items-center ">
        <!-- <div class="flex flex-grow rounded-lg bg-primary-200/65 px-2 py-1 leading-[0] w-24 bg-flax-700 h-[1.5rem] items-center">
                    <p class="">a</p>
                </div> -->
        <div class="flex gap-2">
          <RootLocateUser @update-user-location="updateUserLocation" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
svg {
    display: inherit !important;
}

.menu-toggle {
    justify-content: flex-start;
}

.header {
    box-shadow: 0 4px 2px -2px theme('colors.mulled.500');;
}
</style>
