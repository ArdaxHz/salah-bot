<script setup>
const props = defineProps({
  isMobile: Boolean,
  expandedMenu: Boolean,
  expandedMenuVal: Number,
})

const emits = defineEmits(['ToggleMenu'])

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
    class="flex w-full h-full items-center justify-center bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)] ring-2 ring-[var(--neutral-secondary-color)] header"
  >
    <div class="max-w-7xl flex w-full px-3 sm:px-6 lg:px-8 py-4">
      <div class="flex flex-row gap-3 sm:gap-6 items-center">
        <div class="flex lg:hidden menu-toggle-wrap rounded-md">
          <button class="menu-toggle flex lg:hidden" @click="ToggleMenu">
            <Icon
              class="[var(--light-text-color)] dark:[var(--dark-text-color)]"
              name="material-symbols:menu-rounded"
              size="2rem"
            />
          </button>
        </div>
        <div>
          <RootTodayAdhanTimings class="hidden xs:table" />
          <div class="flex xs:hidden items-center w-full">
            <NuxtLink class="menu-item menu-item-text" to="/today">
              <Icon
                name="material-symbols:prayer-times-outline-rounded"
                size="1.75rem"
              />
              Today
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="flex flex-end ml-auto flex-row gap-2 items-center">
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
