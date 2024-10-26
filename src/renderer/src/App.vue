<template>
  <div class="app-container">
    <RenderFrame></RenderFrame>
  </div>
</template>

<script setup lang="ts">
import RenderFrame from "./components/renderFrame/index.vue";
import player from "./player";

// player.src("http://player.linjiafu.top/test.mp4");
player.src("E:\\迅雷下载\\变形金刚：起源.mp4");
</script>

<style lang="scss">
.app-container {
  width: 100%;
  height: 100%;
}
</style>
