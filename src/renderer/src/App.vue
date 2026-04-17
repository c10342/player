<template>
  <div class="player-app">
    <TitleBar title="Electron Player" />

    <Background />

    <VideoPlayer
      :tracks="playList"
      :active-index="activeTrackIndex"
      :is-playing="isPlaying"
      @select="onTrackSelect"
    />

    <PlayerBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TitleBar from "./components/TitleBar/TitleBar.vue";
import Background from "./components/Background/Background.vue";
import PlayerBar from "./components/PlayerBar/PlayerBar.vue";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer.vue";
import type { Track } from "./components/PlayList/PlayList.vue";

const isPlaying = ref(false);
const activeTrackIndex = ref(0);

const playList = ref<Track[]>([
  { id: "1", title: "Midnight Serenade", artist: "Amber Orchestra", duration: "4:05" },
  { id: "2", title: "Golden Hour", artist: "Amber Orchestra", duration: "3:42" },
  { id: "3", title: "Velvet Dreams", artist: "Luna Waves", duration: "5:18" },
  { id: "4", title: "Starlight Path", artist: "Luna Waves", duration: "4:33" },
  { id: "5", title: "Autumn Whisper", artist: "Echo Chamber", duration: "3:56" },
  { id: "6", title: "Ocean Breeze", artist: "Echo Chamber", duration: "6:02" },
  { id: "7", title: "Crystal Rain", artist: "Solaris", duration: "4:47" },
  { id: "8", title: "Silent Forest", artist: "Solaris", duration: "5:30" },
  { id: "9", title: "Dawn Chorus", artist: "Amber Orchestra", duration: "3:21" },
  { id: "10", title: "Twilight Haze", artist: "Noctis", duration: "4:15" }
]);

function onTrackSelect(index: number) {
  activeTrackIndex.value = index;
}
</script>

<style lang="scss">
.player-app {
  position: relative;
  width: 100%;
  height: 100%;
  background: #0a0a0c;
  overflow: hidden;
}
</style>
