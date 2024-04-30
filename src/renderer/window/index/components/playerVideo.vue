<template>
  <div class="video-container" @click="togglePlay" @contextmenu="onContentMenu">
    <video
      ref="videoRef"
      :src="videoStore.activeVideo?.path"
      class="video"
      autoplay
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedmetadata"
      @ended="onEnded"
    ></video>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VideoEvent } from "../enums/video";
import { triggerEvent } from "../hooks/useEvent";
import { throttle } from "lodash";
import { exportMethod } from "../hooks/useMethod";
import { openMenu } from "../utils/menu";
import { useLocale } from "@renderer/services/hooks/useLocale";
import { useVideoStore } from "../store/video";
// http://player.linjiafu.top/test.mp4
const { t } = useLocale();

const videoStore = useVideoStore();

const videoRef = ref<HTMLVideoElement | null>(null);

const onContentMenu = () => {
  openMenu([
    {
      label: t("openFile"),
      action() {
        window.api
          .showOpenDialog({
            modal: true,
            title: t("selectFile"),
            properties: ["openFile", "multiSelections"],
            filters: [{ name: "Videos", extensions: ["mp4"] }]
          })
          .then((res) => {
            videoStore.addVideo(res.filePaths);
          });
      }
    },
    {
      label: t("openDirectory"),
      action() {
        window.api
          .showOpenDialog({
            modal: true,
            title: t("selectDirectory"),
            properties: ["openDirectory", "multiSelections"]
          })
          .then((res) => {
            videoStore.addVideoFromDir(res.filePaths);
          });
      }
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

const onEnded = () => {
  console.log("end");
};

exportMethod({
  getDuration,
  play,
  pause,
  togglePlay,
  seek,
  getCurrentTime,
  setSpeed,
  getSpeed,
  getPaused
});
</script>
