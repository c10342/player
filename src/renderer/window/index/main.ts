import { initApp } from "@renderer/services/utils/app";
import App from "./App.vue";
import "./assets/style.scss";
import "./assets/icon/iconfont.css";
import { createPinia } from "pinia";
import { persistence } from "./store/plugin";

const render = () => {
  const pinia = createPinia();
  pinia.use(persistence);
  initApp(App, [pinia]);
};

render();
