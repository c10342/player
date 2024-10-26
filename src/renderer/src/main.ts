import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.scss";
import "./assets/iconFont/iconfont.css";
import player, { playerEvent } from "./player";

// 处理跟窗口相关的事件
const winHandler = () => {
  player.on(playerEvent.switchVideo, (url: string) => {
    let title = "播放器";
    window.api.getFileName(url).then((data) => {
      if (data) {
        title = data;
      }
      document.title = title;
    });
  });
};

const init = async () => {
  await player.init();
  winHandler();
  createApp(App).mount("#app");
};

init();
