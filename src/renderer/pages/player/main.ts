import { createPinia } from "pinia";
import App from "./App.vue";
import vlcPlayer from "./player";
import { createApp } from "@renderer/utils";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

window.addEventListener("beforeunload", () => {
  vlcPlayer.destroy();
});
