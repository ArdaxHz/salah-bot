<script setup>
const props = defineProps({
  is_expanded: Boolean,
  navItems: Object,
})
</script>

<template>
  <div
    :class="`${
      is_expanded ? 'justify-start items-start' : 'items-center justify-center'
    }`"
    class="flex menu-header flex-col"
  >
    <NuxtLink
      v-for="menu in navItems"
      :class="`${is_expanded ? 'menu-item-expanded ' : ''}`"
      :to="menu.to"
      class="menu-item"
    >
      <Icon :name="menu.icon" size="1.5rem" />
      <span
        :class="`${props.is_expanded ? 'flex' : 'hidden'}`"
        class="menu-item-text"
      >{{ menu.label }}</span>
    </NuxtLink>
  </div>
</template>
