import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { isFileExist } from "../utils";
import vlcPlayer from "../player";
import { PlayerListItem } from "@share/type";

export const usePlayerStore = defineStore(
  "player",
  () => {
    const playerList = ref<PlayerListItem[]>([]);
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
      if (activeId.value) {
        activeId.value = "";
        vlcPlayer.stop();
      }
    };
    // 移除视频
    const removeVideo = (item: PlayerListItem) => {
      const index = playerList.value.findIndex((i) => i.path === item.path);
      if (index !== -1) {
        if (playerList.value[index].path === activeId.value) {
          removeCurrentVideo();
        }
        playerList.value.splice(index, 1);
      }
    };
    // 切换当前正在播放的视频
    const changeCurrentVideo = (item: PlayerListItem) => {
      const listItem = playerList.value.find((i) => i.path === item.path);
      const newId = listItem?.path || "";
      if (newId === activeId.value) {
        return;
      }
      if (!isFileExist(item.path)) {
        updateVideoInfo({
          ...item,
          error: "文件不存在"
        });
        return;
      }
      activeId.value = newId;
      vlcPlayer.load(newId);
    };
    // 下一个视频
    const nextVideo = () => {
      if (!activeId.value) {
        // 没有视频在播放，直接取第一个视频
        if (playerList.value.length > 0) {
          changeCurrentVideo(playerList.value[0]);
        }
      } else {
        const index = playerList.value.findIndex((i) => i.path === activeId.value);
        const nextIndex = (index + 1) % playerList.value.length;
        // 当只有一个视频，nextindex===index
        if (index !== -1 && nextIndex !== index) {
          changeCurrentVideo(playerList.value[nextIndex]);
        }
      }
    };
    // 上一个视频
    const prevVideo = () => {
      if (!activeId.value) {
        // 没有视频在播放，直接取最后一个视频
        if (playerList.value.length > 0) {
          changeCurrentVideo(playerList.value[playerList.value.length - 1]);
        }
      } else {
        const index = playerList.value.findIndex((i) => i.path === activeId.value);
        const prevIndex = (index - 1 + playerList.value.length) % playerList.value.length;
        // 当只有一个视频，previndex===index
        if (index !== -1 && prevIndex !== index) {
          changeCurrentVideo(playerList.value[prevIndex]);
        }
      }
    };

    // 更新视频信息
    const updateVideoInfo = (item: PlayerListItem) => {
      const index = playerList.value.findIndex((i) => i.path === item.path);
      if (index !== -1) {
        playerList.value[index] = item;
      }
    };
    return {
      playerList,
      addPlayerList,
      removeVideo,
      changeCurrentVideo,
      activeId,
      currentVideo,
      removeCurrentVideo,
      nextVideo,
      prevVideo,
      updateVideoInfo
    };
  },
  {
    persist: {
      key: "player",
      pick: ["playerList"]
    }
  } as any
);
