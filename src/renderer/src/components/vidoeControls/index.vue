<template>
  <div class="vidoe-controls-container">
    <VideoProgress></VideoProgress>
  </div>
</template>

<script setup lang="ts">
import VideoProgress from "./videoProgress.vue";
</script>

<style lang="scss" scoped>
.vidoe-controls-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  padding: 10px 20px;
}
</style>
