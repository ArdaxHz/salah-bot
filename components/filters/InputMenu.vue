<script lang="ts" setup>
const props = defineProps({
  options: Array,
  multiple: { default: false, type: Boolean },
  placeholder: { required: false, type: String },
  labelAttribute: { required: false, type: String },
  valueAttribute: { required: false, type: String },
})

const model = defineModel()
</script>

<template>
  <USelectMenu
    v-model="model"
    :label-attribute="labelAttribute"
    :multiple="multiple"
    :options="options"
    :placeholder="placeholder"
    :ui="{
      rounded: 'rounded-md',
      color: {
        white: {
          outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--color-accent-200]
                focus:ring-[--color-secondary-300]

                dark:ring-[--color-accent-900]
                dark:focus:ring-[--color-secondary-600]`,
        },
      },
    }"
    :ui-menu="{
      background: 'bg-[--light-bg-color] dark:bg-[--dark-bg-color]',
      ring: `ring-[--color-secondary-200]
                focus:ring-[--color-secondary-300]

                dark:ring-[--color-secondary-900]
                dark:focus:ring-[--color-secondary-600]`,
    }"
    :value-attribute="valueAttribute"
  />
</template>

<style scoped></style>
