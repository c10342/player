<template>
  <div class="player-controls">
    <button class="player-controls__btn" title="上一首" @click="emit('prev')">
      <Icon size="20"><PlaySkipBack /></Icon>
    </button>

    <button
      class="player-controls__btn player-controls__btn--play"
      :title="playing ? '暂停' : '播放'"
      @click="emit('toggle')"
    >
      <Icon size="24">
        <span v-if="!playing" class="player-controls__play-icon"><Play /></span>
        <Pause v-else />
      </Icon>
    </button>

    <button class="player-controls__btn" title="停止" @click="emit('stop')">
      <Icon size="20"><Stop /></Icon>
    </button>

    <button class="player-controls__btn" title="下一首" @click="emit('next')">
      <Icon size="20"><PlaySkipForward /></Icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { PlaySkipBack, Play, Pause, Stop, PlaySkipForward } from "@vicons/ionicons5";

defineProps<{
  playing: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  toggle: [];
  stop: [];
  next: [];
}>();
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
    color: rgba(255, 255, 255, 0.6);
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      transform 0.15s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.95);
      background: rgba(255, 255, 255, 0.06);
    }

    &:active {
      transform: scale(0.9);
    }

    &--play {
      width: 48px;
      height: 48px;
      color: #1a1a1a;
      background: linear-gradient(135deg, #e8a849, #f0c27f);
      box-shadow: 0 2px 12px rgba(232, 168, 73, 0.35);

      &:hover {
        color: #1a1a1a;
        background: linear-gradient(135deg, #f0b85c, #f5d09a);
        box-shadow: 0 4px 20px rgba(232, 168, 73, 0.5);
      }

      &:active {
        transform: scale(0.92);
      }

      svg {
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
      }
    }
  }

  &__play-icon {
    display: flex;
    margin-left: 2px;
  }
}
</style>
