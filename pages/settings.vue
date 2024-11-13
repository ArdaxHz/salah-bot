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
  <n-tabs
    size="large" justify-content="space-evenly" class="card-tabs" animated
  >
    <n-tab-pane name="Adhan Calculator Settings" tab="Adhan">
      <n-message-provider>
        <SettingsAdhanSettings />
      </n-message-provider>
    </n-tab-pane>
    <n-tab-pane name="signup" tab="Sign up">
      <n-form>
        <n-form-item-row label="Username">
          <n-input />
        </n-form-item-row>
        <n-form-item-row label="Password">
          <n-input />
        </n-form-item-row>
        <n-form-item-row label="Reenter Password">
          <n-input />
        </n-form-item-row>
      </n-form>
      <n-button type="primary" block secondary strong>
        Sign up
      </n-button>
    </n-tab-pane>
  </n-tabs>

  <div role="tablist" class="tabs tabs-lifted -mb-[var(--tab-border)]">
    <input
      v-model="checked"
      type="radio"
      role="tab"
      class="tab"
      aria-label="Adhan Calculator Settings"
      :class="`${checked === 'tab-1' ? 'tab-active' : 'tab-inactive'}`"
      value="tab-1"
    >
    <div role="tabpanel" class="tab-content p-6" :data-slide="getSlideDirection('tab-1')">
      <n-message-provider>
        <SettingsAdhanSettings />
      </n-message-provider>
    </div>

    <input
      v-model="checked"
      type="radio"
      role="tab"
      class="tab"
      aria-label="Tab 2"
      :class="`${checked === 'tab-2' ? 'tab-active' : 'tab-inactive'}`"
      value="tab-2"
    >
    <div role="tabpanel" class="tab-content p-6" :data-slide="getSlideDirection('tab-2')">
      Tab content 2
    </div>

    <input
      v-model="checked"
      type="radio"
      role="tab"
      class="tab"
      aria-label="Tab 3"
      :class="`${checked === 'tab-3' ? 'tab-active' : 'tab-inactive'}`"
      value="tab-3"
    >
    <div role="tabpanel" class="tab-content p-6" :data-slide="getSlideDirection('tab-3')">
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
  --tab-bg: var(--fallback-n,oklch(var(--n)));
  --tab-border-color: var(--fallback-n,oklch(var(--n)));
  --tab-color: var(--fallback-nc,oklch(var(--nc)));

  font-weight: theme(fontWeight.bold);
}

.tab-inactive {
  --tab-border-color: transparent;
}

.tab-content {
  background-color: var(--fallback-n,oklch(var(--n)));
  border-radius: var(--tab-radius, 0.5rem /* 8px */);
}
.tab-content {
  display: none;
  opacity: 0;
  transform: translateX(100%);
  transition: opacity 0.5s, transform 0.5s;
}

input[type="radio"]:checked + .tab-content-children {
  display: block;
  animation: fadeSlideIn 0.5s forwards;
}

/* Indicator animation */
.tabs::after {
  content: '';
  position: absolute;
  bottom: 0;
  height: 4px;
  width: 0;
  background-color: #f00;
  transition: transform 0.3s, width 0.3s;
  z-index: 0;
}

input[type="radio"]:nth-child(1):checked ~ .tabs::after {
  transform: translateX(0%);
  width: calc(100% / 3);
}

input[type="radio"]:nth-child(3):checked ~ .tabs::after {
  transform: translateX(100%);
  width: calc(100% / 3);
}

input[type="radio"]:nth-child(5):checked ~ .tabs::after {
  transform: translateX(200%);
  width: calc(100% / 3);
}

/* Slide and fade animations */
@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
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

/* Alternate animation for left-to-right and right-to-left */
input[type="radio"]:checked + .tab-content[data-slide="left"] {
  animation: fadeSlideInLeft 0.5s forwards;
}

input[type="radio"]:checked + .tab-content[data-slide="right"] {
  animation: fadeSlideInRight 0.5s forwards;
}

@keyframes fadeSlideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeSlideInRight {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
