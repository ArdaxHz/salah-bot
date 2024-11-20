<script setup>
const props = defineProps({
  expandedMenu: Boolean,
  expandedMenuVal: Number,
  is_mobile: Boolean,
  is_smaller_mobile: Boolean,
})
const emits = defineEmits(['ToggleMenu'])
const SideBarMenu = ref(true)
const is_expanded = ref(props.expandedMenu)

function ToggleMenu() {
  is_expanded.value = !is_expanded.value
  emits('ToggleMenu', is_expanded.value)
}

function ToggleMenuOff() {
  if (is_expanded.value && props.is_mobile) {
    is_expanded.value = false
    emits('ToggleMenu', is_expanded.value)
  }
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

const navItemsTop = ref([
  {
    label: 'Home',
    icon: 'material-symbols:home-outline-rounded',
    to: '/',
    active: 'material-symbols:home-rounded',
  },
  {
    label: 'Prayer Times',
    icon: 'material-symbols:alarm-outline-rounded',
    to: '/today',
    active: 'material-symbols:alarm-rounded',
  },
  {
    label: 'Prayers',
    icon: 'material-symbols:prayer-times-outline-rounded',
    to: '/prayers',
    active: 'material-symbols:prayer-times-rounded',
  },
  {
    label: 'Masaajid',
    icon: 'material-symbols:mosque-outline-rounded',
    to: '/masjids',
    active: 'material-symbols:mosque-rounded',
  },
])

const navItemsBottom = ref([
  // {
  //   label: 'Account',
  //   icon: 'material-symbols:account-circle-outline',
  //   to: '/me',
  //   active: 'material-symbols:account-circle',
  // },
  {
    label: 'Settings',
    icon: 'material-symbols:settings-outline-rounded',
    to: '/settings',
    active: 'material-symbols:settings-rounded',
  },
])
</script>

<template>
  <aside
    ref="SideBarMenu"
    :class="{
      'is-expanded bg-[var(--light-bg-color)]': is_expanded,
      'mobile-expanded': is_smaller_mobile,
    }"
    class="sidebar flex h-[100dvh] !fixed lg:!sticky top-0 z-10 left-0 flex-col bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)] ring-2 ring-[var(--neutral-secondary-color)]"
  >
    <div class="flex flex-col h-full w-full">
      <div
        class="menu-toggle-wrap flex flex-col mb-4 rounded-lg justify-center items-center w-max"
      >
        <button class="menu-toggle" @click="ToggleMenu">
          <Icon name="material-symbols:menu-rounded" size="2rem" />
        </button>
      </div>
      <div
        :class="{
          'overflow-y-auto': is_expanded,
        }"
        class="flex flex-col justify-between h-full w-full"
      >
        <RootNavMenuItems
          :is_expanded="is_expanded"
          :nav-items="navItemsTop"
          @click="ToggleMenuOff"
        />
        <div
          :class="`${
            is_expanded
              ? 'flex-col w-full justify-start items-start'
              : 'justify-center items-center flex-col-reverse gap-7'
          }`"
          class="menu-footer flex gap-4"
        >
          <RootNavMenuItems
            :is_expanded="is_expanded"
            :nav-items="navItemsBottom"
            class="w-full"
            @click="ToggleMenuOff"
          />
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
  overflow-y: auto;

  --sidebar-width: var(--sidebar-width-collapse);
  min-width: var(--sidebar-width);
  max-width: var(--sidebar-width);
  padding-block: 1.3rem;
  padding-inline: 1rem;

  transition: 0.2s ease-in-out;
  box-shadow: 4px 0 2px -2px theme("colors.mulled.500");
}

.sidebar.is-expanded {
  display: flex;

  transition: 0.2s ease-in-out;
}

.sidebar.is-expanded:not(.mobile-expanded) {
  min-width: var(--sidebar-width-expanded);
  max-width: var(--sidebar-width-expanded);
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
  line-height: 1.5rem;
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
  border-radius: theme("borderRadius.lg");
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
