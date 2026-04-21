<template>
  <div class="player-app">
    <TitleBar />

    <Background />

    <VideoPlayer />

    <PlayerBar />
  </div>
</template>

<script setup lang="ts">
import TitleBar from "./components/TitleBar/TitleBar.vue";
import Background from "./components/Background/Background.vue";
import PlayerBar from "./components/PlayerBar/PlayerBar.vue";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.vue";
</script>

<style lang="scss">
.player-app {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bg);
  overflow: hidden;
}
</style>
