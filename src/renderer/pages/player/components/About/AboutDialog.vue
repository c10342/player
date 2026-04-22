<template>
  <Transition name="about-overlay">
    <div v-if="visible" class="about-overlay" @click.self="close">
      <Transition name="about-dialog">
        <div v-if="visible" class="about-dialog">
          <div class="about-dialog__header">
            <div class="about-dialog__logo">
              <div class="about-dialog__logo-ring"></div>
              <span class="about-dialog__logo-text">EP</span>
            </div>
            <button class="about-dialog__close" @click="close">
              <Icon size="14"><Close /></Icon>
            </button>
          </div>

          <div class="about-dialog__body">
            <h2 class="about-dialog__name">Electron Player</h2>
            <div class="about-dialog__version">
              <span class="about-dialog__version-label">{{ t("about.version") }}</span>
              <span class="about-dialog__version-value">v{{ appVersion }}</span>
            </div>

            <div class="about-dialog__status">
              <Transition name="about-status" mode="out-in">
                <div v-if="status === 'idle'" class="about-dialog__status-idle">
                  <div class="about-dialog__status-dot"></div>
                  <span>{{ t("about.checkForUpdates") }}</span>
                </div>
                <div v-else-if="status === 'checking'" class="about-dialog__status-checking">
                  <div class="about-dialog__spinner"></div>
                  <span>{{ t("about.checking") }}</span>
                </div>
                <div v-else-if="status === 'available'" class="about-dialog__status-available">
                  <Icon size="14" class="about-dialog__status-icon"><CloudDownloadOutline /></Icon>
                  <span>{{ t("about.updateAvailable", { version: newVersion }) }}</span>
                  <button class="about-dialog__action-btn" @click="onDownload">
                    {{ t("about.downloadUpdate") }}
                  </button>
                </div>
                <div v-else-if="status === 'downloading'" class="about-dialog__status-downloading">
                  <div class="about-dialog__progress-bar">
                    <div
                      class="about-dialog__progress-fill"
                      :style="{ width: progress + '%' }"
                    ></div>
                  </div>
                  <span class="about-dialog__progress-text">{{
                    t("about.downloading", { progress: progress.toFixed(1) })
                  }}</span>
                </div>
                <div v-else-if="status === 'downloaded'" class="about-dialog__status-downloaded">
                  <Icon size="14" class="about-dialog__status-icon"
                    ><CheckmarkCircleOutline
                  /></Icon>
                  <span>{{ t("about.downloadComplete") }}</span>
                  <button
                    class="about-dialog__action-btn about-dialog__action-btn--primary"
                    @click="onInstall"
                  >
                    {{ t("about.installAndRestart") }}
                  </button>
                </div>
                <div v-else-if="status === 'not-available'" class="about-dialog__status-ok">
                  <Icon size="14" class="about-dialog__status-icon"
                    ><CheckmarkCircleOutline
                  /></Icon>
                  <span>{{ t("about.updateNotAvailable") }}</span>
                </div>
                <div v-else-if="status === 'error'" class="about-dialog__status-error">
                  <Icon size="14" class="about-dialog__status-icon"><AlertCircleOutline /></Icon>
                  <span>{{ t("about.updateError", { message: errorMsg }) }}</span>
                </div>
              </Transition>
            </div>
          </div>

          <div class="about-dialog__footer">
            <button
              v-if="status === 'idle' || status === 'not-available' || status === 'error'"
              class="about-dialog__check-btn"
              @click="onCheck"
            >
              {{ t("about.checkForUpdates") }}
            </button>
            <button
              v-else
              class="about-dialog__check-btn about-dialog__check-btn--disabled"
              disabled
            >
              {{ t("about.checkForUpdates") }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@vicons/utils";
import {
  Close,
  CloudDownloadOutline,
  CheckmarkCircleOutline,
  AlertCircleOutline
} from "@vicons/ionicons5";
import { useI18n } from "vue-i18n";
import { GlobalEventEnum } from "@share/enum";
import { useIpcEvent } from "@renderer/hooks";

type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "downloaded"
  | "not-available"
  | "error";

const { t } = useI18n();

const visible = defineModel<boolean>("visible", { default: false });

const appVersion = ref("");

onMounted(async () => {
  appVersion.value = await window.electronAPI.getAppVersion();
});

const status = ref<UpdateStatus>("idle");
const newVersion = ref("");
const progress = ref(0);
const errorMsg = ref("");

const close = () => {
  visible.value = false;
};

const resetState = () => {
  status.value = "idle";
  newVersion.value = "";
  progress.value = 0;
  errorMsg.value = "";
};

const onCheck = () => {
  resetState();
  status.value = "checking";
  window.electronAPI.checkForUpdate();
};

const onDownload = () => {
  status.value = "downloading";
  progress.value = 0;
  window.electronAPI.downloadUpdate();
};

const onInstall = () => {
  window.electronAPI.installUpdate();
};

useIpcEvent(GlobalEventEnum.UpdateAvailable, (_e, info: { version: string }) => {
  newVersion.value = info.version;
  status.value = "available";
});

useIpcEvent(GlobalEventEnum.UpdateNotAvailable, () => {
  status.value = "not-available";
});

useIpcEvent(GlobalEventEnum.UpdateDownloadProgress, (_e, progressInfo: { percent: number }) => {
  progress.value = progressInfo.percent;
});

useIpcEvent(GlobalEventEnum.UpdateDownloaded, () => {
  status.value = "downloaded";
});

useIpcEvent(GlobalEventEnum.UpdateError, (_e, err: { message: string }) => {
  errorMsg.value = err.message;
  status.value = "error";
});
</script>

<style lang="scss" scoped>
.about-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 60%);
  backdrop-filter: blur(8px);
}

.about-dialog {
  width: 360px;
  overflow: hidden;
  background: var(--surface-bar);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 3%),
    0 20px 60px rgb(0 0 0 / 50%);

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px 16px 12px;
  }

  &__logo {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
  }

  &__logo-ring {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--accent), var(--accent-glow));
    opacity: 0.15;
  }

  &__logo-text {
    position: relative;
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--accent);
    letter-spacing: -0.5px;
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    color: var(--text-muted);
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: var(--text-secondary);
      background: var(--fill-hover);
    }
  }

  &__body {
    padding: 4px 24px 20px;
    text-align: center;
  }

  &__name {
    font-family: "Georgia", "Times New Roman", serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.3px;
  }

  &__version {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 6px;
  }

  &__version-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  &__version-value {
    font-size: 12px;
    color: var(--accent);
    font-variant-numeric: tabular-nums;
  }

  &__status {
    min-height: 36px;
    margin-top: 16px;
    padding: 8px 12px;
    background: rgb(255 255 255 / 3%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__status-idle,
  &__status-checking,
  &__status-available,
  &__status-downloading,
  &__status-downloaded,
  &__status-ok,
  &__status-error {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    line-height: 1;
    color: var(--text-secondary);
  }

  &__status-dot {
    width: 6px;
    height: 6px;
    background: var(--text-muted);
    border-radius: 50%;
  }

  &__spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: about-spin 0.8s linear infinite;
  }

  &__status-icon {
    flex-shrink: 0;
  }

  &__status-ok &__status-icon {
    color: #4ade80;
  }

  &__status-error &__status-icon {
    color: var(--danger);
  }

  &__status-downloaded &__status-icon {
    color: var(--accent);
  }

  &__progress-bar {
    width: 100%;
    height: 4px;
    margin-bottom: 6px;
    overflow: hidden;
    background: var(--border);
    border-radius: 2px;
  }

  &__progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent-hover));
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  &__progress-text {
    font-variant-numeric: tabular-nums;
  }

  &__action-btn {
    padding: 2px 10px;
    font-size: 11px;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid var(--accent-glow);
    border-radius: 4px;
    cursor: pointer;
    transition:
      background 0.15s ease,
      border-color 0.15s ease;

    &:hover {
      background: rgb(232 168 73 / 15%);
      border-color: var(--accent);
    }

    &--primary {
      color: #0a0a0c;
      background: var(--accent);
      border-color: var(--accent);

      &:hover {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
      }
    }
  }

  &__footer {
    padding: 0 24px 20px;
  }

  &__check-btn {
    width: 100%;
    padding: 9px 0;
    font-size: 13px;
    color: var(--accent);
    background: var(--accent-soft);
    border: 1px solid var(--accent-glow);
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      background: rgb(232 168 73 / 15%);
      border-color: var(--accent);
      box-shadow: 0 0 20px var(--accent-glow);
    }

    &--disabled {
      color: var(--text-muted);
      background: transparent;
      border-color: var(--border);
      cursor: not-allowed;

      &:hover {
        background: transparent;
        border-color: var(--border);
        box-shadow: none;
      }
    }
  }
}

@keyframes about-spin {
  to {
    transform: rotate(360deg);
  }
}

.about-overlay-enter-active,
.about-overlay-leave-active {
  transition: opacity 0.2s ease;
}

.about-overlay-enter-from,
.about-overlay-leave-to {
  opacity: 0;
}

.about-dialog-enter-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.about-dialog-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.about-dialog-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}

.about-dialog-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(4px);
}

.about-status-enter-active,
.about-status-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.about-status-enter-from {
  opacity: 0;
  transform: translateY(4px);
}

.about-status-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
