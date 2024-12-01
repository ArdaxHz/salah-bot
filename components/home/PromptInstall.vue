<script setup>
const installable = ref(false)
const deferredPrompt = ref(null)

function handleBeforeInstallPrompt(e) {
  e.preventDefault()
  deferredPrompt.value = e
  installable.value = true
  return false
}

function handleAppInstalled() {
  console.log('INSTALL: Success')
}

function handleInstallClick() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        deferredPrompt.value = null
        installable.value = false
        console.log('User accepted the install prompt')
      }
      else {
        console.log('User dismissed the install prompt')
      }
    })
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<template>
  <div>
    <button v-if="installable" class="menu-item" @click="handleInstallClick">
      <Icon name="material-symbols:app-shortcut-outline-rounded" size="2rem" />
    </button>
  </div>
</template>
