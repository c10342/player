<template>
  <div class="function-grid" @contextmenu="onContentMenu">
    <div class="function-list">
      <div v-for="(item, index) in list" :key="index" class="function-item" @click="item.action">
        <icon :size="30" :name="item.icon"></icon>
        <p class="function-name">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLocale } from "@renderer/services/hooks/useLocale";
import { openMenu } from "../utils/menu";
import Icon from "./icon/index.vue";
import { selectDir, selectFile } from "../utils/file";
const { t } = useLocale();

const list = [
  {
    icon: "folder",
    label: t("openDirectory"),
    action: selectFile
  },
  {
    icon: "file",
    label: t("openFile"),
    action: selectDir
  }
];

const onContentMenu = () => {
  openMenu([
    {
      label: t("openFile"),
      action: selectFile
    },
    {
      label: t("openDirectory"),
      action: selectDir
    }
  ]);
};
</script>
