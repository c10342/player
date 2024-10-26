<template>
  <div class="video-progress-container">
    <span class="video-tiime">{{ currentTimeLabel }}</span>
    <div class="progress-content" @click="onClick">
      <div :style="{ width: playWidth }" class="progress-inner">
        <span class="progress-ball"></span>
      </div>
    </div>
    <span class="video-tiime">{{ durationLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import player, { playerEvent } from "@renderer/player";
import { usePlayerEvent } from "@renderer/services/hooks";
import { secondToTime } from "@renderer/services/utils";
import { throttle } from "lodash";
import { computed, ref } from "vue";

const duration = ref(player.duration);
const currentTime = ref(player.currentTime);

const durationLabel = computed(() => {
  return secondToTime(duration.value);
});

const currentTimeLabel = computed(() => {
  return secondToTime(currentTime.value);
});

// 已经播放的进度
const playWidth = computed(() => {
  if (!duration.value || !currentTime.value) {
    return "0%";
  }
  let rate = currentTime.value / duration.value;
  rate = rate * 100;
  return `${rate.toFixed(2)}%`;
});

// 点击进度条，跳转到指定播放位置
const onClick = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  //   进度条总长度
  const width = target.scrollWidth;
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const rate = offsetX / width;
  const time = duration.value * rate;
  player.seekTo(time);
  currentTime.value = time;
};

usePlayerEvent(playerEvent.loadedmetadata, () => {
  duration.value = player.duration;
});

usePlayerEvent(
  playerEvent.timeupdate,
  throttle(() => {
    currentTime.value = player.currentTime;
  }, 1000)
);
</script>

<style lang="scss" scoped>
.video-progress-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  .video-tiime {
    color: #fff;
    font-size: 12px;
  }
  .progress-content {
    flex: 1;
    height: 4px;
    border-radius: 2px;
    background-color: red;
    margin: 0 20px;
    cursor: pointer;
  }
  .progress-inner {
    width: 0;
    position: relative;
    height: 100%;
    border-radius: 2px;
    background-color: green;
    transition: width 0.4s;
  }
  .progress-ball {
    position: absolute;
    top: 50%;
    right: -7px;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background-color: yellow;
    border-radius: 50%;
  }
}
</style>
