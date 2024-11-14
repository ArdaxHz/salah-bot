<script setup>
const props = defineProps({
  is_expanded: Boolean,
})

const nav = ref([
  { label: 'Home', icon: 'material-symbols:home-outline-rounded', to: '/' },
])
</script>

<template>
  <div
    :class="`${
      is_expanded ? 'justify-start items-start' : 'items-center justify-center'
    }`"
    class="flex menu-header flex-col gap-2"
  >
    <NuxtLink
      v-for="menu in nav"
      :class="`${is_expanded ? 'menu-item-expanded ' : ''}`"
      :to="menu.to"
      class="menu-item"
    >
      <Icon :name="menu.icon" size="1.75rem" />
      <span
        :class="`${props.is_expanded ? 'flex' : 'hidden'}`"
        class="menu-item-text"
      >{{ menu.label }}</span>
    </NuxtLink>
  </div>
</template>
