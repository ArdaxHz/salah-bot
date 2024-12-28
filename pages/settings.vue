<script setup>
const route = useRoute()
const router = useRouter()
const checked = ref('adhan')
const previousTab = ref('adhan')

useSeoMeta({
  title: formatPageTitle('Settings'),
  description: 'Use your invitation to signup to salah.bot'
})

if (route.query.tab) {
  checked.value = route.query.tab
}
else {
  updateTabQuery()
}

function updateTabQuery() {
  router.replace({ path: '/settings', query: { tab: checked.value } })
}

watch(checked, (newVal, oldVal) => {
  previousTab.value = oldVal
  updateTabQuery()
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6 h-full">
    <RootReturnPageName name="Settings" />
    <div class="tabs tabs-bordered h-full" role="tablist">
      <input
        v-model="checked"
        :class="`${
          checked === 'adhan' ? 'tab-active' : 'tab-inactive'
        }`"
        aria-label="Adhan Settings"
        class="tab"
        role="tab"
        type="radio"
        value="adhan"
      >
      <div class="tab-content pt-6" role="tabpanel">
        <SettingsAdhanSettings />
      </div>
      <input
        v-model="checked"
        :class="`${
          checked === 'filtersettings' ? 'tab-active' : 'tab-inactive'
        }`"
        aria-label="Filters"
        class="tab"
        role="tab"
        type="radio"
        value="filters"
      >
      <div class="tab-content pt-6" role="tabpanel">
        <SettingsFilterSettings />
      </div>
    </div>
  </div>
</template>

<style>
.tabs {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.tab-active {
  font-weight: theme("fontWeight.bold");
}

.dark .tab-active {
  --tab-bg: var(--color-accent-900);
  --tab-border-color: var(--color-accent-900);
  --tab-color: var(--dark-text-color);
}

.light .tab-active {
  --tab-bg: var(--color-accent-200);
  --tab-border-color: var(--color-accent-200);
  --tab-color: var(--light-text-color);
}

.tab-inactive {
  --tab-border-color: transparent;
}

.dark .tab-inactive {
  color: var(--dark-text-color);
}

.light .tab-inactive {
  color: var(--light-text-color);
}

.tab-content {
  transition: opacity 0.5s, transform 0.5s;
  height: 100%;
}
</style>
