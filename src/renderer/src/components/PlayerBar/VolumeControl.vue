<template>
  <div class="volume-control" @mouseenter="showSlider = true" @mouseleave="showSlider = false">
    <button class="volume-control__btn" @click="emit('toggleMute')">
      <svg
        v-if="isMuted || volume === 0"
        viewBox="0 0 24 24"
        fill="currentColor"
        width="18"
        height="18"
      >
        <path
          d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
        />
      </svg>
      <svg v-else-if="volume < 0.5" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path
          d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
        />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path
          d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
        />
      </svg>
    </button>

    <div
      class="volume-control__slider-wrap"
      :class="{ 'volume-control__slider-wrap--visible': showSlider }"
    >
      <div ref="trackRef" class="volume-control__slider-track" @mousedown="onMouseDown">
        <div class="volume-control__slider-fill" :style="{ width: volume * 100 + '%' }">
          <div class="volume-control__slider-thumb"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  volume: number;
  isMuted: boolean;
}>();

const emit = defineEmits<{
  changeVolume: [volume: number];
  toggleMute: [];
}>();

const trackRef = ref<HTMLElement | null>(null);
const showSlider = ref(false);

function getVolumeFromEvent(e: MouseEvent): number {
  if (!trackRef.value) return 0;
  const rect = trackRef.value.getBoundingClientRect();
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
}

function onMouseDown(e: MouseEvent) {
  const vol = getVolumeFromEvent(e);
  emit("changeVolume", vol);

  const onMouseMove = (ev: MouseEvent) => {
    emit("changeVolume", getVolumeFromEvent(ev));
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}
</script>

<style scoped lang="scss">
.volume-control {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;

  &__btn {
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

  &__slider-wrap {
    width: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      width 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.2s ease;

    &--visible {
      width: 90px;
      opacity: 1;
    }
  }

  &__slider-track {
    position: relative;
    width: 100%;
    height: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
    }
  }

  &__slider-fill {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 3px;
    background: linear-gradient(90deg, #e8a849, #f0c27f);
    border-radius: 2px;
    transition: height 0.15s ease;
    pointer-events: none;

    .volume-control__slider-track:hover & {
      height: 4px;
    }
  }

  &__slider-thumb {
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    background: #f0c27f;
    border-radius: 50%;
    box-shadow: 0 0 6px rgba(240, 194, 127, 0.4);
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;

    .volume-control__slider-track:hover & {
      opacity: 1;
    }
  }
}
</style>
