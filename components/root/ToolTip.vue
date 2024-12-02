<script setup>
const props = defineProps({ text: String })
const TooltipSlot = ref(null)
const isTooltipVisible = ref(false)

function toggleTooltip() {
  isTooltipVisible.value = !isTooltipVisible.value
  TooltipSlot.value.container = 'w-full h-full'
}
</script>

<template>
  <div :class="[isTooltipVisible && 'show-tooltip']">
    <UTooltip
      ref="TooltipSlot"
      :open="isTooltipVisible"
      :popper="{ arrow: true, adaptive: true, resize: true }"
      :text="text"
      :ui="{
        rounded: 'rounded-sm',
        base: 'sm:text-sm [@media(pointer:coarse]:!block flex items-center justify-center',
        background: 'bg-[--color-accent-200] dark:bg-[--color-accent-700]',
        ring: 'ring-0 dark:ring-0',
        arrow: {
          background:
            'before:bg-[--color-accent-200] dark:before:bg-[--color-accent-700] [@media(pointer:coarse]:!block',
          ring: 'before:ring-0 dark:before:ring-0',
        },
      }"
      @mouseenter="toggleTooltip"
    >
      <slot name="content" />
    </UTooltip>
  </div>
</template>

<style>
.show-tooltip > * {
  @media (pointer: coarse) {
    .\[\@media\(pointer\:coarse\)\]\:hidden {
      display: block;
    }
  }
}
</style>
