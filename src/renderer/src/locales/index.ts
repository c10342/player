import { createI18n } from "vue-i18n";
import { LocaleEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";

const i18n = createI18n({
  legacy: false,
  locale: LocaleEnum.ZhCN,
  fallbackLocale: LocaleEnum.ZhCN,
  messages: {
    [LocaleEnum.ZhCN]: zhCN,
    [LocaleEnum.ZhTW]: zhTW,
    [LocaleEnum.En]: en
  }
});

export default i18n;
