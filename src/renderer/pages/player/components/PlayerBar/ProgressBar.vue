<template>
  <div class="progress-bar">
    <div
      ref="trackRef"
      class="progress-bar__track"
      @mousedown="onTrackMouseDown"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      @mousemove="onMouseMove"
    >
      <div class="progress-bar__fill" :style="{ width: progressPercent + '%' }">
        <div
          class="progress-bar__thumb"
          :class="{ 'progress-bar__thumb--active': isDragging || isHovering }"
        ></div>
      </div>
      <div
        v-if="isHovering || isDragging"
        class="progress-bar__hover-indicator"
        :style="{ left: hoverPosition + 'px' }"
      >
        {{ formattedHover }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowEvent } from "@renderer/hooks";

import { throttle } from "lodash";
import { ref, computed } from "vue";
import { formatTime } from "../../utils";
import vlcPlayer from "../../player";
import { usePlayerEvent } from "../../hooks";

const currentTime = ref(0);

const duration = ref(0);

const trackRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const isHovering = ref(false);
const hoverPosition = ref(0);
const hoverTime = ref(0);

const progressPercent = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const formattedHover = computed(() => formatTime(hoverTime.value));

function getTimeFromEvent(e: MouseEvent): number {
  if (!trackRef.value) return 0;
  const rect = trackRef.value.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  return ratio * duration.value;
}

const throttledSeek = throttle((time: number) => {
  vlcPlayer.seekTo(time);
}, 100);

function onTrackMouseDown(e: MouseEvent) {
  isDragging.value = true;
  const time = getTimeFromEvent(e);
  currentTime.value = time;
  throttledSeek(time);
}

const onTimeChange = throttle((time: number) => {
  if (isDragging.value) return;
  currentTime.value = time;
}, 200);

function onMouseenter() {
  isHovering.value = true;
}

function onMouseMove(e: MouseEvent) {
  const time = getTimeFromEvent(e);

  hoverTime.value = time;
  if (!duration.value || !trackRef.value) {
    hoverPosition.value = 0;
  } else {
    hoverPosition.value = (time / duration.value) * trackRef.value.clientWidth;
  }
}

function onMouseleave() {
  isHovering.value = false;
}

usePlayerEvent("timechanged", onTimeChange);

usePlayerEvent("lengthchanged", (time) => {
  duration.value = time;
});

useWindowEvent("mousemove", (ev: MouseEvent) => {
  if (!isDragging.value) return;
  const t = getTimeFromEvent(ev);
  currentTime.value = t;
  throttledSeek(t);
});
useWindowEvent("mouseup", () => {
  isDragging.value = false;
});
</script>

<style lang="scss">
.progress-bar {
  width: 100%;
  padding: 8px 20px 4px;

  &__track {
    position: relative;
    flex: 1;
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

  &__fill {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--accent-hover));
    border-radius: 2px;
    transition: height 0.15s ease;
    pointer-events: none;

    .progress-bar__track:hover &,
    .progress-bar__track:active & {
      height: 5px;
    }
  }

  &__thumb {
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 12px;
    height: 12px;
    background: var(--accent-hover);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--accent-glow);
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;

    &--active {
      transform: translateY(-50%) scale(1);
    }
  }

  &__hover-indicator {
    position: absolute;
    bottom: 18px;
    transform: translateX(-50%);
    padding: 3px 6px;
    font-size: 10px;
    color: var(--text-primary);
    background: var(--dark);
    border-radius: 4px;
    pointer-events: none;
    white-space: nowrap;
  }
}
</style>
