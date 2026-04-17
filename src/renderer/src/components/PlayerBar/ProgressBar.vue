<template>
  <div class="progress-bar">
    <span class="progress-bar__time progress-bar__time--current">{{ formattedCurrent }}</span>
    <div
      ref="trackRef"
      class="progress-bar__track"
      @mousedown="onTrackMouseDown"
      @mouseenter="isHovering = true"
      @mouseleave="isHovering = false"
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
    <span class="progress-bar__time progress-bar__time--total">{{ formattedDuration }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  currentTime: number;
  duration: number;
}>();

const emit = defineEmits<{
  seek: [time: number];
}>();

const trackRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);
const isHovering = ref(false);
const hoverPosition = ref(0);
const hoverTime = ref(0);

const progressPercent = computed(() => {
  if (!props.duration) return 0;
  return (props.currentTime / props.duration) * 100;
});

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const formattedCurrent = computed(() => formatTime(props.currentTime));
const formattedDuration = computed(() => formatTime(props.duration));
const formattedHover = computed(() => formatTime(hoverTime.value));

function getTimeFromEvent(e: MouseEvent): number {
  if (!trackRef.value) return 0;
  const rect = trackRef.value.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  return ratio * props.duration;
}

function onTrackMouseDown(e: MouseEvent) {
  isDragging.value = true;
  const time = getTimeFromEvent(e);
  emit("seek", time);

  const onMouseMove = (ev: MouseEvent) => {
    const t = getTimeFromEvent(ev);
    emit("seek", t);
  };

  const onMouseUp = () => {
    isDragging.value = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}
</script>

<style scoped lang="scss">
.progress-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0 4px;

  &__time {
    flex-shrink: 0;
    min-width: 38px;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
    color: rgba(255, 255, 255, 0.45);

    &--current {
      text-align: right;
    }

    &--total {
      text-align: left;
    }
  }

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
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
    }
  }

  &__fill {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 3px;
    background: linear-gradient(90deg, #e8a849, #f0c27f);
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
    background: #f0c27f;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(240, 194, 127, 0.5);
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
    color: rgba(255, 255, 255, 0.9);
    background: rgba(30, 30, 30, 0.9);
    border-radius: 4px;
    pointer-events: none;
    white-space: nowrap;
  }
}
</style>
