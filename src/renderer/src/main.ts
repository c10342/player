import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.scss";
import player from "./player";

const init = async () => {
  await player.init();
  createApp(App).mount("#app");
};

init();
