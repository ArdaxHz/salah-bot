<script lang="ts" setup>
const props = defineProps({ size: String })
</script>

<template>
  <UBadge
    :size="size"
    :ui="{
      rounded: 'rounded-base',
      size: { sm: 'sm:text-sm' },
      color: {
        primary: {
          solid: 'bg-[--color-secondary-300] dark:bg-[--color-secondary-500]',
        },
      },
    }"
    class="overflow-hidden align-middle flex items-center justify-center"
  >
    <slot />
  </UBadge>
</template>
