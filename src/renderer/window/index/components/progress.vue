<template>
  <div class="progress-container">
    <div class="progress-wrapper" @click="onClick">
      <div class="progress-inner" :style="{ width: `${progressPercentage}%` }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { VideoEvent } from "../enums/video";
import { useEvent } from "../hooks/useEvent";

import { importMethod } from "../hooks/useMethod";

const { getDuration, seek } = importMethod();

const progressPercentage = ref(0);

const duration = ref(0);

useEvent(VideoEvent.Loadedmetadata, (event: Event) => {
  const target = event.target as HTMLVideoElement;
  duration.value = target.duration;
});

useEvent(VideoEvent.Timeupdate, (event: Event) => {
  if (!duration.value) {
    return;
  }
  const target = event.target as HTMLVideoElement;
  progressPercentage.value = (target.currentTime / target.duration) * 100;
});

const init = () => {
  duration.value = getDuration?.() ?? 0;
};

init();

const onClick = (event: MouseEvent) => {
  if (!duration.value) {
    return;
  }
  const target = event.target as HTMLDivElement;
  const width = target.offsetWidth;
  const time = (event.offsetX / width) * duration.value;
  seek?.(time);
};
</script>
