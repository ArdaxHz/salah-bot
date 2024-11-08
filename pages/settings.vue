<script setup>
</script>

<template>
  <n-tabs
    size="large" justify-content="space-evenly" class="card-tabs" animated
  >
    <n-tab-pane name="Adhan Calculator Settings" tab="Adhan">
      <n-message-provider>
        <SettingsAdhanSettings />
      </n-message-provider>
    </n-tab-pane>
    <n-tab-pane name="signup" tab="Sign up">
      <n-form>
        <n-form-item-row label="Username">
          <n-input />
        </n-form-item-row>
        <n-form-item-row label="Password">
          <n-input />
        </n-form-item-row>
        <n-form-item-row label="Reenter Password">
          <n-input />
        </n-form-item-row>
      </n-form>
      <n-button type="primary" block secondary strong>
        Sign up
      </n-button>
    </n-tab-pane>
  </n-tabs>
</template>

<style>
.n-tabs {
    --n-bar-color: theme('colors.mulled.500') !important;
    --n-tab-text-color: theme('colors.mulled.700') !important;
    --n-tab-text-color-active: theme('colors.mulled.500') !important;
    --n-tab-text-color-hover: theme('colors.mulled.300') !important;
}
</style>
