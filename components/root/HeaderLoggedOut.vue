<script setup>
const optionsStore = useOptionsStore()
const { sidebarExpanded } = storeToRefs(optionsStore)

function ToggleMenu() {
  sidebarExpanded.value = !sidebarExpanded.value
}
</script>

<template>
  <div
    class="flex w-full !sticky top-0 leading-[0] z-[9] h-[var(--header-height)] items-center justify-center bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)] ring-2 ring-[var(--neutral-secondary-color)] header"
  >
    <div class="max-w-7xl flex w-full px-3 sm:px-6 lg:px-8 py-4 h-full">
      <div class="flex flex-row gap-3 sm:gap-6 items-center h-full">
        <div class="flex lg:hidden menu-toggle-wrap rounded-lg">
          <button class="menu-toggle flex lg:hidden" @mousedown="ToggleMenu">
            <Icon
              class="[var(--light-text-color)] dark:[var(--dark-text-color)]"
              name="material-symbols:menu-rounded"
              size="2rem"
            />
          </button>
        </div>
        <div>
          <RootTodayAdhanTimings :header="true" class="hidden xs:flex" />
          <div class="flex xs:hidden items-center w-full">
            <NuxtLink class="menu-item menu-item-text" to="/today">
              <Icon
                name="material-symbols:alarm-outline-rounded"
                size="1.75rem"
              />
              <span class="hidden min-[250px]:block">Today</span>
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
</style>
