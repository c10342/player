<template>
  <div class="render-frame-container" @click="onClick" @contextmenu="onContextMenu">
    <canvas ref="canvasRef" class="canvas-container"></canvas>
  </div>
</template>

<script setup lang="ts">
import player, { playerEvent } from "@renderer/player";
import { useDomResize, usePlayerEvent } from "@renderer/services/hooks";
import { showContextMenu } from "@renderer/services/jsComponent";
import { debounce } from "lodash";
import { onMounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null | undefined = null;

// 初始化画面帧
const initFrame = () => {
  const canvas = canvasRef.value;
  if (!canvas) {
    return;
  }
  canvas.width = canvas.scrollWidth;
  canvas.height = canvas.scrollHeight;
  renderVideo();
};

// 大小发生变化
useDomResize(() => canvasRef.value, debounce(initFrame, 200));

// 渲染视频
const renderVideo = () => {
  const canvas = canvasRef.value;
  if (!ctx || !canvas) {
    return;
  }
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 根据视频的宽高比，计算绘制信息
  const videoWidth = player.videoWidth;
  const videoHeight = player.videoHeight;
  // 等比缩放
  const rate = videoWidth / videoHeight;

  let renderHeight = canvas.height;
  let y = 0;
  let renderWidth = canvas.width;
  let x = 0;
  if (videoWidth >= videoHeight) {
    // 视频宽大于视频高，以视频宽为标准缩放
    renderHeight = canvas.width / rate;
    y = (canvas.height - renderHeight) / 2;
  } else {
    // 反之以视频高为标准进行缩放
    renderWidth = canvas.height * rate;
    x = (canvas.width - renderWidth) / 2;
  }

  ctx.drawImage(player.videoEl, x, y, renderWidth, renderHeight);
};

// 监听渲染事件
usePlayerEvent(playerEvent.render, renderVideo);

// 加载视频数据，渲染第一帧
usePlayerEvent(playerEvent.loadeddata, renderVideo);

const onContextMenu = (event: MouseEvent) => {
  showContextMenu({
    x: event.clientX,
    y: event.clientY,
    items: [
      {
        key: "1",
        label: "1st menu item",
        title: "1st menu item"
      },
      {
        key: "2",
        label: "2nd menu item",
        title: "2nd menu item"
      },
      {
        key: "3",
        label: "3rd menu item",
        title: "3rd menu item"
      }
    ]
  });
};

const onClick = () => {
  player.toggle();
};

onMounted(() => {
  if (canvasRef.value) {
    // 获取canvas相关东西
    ctx = canvasRef.value.getContext("2d");
    if (ctx) {
      // 关闭图像平滑处理
      ctx.imageSmoothingEnabled = false;
    }
    initFrame();
  }
});
</script>

<style lang="scss" scoped>
.render-frame-container {
  width: 100%;
  height: 100%;
  background-color: #000;
  padding: 20px 0;
  .canvas-container {
    width: 100%;
    height: 100%;
  }
}
</style>
