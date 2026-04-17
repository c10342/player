<template>
  <div class="player-bar">
    <ProgressBar :current-time="state.currentTime" :duration="state.duration" @seek="onSeek" />

    <div class="player-bar__inner">
      <div class="player-bar__section player-bar__section--left">
        <span class="player-bar__time">{{ formattedCurrent }}</span>
        <span class="player-bar__time-sep">/</span>
        <span class="player-bar__time">{{ formattedDuration }}</span>
      </div>

      <div class="player-bar__section player-bar__section--center">
        <PlayerControls
          :playing="state.playing"
          @prev="onPrev"
          @toggle="onToggle"
          @stop="onStop"
          @next="onNext"
        />
      </div>

      <div class="player-bar__section player-bar__section--extra">
        <VolumeControl
          :volume="state.volume"
          :is-muted="state.isMuted"
          @change-volume="onChangeVolume"
          @toggle-mute="onToggleMute"
        />
        <button class="player-bar__fullscreen-btn" title="全屏" @click="onFullscreen">
          <Icon size="18">
            <Expand v-if="!state.fullscreen" />
            <Contract v-else />
          </Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { Icon } from "@vicons/utils";
import { Expand, Contract } from "@vicons/ionicons5";
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

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const formattedCurrent = computed(() => formatTime(state.currentTime));
const formattedDuration = computed(() => formatTime(state.duration));

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

<style lang="scss">
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

    &--left {
      flex: 1;
      align-items: center;
      gap: 4px;
    }

    &--center {
      flex-shrink: 0;
      justify-content: center;
    }

    &--extra {
      flex: 1;
      justify-content: flex-end;
      gap: 4px;
    }
  }

  &__time {
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.5);
  }

  &__time-sep {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.25);
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
