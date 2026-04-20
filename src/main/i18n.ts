import { LocaleEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";

const messages: Record<string, any> = {
  [LocaleEnum.ZhCN]: zhCN,
  [LocaleEnum.ZhTW]: zhTW,
  [LocaleEnum.En]: en
};

let currentLocale: string = LocaleEnum.ZhCN;

const getNestedValue = (obj: any, path: string): string => {
  const keys = path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return path;
    }
  }
  return typeof result === "string" ? result : path;
};

export const setLocale = (locale: string): void => {
  if (messages[locale]) {
    currentLocale = locale;
  }
};

export const getLocale = (): string => {
  return currentLocale;
};

export const t = (key: string): string => {
  const msg = messages[currentLocale];
  if (!msg) return key;
  return getNestedValue(msg, key);
};
