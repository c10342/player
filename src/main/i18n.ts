import i18next from "i18next";
import { LangEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";
import { getStore, setStore } from "./store";
import { defaultLang } from "@share/config";

export const initI18n = () => {
  const lang = getStore("lang");
  i18next.init({
    lng: lang,
    fallbackLng: defaultLang,
    resources: {
      [LangEnum.ZhCN]: { translation: zhCN },
      [LangEnum.ZhTW]: { translation: zhTW },
      [LangEnum.En]: { translation: en }
    }
  });
};

export const setLang = (lang: string): void => {
  i18next.changeLanguage(lang);
  setStore("lang", lang);
};

export const getLang = (): string => {
  return i18next.language;
};

export const t = (key: string): string => {
  return i18next.t(key);
};

export default i18next;
