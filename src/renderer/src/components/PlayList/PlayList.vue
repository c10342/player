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

    <div class="play-list__panel">
      <div class="play-list__header">
        <h2 class="play-list__title">播放列表</h2>
        <div class="play-list__header-actions">
          <button class="play-list__add-btn" title="添加视频" @click="emit('add')">
            <Icon size="16"><AddOutline /></Icon>
          </button>
          <span class="play-list__count">{{ tracks.length }} 首</span>
        </div>
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
          <button class="play-list__item-remove" title="移除" @click.stop="emit('remove', index)">
            <Icon size="14"><CloseOutline /></Icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { ChevronForward, ChevronBack, AddOutline, CloseOutline } from "@vicons/ionicons5";

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
  add: [];
  remove: [index: number];
}>();
</script>

<style lang="scss">
.play-list {
  position: relative;
  display: flex;
  height: 100%;
  flex-shrink: 0;
  width: 250px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &--collapsed {
    width: 0;

    .play-list__toggle {
      border-radius: 4px 0 0 4px;
    }
  }

  &__toggle {
    position: absolute;
    top: 50%;
    left: -24px;
    transform: translateY(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 48px;
    flex-shrink: 0;
    color: var(--text-muted);
    background: var(--surface);
    border: 1px solid var(--border);
    border-right: none;
    border-radius: 4px 0 0 4px;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    width: 304px;
    height: 100%;
    background: var(--surface);
    backdrop-filter: blur(20px);
    border-left: 1px solid var(--border);
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
    padding: 16px 20px 12px;
    border-bottom: 1px solid var(--border);
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--text-secondary);
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: var(--text-primary);
      background: var(--fill-hover);
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: 0.3px;
  }

  &__count {
    font-size: 11px;
    color: var(--text-secondary);
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
      background: var(--border);
      border-radius: 2px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    cursor: pointer;
    transition:
      background 0.15s ease,
      color 0.15s ease;

    &:hover {
      background: var(--fill-hover);

      .play-list__item-remove {
        opacity: 1;
      }
    }

    &--active {
      background: var(--accent-soft);

      .play-list__item-title {
        color: var(--accent);
      }

      .play-list__item-artist {
        color: var(--accent-glow);
      }

      .play-list__item-num {
        color: var(--accent);
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
    color: var(--text-muted);
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
    background: var(--accent);
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
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__item-artist {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__item-duration {
    flex-shrink: 0;
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: var(--text-muted);
  }

  &__item-remove {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--text-muted);
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    transition:
      opacity 0.15s ease,
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: rgb(255 100 100 / 90%);
      background: rgb(255 100 100 / 10%);
    }
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
