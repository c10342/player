<template>
  <div class="player-controls">
    <button class="player-controls__btn" title="上一首" @click="onPrev">
      <Icon size="20"><PlaySkipBack /></Icon>
    </button>

    <button
      class="player-controls__btn player-controls__btn--play"
      :title="playing ? '暂停' : '播放'"
      @click="onToggle"
    >
      <Icon size="24">
        <span v-if="!playing" class="player-controls__play-icon"><Play /></span>
        <Pause v-else />
      </Icon>
    </button>

    <button class="player-controls__btn" title="停止" @click="onStop">
      <Icon size="20"><Stop /></Icon>
    </button>

    <button class="player-controls__btn" title="下一首" @click="onNext">
      <Icon size="20"><PlaySkipForward /></Icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { PlaySkipBack, Play, Pause, Stop, PlaySkipForward } from "@vicons/ionicons5";
import vlcPlayer from "@renderer/player";
import { ref } from "vue";
import { usePlayerEvent } from "@renderer/hooks";
import { usePlayerStore } from "@renderer/stores";

const playing = ref(false);

const playerStore = usePlayerStore();

const onToggle = () => {
  vlcPlayer.toggle();
};

const onStop = () => {
  playerStore.removeCurrentVideo();
};

const onNext = () => {
  playerStore.nextVideo();
};

const onPrev = () => {
  playerStore.prevVideo();
};

usePlayerEvent("playing", () => {
  playing.value = true;
});

usePlayerEvent("paused", () => {
  playing.value = false;
});
</script>

<style lang="scss">
.player-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      transform 0.15s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }

    &:active {
      transform: scale(0.9);
    }

    &--play {
      width: 48px;
      height: 48px;
      color: var(--dark);
      background: linear-gradient(135deg, var(--accent), var(--accent-hover));
      box-shadow: 0 2px 12px var(--accent-glow);

      &:hover {
        color: var(--dark);
        background: linear-gradient(135deg, var(--accent-hover), var(--accent));
        box-shadow: 0 4px 20px var(--accent-glow);
      }

      &:active {
        transform: scale(0.92);
      }

      svg {
        filter: drop-shadow(0 1px 1px rgb(0 0 0 / 15%));
      }
    }
  }

  &__play-icon {
    display: flex;
    margin-left: 2px;
  }
}
</style>
