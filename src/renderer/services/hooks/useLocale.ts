import { useI18n } from "vue-i18n";
import { messages } from "@renderer/locale";

export const useLocale = () => {
  return useI18n<{ messages: typeof messages }>();
};
