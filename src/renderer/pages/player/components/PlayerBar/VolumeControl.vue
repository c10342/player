<template>
  <div class="volume-control" @mouseenter="showSlider = true" @mouseleave="showSlider = false">
    <button class="volume-control__btn" @click="onToggleMute">
      <Icon size="18">
        <VolumeMute v-if="isMuted || volume === 0" />
        <VolumeLow v-else-if="volume < 0.5" />
        <VolumeHigh v-else />
      </Icon>
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
import { Icon } from "@vicons/utils";
import { VolumeHigh, VolumeLow, VolumeMute } from "@vicons/ionicons5";
import vlcPlayer from "../../player";

// 0-1，但是实际是0-100，需要转换一下
const volume = ref(1);

const isMuted = ref(false);

const trackRef = ref<HTMLElement | null>(null);
const showSlider = ref(false);

function getVolumeFromEvent(e: MouseEvent): number {
  if (!trackRef.value) return 0;
  const rect = trackRef.value.getBoundingClientRect();
  return Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
}

function onMouseDown(e: MouseEvent) {
  const vol = getVolumeFromEvent(e);
  onVolumeChange(vol);

  const onMouseMove = (ev: MouseEvent) => {
    onVolumeChange(getVolumeFromEvent(ev));
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

const onVolumeChange = (data: number) => {
  vlcPlayer.setVolume(data * 100);
  volume.value = data;
};

const onToggleMute = () => {
  if (isMuted.value) {
    vlcPlayer.setVolume(volume.value * 100);
  } else {
    vlcPlayer.setVolume(0);
  }
  isMuted.value = !isMuted.value;
};

const init = () => {
  if (vlcPlayer.volume !== -1) {
    volume.value = vlcPlayer.volume / 100;
  }
  isMuted.value = vlcPlayer.volume === 0;
};

init();
</script>

<style lang="scss">
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
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition:
      color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }
  }

  &__slider-wrap {
    width: 0;
    // overflow: hidden;
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
      background: var(--border);
      border-radius: 2px;
    }
  }

  &__slider-fill {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-hover));
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
    background: var(--accent-hover);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--accent-glow);
    opacity: 0;
    transition: opacity 0.15s ease;
    pointer-events: none;

    .volume-control__slider-track:hover & {
      opacity: 1;
    }
  }
}
</style>
