import { initI18n } from "@renderer/locales";
import log, { initLogger } from "./logger";
import { DefineComponent, createApp as createVueApp } from "vue";
import "../assets/styles/index.scss";
import { initContextMenu } from "@renderer/components/ContextMenu/contextMenu";

export const createApp = async (App: DefineComponent<any, any, any>) => {
  initLogger();
  const app = createVueApp(App);
  const i18n = await initI18n();
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

  initContextMenu();

  return app;
};
