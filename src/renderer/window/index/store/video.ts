import { defineStore } from "pinia";
import { ref } from "vue";
import { VideoItem } from "../types/video";
import { videoExt } from "../utils/video";

// 支持播放的视频文件
// const whiteList = [".mp4"];

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useVideoStore = defineStore("video", () => {
  // 视频播放列表
  const videoList = ref<VideoItem[]>([]);
  // 当前正在播放的视频
  const activeVideo = ref<VideoItem | null>(null);
  // 根据文件名进行添加
  const addVideo = async (filePath: string[]) => {
    const task = filePath.map((path) => {
      return window.api.getFileNameFromPath(path).then((name) => {
        const obj: VideoItem = {
          name,
          path,
          errorMessage: ""
        };
        return obj;
      });
    });
    const res = await Promise.all(task);
    //  去重
    const arr = res.filter((r) => !videoList.value.find((i) => i.path === r.path));
    videoList.value.push(...arr);
  };
  // 根据文件夹添加
  const addVideoFromDir = async (dir: string[]) => {
    const res = await window.api.getAllFile(dir);
    const arr: VideoItem[] = res
      .filter(
        (r) =>
          videoExt.find((w) => `.${w}`.toLocaleLowerCase() === r.ext.toLocaleLowerCase()) &&
          !videoList.value.find((i) => i.path === r.path)
      )
      .map((item) => ({
        name: item.name,
        path: item.path,
        errorMessage: ""
      }));
    videoList.value.push(...arr);
  };
  const setActiveVideo = (video: VideoItem | null) => {
    if (video?.path === activeVideo.value?.path) {
      return;
    }
    if (video) {
      activeVideo.value = { ...video };
    } else {
      activeVideo.value = null;
    }
  };

  const setVideo = (video: VideoItem) => {
    const index = videoList.value.findIndex((v) => v.path === video.path);
    if (index > -1) {
      videoList.value[index] = { ...video };
    }
  };
  return { videoList, addVideo, addVideoFromDir, activeVideo, setActiveVideo, setVideo };
});
