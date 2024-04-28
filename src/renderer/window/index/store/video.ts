import { defineStore } from "pinia";
import { ref } from "vue";
import { VideoItem } from "../types/video";

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useVideoStore = defineStore("video", () => {
  const videoList = ref<VideoItem[]>([]);
  return { videoList };
});
