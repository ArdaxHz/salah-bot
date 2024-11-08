<script setup lang="ts">
const supabase = useSupabaseClient()
const email = ref('')

async function signInAnonymously() {
  const { error } = await supabase.auth.signInAnonymously()
  if (error) { console.log(error) }
}
</script>

<template>
  <div>
    <button @click="signInAnonymously">
      Sign In Anonymously
    </button>
  </div>
</template>
