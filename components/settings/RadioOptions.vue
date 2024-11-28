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
                      ring-[--light-text-accent-color-hover-light]
                      hover:ring-[--light-text-accent-color-hover-light]
                      hover:bg-[--light-text-accent-color-hover-light]
                      group-has-[:checked]:bg-[--dark-text-secondary-color-hover-light]
                      group-has-[:checked]:text-[--light-text-color]
                      group-has-[:checked]:ring-[--dark-text-secondary-color-hover-light]
                      group-has-[:checked]:hover:bg-[--dark-text-secondary-color-hover]
                      group-has-[:checked]:hover:ring-[--dark-text-secondary-color-hover]

                      dark:text-[--dark-text-color]
                      dark:ring-[--dark-text-accent-color-hover-light]
                      dark:hover:ring-[--dark-text-accent-color-hover-light]
                      dark:hover:bg-[--dark-text-accent-color-hover-light]
                      dark:group-has-[:checked]:bg-[--neutral-secondary-color]
                      dark:group-has-[:checked]:text-[--dark-text-color]
                      dark:group-has-[:checked]:ring-[--neutral-secondary-color]
                      dark:group-has-[:checked]:hover:bg-[--light-text-secondary-color-hover-light]
                      dark:group-has-[:checked]:hover:ring-[--light-text-secondary-color-hover-light] `,
        inner: 'm-0',
      }"
      class="flex radio-option group"
      v-bind="madhab"
    />
  </div>
</template>

<style scoped></style>
