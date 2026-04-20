import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/index.scss";
import { log } from "./utils";
import vlcPlayer from "./player";
import i18n from "./locales";

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err, _instance, info) => {
  log.error("[Vue ErrorHandler]", err, info);
};

app.use(pinia);
app.use(i18n);
app.mount("#app");

window.addEventListener("beforeunload", () => {
  vlcPlayer.destroy();
});

window.addEventListener("error", (event) => {
  log.error("[Uncaught Error]", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  log.error("[Unhandled Rejection]", event.reason);
});
