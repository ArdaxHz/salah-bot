<script setup lang="ts">
import type { FormInst } from 'naive-ui'
import { useMessage } from 'naive-ui'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'

const adhanSettingsStore = useAdhanSettings()

const formRef = ref<FormInst | null>(null)
const message = useMessage()
const model = ref({
  calculationMethod: adhanSettingsStore.method,
  asrTime: adhanSettingsStore.madhab,
  fajrAngle: adhanSettingsStore.fajrAngle,
})
const calculationMethodOptions = [{ id: 'MuslimWorldLeague', name: 'Muslim World League' }, { id: 'Egyptian', name: 'Egyptian' }, { id: 'Karachi', name: 'Karachi' }, { id: 'UmmAlQura', name: 'Umm Al Qura' }, { id: 'Dubai', name: 'Dubai' }, { id: 'MoonsightingCommittee', name: 'Moonsighting Committee' }, { id: 'NorthAmerica', name: 'North America' }, { id: 'Kuwait', name: 'Kuwait' }, { id: 'Qatar', name: 'Qatar' }, { id: 'Singapore', name: 'Singapore' }, { id: 'Tehran', name: 'Tehran' }, { id: 'Turkey', name: 'Turkey' }].map(
  v => ({
    label: v.name,
    value: v.id
  })
)
function handleValidateButtonClick(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      adhanSettingsStore.$patch({ method: model.value.calculationMethod, madhab: model.value.asrTime, fajrAngle: model.value.fajrAngle })
      message.success('Saved')
    }
    else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="flex m-auto items-center justify-center w-full">
    <n-form
      ref="formRef"
      :model="model"
      label-placement="top"
    >
      <n-grid :cols="1" class="flex items-center w-full justify-center">
        <n-form-item-gi :span="12" label="Early or Late Asr" path="asrTime">
          <n-switch v-model:value="model.asrTime" :round="false" checked-value="shafi" unchecked-value="hanafi">
            <template #checked>
              Early
            </template>
            <template #unchecked>
              Late
            </template>
          </n-switch>
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Calculation Method" path="calculationMethod">
          <n-select
            v-model:value="model.calculationMethod"
            :options="calculationMethodOptions"
          />
        </n-form-item-gi>
        <n-form-item-gi :span="12" label="Fajr Angle" path="fajrAngle">
          <n-input-number v-model:value="model.fajrAngle" max="20" min="12" step="0.5" />
        </n-form-item-gi>
        <n-gi>
          <div>
            <n-button type="primary" class="rounded-md w-full" secondary strong @click="handleValidateButtonClick">
              Save
            </n-button>
          </div>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
  <pre>{{ JSON.stringify(model, null, 2) }}
</pre>
</template>

<style>
.dark .n-form-item .n-form-item-label {
--n-label-text-color: #FFF !important;
}
.light .n-form-item .n-form-item-label {
--n-label-text-color: #000 !important;
}
</style>
