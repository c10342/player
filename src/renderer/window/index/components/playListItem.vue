<template>
  <div class="play-list-item active">
    <div class="info-container">
      <div class="video-name-container">
        <icon :size="10" name="triangle" class="video-icon" />
        <div class="video-name">{{ video.name }}</div>
      </div>
      <div>02:47</div>
    </div>
    <div class="mask-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import Icon from "./icon/index.vue";
import { VideoItem } from "../types/video";

defineProps({
  video: {
    type: Object as PropType<VideoItem>,
    default: () => ({}),
    required: true
  }
});
</script>
