<template>
  <div class="play-list" :class="{ 'play-list--collapsed': collapsed }">
    <button
      class="play-list__toggle"
      :title="collapsed ? '展开播放列表' : '收起播放列表'"
      @click="emit('toggle')"
    >
      <Icon size="16">
        <ChevronForward v-if="collapsed" />
        <ChevronBack v-else />
      </Icon>
    </button>

    <div v-if="!collapsed" class="play-list__panel">
      <div class="play-list__header">
        <h2 class="play-list__title">播放列表</h2>
        <span class="play-list__count">{{ tracks.length }} 首</span>
      </div>

      <div class="play-list__body">
        <div
          v-for="(track, index) in tracks"
          :key="track.id"
          class="play-list__item"
          :class="{ 'play-list__item--active': index === activeIndex }"
          @click="emit('select', index)"
        >
          <div class="play-list__item-index">
            <span v-if="index === activeIndex" class="play-list__item-playing">
              <span class="play-list__bar"></span>
              <span class="play-list__bar"></span>
              <span class="play-list__bar"></span>
            </span>
            <span v-else class="play-list__item-num">{{ String(index + 1).padStart(2, "0") }}</span>
          </div>
          <div class="play-list__item-info">
            <span class="play-list__item-title">{{ track.title }}</span>
            <span class="play-list__item-artist">{{ track.artist }}</span>
          </div>
          <span class="play-list__item-duration">{{ track.duration }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { ChevronForward, ChevronBack } from "@vicons/ionicons5";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
}

defineProps<{
  tracks: Track[];
  activeIndex: number;
  collapsed: boolean;
}>();

const emit = defineEmits<{
  select: [index: number];
  toggle: [];
}>();
</script>

<style scoped lang="scss">
.play-list {
  display: flex;
  height: 100%;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--collapsed {
    .play-list__toggle {
      border-radius: 4px 0 0 4px;
    }
  }

  &__toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 48px;
    flex-shrink: 0;
    align-self: center;
    color: rgba(255, 255, 255, 0.35);
    background: rgba(14, 14, 16, 0.6);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-right: none;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
      background: rgba(255, 255, 255, 0.06);
    }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    width: 280px;
    height: 100%;
    background: rgba(14, 14, 16, 0.6);
    backdrop-filter: blur(20px);
    border-left: 1px solid rgba(255, 255, 255, 0.04);
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 16px 20px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.3px;
  }

  &__count {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
  }

  &__body {
    flex: 1;
    overflow-y: auto;
    padding: 4px 0;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 2px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 20px;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }

    &--active {
      background: rgba(232, 168, 73, 0.08);

      .play-list__item-title {
        color: #e8a849;
      }

      .play-list__item-artist {
        color: rgba(232, 168, 73, 0.5);
      }

      .play-list__item-num {
        color: #e8a849;
      }
    }
  }

  &__item-index {
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }

  &__item-num {
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.2);
  }

  &__item-playing {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
    height: 14px;
  }

  &__bar {
    width: 3px;
    background: #e8a849;
    border-radius: 1px;
    animation: bar-bounce 0.8s ease-in-out infinite;

    &:nth-child(1) {
      height: 6px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      height: 10px;
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      height: 4px;
      animation-delay: 0.3s;
    }
  }

  &__item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__item-title {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__item-artist {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__item-duration {
    flex-shrink: 0;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.25);
  }
}

@keyframes bar-bounce {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.4);
  }
}
</style>
