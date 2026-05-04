<template>
  <div
    class="play-list-item"
    :class="[isActive && 'play-list-item--active', hasError && 'play-list-item--error']"
    :title="item.name"
    @dblclick="onSelectVideo"
    @contextmenu.prevent="onContextMenu"
  >
    <div class="play-list-item__index">
      <span v-if="hasError" class="play-list-item__error-icon">
        <Icon size="16"><AlertCircleOutline /></Icon>
      </span>
      <span v-else-if="isActive" class="play-list-item__playing">
        <span class="play-list-item__bar"></span>
        <span class="play-list-item__bar"></span>
        <span class="play-list-item__bar"></span>
      </span>
      <span v-else class="play-list-item__num">{{ String(index + 1).padStart(2, "0") }}</span>
    </div>
    <div class="play-list-item__info">
      <span class="play-list-item__title">{{ item.name }}</span>
      <span v-if="hasError" class="play-list-item__error-text">{{ item.error }}</span>
      <span v-else class="play-list-item__artist">{{ formatFileSize(item.size) }}</span>
    </div>
    <button
      class="play-list-item__remove"
      :title="t('playList.remove')"
      @click.stop="onRemoveVideo"
    >
      <Icon size="14"><CloseOutline /></Icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import {
  CloseOutline,
  AlertCircleOutline,
  FolderOpenOutline,
  TrashOutline,
  PlayOutline,
  PauseOutline
} from "@vicons/ionicons5";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { usePlayerStore } from "../../stores";
import { formatFileSize } from "../../utils";
import { PlayerListItem } from "@share/type";
import { showContextMenu } from "@renderer/components/ContextMenu/contextMenu";
import { BridgeEnum } from "@share/enum";
import vlcPlayer from "../../player";

const { t } = useI18n();

const props = defineProps<{
  item: PlayerListItem;
  index: number;
}>();

const playerStore = usePlayerStore();

const isActive = computed(() => props.item.path === playerStore.activeId);
const hasError = computed(() => !!props.item.error);

const onSelectVideo = () => {
  playerStore.changeCurrentVideo(props.item);
};
const onRemoveVideo = () => {
  playerStore.removeVideo(props.item);
};

const onContextMenu = (e: MouseEvent) => {
  const isCurrentPlaying = isActive.value && vlcPlayer.isPlaying;

  showContextMenu({
    x: e.clientX,
    y: e.clientY,
    items: [
      {
        label: isCurrentPlaying ? t("contextMenu.pause") : t("contextMenu.play"),
        icon: isCurrentPlaying ? PauseOutline : PlayOutline,
        action: () => {
          if (isActive.value) {
            vlcPlayer.toggle();
          } else {
            playerStore.changeCurrentVideo(props.item);
          }
        }
      },
      {
        label: t("contextMenu.openInFolder"),
        icon: FolderOpenOutline,
        action: () => window.electronAPI[BridgeEnum.ShowItemInFolder](props.item.path)
      },
      {
        label: t("contextMenu.remove"),
        icon: TrashOutline,
        divided: true,
        action: () => playerStore.removeVideo(props.item)
      }
    ]
  });
};
</script>

<style lang="scss">
.play-list-item {
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

    .play-list-item__remove {
      opacity: 1;
    }
  }

  &--active {
    background: var(--accent-soft);

    .play-list-item__title {
      color: var(--accent);
    }

    .play-list-item__artist {
      color: var(--accent-glow);
    }

    .play-list-item__num {
      color: var(--accent);
    }
  }

  &--error {
    position: relative;
    cursor: default;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 4px;
      bottom: 4px;
      width: 2px;
      border-radius: 1px;
      background: var(--danger);
      opacity: 0.7;
    }

    &:hover {
      background: rgb(232 17 35 / 5%);

      .play-list-item__remove {
        opacity: 1;
      }
    }

    .play-list-item__title {
      color: var(--text-muted);
      text-decoration: line-through;
      text-decoration-color: rgb(255 255 255 / 15%);
    }

    .play-list-item__remove {
      opacity: 1;
    }
  }

  &__index {
    flex-shrink: 0;
    width: 24px;
    text-align: center;
  }

  &__num {
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    color: var(--text-muted);
  }

  &__playing {
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

  &__info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__title {
    font-size: 13px;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
  }

  &__artist {
    font-size: 11px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s ease;
    margin-top: 4px;
  }

  &__error-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--danger);
    animation: error-pulse 2s ease-in-out infinite;
  }

  &__error-text {
    font-size: 11px;
    color: var(--danger);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
    opacity: 0.85;
  }

  &__remove {
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

@keyframes error-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
