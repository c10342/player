<template>
  <div class="control-bar">
    <progress-bar v-if="videoStore.activeVideo" />
    <div class="time-container">
      <span>{{ currentTimeLabel }}</span>
      <span class="ml-2 mr-2">/</span>
      <span> {{ durationLabel }} </span>
    </div>
    <div class="action-button-container">
      <icon class="icon-button-item" name="stop" :size="24" @click="onStop"></icon>
      <icon class="icon-button-item" name="skip-previous" :size="30"></icon>
      <icon class="icon-button-item" :name="playIcon" :size="34" @click="onToggle"></icon>
      <icon class="icon-button-item" name="skip-next" :size="30"></icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import ProgressBar from "./progress.vue";
import { VideoEvent } from "../enums/video";
import { useEvent } from "../hooks/useEvent";
import { formatTime } from "../utils/formatTime";
import Icon from "./icon/index.vue";
import { useVideoStore } from "../store/video";
import { VideoItem } from "../types/video";
import { player } from "../player";

const videoStore = useVideoStore();

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

useEvent(VideoEvent.VideoChange, (video: VideoItem | null) => {
  if (!video) {
    currentTimeLabel.value = "00:00";
    durationLabel.value = "00:00";
  }
});

const onStop = () => {
  player.setVideo(null);
};

const onToggle = () => {
  player.togglePlay();
};

const init = () => {
  player.getDuration().then((res) => {
    durationLabel.value = formatTime(res);
  });
  player.getCurrentTime().then((res) => {
    currentTimeLabel.value = formatTime(res);
  });
  player.getPaused().then((res) => {
    playIcon.value = res ? "play" : "pause";
  });
};

init();
</script>
