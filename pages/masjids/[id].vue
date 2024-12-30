<script setup>
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const optionsStore = useOptionsStore()
const masjidData = ref(null)
const masjidId = route.params.id
const isLoading = ref(true)
const isError = ref(false)

definePageMeta({
  middleware: 'uuid',
})

useSeoMeta({
  title: formatPageTitle('Masjid'),
  description: 'See more information about the masjid'
})

async function fetchData() {
  isLoading.value = true
  isError.value = false

  if (masjidId) {
    try {
      const masjidResponse = await $fetch(`/api/masjids/${masjidId}`, {
        headers: useRequestHeaders(['cookie']),
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      })

      if (masjidResponse) {
        masjidData.value = masjidResponse.data
      }
      else {
        isError.value = true
        console.error('Unexpected data format:', masjidResponse)
      }
    }
    catch (error) {
      console.error('Error fetching data:', error)
      isError.value = true
    }
    finally {
      isLoading.value = false
    }
  }
}

function anyBadges() {
  return masjidData.value.usage || masjidData.value.sect || masjidData.value.management
}

onMounted(async () => {
  await fetchData()
})
</script>

<template>
  {{ masjidData }}
  <div v-if="masjidData">
    <div class="space-y-2 mb-5">
      <h1 v-if="masjidData.name" class="font-bold text-2xl sm:text-3xl md:text-4xl">
        {{ masjidData.name }}
      </h1>
      <div v-if="anyBadges()" class="flex gap-1 md:gap-2 h-6 sm:h-7">
        <!--        Usage -->
        <UBadge
          v-if="masjidData.usage"
          :label="masjidData.usage"
          :ui="{
            rounded: 'rounded-base',
            size: { sm: 'sm:text-sm' },
            color: {
              primary: {
                solid: 'bg-orange-400 dark:bg-orange-600',
              },
            },
          }"
          class="overflow-hidden align-middle flex items-center justify-center"
        />
        <!--        Sect -->
        <HomeSectBadge v-if="masjidData.sect">
          <template #default>
            {{ masjidData.sect }}
          </template>
        </HomeSectBadge>
        <!--        Management -->
        <UBadge
          v-if="masjidData.management"
          :label="masjidData.management"
          :ui="{
            rounded: 'rounded-base',
            size: { sm: 'sm:text-sm' },
          }"
          class="overflow-hidden align-middle flex items-center justify-center text-[--light-text-color] dark:text-[--dark-text-color] ring-[--color-accent-600] dark:ring-[--color-accent-800]"
          variant="outline"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h2>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis sapien lectus. Morbi quis dignissim mi.
        Mauris volutpat pretium sapien non imperdiet. Sed viverra nulla sed dictum vehicula. Donec auctor tristique
        ipsum, a semper lectus facilisis ut. Suspendisse potenti. Morbi eu quam id erat venenatis mattis quis sed metus.
        Nulla nisl ante, posuere quis mauris vitae, euismod pellentesque mauris. Ut lobortis justo vel lacus pulvinar
        fringilla. Sed dapibus placerat placerat. Sed bibendum egestas congue. Mauris tincidunt erat vitae mauris
        sodales, a congue augue molestie. Sed vel tempor lorem. Curabitur vehicula erat urna.
      </h2>
    </div>
  </div>
</template>
