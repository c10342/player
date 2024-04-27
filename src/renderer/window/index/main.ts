import { initApp } from "@renderer/services/utils/app";
import App from "./App.vue";
import "./style.scss";
import "./icon/iconfont.css";

const render = async () => {
  initApp(App);
};

render();
