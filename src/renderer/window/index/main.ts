import { initApp } from "@renderer/services/utils/app";
import App from "./App.vue";
import "./style.scss";

const render = async () => {
  initApp(App);
};

render();
