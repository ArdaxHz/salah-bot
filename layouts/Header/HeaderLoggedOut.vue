<script setup>
import { capitalizeFirstLetter } from '~/composables/helpers'

const props = defineProps({
  is_mobile: Boolean,
  expandedMenu: Boolean,
  expandedMenuVal: Number
})
const emits = defineEmits(['ToggleMenu'])
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
</script>

<template>
  <div class="flex w-full items-center justify-center bg-white dark:bg-flax-950 ring-2 ring-mulled-500 header">
    <div class="max-w-7xl flex w-full px-6 lg:px-8 py-4">
      <div class="flex flex-row gap-3 sm:gap-6 items-center">
        <div class="flex lg:hidden">
          <button class="menu-toggle flex lg:hidden" @click="ToggleMenu">
            <Icon name="mdi:menu" size="2rem" class="text-black dark:text-white" />
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
      <div class="hidden sm:flex flex-end ml-auto flex-row gap-2 items-center ">
        <!-- <div class="flex flex-grow rounded-lg bg-primary-200/65 px-2 py-1 leading-[0] w-24 bg-flax-700 h-[1.5rem] items-center">
                    <p class="">a</p>
                </div> -->
        <div class="flex gap-2">
          <RootLocateUser />
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
  height: var(--navbar-height);
  box-shadow: 0 4px 2px -2px theme('colors.mulled.500');
}
</style>
