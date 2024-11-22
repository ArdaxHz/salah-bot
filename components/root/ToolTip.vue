<script setup>
const props = defineProps({ text: String })
</script>

<template>
  <UTooltip
    :popper="{ arrow: true }"
    :text="text"
    :ui="{
      base: 'sm:text-sm [@media(pointer:coarse]:!block flex items-center justify-center',
      background: 'bg-[--light-bg-color] dark:bg-[--dark-bg-color]',
      ring: 'ring-[--neutral-secondary-color] dark:ring-[--neutral-secondary-color]',
      arrow: {
        background:
          'before:bg-[--light-bg-color] dark:before:bg-[--dark-bg-color]',
        ring: 'before:ring-[--neutral-secondary-color] dark:before:ring-[--neutral-secondary-color]',
      },
    }"
  >
    <slot name="content" />
  </UTooltip>
</template>
