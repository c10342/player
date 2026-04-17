<template>
  <div class="player-bar">
    <div class="player-bar__inner">
      <div class="player-bar__section player-bar__section--track">
        <TrackInfo title="Midnight Serenade" artist="Amber Orchestra" :playing="state.playing" />
      </div>

      <div class="player-bar__section player-bar__section--center">
        <PlayerControls
          :playing="state.playing"
          @prev="onPrev"
          @toggle="onToggle"
          @stop="onStop"
          @next="onNext"
        />
        <ProgressBar :current-time="state.currentTime" :duration="state.duration" @seek="onSeek" />
      </div>

      <div class="player-bar__section player-bar__section--extra">
        <VolumeControl
          :volume="state.volume"
          :is-muted="state.isMuted"
          @change-volume="onChangeVolume"
          @toggle-mute="onToggleMute"
        />
        <button class="player-bar__fullscreen-btn" title="全屏" @click="onFullscreen">
          <svg
            v-if="!state.fullscreen"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path
              d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path
              d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import TrackInfo from "./TrackInfo.vue";
import PlayerControls from "./PlayerControls.vue";
import ProgressBar from "./ProgressBar.vue";
import VolumeControl from "./VolumeControl.vue";

const state = reactive({
  playing: false,
  currentTime: 72,
  duration: 245,
  volume: 0.7,
  isMuted: false,
  fullscreen: false
});

function onToggle() {
  state.playing = !state.playing;
}

function onStop() {
  state.playing = false;
  state.currentTime = 0;
}

function onPrev() {
  state.currentTime = 0;
}

function onNext() {
  state.currentTime = 0;
}

function onSeek(time: number) {
  state.currentTime = time;
}

function onChangeVolume(vol: number) {
  state.volume = vol;
  if (vol > 0) {
    state.isMuted = false;
  }
}

function onToggleMute() {
  state.isMuted = !state.isMuted;
}

function onFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    state.fullscreen = true;
  } else {
    document.exitFullscreen();
    state.fullscreen = false;
  }
}
</script>

<style scoped lang="scss">
.player-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(12, 12, 14, 0.85) 0%, rgba(12, 12, 14, 0.97) 100%);
  backdrop-filter: blur(30px) saturate(1.2);
  border-top: 1px solid rgba(255, 255, 255, 0.04);

  &__inner {
    display: flex;
    align-items: center;
    padding: 10px 20px;
  }

  &__section {
    display: flex;
    align-items: center;

    &--track {
      flex: 1;
      justify-content: flex-start;
      min-width: 0;
    }

    &--center {
      flex: 2;
      flex-direction: column;
      gap: 6px;
      max-width: 600px;
    }

    &--extra {
      flex: 1;
      justify-content: flex-end;
      gap: 4px;
    }
  }

  &__fullscreen-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: rgba(255, 255, 255, 0.55);
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.06);
    }
  }
}
</style>
