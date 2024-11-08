<script setup>
const props = defineProps({
  expandedMenu: Boolean,
  expandedMenuVal: Number
})
const emits = defineEmits(['ToggleMenu'])
const SideBarMenu = ref(true)
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
  <aside ref="SideBarMenu" class="sidebar flex relative flex-col bg-whtie ring-2 ring-mulled-500 dark:bg-flax-950" :class="`${is_expanded ? 'is-expanded bg-white ' : ''}` ">
    <!-- <div class="logo">
             <img :src="logoURL" alt="Vue" />
        </div> -->

    <div class="flex flex-col justify-center h-full w-full">
      <div class="menu-toggle-wrap mb-4">
        <button class="menu-toggle" @click="ToggleMenu">
          <Icon name="mdi:menu" size="2rem" class="text-black dark:text-white" />
        </button>
      </div>

      <div class="flex flex-col justify-between h-full w-full">
        <RootNavMenuItems :is_expanded="is_expanded" />

        <div
          class="menu-footer flex gap-4" :class="`${is_expanded ? 'flex-col w-full justify-start items-start' : 'justify-center items-center flex-col-reverse gap-7'}`"
        >
          <NuxtLink class="menu-item" :class="`${is_expanded ? 'menu-item-expanded ' : ''}`" to="/settings">
            <Icon name="mdi:cog-outline" size="1.75rem" class="text-black dark:text-white" /> <span class="menu-item-text" :class="`${is_expanded ? 'flex' : 'hidden'}`">Settings</span>
          </NuxtLink>
          <RootThemeSelector class="grow w-100" :class="`${is_expanded ? 'rotate-0' : '-rotate-90'}`" :is_expanded="is_expanded" />
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

.animateOut {
    @media (max-width: 1023px) {
        animation: translateOut 500ms forwards;
    }
}

aside {
    display: flex;
    flex-direction: column;
    background-color: var(--dark);
    color: var(--light);

    box-shadow: 4px 0 2px -2px;

    min-width: var(--sidebar-width-collapse);
    max-width: var(--sidebar-width-collapse);
    overflow: hidden;
    padding-block: 1.3rem;
    padding-inline: 1rem;

    transition: 0.2s ease-in-out;

    @media (max-width: 1023px) {
        animation: translateOut 500ms forwards;
    }

    .logo {
        margin-bottom: 1rem;

        img {
            width: 2rem;
        }
    }

    .menu-toggle-wrap {
        transition: 0.2s ease-in-out;
        line-height: 0;

        .menu-toggle {
            transition: 0.2s ease-in-out;

            &:hover {
            }
        }
    }

    &.is-expanded {
        box-shadow: 4px 0 2px -2px theme('colors.mulled.500');

        display: flex;
        min-width: var(--sidebar-width);
        max-width: var(--sidebar-width);
        height: 100%;

        transition: 0.2s ease-in-out;

        @media (max-width: 1023px) {
            animation: translateIn 500ms forwards;
            position: absolute;
        }

        .menu-toggle-wrap {
            .menu-toggle {
                transform: rotate(-180deg);
            }
        }
    }

    .menu-item-text {
        font-size: 1.25rem;
        line-height: 1.75rem;
        font-weight: 600;
    }

    .menu-item {
        justify-content: start;
        display: flex;
        gap: 0.5rem;
        align-items: center;
        padding-block: 0.5rem;
    }

    .menu-item-expanded {
        width: 100%;
        background-color: theme('backgroundColor.slate.500');

        padding-left: 0.25rem;
        /* padding-inline: 2.5rem; */

        border-radius: 0.375rem;
        animation: fadeIn .75s;

        justify-content: start;
        align-items: start;
    }
}

@keyframes fadeIn {
    from {opacity:0;}
    to {opacity:1;}
}
</style>
