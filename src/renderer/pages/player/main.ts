import { createPinia } from "pinia";
import App from "./App.vue";
import vlcPlayer from "./player";
import { createApp } from "@renderer/utils";
import { piniaElectronStore } from "@renderer/plugins/piniaElectronStore";

const init = async () => {
  const app = await createApp(App);
  const pinia = createPinia();
  pinia.use(piniaElectronStore);

  app.use(pinia);
  app.mount("#app");
};

init();

window.addEventListener("beforeunload", () => {
  vlcPlayer.destroy();
});
