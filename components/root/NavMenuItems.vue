<script setup>
const props = defineProps({
  is_expanded: Boolean
})

const nav = ref([{ label: 'Home', icon: 'mdi:home-outline', to: '/' }])
</script>

<template>
  <div class="flex menu-header flex-col gap-2" :class="`${is_expanded ? 'justify-start items-start' : 'items-center justify-center'}`">
    <NuxtLink v-for="menu in nav" class="menu-item" :class="`${is_expanded ? 'menu-item-expanded ' : ''}`" :to="menu.to">
      <Icon :name="menu.icon" size="1.75rem" /> <span class="menu-item-text" :class="`${props.is_expanded ? 'flex' : 'hidden'}`">{{ menu.label }}</span>
    </NuxtLink>
  </div>
</template>
