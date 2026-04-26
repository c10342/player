import { createI18n, I18n } from "vue-i18n";
import { GlobalEventEnum, LangEnum } from "@share/enum";
import zhCN from "@share/locales/zh-CN";
import zhTW from "@share/locales/zh-TW";
import en from "@share/locales/en";
import { defaultLang } from "@share/config";
const messages = {
  [LangEnum.ZhCN]: zhCN,
  [LangEnum.ZhTW]: zhTW,
  [LangEnum.En]: en
};
let i18n: I18n<
  typeof messages,
  Record<string, string>,
  Record<string, string>,
  string,
  false
> | null;

export const initI18n = async () => {
  const lang = await window.electronAPI.getLang();
  i18n = createI18n({
    legacy: false,
    locale: lang,
    fallbackLocale: defaultLang,
    messages: messages
  });

  window.electronAPI.ipcOn(GlobalEventEnum.LangChanged, (_, lang: string) => {
    if (!i18n) return;
    i18n.global.locale.value = lang as LangEnum;
  });
  return i18n;
};

export const changeLang = (lang: string) => {
  // 先通知主进程，主进程广播给所有窗口
  if (lang !== i18n?.global.locale.value) {
    window.electronAPI.setLang(lang);
  }
};
