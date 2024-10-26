import { createApp } from "vue";
import App from "./App.vue";
import player from "./player";
import "./assets/styles/index.scss";

const init = async () => {
  await player.init({
    el: document.body
  });
  createApp(App).mount("#app");
};

init();
