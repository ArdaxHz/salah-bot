<script setup>
const props = defineProps({ list: Array })
const model = defineModel()
</script>

<template>
  <div class="form-radio-group flex-wrap">
    <URadio
      v-for="madhab of list"
      :key="madhab.value"
      v-model="model"
      :label="madhab.label"
      :ui="{
        label: `flex cursor-pointer text-md px-3 py-1 rounded-md
                      ring-1 ring-inset

                      text-[--light-text-color]
                      ring-[--color-accent-300]
                      hover:ring-[--color-accent-300]
                      hover:bg-[--color-accent-300]
                      group-has-[:checked]:bg-[--color-secondary-300]
                      group-has-[:checked]:text-[--light-text-color]
                      group-has-[:checked]:ring-[--color-secondary-300]
                      group-has-[:checked]:hover:bg-[--color-secondary-200]
                      group-has-[:checked]:hover:ring-[--color-secondary-200]

                      dark:text-[--dark-text-color]
                      dark:ring-[--color-accent-600]
                      dark:hover:ring-[--color-accent-600]
                      dark:hover:bg-[--color-accent-600]
                      dark:group-has-[:checked]:bg-[--color-secondary-500]
                      dark:group-has-[:checked]:text-[--dark-text-color]
                      dark:group-has-[:checked]:ring-[--color-secondary-500]
                      dark:group-has-[:checked]:hover:bg-[--color-secondary-600]
                      dark:group-has-[:checked]:hover:ring-[--color-secondary-600] `,
        inner: 'm-0',
      }"
      class="flex radio-option group"
      v-bind="madhab"
    />
  </div>
</template>

<style scoped></style>
