<template>
  <div class="video-container" @click="togglePlay">
    <video
      ref="videoRef"
      src="http://player.linjiafu.top/test.mp4"
      class="video"
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
import { exportMethod } from "../hooks/useMethod";

const videoRef = ref<HTMLVideoElement | null>(null);

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

const seek = (time: number) => {
  if (videoRef.value) {
    videoRef.value.currentTime = time;
  }
};

exportMethod({
  getDuration,
  play,
  pause,
  togglePlay,
  seek
});
</script>
