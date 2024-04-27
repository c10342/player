import ZhCNLang from "./module/zh-CN";
import EnUSLang from "./module/en-US";
import ZhTWLang from "./module/en-US";
import { LangEnum } from "@share/enum";
import { createI18n } from "vue-i18n";

export const messages = {
  [LangEnum.EnUs]: EnUSLang,
  [LangEnum.ZhCN]: ZhCNLang,
  [LangEnum.ZhTW]: ZhTWLang
};

const i18n = createI18n({
  locale: LangEnum.ZhCN,
  fallbackLocale: LangEnum.ZhCN,
  messages,
  legacy: false
});

export default i18n;
