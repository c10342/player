<template>
  <div class="video-container" @click="togglePlay" @contextmenu="onContentMenu">
    <video
      ref="videoRef"
      :src="currentVideo?.path"
      class="video"
      autoplay
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedmetadata"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VideoEvent } from "../enums/video";
import { triggerEvent } from "../hooks/useEvent";
import { throttle } from "lodash";
import { openMenu } from "../utils/menu";
import { useLocale } from "@renderer/services/hooks/useLocale";
import { useVideoStore } from "../store/video";
import { selectDir, selectFile } from "../utils/file";
import { VideoItem } from "../types/video";
import { exportMethod } from "../hooks/useMethod";
// http://player.linjiafu.top/test.mp4
const { t } = useLocale();

const videoStore = useVideoStore();

const currentVideo = ref<VideoItem | null>(null);

const videoRef = ref<HTMLVideoElement | null>(null);

const onContentMenu = () => {
  openMenu([
    {
      label: t("openFile"),
      action: selectFile
    },
    {
      label: t("openDirectory"),
      action: selectDir
    }
  ]);
};

const onPlay = (event: Event) => {
  triggerEvent(VideoEvent.Play, event);
};

const onPause = (event: Event) => {
  triggerEvent(VideoEvent.Pause, event);
};

const onLoadedmetadata = (event: Event) => {
  triggerEvent(VideoEvent.Loadedmetadata, event);
};

const onTimeUpdate = throttle((event: Event) => {
  triggerEvent(VideoEvent.Timeupdate, event);
}, 1000);

const play = () => {
  return videoRef.value?.play() ?? Promise.resolve();
};
const pause = () => {
  videoRef.value?.pause();
  return Promise.resolve();
};

const togglePlay = () => {
  if (videoRef.value?.paused) {
    return play();
  } else {
    return pause();
  }
};

const getDuration = () => {
  return videoRef.value?.duration ?? 0;
};

const getCurrentTime = () => {
  return videoRef.value?.currentTime ?? 0;
};

const setSpeed = (rate: number) => {
  if (videoRef.value) {
    videoRef.value.playbackRate = rate;
  }
};

const getSpeed = () => {
  return videoRef.value?.playbackRate ?? 1;
};

const seek = (time: number) => {
  if (videoRef.value) {
    videoRef.value.currentTime = time;
  }
};

const getPaused = () => {
  return videoRef.value?.paused ?? true;
};

const setVideo = async (video: VideoItem | null) => {
  if (video?.path === currentVideo.value?.path) {
    return;
  }
  if (video?.path) {
    const isExit = await window.api.fileExists(video.path);
    if (!isExit) {
      window.api.showMessageBox({
        modal: true,
        message: `${video.path}不存在`
      });
      videoStore.setVideo({
        ...video,
        errorMessage: "文件失效"
      });
      return;
    }
  }
  currentVideo.value = video;
  videoStore.setActiveVideo(video ? { ...video, errorMessage: "" } : null);
  triggerEvent(VideoEvent.VideoChange, video);
};

const init = () => {
  if (videoStore.activeVideo) {
    currentVideo.value = { ...videoStore.activeVideo };
  }
};

init();

// 注册事件处理函数
exportMethod({
  getDuration,
  play,
  pause,
  togglePlay,
  seek,
  getCurrentTime,
  setSpeed,
  getSpeed,
  getPaused,
  setVideo
});
</script>
