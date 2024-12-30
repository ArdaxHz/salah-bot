<script setup>
const viewport = useViewport()
const optionsStore = useOptionsStore()
const { sidebarExpanded, mobile } = storeToRefs(optionsStore)
const activeItem = ref(null)
const route = useRoute()

function ToggleMenu() {
  sidebarExpanded.value = !sidebarExpanded.value
}

function ToggleMenuOff() {
  if (sidebarExpanded.value && viewport.isLessThan('lg')) {
    sidebarExpanded.value = false
  }
}

watch(route, () => {
  activeItem.value = route.path
})

const navItemsTop = ref([
  {
    label: 'Home',
    icon: 'material-symbols:home-outline-rounded',
    to: '/',
    active: 'material-symbols:home-rounded',
  },
  {
    label: 'Adhan',
    icon: 'material-symbols:alarm-outline-rounded',
    to: '/adhan',
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

  {
    label: 'Locate',
    icon: 'material-symbols:location-on-outline-rounded',
    to: '/locate',
    active: 'material-symbols:location-on-rounded',
  },
])

const navItemsBottom = ref([
  {
    label: 'About',
    icon: 'material-symbols:group-outline-rounded',
    to: '/about',
    active: 'material-symbols:group-rounded',
  },
  {
    label: 'Account',
    icon: 'material-symbols:account-circle-outline',
    to: '/me',
    active: 'material-symbols:account-circle',
  },
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
    :class="{
      'is-expanded bg-[--light-bg-color]': sidebarExpanded,
    }"
    class="sidebar h-[100dvh] !fixed lg:!sticky top-0 z-10 left-0 flex-col bg-[--light-bg-color] dark:bg-[--dark-bg-color] ring-2 ring-[--color-secondary-500]"
  >
    <div
      class="menu-toggle-wrap flex flex-col standalone:mb-[env(safe-area-inset-bottom,2.5rem)] standalone:mt-4 standalone:sm:mt-0 standalone:sm:mb-4 mb-4 rounded-md justify-center items-center w-max"
    >
      <button class="menu-toggle" @click="ToggleMenu">
        <Icon
          :name="`${
            sidebarExpanded
              ? 'material-symbols:close-rounded'
              : 'material-symbols:menu-rounded'
          }`"
          size="2rem"
        />
      </button>
    </div>
    <div
      :class="{
        'overflow-y-auto': sidebarExpanded,
      }"
      class="flex flex-col standalone:flex-col-reverse standalone:sm:flex-col justify-between h-full w-full"
    >
      <LayoutNavMenuItems
        v-model="activeItem"
        :is_expanded="sidebarExpanded"
        :nav-items="navItemsTop"
        @click="ToggleMenuOff"
      />
      <div
        :class="`${
          sidebarExpanded
            ? 'flex-col w-full justify-start items-start'
            : 'justify-center items-center flex-col-reverse gap-7'
        }`"
        class="menu-footer flex gap-4 standalone:flex-col-reverse standalone:sm:flex-col"
      >
        <LayoutNavMenuItems
          v-model="activeItem"
          :is_expanded="sidebarExpanded"
          :nav-items="navItemsBottom"
          class="w-full standalone:flex-col-reverse standalone:sm:flex-col"
          @click="ToggleMenuOff"
        />
        <RootThemeSelector
          :class="`${sidebarExpanded ? 'rotate-0' : '-rotate-90'}`"
          :is_expanded="sidebarExpanded"
          class="grow w-100"
        />
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
  animation: translateOut 500ms forwards;
}

@media all and (display-mode: standalone) and (max-width: 640px) {
  .sidebar {
    flex-direction: column-reverse;
  }
}

.sidebar.is-expanded {
  display: flex;

  position: absolute;
  animation: translateIn 500ms forwards;
  transition: 0.2s ease-in-out;
}

.sidebar.is-expanded {
  min-width: 100svw;
  max-width: 100svw;
}

@media (min-width: 320px) {
  .sidebar.is-expanded {
    min-width: var(--sidebar-width-expanded);
    max-width: var(--sidebar-width-expanded);
  }
}

@media (min-width: 1024px) {
  .sidebar.is-expanded {
    position: relative;
    animation: initial;
  }
}

@media (min-width: 1024px) {
  .sidebar {
    animation: initial;
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

  padding: 0.3rem 0.5rem;
  border-radius: theme("borderRadius.base");
}

.menu-item-expanded {
  width: 100%;
  animation: fadeIn 0.75s;

  justify-content: start;
  align-items: start;
}

.dark .menu-item:hover,
.dark .menu-toggle-wrap:hover {
  background-color: var(--color-accent-700);
}

.light .menu-item:hover,
.light .menu-toggle-wrap:hover {
  background-color: var(--color-accent-200);
}

.menu-item:active:focus,
.button-scale:active:focus {
  animation: button-pop 0s ease-out;
  transform: scale(var(--btn-focus-scale, 0.97));
}
</style>
