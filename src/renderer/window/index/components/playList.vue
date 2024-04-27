<template>
  <div
    class="play-list"
    :style="{ position: isLock ? 'relative' : 'absolute', width: isFold ? 0 : '' }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="action-button-container" @click="togglePlay">
      <div v-if="isEnter" class="action-button" @click.stop>
        <icon v-if="isFold" name="triangle-left" :size="22" @click="openMenu"></icon>
        <template v-else>
          <icon v-if="isLock" name="unlock" :size="16" @click="onUnLock"></icon>
          <icon v-else name="lock" :size="16" @click="onLock"></icon>
        </template>
      </div>
    </div>

    <div class="item-container scroll-bar">
      <play-list-item v-for="i in 20" :key="i"></play-list-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlayListItem from "./playListItem.vue";
import Icon from "./icon/index.vue";
import { ref } from "vue";
import { importMethod } from "../hooks/useMethod";

const { togglePlay } = importMethod();

const isEnter = ref(false);

const isLock = ref(false);

const isFold = ref(true);

let timer: any = null;

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const startTimer = () => {
  clearTimer();

  timer = setTimeout(() => {
    isFold.value = true;
  }, 2000);
};

const onMouseEnter = () => {
  isEnter.value = true;
  clearTimer();
};

const onMouseLeave = () => {
  isEnter.value = false;
  if (!isLock.value) {
    startTimer();
  }
};

const openMenu = () => {
  isFold.value = false;
};

const onLock = () => {
  isLock.value = true;
};

const onUnLock = () => {
  isLock.value = false;
};
</script>
