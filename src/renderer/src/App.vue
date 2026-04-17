<template>
  <div class="player-app">
    <TitleBar title="Electron Player" />

    <div class="player-app__bg">
      <div class="player-app__bg-orb player-app__bg-orb--1"></div>
      <div class="player-app__bg-orb player-app__bg-orb--2"></div>
      <div class="player-app__bg-orb player-app__bg-orb--3"></div>
    </div>

    <div class="player-app__body">
      <div class="player-app__content">
        <div class="player-app__hero">
          <div class="player-app__vinyl" :class="{ 'player-app__vinyl--spinning': isPlaying }">
            <div class="player-app__vinyl-groove player-app__vinyl-groove--1"></div>
            <div class="player-app__vinyl-groove player-app__vinyl-groove--2"></div>
            <div class="player-app__vinyl-groove player-app__vinyl-groove--3"></div>
            <div class="player-app__vinyl-label">
              <span class="player-app__vinyl-dot"></span>
            </div>
          </div>
          <div class="player-app__hero-meta">
            <h1 class="player-app__hero-title">Midnight Serenade</h1>
            <p class="player-app__hero-artist">Amber Orchestra</p>
            <p class="player-app__hero-album">Nocturne Collection</p>
          </div>
        </div>
      </div>

      <PlayList
        :tracks="playList"
        :active-index="activeTrackIndex"
        :collapsed="playListCollapsed"
        @select="onTrackSelect"
        @toggle="playListCollapsed = !playListCollapsed"
      />
    </div>

    <PlayerBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TitleBar from "./components/TitleBar/TitleBar.vue";
import PlayerBar from "./components/PlayerBar/PlayerBar.vue";
import PlayList from "./components/PlayList/PlayList.vue";
import type { Track } from "./components/PlayList/PlayList.vue";

const isPlaying = ref(false);
const activeTrackIndex = ref(0);
const playListCollapsed = ref(false);

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

  &__bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
  }

  &__bg-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.35;

    &--1 {
      top: -20%;
      left: -10%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, #e8a849 0%, transparent 70%);
      animation: float1 12s ease-in-out infinite;
    }

    &--2 {
      right: -15%;
      bottom: -10%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, #6b3fa0 0%, transparent 70%);
      animation: float2 15s ease-in-out infinite;
    }

    &--3 {
      top: 40%;
      left: 50%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, #2a6b4f 0%, transparent 70%);
      animation: float3 10s ease-in-out infinite;
    }
  }

  &__body {
    position: relative;
    z-index: 1;
    display: flex;
    width: 100%;
    height: calc(100% - 36px - 80px);
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  &__vinyl {
    position: relative;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0d0d0d 100%);
    border-radius: 50%;
    box-shadow:
      0 0 0 2px rgba(255, 255, 255, 0.03),
      0 8px 40px rgba(0, 0, 0, 0.6),
      inset 0 0 60px rgba(0, 0, 0, 0.5);

    &--spinning {
      animation: vinyl-spin 3s linear infinite;
    }
  }

  &__vinyl-groove {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 0.5px solid rgba(255, 255, 255, 0.04);

    &--1 {
      width: 180px;
      height: 180px;
    }

    &--2 {
      width: 140px;
      height: 140px;
    }

    &--3 {
      width: 100px;
      height: 100px;
    }
  }

  &__vinyl-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #e8a849, #c4873a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px rgba(232, 168, 73, 0.2);
  }

  &__vinyl-dot {
    width: 8px;
    height: 8px;
    background: #0a0a0c;
    border-radius: 50%;
  }

  &__hero-meta {
    text-align: center;
  }

  &__hero-title {
    font-size: 28px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  &__hero-artist {
    margin-top: 6px;
    font-size: 15px;
    color: #e8a849;
    letter-spacing: 0.3px;
  }

  &__hero-album {
    margin-top: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

@keyframes float1 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, 30px);
  }
}

@keyframes float2 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-30px, -40px);
  }
}

@keyframes float3 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, -20px);
  }
}

@keyframes vinyl-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
