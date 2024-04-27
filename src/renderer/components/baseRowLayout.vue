<template>
  <div class="base-row-layout">
    <div v-if="$slots.left" class="base-row-left">
      <slot name="left"></slot>
    </div>
    <div v-if="$slots.default" class="base-row-content">
      <slot></slot>
    </div>
    <div v-if="$slots.right" class="base-row-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.base-row-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  .base-row-left,
  .base-row-right,
  .base-row-content {
    height: 100%;
    overflow: hidden;
  }
  .base-row-content {
    flex: 1;
    width: 0;
  }
}
</style>
