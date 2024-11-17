import { createApp } from "vue";
import App from "./App.vue";
import "./assets/styles/index.scss";
import "./assets/iconFont/iconfont.css";
import player, { playerEvent, PlayListItem } from "./player";
import Mousetrap from "mousetrap";
import { GlobalHotKeyEnum } from "./services/enums";
import { openFile } from "./services/common";

// 处理跟窗口相关的事件
const winHandler = () => {
  player.on(playerEvent.switch, (params: PlayListItem) => {
    let title = "播放器";
    window.api.getFileName(params.url).then((data) => {
      if (data) {
        title = data;
      }
      document.title = title;
    });
  });
};

// 初始化全局快捷键
const initHotKey = () => {
  Mousetrap.bind(GlobalHotKeyEnum.OpenFile, openFile);
  Mousetrap.bind(GlobalHotKeyEnum.PlayVideo, () => {
    player.play();
  });
  Mousetrap.bind(GlobalHotKeyEnum.PauseVideo, () => {
    player.pause();
  });
};

const init = async () => {
  await player.init();
  winHandler();
  initHotKey();
  createApp(App).mount("#app");
};

init();
