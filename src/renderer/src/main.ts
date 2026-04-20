import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/index.scss";
import { log } from "./utils";
import vlcPlayer from "./player";
import i18n from "./locales";
import { GlobalEventEnum, LocaleEnum } from "@share/enum";

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err, _instance, info) => {
  log.error("[Vue ErrorHandler]", err, info);
};

app.use(pinia);
app.use(i18n);
app.mount("#app");

window.electronAPI.ipcOn(GlobalEventEnum.LocaleChanged, (_, locale: string) => {
  i18n.global.locale.value = locale as LocaleEnum;
});

window.addEventListener("beforeunload", () => {
  vlcPlayer.destroy();
});

window.addEventListener("error", (event) => {
  log.error("[Uncaught Error]", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  log.error("[Unhandled Rejection]", event.reason);
});
