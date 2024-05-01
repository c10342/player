import { initApp } from "@renderer/services/utils/app";
import App from "./App.vue";
import "./assets/style.scss";
import "./assets/icon/iconfont.css";
import { createPinia } from "pinia";
import { persistence } from "./store/plugin";

const render = async () => {
  const pinia = createPinia();
  // 还原之前的状态
  const jsonStr = await window.api.getStore(`pinia-state`);
  if (jsonStr) {
    const state = JSON.parse(jsonStr);
    pinia.state.value = state;
  }
  pinia.use(persistence);
  initApp(App, [pinia]);
};

render();
