<template>
  <div class="video-player">
    <div class="video-player__content">
      <div class="video-player__empty">
        <button class="video-player__add-btn" @click="emit('add')">
          <Icon size="32"><AddOutline /></Icon>
          <span class="video-player__add-btn-text">添加视频</span>
        </button>
      </div>
    </div>

    <PlayList
      :tracks="tracks"
      :active-index="activeIndex"
      :collapsed="playListCollapsed"
      @select="(index: number) => emit('select', index)"
      @toggle="playListCollapsed = !playListCollapsed"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@vicons/utils";
import { AddOutline } from "@vicons/ionicons5";
import PlayList from "../PlayList/PlayList.vue";
import type { Track } from "../PlayList/PlayList.vue";

defineProps<{
  tracks: Track[];
  activeIndex: number;
  isPlaying: boolean;
}>();

const emit = defineEmits<{
  select: [index: number];
  add: [];
}>();

const playListCollapsed = ref(false);
</script>

<style lang="scss">
.video-player {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: calc(100% - 36px - 80px);

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 48px;
    background: transparent;
    border: 2px dashed rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.8);
    transition:
      border-color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: rgba(255, 255, 255, 1);
      border-color: rgba(255, 255, 255, 1);
      background: rgba(255, 255, 255, 0.06);
    }
  }

  &__add-btn-text {
    font-size: 14px;
    letter-spacing: 0.5px;
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

@keyframes vinyl-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
