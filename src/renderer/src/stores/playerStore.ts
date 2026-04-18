import player from "@renderer/player";
import { PlayerListItem } from "@renderer/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
  const playerList = ref<PlayerListItem[]>([
    {
      path: "E:\\迅雷下载\\阳光电影dygod.org.大突围.2024.HD.1080P.国语中英双字.mkv",
      name: "阳光电影dygod.org.大突围.2024.HD.1080P.国语中英双字.mkv",
      type: ".mkv",
      size: 2086207073
    },
    {
      path: "E:\\aDriver\\【保姆级教学】从零搭建组件库\\8-08.实现树的基本搭建.mp4",
      name: "8-08.实现树的基本搭建.mp4",
      type: ".mp4",
      size: 131622108
    },
    {
      path: "E:\\aDriver\\【保姆级教学】从零搭建组件库\\23-23.完善input组件功能.mp4",
      name: "23-23.完善input组件功能.mp4",
      type: ".mp4",
      size: 83412820
    }
  ]);
  // 当前正在播放的视频
  const activeId = ref("");
  const currentVideo = computed(() => playerList.value.find((i) => i.path === activeId.value));
  const addPlayerList = (item: PlayerListItem) => {
    const index = playerList.value.findIndex((i) => i.path === item.path);
    if (index === -1) {
      playerList.value.push(item);
    }
  };

  const removeCurrentVideo = () => {
    activeId.value = "";
    player.stop();
  };

  const removePlayerList = (item: PlayerListItem) => {
    const index = playerList.value.findIndex((i) => i.path === item.path);
    if (index !== -1) {
      if (playerList.value[index].path === activeId.value) {
        removeCurrentVideo();
      }
      playerList.value.splice(index, 1);
    }
  };
  const selectPlayerList = (item: PlayerListItem) => {
    const listItem = playerList.value.find((i) => i.path === item.path);
    const newId = listItem?.path || "";
    if (newId === activeId.value) {
      return;
    }
    activeId.value = newId;
    player.load(newId);
  };
  return {
    playerList,
    addPlayerList,
    removePlayerList,
    selectPlayerList,
    activeId,
    currentVideo,
    removeCurrentVideo
  };
});
