<script lang="ts" setup>
import { z } from 'zod'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'

const adhanSettingsStore = useAdhanSettings()

const formRef = ref<FormInst | null>(null)
const model = ref({
  calculationMethod: adhanSettingsStore.method,
  asrTime: adhanSettingsStore.madhab,
  fajrAngle: adhanSettingsStore.fajrAngle,
})
const madhabs = [
  { value: 'shafi', label: 'Early' },
  { value: 'hanafi', label: 'Late' },
]
const calculationMethodOptions = [
  { value: 'MuslimWorldLeague', label: 'Muslim World League' },
  {
    value: 'Egyptian',
    label: 'Egyptian',
  },
  { value: 'Karachi', label: 'Karachi' },
  { value: 'UmmAlQura', label: 'Umm Al Qura' },
  {
    value: 'Dubai',
    label: 'Dubai',
  },
  { value: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  {
    value: 'NorthAmerica',
    label: 'North America',
  },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Singapore', label: 'Singapore' },
  {
    value: 'Tehran',
    label: 'Tehran',
  },
  { value: 'Turkey', label: 'Turkey' },
]

const formSchema = z.object({
  asrTime: z.enum(['shafi', 'hanafi']),
  calculationMethod: z.string().nonempty('Calculation Method is required'),
  fajrAngle: z
    .number()
    .min(12, 'Minimum value is 12')
    .max(20, 'Maximum value is 20'),
})

async function handleSubmit(event) {
  event.preventDefault()
  try {
    formSchema.parse(model.value)
    adhanSettingsStore.$patch({
      method: model.value.calculationMethod,
      madhab: model.value.asrTime,
      fajrAngle: model.value.fajrAngle,
    })
  }
  catch (e) {
    console.error('Form validation error:', e.errors)
  }
}
</script>

<template>
  <div class="flex m-auto items-center justify-center w-full">
    <UForm
      :schema="formSchema"
      :state="model"
      class="flex flex-col gap-2"
      @submit="handleSubmit"
    >
      <UFormGroup
        :ui="{
          label: {
            base: 'text-[var(--light-text-color)] dark:text-[var(--dark-text-color)]',
          },
        }"
        label="Early or Late Asr"
        name="asrTime"
      >
        <div class="form-radio-group">
          <URadio
            v-for="madhab of madhabs"
            :key="madhab.value"
            v-model="model.asrTime"
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
      </UFormGroup>

      <UFormGroup
        :ui="{
          label: {
            base: 'text-[var(--light-text-color)] dark:text-[var(--dark-text-color)]',
          },
        }"
        label="Calculation Method"
        name="calculationMethod"
      >
        <USelect
          v-model="model.calculationMethod"
          :options="calculationMethodOptions"
          :ui="{
            rounded: 'rounded-lg',
            color: {
              white: {
                outline: `bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)]
                focus:ring-2
                ring-[var(--light-text-accent-color-hover)]
                focus:ring-[var(--dark-text-secondary-color-hover-light)]

                dark:ring-[var(--dark-accent-color-dark)]
                dark:focus:ring-[var(--light-text-secondary-color-hover-light)]
                `,
              },
            },
          }"
        />
      </UFormGroup>

      <UFormGroup
        :ui="{
          label: {
            base: 'text-[var(--light-text-color)] dark:text-[var(--dark-text-color)]',
          },
        }"
        label="Fajr Angle"
        name="fajrAngle"
      >
        <UInput
          v-model="model.fajrAngle"
          :ui="{
            rounded: 'rounded-lg',
            color: {
              white: {
                outline: `bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)]
                focus:ring-2
                ring-[var(--light-text-accent-color-hover)]
                focus:ring-[var(--dark-text-secondary-color-hover-light)]

                dark:ring-[var(--dark-accent-color-dark)]
                dark:focus:ring-[var(--light-text-secondary-color-hover-light)]
                `,
              },
            },
          }"
          max="20"
          min="12"
          step="0.5"
          type="number"
        />
      </UFormGroup>

      <UButton
        :ui="{
          rounded: 'rounded-lg',
          inline: `flex justify-center font-bold text-sm
            text-[var(--light-text-color)]
            dark:text-[var(--dark-text-color)]`,
        }"
        type="submit"
      >
        Save
      </UButton>
    </UForm>
  </div>
</template>

<style>
.dark .n-form-item .n-form-item-label {
  --n-label-text-color: var(--dark-text-color) !important;
}

.light .n-form-item .n-form-item-label {
  --n-label-text-color: var(--light-text-color) !important;
}

.dark .save-adhan-setting-button .n-button {
  background-color: red !important;
}

.form-radio-group {
  display: flex;
  gap: 0.25rem;
}

.form-radio-group input[type="radio"] {
  display: none;
  margin: 0;
}
</style>
