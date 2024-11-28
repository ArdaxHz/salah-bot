<script setup>
const distance = defineModel()
</script>

<template>
  <div class="w-full">
    <UFormGroup
      :ui="{
        label: {
          base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
        },
      }"
      label="Max distance (metres)"
      name="distance"
    >
      <UInput
        v-model="distance"
        :ui="{
          rounded: 'rounded-md',
          color: {
            white: {
              outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--light-text-accent-color-hover]
                focus:ring-[--dark-text-secondary-color-hover-light]

                dark:ring-[--dark-accent-color-dark]
                dark:focus:ring-[--light-text-secondary-color-hover-light]
                `,
            },
          },
        }"
        max="7000"
        min="500"
        step="100"
        type="number"
      />
    </UFormGroup>
  </div>
</template>
