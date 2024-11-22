<script setup>
const props = defineProps({ list: Array })
const model = defineModel()
</script>

<template>
  <div class="form-radio-group flex-col sm:flex-row">
    <URadio
      v-for="madhab of list"
      :key="madhab.value"
      v-model="model"
      :label="madhab.label"
      :ui="{
        label: `flex cursor-pointer text-md px-3 py-1 rounded-lg
                      ring-1 ring-inset

                      text-[var(--light-text-color)]
                      ring-[var(--light-text-accent-color-hover-light)]
                      hover:ring-[var(--light-text-accent-color-hover-light)]
                      hover:bg-[var(--light-text-accent-color-hover-light)]
                      group-has-[:checked]:bg-[var(--dark-text-secondary-color-hover-light)]
                      group-has-[:checked]:text-[var(--light-text-color)]
                      group-has-[:checked]:ring-[var(--dark-text-secondary-color-hover-light)]
                      group-has-[:checked]:hover:bg-[var(--dark-text-secondary-color-hover)]
                      group-has-[:checked]:hover:ring-[var(--dark-text-secondary-color-hover)]

                      dark:text-[var(--dark-text-color)]
                      dark:ring-[var(--dark-text-accent-color-hover-light)]
                      dark:hover:ring-[var(--dark-text-accent-color-hover-light)]
                      dark:hover:bg-[var(--dark-text-accent-color-hover-light)]
                      dark:group-has-[:checked]:bg-[var(--neutral-secondary-color)]
                      dark:group-has-[:checked]:text-[var(--dark-text-color)]
                      dark:group-has-[:checked]:ring-[var(--neutral-secondary-color)]
                      dark:group-has-[:checked]:hover:bg-[var(--light-text-secondary-color-hover-light)]
                      dark:group-has-[:checked]:hover:ring-[var(--light-text-secondary-color-hover-light)] `,
        inner: 'm-0',
      }"
      class="flex radio-option group"
      v-bind="madhab"
    />
  </div>
</template>

<style scoped></style>
