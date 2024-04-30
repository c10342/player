<template>
  <div class="function-grid" @contextmenu="onContentMenu"></div>
</template>

<script lang="ts" setup>
import { useLocale } from "@renderer/services/hooks/useLocale";
import { useVideoStore } from "../store/video";
import { openMenu } from "../utils/menu";
const { t } = useLocale();
const videoStore = useVideoStore();

const onContentMenu = () => {
  openMenu([
    {
      label: t("openFile"),
      action() {
        window.api
          .showOpenDialog({
            modal: true,
            title: t("selectFile"),
            properties: ["openFile", "multiSelections"],
            filters: [{ name: "Videos", extensions: ["mp4"] }]
          })
          .then((res) => {
            videoStore.addVideo(res.filePaths);
          });
      }
    },
    {
      label: t("openDirectory"),
      action() {
        window.api
          .showOpenDialog({
            modal: true,
            title: t("selectDirectory"),
            properties: ["openDirectory", "multiSelections"]
          })
          .then((res) => {
            videoStore.addVideoFromDir(res.filePaths);
          });
      }
    }
  ]);
};
</script>
