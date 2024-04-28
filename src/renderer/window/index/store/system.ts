import { LangEnum } from "@share/enum";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSystemStore = defineStore("system", () => {
  const lang = ref<LangEnum>(LangEnum.ZhCN);
  return { lang };
});
