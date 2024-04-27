import "@renderer/assets/style/index.scss";
import i18n from "@renderer/locale";
import { DefineComponent, createApp, Plugin } from "vue";

// 初始化vue实例
export const initApp = (App: DefineComponent<any, any, any>, plugins: Plugin<[]>[] = []) => {
  const app = createApp(App);
  app.use(i18n);
  plugins.forEach((plugin) => app.use(plugin));

  return app.mount("#app");
};
