<template>
  <div class="title-bar">
    <div class="title-bar__drag">
      <span class="title-bar__title">{{ title }}</span>
    </div>
    <div class="title-bar__actions">
      <button class="title-bar__btn title-bar__btn--minimize" title="最小化" @click="onMinimize">
        <Icon size="16"><Remove /></Icon>
      </button>
      <button
        class="title-bar__btn title-bar__btn--maximize"
        :title="isMaximized ? '还原' : '最大化'"
        @click="onMaximize"
      >
        <Icon size="16">
          <WindowRestoreRegular v-if="isMaximized" />
          <SquareOutline v-else />
        </Icon>
      </button>
      <button class="title-bar__btn title-bar__btn--close" title="关闭" @click="onClose">
        <Icon size="16"><Close /></Icon>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@vicons/utils";
import { Remove, SquareOutline, Close } from "@vicons/ionicons5";
import { WindowRestoreRegular } from "@vicons/fa";

defineProps<{
  title: string;
}>();

const isMaximized = ref(true);

function onMinimize() {
  // todo
}

function onMaximize() {
  // todo
}

function onClose() {
  // todo
}
</script>

<style scoped lang="scss">
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  background: rgba(12, 12, 14, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  user-select: none;
  -webkit-app-region: drag;

  &__drag {
    display: flex;
    align-items: center;
    flex: 1;
    height: 100%;
    padding-left: 14px;
  }

  &__title {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.3px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__actions {
    display: flex;
    align-items: center;
    height: 100%;
    -webkit-app-region: no-drag;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 100%;
    color: rgba(255, 255, 255, 0.55);
    background: transparent;
    border: none;
    cursor: pointer;
    transition:
      color 0.15s ease,
      background 0.15s ease;

    &:hover {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.06);
    }

    &--close:hover {
      color: #fff;
      background: #e81123;
    }
  }
}
</style>
