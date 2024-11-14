<script setup>
import { useLocationStore } from '@/composables/stores/location'

const props = defineProps({
  isMobile: Boolean,
  expandedMenu: Boolean,
  expandedMenuVal: Number,
})

const emits = defineEmits(['ToggleMenu'])

const location = useLocationStore()

const is_expanded = ref(props.expandedMenu)

function ToggleMenu() {
  is_expanded.value = !is_expanded.value
  emits('ToggleMenu', is_expanded.value)
}

watch(
  () => props.expandedMenuVal,
  (newValue, _) => {
    if (newValue) {
      if (newValue % 2 == 0) {
        is_expanded.value = true
      }

      if (Math.abs(newValue % 2) == 1) {
        is_expanded.value = false
      }
    }
  }
)
</script>

<template>
  <div
    class="flex w-full h-full items-center justify-center bg-white dark:bg-flax-950 ring-2 ring-mulled-500 header"
  >
    <div class="max-w-7xl flex w-full px-3 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-row gap-3 sm:gap-6 items-center">
        <div class="flex lg:hidden menu-toggle-wrap rounded-md">
          <button class="menu-toggle flex lg:hidden" @click="ToggleMenu">
            <Icon
              class="text-black dark:text-white"
              name="material-symbols:menu-rounded"
              size="2rem"
            />
          </button>
        </div>
        <NuxtLink to="/">
          <RootTodayAdhanTimings />
        </NuxtLink>
        <!-- <p class="text-2xl font-bold whitespace-normal">Assalamu Alaikum</p>
                <NuxtLink class="text-2xl font-bold whitespace-normal" v-if="nextSalah" to="/">
                    Next Salah: {{ capitalizeFirstLetter(nextSalah) }}
                </NuxtLink> -->
      </div>
      <div class="flex flex-end ml-auto flex-row gap-2 items-center">
        <!-- <div class="flex flex-grow rounded-lg bg-primary-200/65 px-2 py-1 leading-[0] w-24 bg-flax-700 h-[1.5rem] items-center">
                    <p class="">a</p>
                </div> -->
        <!--        <div -->
        <!--          :class="`${location.latitude ? '[.tooltip:opacity-0]' : ''}`" -->
        <!--          class="flex gap-2 tooltip tooltip-left" -->
        <!--          data-tip="Enable location access for this site to work." -->
        <!--        > -->
        <!--        </div> -->
        <RootLocateUser />
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
  box-shadow: 0 4px 2px -2px theme("colors.mulled.500");
}

.tooltip {
  /* opacity: 0; */
}
</style>
