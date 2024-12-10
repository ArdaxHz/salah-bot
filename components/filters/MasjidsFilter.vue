<script setup>
const filters = defineModel()

const sects = ['Barelvi', 'Maudoodi', 'Shia', 'Sufi']
const management = [
  'Arab',
  'Bangladeshi',
  'Pakistani',
  'Students',
  'Tamil',
  'Turkish',
]
const usageTypes = ['Irregular', 'Jumu\'ah Only']
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 w-full">
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
        v-model="filters.distance"
        :ui="{
          rounded: 'rounded-md',
          base: 'sm:w-32',
          color: {
            white: {
              outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--color-accent-200]
                focus:ring-[--color-secondary-300]

                dark:ring-[--color-accent-900]
                dark:focus:ring-[--color-secondary-600]
                `,
            },
          },
        }"
        max="10000"
        min="500"
        step="100"
        type="number"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{
        label: {
          base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
        },
      }"
      label="Sects"
      name="sects"
    >
      <FiltersSelectMenu
        v-model="filters.sects"
        :multiple="true"
        :options="sects"
        class="sm:w-32"
        placeholder="Select Sects"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{
        label: {
          base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
        },
      }"
      label="Management"
      name="management"
    >
      <FiltersSelectMenu
        v-model="filters.management"
        :multiple="true"
        :options="management"
        class="sm:w-32"
        placeholder="Select management"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{
        label: {
          base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
        },
      }"
      label="Usage Type"
      name="usagetypes"
    >
      <FiltersSelectMenu
        v-model="filters.usage"
        :multiple="true"
        :options="usageTypes"
        class="sm:w-32"
        placeholder="Usage Type"
      />
    </UFormGroup>

    <UFormGroup
      :ui="{
        label: {
          base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
        },
      }"
      label="Women Facilities"
      name="womenfacilities"
    >
      <SettingsRadioOptions
        v-model="filters.women"
        :list="[{ label: 'Women Facilities', value: null }]"
      />
    </UFormGroup>
  </div>
</template>
