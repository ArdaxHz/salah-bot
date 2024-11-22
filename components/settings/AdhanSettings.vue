<script lang="ts" setup>
import { z } from "zod";
import { useAdhanSettings } from "@/composables/stores/adhanSettings";

const adhanSettingsStore = useAdhanSettings();
const model = ref({ ...adhanSettingsStore.params() });
const madhabs = [
  { value: "shafi", label: "Early", hint: "Earlier Asr time" },
  { value: "hanafi", label: "Late", hint: "Later Asr time" },
];
const calculationMethodOptions = [
  {
    value: "MuslimWorldLeague",
    label: "Muslim World League",
    hint: "Muslim World League. Standard Fajr time with an angle of 18°. Earlier Isha time with an angle of 17°.",
  },
  {
    value: "Egyptian",
    label: "Egyptian",
    hint: "Egyptian General Authority of Survey. Early Fajr time using an angle 19.5° and a slightly earlier Isha time using an angle of 17.5°.",
  },
  {
    value: "Karachi",
    label: "Karachi",
    hint: "University of Islamic Sciences, Karachi. A generally applicable method that uses standard Fajr and Isha angles of 18°.",
  },
  {
    value: "UmmAlQura",
    label: "Umm Al Qura",
    hint: "Umm al-Qura University, Makkah. Uses a fixed interval of 90 minutes from maghrib to calculate Isha. And a slightly earlier Fajr time with an angle of 18.5°. Note: you should add a +30 minute custom adjustment for Isha during Ramadan.",
  },
  {
    value: "Dubai",
    label: "Dubai",
    hint: "Used in the UAE. Slightly earlier Fajr time and slightly later Isha time with angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib.",
  },
  {
    value: "Qatar",
    label: "Qatar",
    hint: "Same Isha interval as Umm al-Qura but with the standard Fajr time using an angle of 18°.",
  },
  {
    value: "MoonsightingCommittee",
    label: "Moonsighting Committee",
    hint: "Method developed by Khalid Shaukat, founder of Moonsighting Committee Worldwide. Uses standard 18° angles for Fajr and Isha in addition to seasonal adjustment values. This method automatically applies the 1/7 approximation rule for locations above 55° latitude. Recommended for North America and the UK.",
  },
  {
    value: "NorthAmerica",
    label: "North America",
    hint: "Also known as the ISNA method. Can be used for North America, but the moonsightingCommittee method is preferable. Gives later Fajr times and early Isha times with angles of 15°.",
  },
  {
    value: "Kuwait",
    label: "Kuwait",
    hint: "Standard Fajr time with an angle of 18°. Slightly earlier Isha time with an angle of 17.5°.",
  },
  {
    value: "Singapore",
    label: "Singapore",
    hint: "Used in Singapore, Malaysia, and Indonesia. Early Fajr time with an angle of 20° and standard Isha time with an angle of 18°.",
  },
  {
    value: "Tehran",
    label: "Tehran",
    hint: "Institute of Geophysics, University of Tehran. Early Isha time with an angle of 14°. Slightly later Fajr time with an angle of 17.7°. Calculates Maghrib based on the sun reaching an angle of 4.5° below the horizon.",
  },
  {
    value: "Turkey",
    label: "Turkey",
    hint: "An approximation of the Diyanet method used in Turkey. This approximation is less accurate outside the region of Turkey.",
  },
  {
    value: "Other",
    label: "Other",
    hint: "Defaults to angles of 0°, should generally be used for making a custom method and setting your own values.",
  },
];
const roundingOptions = [
  { value: "nearest", label: "Nearest", hint: "Rounds to nearest minute." },
  {
    value: "up",
    label: "Up",
    hint: "Rounds up to higher minute.",
  },
  { value: "none", label: "None", hint: "Doesn't round." },
];
const highLatitudeRuleOptions = [
  {
    value: "middleofthenight",
    label: "Middle of the Night",
    hint: "Fajr will never be earlier than the middle of the night and Isha will never be later than the middle of the night.",
  },
  {
    value: "seventhofthenight",
    label: "Seventh of the Night",
    hint: "Fajr will never be earlier than the beginning of the last seventh of the night and Isha will never be later than the end of the first seventh of the night. This is recommended to use for locations above 48° latitude to prevent prayer times that would be difficult to perform.",
  },
  {
    value: "twilightangle",
    label: "Twilight Angle",
    hint: "The night is divided into portions of roughly 1/3. The exact value is derived by dividing the fajr/isha angles by 60. This can be used to prevent difficult fajr and isha times at certain locations.",
  },
  {
    value: "recommended",
    label: "Recommended",
    hint: "Uses your location to find the optimal High Latitude Rule.",
  },
];
const polarCircleResolutionOptions = [
  {
    value: "AqrabBalad",
    label: "AqrabBalad",
    hint: "Finds the closest location for which sunrise and sunset prayer times can be computed.",
  },
  {
    value: "AqrabYaum",
    label: "AqrabYaum",
    hint: "Finds the closest date (forward or backward) for which sunrise and sunset prayer times can be computed.",
  },
  {
    value: "Unresolved",
    label: "Empty",
    hint: "(default) Leaves sunrise and sunset prayer times empty when they can't be computed.",
  },
];
const shafaqOptions = [
  {
    value: "general",
    label: "General",
    hint: "General is a combination of Ahmer and Abyad. This is the defualt value and will provide more reasonable times for locations at higher latitudes.",
  },
  {
    value: "ahmer",
    label: "Ahmer",
    hint: "Ahmer means the twilight is the red glow in the sky. Used by the Shafi, Maliki, and Hanbali madhabs. This generally produces an earlier Isha time.",
  },
  {
    value: "abyad",
    label: "Abyad",
    hint: "Abyad means the twilight is the white glow in the sky. Used by the Hanafi madhab. This generally produces a later Isha time.",
  },
];

const formSchema = z.object({
  madhab: z.enum(["shafi", "hanafi"]),
  rounding: z.enum(["nearest", "up", "none"]),
  highLatitudeRule: z.enum([
    "middleofthenight",
    "seventhofthenight",
    "twilightangle",
    "recommended",
  ]),
  polarCircleResolution: z.enum(["AqrabBalad", "AqrabYaum", "Unresolved"]),
  shafaq: z.enum(["general", "ahmer", "abyad"]),
  calculationMethod: z.string().nonempty("Calculation Method is required"),
  fajrAngle: z
    .number()
    .min(12, "Minimum value is 12")
    .max(20, "Maximum value is 20"),
  ishaAngle: z
    .number()
    .min(12, "Minimum value is 12")
    .max(20, "Maximum value is 20"),
  adjustments: z.object({
    fajr: z.number(),
    sunrise: z.number(),
    dhuhr: z.number(),
    asr: z.number(),
    maghrib: z.number(),
    isha: z.number(),
  }),
});

async function handleSubmit(event) {
  event.preventDefault();
  try {
    formSchema.parse(model.value);
    adhanSettingsStore.$patch({ ...model.value });
  } catch (e) {
    console.error("Form validation error:", e.errors);
  }
}
</script>

<template>
  <div class="flex items-center justify-center flex-col gap-4">
    <UForm
      :schema="formSchema"
      :state="model"
      class="flex flex-col gap-4"
      @submit="handleSubmit"
    >
      <UFormGroup
        :ui="{
          label: {
            base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
          },
        }"
        label="Early or Late Asr"
        name="madhab"
      >
        <div class="form-radio-group">
          <SettingsRadioOptions v-model="model.madhab" :list="madhabs" />
        </div>
      </UFormGroup>

      <UFormGroup
        :ui="{
          label: {
            base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
          },
        }"
        label="Calculation Method"
        name="calculationMethod"
      >
        <UInputMenu
          v-model="model.calculationMethod"
          :options="calculationMethodOptions"
          :ui="{
            rounded: 'rounded-lg',
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
          label-attribute="label"
          value-attribute="value"
        />
      </UFormGroup>

      <UFormGroup
        :ui="{
          label: {
            base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
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
          max="20"
          min="12"
          step="0.5"
          type="number"
        />
      </UFormGroup>

      <div class="collapse collapse-plus">
        <input type="checkbox" />
        <div class="collapse-title sm:text-xl font-semibold">
          Advanced Settings
        </div>
        <div class="collapse-content flex flex-col gap-4 px-0">
          <UFormGroup
            :ui="{
              label: {
                base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
              },
            }"
            label="Isha Angle"
            name="ishaAngle"
          >
            <UInput
              v-model="model.ishaAngle"
              :ui="{
                rounded: 'rounded-lg',
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
              max="20"
              min="12"
              step="0.5"
              type="number"
            />
          </UFormGroup>

          <!--          <UFormGroup -->
          <!--            :ui="{ -->
          <!--              label: { -->
          <!--                base: 'text-[&#45;&#45;light-text-color] dark:text-[&#45;&#45;dark-text-color]', -->
          <!--              }, -->
          <!--            }" -->
          <!--            label="Isha Interval" -->
          <!--            name="ishaInterval" -->
          <!--          > -->
          <!--            <UInput -->
          <!--              v-model="model.ishaInterval" -->
          <!--              :ui="{ -->
          <!--                rounded: 'rounded-lg', -->
          <!--                color: { -->
          <!--                  white: { -->
          <!--                    outline: `bg-[&#45;&#45;light-bg-color] dark:bg-[&#45;&#45;dark-bg-color] -->
          <!--                          focus:ring-2 -->
          <!--                          ring-[&#45;&#45;light-text-accent-color-hover] -->
          <!--                          focus:ring-[&#45;&#45;dark-text-secondary-color-hover-light] -->

          <!--                          dark:ring-[&#45;&#45;dark-accent-color-dark] -->
          <!--                          dark:focus:ring-[&#45;&#45;light-text-secondary-color-hover-light] -->
          <!--                          `, -->
          <!--                  }, -->
          <!--                }, -->
          <!--              }" -->
          <!--              max="20" -->
          <!--              min="0" -->
          <!--              step="1" -->
          <!--              type="number" -->
          <!--            /> -->
          <!--          </UFormGroup> -->

          <UFormGroup
            :ui="{
              label: {
                base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
              },
            }"
            label="Minute Rounding"
            name="rounding"
          >
            <div class="form-radio-group">
              <SettingsRadioOptions
                v-model="model.rounding"
                :list="roundingOptions"
              />
            </div>
          </UFormGroup>

          <UFormGroup
            :ui="{
              label: {
                base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
              },
            }"
            label="High Latitude Rule"
            name="highLatitudeRule"
          >
            <USelectMenu
              v-model="model.highLatitudeRule"
              :options="highLatitudeRuleOptions"
              :ui="{
                rounded: 'rounded-lg',
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
              label-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>

          <UFormGroup
            :ui="{
              label: {
                base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
              },
            }"
            label="Polar Circle Resolution"
            name="polarCircleResolution"
          >
            <USelectMenu
              v-model="model.polarCircleResolution"
              :options="polarCircleResolutionOptions"
              :ui="{
                rounded: 'rounded-lg',
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
              label-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>

          <UFormGroup
            :ui="{
              label: {
                base: 'text-[--light-text-color] dark:text-[--dark-text-color]',
              },
            }"
            label="Shafaq"
            name="shafaq"
          >
            <USelectMenu
              v-model="model.shafaq"
              :options="shafaqOptions"
              :ui="{
                rounded: 'rounded-lg',
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
              label-attribute="label"
              value-attribute="value"
            />
          </UFormGroup>

          <div class="flex flex-col gap-2">
            <p class="font-medium text-sm">Manual Adjustments</p>
            <div
              v-for="(_, prayer) in model.adjustments"
              :key="prayer"
              class="flex flex-col sm:flex-row justify-between w-full"
            >
              <p class="w-10/12">
                {{ capitalizeFirstLetter(prayer) }}
              </p>
              <UInput
                v-model="model.adjustments[prayer]"
                :ui="{
                  rounded: 'rounded-lg',
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
                step="1"
                type="number"
              />
            </div>
          </div>
        </div>
      </div>

      <UButton
        :ui="{
          rounded: 'rounded-lg',
          inline: `flex justify-center font-bold text-sm
            text-[--light-text-color]
            dark:text-[--dark-text-color]`,
        }"
        type="submit"
        @click.prevent="handleSubmit"
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
