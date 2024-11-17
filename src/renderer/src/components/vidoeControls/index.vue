<template>
  <div class="vidoe-controls-container">
    <VideoProgress></VideoProgress>
    <div class="button-container">
      <div class="center-button-group">
        <IconFont
          :class="!disabledPrev ? 'cp' : 'cp-disabled'"
          :size="40"
          :color="!disabledPrev ? '#fff' : '#aaa'"
          name="skip-previous"
          @click="onPrev"
        ></IconFont>
        <IconFont
          class="status-button"
          :size="50"
          color="#fff"
          :name="isPlay ? 'pause' : 'play'"
          @click="onToggle"
        ></IconFont>
        <IconFont
          :class="!disabledNext ? 'cp' : 'cp-disabled'"
          :size="40"
          :color="!disabledNext ? '#fff' : '#aaa'"
          name="skip-next"
          @click="onNext"
        ></IconFont>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import player, { playerEvent } from "@renderer/player";
import VideoProgress from "./videoProgress.vue";
import { ref } from "vue";
import { usePlayerEvent } from "@renderer/services/hooks";

// 是否正在播放
const isPlay = ref(player.isPlay);
// 是否可以点击上一个按钮
const disabledPrev = ref(false);
// 是否可以点击下一个按钮
const disabledNext = ref(false);

const onToggle = () => {
  player.toggle();
};

const onPrev = async () => {
  if (!disabledPrev.value) {
    await player.prev();
    await player.play();
  }
};

const onNext = async () => {
  if (!disabledNext.value) {
    await player.next();
    await player.play();
  }
};

// 初始化上一个/下一个按钮状态
const initButtonStatus = async () => {
  const index = await player.findVideoIndex(player.currentVideo?.url);
  if (index > -1) {
    disabledNext.value = index === player.playList.length - 1;
    disabledPrev.value = index === 0;
  } else {
    disabledNext.value = false;
    disabledPrev.value = false;
  }
};

initButtonStatus();

usePlayerEvent(playerEvent.pause, () => {
  isPlay.value = false;
});

usePlayerEvent(playerEvent.play, () => {
  isPlay.value = true;
});

usePlayerEvent(playerEvent.add, initButtonStatus);

usePlayerEvent(playerEvent.remove, initButtonStatus);

usePlayerEvent(playerEvent.switch, initButtonStatus);
</script>

<style lang="scss" scoped>
.vidoe-controls-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 10;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  .button-container {
    flex: 1;
    position: relative;
    .center-button-group {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .status-button {
    cursor: pointer;
    margin: 0 10px;
  }
}
</style>
