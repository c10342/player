import i18next from "i18next";
import { LocaleEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";

export const initI18n = () => {
  i18next.init({
    lng: LocaleEnum.ZhCN,
    fallbackLng: LocaleEnum.ZhCN,
    resources: {
      [LocaleEnum.ZhCN]: { translation: zhCN },
      [LocaleEnum.ZhTW]: { translation: zhTW },
      [LocaleEnum.En]: { translation: en }
    }
  });
};

export const setLocale = (locale: string): void => {
  i18next.changeLanguage(locale);
};

export const getLocale = (): string => {
  return i18next.language;
};

export const t = (key: string): string => {
  return i18next.t(key);
};

export default i18next;
