<template>
  <a-menu :items="list" />
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import { MenuItem } from ".";
import { MenuProps } from "ant-design-vue";

const props = defineProps({
  items: {
    type: Array as PropType<MenuItem[]>,
    default: () => []
  }
});

const getKey = () => {
  return Math.random().toString(32).slice(-6);
};

const list = computed(() => {
  const arr: MenuProps["items"] = [];
  props.items.forEach((item) => {
    arr.push({
      key: getKey(),
      label: item.title,
      onClick: item.onClick
    });
  });
  return arr;
});
</script>

<style lang="scss" scoped>
// todo
</style>
