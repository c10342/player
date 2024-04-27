<template>
  <div class="progress-container">
    <div
      class="progress-wrapper"
      @click="onClick"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
    >
      <div v-if="tip" ref="tipRef" class="time-tip" :style="{ left: tipLeft }">{{ tip }}</div>
      <div class="progress-inner" :style="{ width: percentage }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { VideoEvent } from "../enums/video";
import { useEvent } from "../hooks/useEvent";

import { importMethod } from "../hooks/useMethod";
import { formatTime } from "../utils/formatTime";

const { getDuration, seek, getCurrentTime } = importMethod();

const duration = ref(0);

const currentTime = ref(0);

const tip = ref("");

const tipLeft = ref("0%");

const tipRef = ref<HTMLDivElement | null>(null);

const percentage = computed(() => {
  if (duration.value === 0) {
    return "0%";
  }
  return `${(currentTime.value / duration.value) * 100}%`;
});

useEvent(VideoEvent.Loadedmetadata, (event: Event) => {
  const target = event.target as HTMLVideoElement;
  duration.value = target.duration;
});

useEvent(VideoEvent.Timeupdate, (event: Event) => {
  const target = event.target as HTMLVideoElement;
  currentTime.value = target.currentTime;
});

const onClick = (event: MouseEvent) => {
  if (!duration.value) {
    return;
  }
  const target = event.target as HTMLDivElement;
  const width = target.offsetWidth;
  const time = (event.offsetX / width) * duration.value;
  seek?.(time);
};

const onMouseMove = (event: MouseEvent) => {
  if (!duration.value) {
    return;
  }
  const target = event.target as HTMLDivElement;
  const width = target.offsetWidth;
  const time = (event.offsetX / width) * duration.value;
  tip.value = formatTime(time);
  nextTick(() => {
    // 居中
    const tipWidth = tipRef.value?.offsetWidth ?? 0;
    tipLeft.value = `${((event.offsetX - tipWidth / 2) / width) * 100}%`;
  });
};

const onMouseLeave = () => {
  tip.value = "";
};

const init = () => {
  duration.value = getDuration?.() ?? 0;
  currentTime.value = getCurrentTime?.() ?? 0;
};

init();
</script>
