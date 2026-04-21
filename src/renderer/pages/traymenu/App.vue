<template>
  <div class="tray-menu" @contextmenu.prevent>
    <div class="tray-menu__inner">
      <div class="tray-menu__header">
        <div class="tray-menu__logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#e8a849" />
                <stop offset="100%" stop-color="#f0c27f" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="11" stroke="url(#logoGrad)" stroke-width="1.5" fill="none" />
            <polygon points="10,7.5 17,12 10,16.5" fill="url(#logoGrad)" />
          </svg>
        </div>
        <span class="tray-menu__title">Electron Player</span>
      </div>
      <div class="tray-menu__divider"></div>
      <div class="tray-menu__items">
        <div class="tray-menu__item" @click="handleAction('prev')">
          <div class="tray-menu__item-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.prev") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('togglePlay')">
          <div class="tray-menu__item-icon tray-menu__item-icon--accent">
            <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
          <span class="tray-menu__item-text">{{
            isPlaying ? t("tray.pause") : t("tray.play")
          }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('stop')">
          <div class="tray-menu__item-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.stop") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
        <div class="tray-menu__item" @click="handleAction('next')">
          <div class="tray-menu__item-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.next") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
      </div>
      <div class="tray-menu__divider"></div>
      <div class="tray-menu__items">
        <div class="tray-menu__item tray-menu__item--danger" @click="handleAction('exit')">
          <div class="tray-menu__item-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          <span class="tray-menu__item-text">{{ t("tray.exit") }}</span>
          <div class="tray-menu__item-shine"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { BridgeEnum, GlobalEventEnum } from "@share/enum";

const { t } = useI18n();

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
  padding: 6px;
  height: 100%;
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
    gap: 8px;
    padding: 8px 10px 6px;
  }

  &__logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
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
