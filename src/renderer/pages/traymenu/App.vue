<template>
  <div ref="menuRef" class="tray-menu" @contextmenu.prevent>
    <div class="tray-menu__inner">
      <div class="tray-menu__header">
        <div class="tray-menu__logo">
          <img :src="logoUrl" alt="logo" width="18" height="18" />
        </div>
        <span class="tray-menu__title">Electron Player</span>
      </div>
      <div class="tray-menu__divider"></div>
      <div class="tray-menu__items">
        <div class="tray-menu__item" @click="handleAction('prev')">
          <div class="tray-menu__item-icon">
            <Icon size="16"><PlaySkipBack /></Icon>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.prev") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('togglePlay')">
          <div class="tray-menu__item-icon tray-menu__item-icon--accent">
            <Icon size="16">
              <Play v-if="!isPlaying" />
              <Pause v-else />
            </Icon>
          </div>
          <span class="tray-menu__item-text">{{
            isPlaying ? t("tray.pause") : t("tray.play")
          }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('stop')">
          <div class="tray-menu__item-icon">
            <Icon size="16"><Stop /></Icon>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.stop") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('next')">
          <div class="tray-menu__item-icon">
            <Icon size="16"><PlaySkipForward /></Icon>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.next") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
      </div>
      <div class="tray-menu__divider"></div>
      <div class="tray-menu__items">
        <div class="tray-menu__item tray-menu__item--danger" @click="handleAction('exit')">
          <div class="tray-menu__item-icon">
            <Icon size="16"><LogOutOutline /></Icon>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.exit") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { Icon } from "@vicons/utils";
import { PlaySkipBack, Play, Pause, Stop, PlaySkipForward, LogOutOutline } from "@vicons/ionicons5";
import { BridgeEnum, GlobalEventEnum } from "@share/enum";
import logoUrl from "@renderer/assets/icon.png";

const { t } = useI18n();

const menuRef = ref<HTMLElement | null>(null);
const isPlaying = ref(false);

const handleAction = (action: string) => {
  switch (action) {
    case "prev":
      window.electronAPI.ipcSend(BridgeEnum.TrayPrev);
      break;
    case "togglePlay":
      window.electronAPI.ipcSend(BridgeEnum.TrayTogglePlay);
      break;
    case "stop":
      window.electronAPI.ipcSend(BridgeEnum.TrayStop);
      break;
    case "next":
      window.electronAPI.ipcSend(BridgeEnum.TrayNext);
      break;
    case "exit":
      window.electronAPI.ipcSend(BridgeEnum.TrayQuit);
      break;
  }
};

const onPlayingChanged = (_event: Electron.IpcRendererEvent, playing: boolean) => {
  isPlaying.value = playing;
};

onMounted(() => {
  window.electronAPI.ipcOn(GlobalEventEnum.TrayPlayingChanged, onPlayingChanged);
  nextTick(() => {
    if (menuRef.value) {
      const { scrollWidth, scrollHeight } = menuRef.value;
      window.electronAPI.ipcSend(BridgeEnum.TrayMenuResize, scrollWidth, scrollHeight);
    }
  });
});

onBeforeUnmount(() => {
  window.electronAPI.ipcOff(GlobalEventEnum.TrayPlayingChanged, onPlayingChanged);
});
</script>

<style lang="scss">
html,
body,
#app {
  background: transparent !important;
  overflow: hidden;
}

.tray-menu {
  display: inline-block;
  box-sizing: border-box;

  &__inner {
    background: rgb(20 20 24 / 92%);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid rgb(255 255 255 / 8%);
    border-radius: 12px;
    padding: 6px;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 5%);
    overflow: hidden;
  }

  &__header {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    white-space: nowrap;
    gap: 8px;
    padding: 8px 10px 6px;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    img {
      border-radius: 4px;
    }
  }

  &__title {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: rgb(255 255 255 / 75%);
  }

  &__divider {
    height: 1px;
    margin: 4px 8px;
    background: linear-gradient(
      90deg,
      transparent,
      rgb(255 255 255 / 8%) 20%,
      rgb(255 255 255 / 8%) 80%,
      transparent
    );
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s ease;
    overflow: hidden;

    &:hover {
      background: rgb(255 255 255 / 6%);

      .tray-menu__item-shine {
        opacity: 1;
      }
    }

    &:active {
      background: rgb(255 255 255 / 10%);
      transform: scale(0.98);
    }

    &--danger {
      &:hover {
        background: rgb(232 17 35 / 12%);

        .tray-menu__item-icon {
          color: #e81123;
        }

        .tray-menu__item-text {
          color: #e81123;
        }
      }
    }
  }

  &__item-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background: linear-gradient(135deg, rgb(255 255 255 / 3%) 0%, transparent 60%);
    transition: opacity 0.2s ease;
  }

  &__item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    color: rgb(255 255 255 / 55%);
    flex-shrink: 0;
    transition: color 0.15s ease;

    &--accent {
      color: #e8a849;
      background: rgb(232 168 73 / 10%);
    }
  }

  &__item-text {
    font-size: 12.5px;
    font-weight: 500;
    color: rgb(255 255 255 / 80%);
    letter-spacing: 0.2px;
    transition: color 0.15s ease;
  }
}
</style>
