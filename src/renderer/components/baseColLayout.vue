<template>
  <div class="base-col-layout">
    <div v-if="$slots.header" class="base-col-header">
      <slot name="header"></slot>
    </div>
    <div v-if="$slots.default" class="base-col-content">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-col-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.base-col-layout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .base-col-header,
  .base-col-footer,
  .base-col-content {
    width: 100%;
    overflow: hidden;
  }
  .base-col-content {
    flex: 1;
    height: 0;
  }
}
</style>
