import i18n from "@renderer/locales";
import log from "./logger";
import { GlobalEventEnum, LocaleEnum } from "@share/enum";
import { DefineComponent, createApp as createVueApp } from "vue";
import "../assets/styles/index.scss";

export const createApp = (App: DefineComponent<any, any, any>) => {
  const app = createVueApp(App);
  app.use(i18n);

  app.config.errorHandler = (err, _instance, info) => {
    log.error("[Vue ErrorHandler]", err, info);
  };
  window.addEventListener("error", (event) => {
    log.error("[Uncaught Error]", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    log.error("[Unhandled Rejection]", event.reason);
  });
  window.electronAPI.ipcOn(GlobalEventEnum.LocaleChanged, (_, locale: string) => {
    i18n.global.locale.value = locale as LocaleEnum;
  });

  return app;
};
