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
import { usePlayerStore } from "./stores";
import vlcPlayer from "./player";
import { BridgeEnum } from "@share/enum";
import { usePlayerEvent } from "./hooks";
import { useIpcEvent } from "@renderer/hooks";

const playerStore = usePlayerStore();

let playing = false;

const syncTrayPlaying = () => {
  window.electronAPI.setTrayPlaying(playing);
};

const onTrayPrev = () => {
  playerStore.prevVideo();
};

const onTrayNext = () => {
  playerStore.nextVideo();
};

const onTrayTogglePlay = () => {
  vlcPlayer.toggle();
};

const onTrayStop = () => {
  playerStore.removeCurrentVideo();
};

const onPlaying = () => {
  playing = true;
  syncTrayPlaying();
};

const onPaused = () => {
  playing = false;
  syncTrayPlaying();
};

const onStopped = () => {
  playing = false;
  syncTrayPlaying();
};

usePlayerEvent("playing", onPlaying);
usePlayerEvent("paused", onPaused);
usePlayerEvent("stopped", onStopped);

useIpcEvent(BridgeEnum.TrayPrev, onTrayPrev);
useIpcEvent(BridgeEnum.TrayNext, onTrayNext);
useIpcEvent(BridgeEnum.TrayTogglePlay, onTrayTogglePlay);
useIpcEvent(BridgeEnum.TrayStop, onTrayStop);
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
