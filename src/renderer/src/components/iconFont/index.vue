<template>
  <i class="iconfont icon-font" :class="[`icon-${name}`]"></i>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: 16
  },
  color: {
    type: String,
    default: ""
  },
  backgroundColor: {
    type: String,
    default: ""
  },
  padding: {
    type: String,
    default: "0px"
  },
  borderRadius: {
    type: String,
    default: "0px"
  }
});

const fontSize = computed(() => {
  return `${props.size}px`;
});
</script>

<style lang="scss" scoped>
.icon-font {
  font-size: v-bind(fontSize);
  color: v-bind(color);
  background-color: v-bind(backgroundColor);
  padding: v-bind(padding);
  border-radius: v-bind(borderRadius);
}
</style>
