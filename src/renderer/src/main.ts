import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import "./assets/styles/index.scss";
import player from "./player";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

window.addEventListener("beforeunload", () => {
  player.destroy();
});
