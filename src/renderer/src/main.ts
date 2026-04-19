import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/index.scss";
import { log } from "./utils";
import player from "./player";

const app = createApp(App);
const pinia = createPinia();

app.config.errorHandler = (err, _instance, info) => {
  log.error("[Vue ErrorHandler]", err, info);
};

app.use(pinia);
app.mount("#app");

window.addEventListener("beforeunload", () => {
  player.destroy();
});

window.addEventListener("error", (event) => {
  log.error("[Uncaught Error]", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  log.error("[Unhandled Rejection]", event.reason);
});
