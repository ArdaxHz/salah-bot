import { defineStore } from "pinia";

export const useOptionsStore = defineStore("options", () => {
  const sidebarExpanded = ref(false);
  const mobile = ref(false);
  return { sidebarExpanded, mobile };
});
