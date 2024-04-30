<template>
  <div class="play-list-item" :class="{ active: isActive }" @dblclick="onClick">
    <div class="info-container">
      <div class="video-name-container">
        <icon :size="10" name="triangle" class="video-icon" />
        <div class="video-name">{{ video.name }}</div>
      </div>
      <div v-if="isActive">{{ durationLabel }}</div>
    </div>
    <div v-if="isActive" class="mask-container" :style="{ width: maskWidth }"></div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from "vue";
import Icon from "./icon/index.vue";
import { VideoItem } from "../types/video";
import { useVideoStore } from "../store/video";
import { useEvent } from "../hooks/useEvent";
import { VideoEvent } from "../enums/video";
import { formatTime } from "../utils/formatTime";

const props = defineProps({
  video: {
    type: Object as PropType<VideoItem>,
    default: () => ({}),
    required: true
  }
});

const videoStore = useVideoStore();

const duration = ref(0);

const currentTime = ref(0);

const maskWidth = computed(() => {
  if (duration.value && currentTime.value) {
    return `${(currentTime.value / duration.value) * 100}%`;
  }
  return "0%";
});

const isActive = computed(() => {
  return videoStore.activeVideo?.path === props.video.path;
});

const durationLabel = computed(() => {
  return formatTime(duration.value);
});

const onClick = () => {
  videoStore.setActiveVideo(props.video);
};

useEvent(VideoEvent.Loadedmetadata, (event: Event) => {
  if (!isActive.value) {
    return;
  }
  const target = event.target as HTMLVideoElement;
  duration.value = target.duration;
});

useEvent(VideoEvent.Timeupdate, (event: Event) => {
  if (!isActive.value) {
    return;
  }
  const target = event.target as HTMLVideoElement;
  currentTime.value = target.currentTime;
});
</script>
