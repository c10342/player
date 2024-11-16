<template>
  <div class="vidoe-controls-container">
    <VideoProgress></VideoProgress>
    <div class="button-container">
      <div class="center-button-group">
        <IconFont
          :class="previous ? 'cp' : 'cp-disabled'"
          :size="40"
          :color="previous ? '#fff' : '#aaa'"
          name="skip-previous"
        ></IconFont>
        <IconFont
          class="status-button"
          :size="50"
          color="#fff"
          :name="isPlay ? 'pause' : 'play'"
          @click="onStatusCliick"
        ></IconFont>
        <IconFont
          :class="next ? 'cp' : 'cp-disabled'"
          :size="40"
          :color="next ? '#fff' : '#aaa'"
          name="skip-next"
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
const previous = ref(false);
// 是否可以点击下一个按钮
const next = ref(true);

const onStatusCliick = () => {
  player.toggle();
};

usePlayerEvent(playerEvent.pause, () => {
  isPlay.value = false;
});

usePlayerEvent(playerEvent.play, () => {
  isPlay.value = true;
});
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
