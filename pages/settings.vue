<script setup>
const route = useRoute()
const router = useRouter()
const checked = ref('adhansettings')
const previousTab = ref('adhansettings')
const locationStore = useLocationStore()
const { latitude, longitude } = storeToRefs(locationStore)

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
  <div class="flex flex-col gap-4 sm:gap-6">
    <RootReturnPageName name="Settings" />
    <div>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>
    <div class="tabs tabs-bordered" role="tablist">
      <input
        v-model="checked"
        :class="`${
          checked === 'adhansettings' ? 'tab-active' : 'tab-inactive'
        }`"
        aria-label="Adhan Settings"
        class="tab"
        role="tab"
        type="radio"
        value="adhansettings"
      >
      <div class="tab-content p-6" role="tabpanel">
        <SettingsAdhanSettings />
      </div>
    </div>
  </div>
</template>

<style>
.tabs {
  overflow: hidden;
  width: 100%;
}

.tab {
  height: max-content;
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
}
</style>
