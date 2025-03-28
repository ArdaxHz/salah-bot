<script setup>
const viewport = useViewport()
const optionsStore = useOptionsStore()
const locationStore = useLocationStore()
const { locationAccess } = storeToRefs(locationStore)
const { sidebarExpanded, mobile } = storeToRefs(optionsStore)

function ToggleMenuOff() {
  if (sidebarExpanded.value && viewport.isLessThan('lg')) {
    sidebarExpanded.value = false
  }
}

updateBreakpoints()

watch(viewport.breakpoint, () => {
  updateBreakpoints()
})

function updateBreakpoints() {
  mobile.value = !!viewport.isLessThan('sm')
  //   if (mobile.value && sidebarExpanded.value) {
  //     sidebarExpanded.value = false
  //   }
  //   if (!mobile.value) {
  //     sidebarExpanded.value = true
  //   }
}

const validLocation = computed(() => {
  return !locationAccess
})
</script>

<template>
  <div class="root-container">
    <NuxtLoadingIndicator color="#9081d3" />
    <!--    <div class="top-announcement-container" /> -->
    <div class="sidebar-container">
      <LayoutSidebar />
    </div>
    <div class="top-content-container">
      <div class="header-container">
        <LayoutHeader />
      </div>
      <div class="main-content-container" @mousedown="ToggleMenuOff">
        <ClientOnly>
          <div
            v-if="!locationAccess"
            :key="validLocation"
            class="content-announcement-container font-bold text-xl sm:text-2xl text-center"
          >
            <p v-if="!locationAccess" class="!text-[--error-color-text]">
              Please enable location access for this site to work correctly.
              Press the location pin button in the header to update your
              location. on the
            </p>
          </div>
        </ClientOnly>
        <div class="content-container">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.root-container {
  display: grid;
  grid-template-columns: [sidebar-container] min-content [top-content-container] auto;
  grid-template-areas:
    /*"top-announcement-container top-announcement-container"*/ "sidebar-container top-content-container";
  justify-items: stretch;
}

.top-announcement-container {
  grid-area: top-announcement-container;
  width: 0;
}

.sidebar-container {
  grid-area: sidebar-container;
}

.content-announcement-container {
  grid-area: content-announcement-container;
}

.header-container {
  grid-area: header-container;
  position: sticky !important;
  top: 0;
  line-height: 0;
  z-index: 9;
  width: 100%;
}

.main-content-container {
  grid-area: main-content-container;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;

  max-width: 80rem;

  padding: 0.5rem 0.75rem;
  margin-top: 1rem;

  margin-bottom: 2rem;
}

.content-container {
  height: calc(100vh - var(--header-height));
}

@media (min-width: 640px) {
  .main-content-container {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-bottom: 3rem;
    margin-top: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .main-content-container {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

.main-content-container > * {
  height: 100%;
  width: 100%;
}

.root-container {
  display: grid;
  height: 100svh;

  overflow-y: auto;
}

.top-content-container {
  display: grid;
  grid-template-rows: [header-container] var(--header-height) [main-content-container] auto;
  grid-template-areas:
    "header-container"
    "main-content-container";
  height: 100%;
  width: 100%;

  justify-items: center;
  align-items: start;
}

@media all and (display-mode: standalone) and (max-width: 640px) {
  .top-content-container {
    grid-template-rows: [main-content-container] auto [header-container] var(
        --header-height
      );
    grid-template-areas:
      "main-content-container"
      "header-container";
  }

  .header-container {
    bottom: 0;
  }

  .main-content-container {
    margin-top: 3rem;
  }
}
</style>
