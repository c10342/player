import App from "./App.vue";
import { createApp } from "@renderer/utils";

const init = async () => {
  const app = await createApp(App);
  app.mount("#app");
};

init();
