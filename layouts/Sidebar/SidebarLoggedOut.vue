<script setup>
const props = defineProps({
  expandedMenu: Boolean,
  expandedMenuVal: Number,
  is_mobile: Boolean,
})
const emits = defineEmits(['ToggleMenu'])
const SideBarMenu = ref(true)
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
  <aside
    ref="SideBarMenu"
    :class="{
      'is-expanded bg-white': is_expanded,
      'mobile-expanded': is_mobile,
    }"
    class="sidebar flex relative flex-col bg-whtie ring-2 ring-mulled-500 dark:bg-flax-950"
  >
    <div class="flex flex-col h-full w-full">
      <div
        class="menu-toggle-wrap flex flex-col mb-4 rounded-md justify-center items-center w-max"
      >
        <button class="menu-toggle" @click="ToggleMenu">
          <Icon class="" name="material-symbols:menu-rounded" size="2rem" />
        </button>
      </div>
      <div class="flex flex-col justify-between h-full w-full">
        <RootNavMenuItems :is_expanded="is_expanded" @click="ToggleMenu" />
        <div
          :class="`${
            is_expanded
              ? 'flex-col w-full justify-start items-start'
              : 'justify-center items-center flex-col-reverse gap-7'
          }`"
          class="menu-footer flex gap-4"
        >
          <NuxtLink
            :class="`${is_expanded ? 'menu-item-expanded ' : ''}`"
            class="menu-item"
            to="/settings"
            @click="ToggleMenu"
          >
            <Icon
              class=""
              name="material-symbols:settings-outline-rounded"
              size="1.75rem"
            />
            <span
              :class="`${is_expanded ? 'flex' : 'hidden'}`"
              class="menu-item-text"
            >Settings</span>
          </NuxtLink>
          <RootThemeSelector
            :class="`${is_expanded ? 'rotate-0' : '-rotate-90'}`"
            :is_expanded="is_expanded"
            class="grow w-100"
          />
        </div>
      </div>
    </div>
  </aside>
</template>

<style>
@keyframes translateIn {
  from {
    transition: 0.2s ease-in-out;
    transform: translateX(-100%);
  }

  to {
    transition: 0.2s ease-in-out;
    transform: translateX(0);
    display: flex;
  }
}

@keyframes translateOut {
  from {
    transition: 0.2s ease-in-out;
    transform: translateX(0);
    display: flex;
  }

  to {
    transition: 0.2s ease-in-out;
    transform: translateX(-100%);
    display: none;
  }
}

@media (max-width: 1023px) {
  .animateOut {
    animation: translateOut 500ms forwards;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;

  box-shadow: 4px 0 2px -2px;

  min-width: var(--sidebar-width-collapse);
  max-width: var(--sidebar-width-collapse);
  overflow: hidden;
  padding-block: 1.3rem;
  padding-inline: 1rem;

  transition: 0.2s ease-in-out;
  box-shadow: 4px 0 2px -2px theme("colors.mulled.500");
}

.sidebar.is-expanded {
  display: flex;
  height: 100%;

  transition: 0.2s ease-in-out;
}

.sidebar.is-expanded:not(.mobile-expanded) {
  min-width: var(--sidebar-width);
  max-width: var(--sidebar-width);
}

.sidebar.is-expanded.mobile-expanded {
  min-width: 100svw !important;
  max-width: 100svw !important;
}

@media (max-width: 1023px) {
  .sidebar.is-expanded {
    animation: translateIn 500ms forwards;
    position: absolute;
  }
}

@media (max-width: 1023px) {
  .sidebar {
    animation: translateOut 500ms forwards;
  }
}

.menu-toggle,
.menu-toggle-wrap {
  transition: 0.2s ease-in-out;
  line-height: 0;
}

.dark .menu-toggle > * {
  color: var(--dark-text-color);
}

.light .menu-toggle > * {
  color: var(--light-text-color);
}

.is-expanded .menu-toggle {
  transform: rotate(-180deg);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.menu-item-text {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-weight: 600;
}

.dark .menu-item {
  color: var(--dark-text-color);
}

.light .menu-item {
  color: var(--light-text-color);
}

.menu-item {
  justify-content: start;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  padding: 0.5rem;
  border-radius: theme("borderRadius.md");
}

.menu-item-expanded {
  width: 100%;
  animation: fadeIn 0.75s;

  justify-content: start;
  align-items: start;
}

.dark .menu-item:hover,
.dark .menu-toggle-wrap:hover {
  background-color: var(--dark-text-accent-color-hover);
}

.light .menu-item:hover,
.light .menu-toggle-wrap:hover {
  background-color: var(--light-text-accent-color-hover);
}

.menu-item:active:focus {
  animation: button-pop 0s ease-out;
  transform: scale(var(--btn-focus-scale, 0.97));
}
</style>
