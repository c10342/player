import { PlayerListItem } from "@renderer/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePlayerStore = defineStore("player", () => {
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

  const removePlayerList = (item: PlayerListItem) => {
    const index = playerList.value.findIndex((i) => i.path === item.path);
    if (index !== -1) {
      playerList.value.splice(index, 1);
    }
  };
  const selectPlayerList = (item: PlayerListItem) => {
    const listItem = playerList.value.find((i) => i.path === item.path);
    activeId.value = listItem?.path || "";
  };
  return {
    playerList,
    addPlayerList,
    removePlayerList,
    selectPlayerList,
    activeId,
    currentVideo
  };
});
