<script setup>
const props = defineProps({
  is_expanded: Boolean,
  navItems: Object,
})
const activeItem = defineModel()
</script>

<template>
  <div
    :class="`${
      is_expanded ? 'justify-start items-start' : 'items-center justify-center'
    }`"
    class="flex menu-header flex-col gap-0.5 standalone:flex-col-reverse standalone:sm:flex-col"
  >
    <NuxtLink
      v-for="menu in navItems"
      :key="menu.to"
      :class="[is_expanded ? 'menu-item-expanded' : '']"
      :to="menu.to"
      class="menu-item"
      exact-active-class="active-nav-item"
    >
      <Icon
        :name="activeItem === menu.to ? menu.active : menu.icon"
        size="1.5rem"
      />
      <span
        :class="`${props.is_expanded ? 'flex' : 'hidden'}`"
        class="menu-item-text"
      >{{ menu.label }}</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.light .active-nav-item {
  background-color: var(--color-secondary-300);
}

.dark .active-nav-item {
  background-color: var(--color-secondary-600);
}

.light .active-nav-item:hover {
  background-color: var(--color-secondary-200) !important;
}

.dark .active-nav-item:hover {
  background-color: var(--color-secondary-700) !important;
}
</style>
