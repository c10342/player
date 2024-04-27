<template>
  <span class="iconfont icon" :class="`icon-${name}`" :style="{ fontSize: `${size}px` }"></span>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    default: "",
    required: true
  },
  size: {
    type: Number,
    default: 14
  }
});
</script>
