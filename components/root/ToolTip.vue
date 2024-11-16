<script setup>
const props = defineProps({ text: String })
</script>

<template>
  <UTooltip
    :popper="{ arrow: true }"
    :text="text"
    :ui="{
      base: 'sm:text-sm',
      background: 'bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)]',
      ring: 'ring-[var(--neutral-secondary-color)] dark:ring-[var(--neutral-secondary-color)]',
      arrow: {
        background:
          'before:bg-[var(--light-bg-color)] dark:before:bg-[var(--dark-bg-color)]',
        ring: 'before:ring-[var(--neutral-secondary-color)] dark:before:ring-[var(--neutral-secondary-color)]',
      },
    }"
  >
    <slot name="content" />
  </UTooltip>
</template>
