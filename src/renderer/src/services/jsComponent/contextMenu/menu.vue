<template>
  <!-- <a-menu @open-change="emits('openChange', $event)">
    <a-menu-item key="1">1st menu item</a-menu-item>
    <a-menu-item key="2">2nd menu item</a-menu-item>
    <a-menu-item key="3">3rd menu item</a-menu-item>
  </a-menu> -->
  <a-menu :items="items" />
</template>

<script setup lang="ts">
import { MenuProps } from "ant-design-vue";
import { PropType } from "vue";
defineProps({
  items: {
    type: Array as PropType<MenuProps["items"]>,
    default: () => []
  }
});

// const items = ref<MenuProps["items"]>([
//   {
//     key: "1",
//     label: "1st menu item",
//     title: "1st menu item"
//   },
//   {
//     key: "2",
//     label: "2nd menu item",
//     title: "2nd menu item"
//   },
//   {
//     key: "3",
//     label: "3rd menu item",
//     title: "3rd menu item"
//   }
// ]);
</script>

<style lang="scss" scoped>
// todo
</style>
