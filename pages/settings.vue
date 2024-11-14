<script setup>
const checked = ref('tab-1')
const previousTab = ref('tab-1')

watch(checked, (newVal, oldVal) => {
  previousTab.value = oldVal
})

function getSlideDirection(currentTab) {
  const tabOrder = ['tab-1', 'tab-2', 'tab-3']
  const currentIndex = tabOrder.indexOf(currentTab)
  const previousIndex = tabOrder.indexOf(previousTab.value)

  return currentIndex > previousIndex ? 'right' : 'left'
}
</script>

<template>
  <div class="tabs tabs-lifted -mb-[var(--tab-border)]" role="tablist">
    <input
      v-model="checked"
      :class="`${checked === 'tab-1' ? 'tab-active' : 'tab-inactive'}`"
      aria-label="Adhan Calculator Settings"
      class="tab"
      role="tab"
      type="radio"
      value="tab-1"
    >
    <div
      :data-slide="getSlideDirection('tab-1')"
      class="tab-content p-6"
      role="tabpanel"
    >
      <n-message-provider>
        <SettingsAdhanSettings />
      </n-message-provider>
    </div>

    <input
      v-model="checked"
      :class="`${checked === 'tab-2' ? 'tab-active' : 'tab-inactive'}`"
      aria-label="Tab 2"
      class="tab"
      role="tab"
      type="radio"
      value="tab-2"
    >
    <div
      :data-slide="getSlideDirection('tab-2')"
      class="tab-content p-6"
      role="tabpanel"
    >
      <div class="tab-content-children">
        Tab content 2
      </div>
    </div>

    <input
      v-model="checked"
      :class="`${checked === 'tab-3' ? 'tab-active' : 'tab-inactive'}`"
      aria-label="Tab 3"
      class="tab"
      role="tab"
      type="radio"
      value="tab-3"
    >
    <div
      :data-slide="getSlideDirection('tab-3')"
      class="tab-content p-6"
      role="tabpanel"
    >
      <div class="tab-content-children">
        Tab content 3
      </div>
    </div>
  </div>
</template>

<style>
.n-tabs {
  --n-bar-color: var(--neutral-secondary-color) !important;
  --n-tab-text-color: var(--light-text-secondary-color-hover) !important;
  --n-tab-text-color-active: var(--neutral-secondary-color) !important;
}

.dark .n-tabs-tab:hover {
  color: var(--dark-text-secondary-color-hover) !important;
}

.light .n-tabs-tab:hover {
  color: var(--light-text-secondary-color-hover) !important;
}

.tabs {
  overflow: hidden;
}

.tab-active {
  --tab-bg: var(--fallback-n, oklch(var(--n)));
  --tab-border-color: var(--fallback-n, oklch(var(--n)));
  --tab-color: var(--fallback-nc, oklch(var(--nc)));

  font-weight: theme(fontWeight.bold);
}

.tab-inactive {
  --tab-border-color: transparent;
}

.tab-content {
  background-color: var(--fallback-n, oklch(var(--n)));
  border-radius: var(--tab-radius, 0.5rem /* 8px */);

  transition: opacity 0.5s, transform 0.5s;
}

.tab-content > * + .tab-content[data-slide="left"] {
  animation: fadeSlideInLeft 0.5s;
}

.tab-content > * + .tab-content[data-slide="right"] {
  animation: fadeSlideInRight 0.5s;
}

/* Slide and fade animations */
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  50% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-100%);
  }
}

@keyframes fadeSlideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  50% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  50% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
