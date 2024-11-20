<script setup>
const props = defineProps({
  expandedMenu: Boolean,
  expandedMenuVal: Number,
  is_mobile: Boolean,
  is_smaller_mobile: Boolean,
  mobile_break: Boolean,
})

const emits = defineEmits(['ToggleMenu'])

function ToggleMenu(val) {
  emits('ToggleMenu', val)
}

function handleMouseDown() {
  if (props.expandedMenu && props.is_mobile) {
    ToggleMenu(false)
  }
}
</script>

<template>
  <div class="root-container">
    <NuxtLoadingIndicator color="#9081d3" />
    <!--    <div class="top-announcement-container" /> -->
    <div class="sidebar-container">
      <RootSidebarLoggedOut
        :expanded-menu="expandedMenu"
        :expanded-menu-val="expandedMenuVal"
        :is_mobile="is_mobile"
        :is_smaller_mobile="is_smaller_mobile"
        @toggle-menu="ToggleMenu"
      />
    </div>
    <div class="top-content-container">
      <div class="header-container">
        <RootHeaderLoggedOut
          :expanded-menu="expandedMenu"
          :expanded-menu-val="expandedMenuVal"
          :is_mobile="is_mobile"
          :is_smaller_mobile="is_smaller_mobile"
          @toggle-menu="ToggleMenu"
        />
      </div>
      <div class="main-content-container">
        <div class="content-announcement-container" />
        <div class="content-container" @mousedown="handleMouseDown">
          <slot :mobile_break="mobile_break" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.root-container {
  display: grid;
  grid-template-columns: [sidebar-container] min-content [top-content-container] auto;
  grid-template-areas: "sidebar-container top-content-container";
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

  max-width: 80rem;

  padding: 0.5rem 0.75rem;
  margin-top: 1rem;

  margin-bottom: 2rem;
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
  height: 100dvh;

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
</style>
