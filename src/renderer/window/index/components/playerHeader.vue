<template>
  <div class="player-header" @mousedown="onMousedown">
    <div v-if="videoStore.activeVideo?.name" class="video-name">
      {{ videoStore.activeVideo?.name }}
    </div>
    <div class="action-button-container" @mousedown.stop>
      <icon class="action-button-item" name="minimize" :size="15" @click="onMinimize"></icon>
      <icon
        v-if="isMaximize"
        class="action-button-item"
        name="maximize"
        :size="13"
        @click="onUnmaximize"
      ></icon>
      <icon
        v-else
        class="action-button-item"
        name="window-maximize"
        :size="13"
        @click="onMaximize"
      ></icon>
      <icon
        class="action-button-item action-button-close"
        name="close"
        :size="17"
        @click="onClose"
      ></icon>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useGlobalEvent } from "@renderer/services/hooks/useGlobalEvent";
import Icon from "./icon/index.vue";
import { GlobalEventEnum } from "@share/enum";
import { ref } from "vue";
import { useDragWin } from "@renderer/services/hooks/useDragWin";
import { useVideoStore } from "../store/video";

const isMaximize = ref(false);

const { onMousedown } = useDragWin();

const videoStore = useVideoStore();

useGlobalEvent(GlobalEventEnum.Maximize, () => {
  isMaximize.value = true;
});

useGlobalEvent(GlobalEventEnum.Unmaximize, () => {
  isMaximize.value = false;
});

const onMinimize = () => {
  window.api.minimizeWin();
};

const onUnmaximize = () => {
  window.api.unmaximizeWin();
};

const onMaximize = () => {
  window.api.maximizeWin();
};

const onClose = () => {
  window.api.closeWin();
};
</script>
