<script lang="ts" setup>
const props = defineProps({
  label: String,
})
</script>

<template>
  <UBadge
    :ui="{
      rounded: 'rounded-base',
      color: {
        primary: {
          solid: 'bg-[--color-secondary-300] dark:bg-[--color-secondary-500]',
        },
      },
    }"
    class="overflow-hidden align-middle flex items-center justify-center"
  >
    <RootToolTip :key="props.label" :text="props.label">
      <template #content>
        {{ label.slice(0, 1) }}
      </template>
    </RootToolTip>
  </UBadge>
</template>
