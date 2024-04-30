<template>
  <div class="control-bar">
    <progress-bar />
    <div class="bottom-control">
      <div class="time-container">
        <span>{{ currentTimeLabel }}</span>
        <span class="ml-2 mr-2">/</span>
        <span> {{ durationLabel }} </span>
      </div>
      <div class="action-button-container">
        <icon class="icon-button-item" name="stop" :size="24" @click="onStop"></icon>
        <icon class="icon-button-item" name="skip-previous" :size="30"></icon>
        <icon class="icon-button-item" :name="playIcon" :size="34" @click="togglePlay"></icon>
        <icon class="icon-button-item" name="skip-next" :size="30"></icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { importMethod } from "../hooks/useMethod";
import ProgressBar from "./progress.vue";
import { VideoEvent } from "../enums/video";
import { useEvent } from "../hooks/useEvent";
import { formatTime } from "../utils/formatTime";
import Icon from "./icon/index.vue";
import { useVideoStore } from "../store/video";

const videoStore = useVideoStore();

const { getDuration, getCurrentTime, getPaused, togglePlay } = importMethod();

const durationLabel = ref("00:00");

const currentTimeLabel = ref("00:00");

const playIcon = ref("play");

useEvent(VideoEvent.Loadedmetadata, (event: Event) => {
  const target = event.target as HTMLVideoElement;
  durationLabel.value = formatTime(target.duration);
});

useEvent(VideoEvent.Timeupdate, (event: Event) => {
  const target = event.target as HTMLVideoElement;
  currentTimeLabel.value = formatTime(target?.currentTime ?? 0);
});

useEvent(VideoEvent.Play, () => {
  playIcon.value = "pause";
});
useEvent(VideoEvent.Pause, () => {
  playIcon.value = "play";
});

const onStop = () => {
  videoStore.setActiveVideo(null);
};

const init = () => {
  if (getDuration) {
    durationLabel.value = formatTime(getDuration());
  }
  if (getCurrentTime) {
    currentTimeLabel.value = formatTime(getCurrentTime());
  }
  if (getPaused) {
    playIcon.value = getPaused() ? "play" : "pause";
  }
};

init();
</script>
