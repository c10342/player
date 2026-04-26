import { createPinia } from "pinia";
import App from "./App.vue";
import vlcPlayer from "./player";
import { createApp } from "@renderer/utils";

const init = async () => {
  const app = await createApp(App);
  const pinia = createPinia();

  app.use(pinia);
  app.mount("#app");
};

init();

window.addEventListener("beforeunload", () => {
  vlcPlayer.destroy();
});
