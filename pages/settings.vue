<script setup>
import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()
const supabase = createClient(config.public.SUPABASE_URL, config.public.SUPABASE_ANON_KEY)

const { data, error } = await supabase.functions.invoke('search-masjids', { body: JSON.stringify({ lat: 51.5428223, long: 0.0880792 }) })
</script>

<template>
  <p>{{ data }}</p>
  <p>{{ error }}</p>
</template>
