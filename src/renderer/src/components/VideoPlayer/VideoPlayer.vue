<template>
  <div class="video-player">
    <div class="video-player__content">
      <div v-if="!playerStore.activeId" class="video-player__empty">
        <button class="video-player__add-btn" @click="onAddClick">
          <Icon size="32"><AddOutline /></Icon>
          <span class="video-player__add-btn-text">添加视频</span>
        </button>
      </div>
      <canvas id="cv" class="video-player__canvas"></canvas>
    </div>

    <PlayList />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@vicons/utils";
import { AddOutline } from "@vicons/ionicons5";
import PlayList from "../PlayList/PlayList.vue";
import { addVideoFile } from "@renderer/utils";
import { usePlayerStore } from "@renderer/stores";
import { onMounted } from "vue";
import { usePlayerEvent, useWindowEvent } from "@renderer/hooks";

let cv: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
const playerStore = usePlayerStore();

const onAddClick = () => {
  addVideoFile();
};

let pendingFrame: any = null;
let renderScheduled = false;
let videoW = 0;
let videoH = 0;

let offscreenCanvas: HTMLCanvasElement | null = null;

let offscreenCtx: CanvasRenderingContext2D | null = null;
const canvasRect = { width: 0, height: 0 };

function resizeCanvas() {
  const rect = cv.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;
  canvasRect.width = rect.width;
  canvasRect.height = rect.height;
  const dpr = window.devicePixelRatio || 1;
  cv.width = Math.floor(rect.width * dpr);
  cv.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function renderFrame() {
  renderScheduled = false;
  if (!pendingFrame) return;

  const frame = pendingFrame;
  const w = videoW;
  const h = videoH;
  pendingFrame = null;

  if (w <= 0 || h <= 0) return;

  if (!offscreenCanvas || w !== offscreenCanvas.width || h !== offscreenCanvas.height) {
    offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    offscreenCtx = offscreenCanvas.getContext("2d");
  }

  const pixelCount = w * h;
  const buf32 = new Uint32Array(frame.buffer, frame.byteOffset, pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const p = buf32[i];
    buf32[i] = (p & 0xff00ff00) | ((p >> 16) & 0xff) | ((p & 0xff) << 16);
  }

  const imgData = offscreenCtx!.createImageData(w, h);
  imgData.data.set(new Uint8ClampedArray(frame.buffer, frame.byteOffset, pixelCount * 4));
  offscreenCtx!.putImageData(imgData, 0, 0);

  const dw = canvasRect.width;
  const dh = canvasRect.height;
  if (dw <= 0 || dh <= 0) return;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, dw, dh);

  const scale = Math.min(dw / w, dh / h);
  const drawW = w * scale;
  const drawH = h * scale;
  ctx.drawImage(offscreenCanvas, (dw - drawW) / 2, (dh - drawH) / 2, drawW, drawH);
}
usePlayerEvent("frame", (frame: any, w: number, h: number) => {
  pendingFrame = frame;
  videoW = w;
  videoH = h;
  if (!renderScheduled) {
    renderScheduled = true;
    requestAnimationFrame(renderFrame);
  }
});

useWindowEvent("resize", resizeCanvas);

onMounted(() => {
  cv = document.getElementById("cv") as HTMLCanvasElement;
  ctx = cv.getContext("2d") as CanvasRenderingContext2D;
  resizeCanvas();
});
</script>

<style lang="scss">
.video-player {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  height: calc(100% - 36px - 80px);

  &__canvas {
    height: 100%;
    width: 100%;
    display: block;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 40px;
    position: relative;
  }

  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  &__add-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 48px;
    background: transparent;
    border: 2px dashed var(--text-primary);
    border-radius: 16px;
    cursor: pointer;
    color: var(--text-primary);
    transition:
      border-color 0.2s ease,
      background 0.2s ease;

    &:hover {
      color: #fff;
      border-color: #fff;
      background: var(--fill-hover);
    }
  }

  &__add-btn-text {
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  &__hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  &__vinyl {
    position: relative;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle at 50% 50%, var(--dark) 0%, var(--bg) 100%);
    border-radius: 50%;
    box-shadow:
      0 0 0 2px var(--border),
      0 8px 40px rgb(0 0 0 / 60%),
      inset 0 0 60px rgb(0 0 0 / 50%);

    &--spinning {
      animation: vinyl-spin 3s linear infinite;
    }
  }

  &__vinyl-groove {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 0.5px solid var(--border);

    &--1 {
      width: 180px;
      height: 180px;
    }

    &--2 {
      width: 140px;
      height: 140px;
    }

    &--3 {
      width: 100px;
      height: 100px;
    }
  }

  &__vinyl-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--accent), var(--accent-hover));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 20px var(--accent-glow);
  }

  &__vinyl-dot {
    width: 8px;
    height: 8px;
    background: var(--bg);
    border-radius: 50%;
  }

  &__hero-meta {
    text-align: center;
  }

  &__hero-title {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-primary);
    letter-spacing: -0.5px;
    line-height: 1.2;
  }

  &__hero-artist {
    margin-top: 6px;
    font-size: 15px;
    color: var(--accent);
    letter-spacing: 0.3px;
  }

  &__hero-album {
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-secondary);
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

@keyframes vinyl-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
