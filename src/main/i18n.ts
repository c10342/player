import i18next from "i18next";
import { LocaleEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";
import { getStore, setStore } from "./store";
import { defaultLang } from "@share/config";

export const initI18n = () => {
  const savedLocale = getStore("locale");
  i18next.init({
    lng: savedLocale,
    fallbackLng: defaultLang,
    resources: {
      [LocaleEnum.ZhCN]: { translation: zhCN },
      [LocaleEnum.ZhTW]: { translation: zhTW },
      [LocaleEnum.En]: { translation: en }
    }
  });
};

export const setLocale = (locale: string): void => {
  i18next.changeLanguage(locale);
  setStore("locale", locale);
};

export const getLocale = (): string => {
  return i18next.language;
};

export const t = (key: string): string => {
  return i18next.t(key);
};

export default i18next;
