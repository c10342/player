import { initApp } from "@renderer/services/utils/app";
import App from "./App.vue";
import "./assets/style.scss";
import "./assets/icon/iconfont.css";
import { createPinia } from "pinia";

const render = () => {
  const pinia = createPinia();
  initApp(App, [pinia]);
};

render();
