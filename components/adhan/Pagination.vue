<script setup>
import { VueAwesomePaginate } from 'vue-awesome-paginate'

const props = defineProps({ limit: Number, total: Number })
const page = defineModel()
const viewport = useViewport()

const maxPagesToShow = ref(5)

function updateWidth() {
  if (viewport.isLessThan('sm')) {
    maxPagesToShow.value = 1
  }
  else if (viewport.isLessThan('md')) {
    maxPagesToShow.value = 3
  }
  else if (viewport.isLessThan('lg')) {
    maxPagesToShow.value = 5
  }
  else {
    maxPagesToShow.value = 10
  }
}

watch(viewport.breakpoint, () => {
  updateWidth()
})

onMounted(() => {
  updateWidth()
})
</script>

<template>
  <div v-if="total > limit" class="flex justify-center w-full">
    <VueAwesomePaginate
      v-model="page" :items-per-page="limit" :max-pages-shown="maxPagesToShow"
      :show-breakpoint-buttons="false" :show-ending-buttons="true"
      :total-items="total"
      link-url="?page=[page]"
      type="link"
    >
      <template #first-page-button>
        <div class="leading-[0]">
          <Icon class="rotate-180" name="material-symbols:double-arrow-rounded" />
        </div>
      </template>
      <template #prev-button>
        <div class="leading-[0]">
          <Icon name="material-symbols:arrow-back-ios-new-rounded" />
        </div>
      </template>

      <template #next-button>
        <div class="leading-[0]">
          <Icon name="material-symbols:arrow-forward-ios-rounded" />
        </div>
      </template>
      <template #last-page-button>
        <div class="leading-[0]">
          <Icon name="material-symbols:double-arrow-rounded" />
        </div>
      </template>
    </VueAwesomePaginate>
  </div>
</template>

<style>
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;

  font-weight: theme('fontWeight.semibold');
}

.paginate-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: theme('borderRadius.base');

  min-width: 2rem;
  height: 2rem;

  cursor: pointer;
}

.dark .paginate-buttons {
  color: var(--dark-text-color);
}

.light .paginate-buttons {
  color: var(--light-text-color);
}

.light .active-page {
  background-color: var(--color-secondary-300);
}

.dark .active-page {
  background-color: var(--color-secondary-500);
}

.light .active-page:hover {
  background-color: var(--color-secondary-200) !important;
}

.dark .active-page:hover {
  background-color: var(--color-secondary-700) !important;
}

.light .paginate-buttons:hover {
  background-color: var(--color-accent-300);
}

.dark .paginate-buttons:hover {
  background-color: var(--color-accent-600);
}

.back-button,
.next-button,
.first-page-button,
.last-page-button {
  border-radius: theme('borderRadius.full');
}
</style>
