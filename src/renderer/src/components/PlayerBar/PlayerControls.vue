<template>
  <div class="player-controls">
    <button class="player-controls__btn" title="上一首" @click="emit('prev')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
      </svg>
    </button>

    <button
      class="player-controls__btn player-controls__btn--play"
      :title="playing ? '暂停' : '播放'"
      @click="emit('toggle')"
    >
      <svg v-if="!playing" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M8 5v14l11-7z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
    </button>

    <button class="player-controls__btn" title="停止" @click="emit('stop')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6 6h12v12H6z" />
      </svg>
    </button>

    <button class="player-controls__btn" title="下一首" @click="emit('next')">
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
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

<style scoped lang="scss">
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
}
</style>
