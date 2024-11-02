<template>
  <div class="video-progress-container">
    <span class="video-time">{{ currentTimeLabel }}</span>
    <div class="progress-content" @click="onClick" @mousemove="onMouseMove">
      <span class="hover-tip" :style="{ left: hoverLeft }"> {{ hoverTimeLabel }}</span>
      <div :style="{ width: playWidth }" class="progress-inner">
        <span class="progress-ball"></span>
      </div>
    </div>
    <span class="video-time">{{ durationLabel }}</span>
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
// 鼠标悬浮在进度条位置的时间
const hoverTime = ref(0);
// 动态计算提示的位置
const hoverLeft = ref("0px");

const durationLabel = computed(() => {
  return secondToTime(duration.value);
});

const currentTimeLabel = computed(() => {
  return secondToTime(currentTime.value);
});

const hoverTimeLabel = computed(() => {
  return secondToTime(hoverTime.value);
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

const getProgressInfo = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  //   进度条总长度
  const width = target.scrollWidth;
  const rect = target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const rate = offsetX / width;
  const time = duration.value * rate;
  return { time, rate };
};

// 点击进度条，跳转到指定播放位置
const onClick = (event: MouseEvent) => {
  const { time } = getProgressInfo(event);
  player.seekTo(time);
  currentTime.value = time;
};

const onMouseMove = (event: MouseEvent) => {
  const { time, rate } = getProgressInfo(event);
  hoverTime.value = time;
  hoverLeft.value = `${(rate * 100).toFixed(2)}%`;
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

  .video-time {
    color: #fff;
    font-size: 12px;
  }
  .progress-content {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background-color: hsla(0, 0%, 100%, 0.2);
    margin: 0 20px;
    cursor: pointer;
    position: relative;
    &:hover {
      .hover-tip {
        display: block;
      }
    }
  }
  .progress-inner {
    width: 0;
    position: relative;
    height: 100%;
    border-radius: 3px;
    background-color: #fb6640;
    transition: width 0.4s;
  }
  .progress-ball {
    position: absolute;
    top: 50%;
    right: -7px;
    transform: translateY(-50%);
    width: 14px;
    height: 14px;
    background-color: #fb6640;
    border-radius: 50%;
  }
  .hover-tip {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    font-size: 12px;
    padding: 6px;
    transform: translate(-50%, -130%);
    display: none;
  }
}
</style>
