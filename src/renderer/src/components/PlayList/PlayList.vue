<template>
  <div class="play-list" :class="{ 'play-list--collapsed': playListCollapsed }">
    <button
      class="play-list__toggle"
      :title="playListCollapsed ? t('playList.expand') : t('playList.collapse')"
      @click="playListCollapsed = !playListCollapsed"
    >
      <Icon size="16">
        <ChevronForward v-if="playListCollapsed" />
        <ChevronBack v-else />
      </Icon>
    </button>

    <div class="play-list__panel">
      <div class="play-list__header">
        <h2 class="play-list__title">{{ t("playList.title") }}</h2>
        <div class="play-list__header-actions">
          <button class="play-list__add-btn" :title="t('playList.addVideo')" @click="onAddVideo">
            <Icon size="16"><AddOutline /></Icon>
          </button>
          <span class="play-list__count"
            >{{ playerStore.playerList.length }} {{ t("playList.count") }}</span
          >
        </div>
      </div>

      <div class="play-list__body">
        <PlayListItem
          v-for="(item, index) in playerStore.playerList"
          :key="item.path"
          :item="item"
          :index="index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { ChevronForward, ChevronBack, AddOutline } from "@vicons/ionicons5";
import { ref } from "vue";
import { usePlayerStore } from "@renderer/stores";
import { addVideoFile } from "@renderer/utils";
import PlayListItem from "./PlayListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playerStore = usePlayerStore();

const playListCollapsed = ref(false);

const onAddVideo = () => {
  addVideoFile();
};
</script>

<style lang="scss">
.play-list {
  position: relative;
  display: flex;
  height: 100%;
  flex-shrink: 0;
  // width: 250px;
  max-width: 250px;
  width: 30%;
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
}
</style>
