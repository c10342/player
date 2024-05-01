import { getLangText } from "@renderer/locale";
import { useVideoStore } from "../store/video";
import { videoExt } from "./video";

export const selectFile = () => {
  const videoStore = useVideoStore();
  window.api
    .showOpenDialog({
      modal: true,
      title: getLangText("selectFile"),
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Videos", extensions: videoExt }]
    })
    .then((res) => {
      videoStore.addVideo(res.filePaths);
    });
};

export const selectDir = () => {
  const videoStore = useVideoStore();
  window.api
    .showOpenDialog({
      modal: true,
      title: getLangText("selectDirectory"),
      properties: ["openDirectory", "multiSelections"]
    })
    .then((res) => {
      videoStore.addVideoFromDir(res.filePaths);
    });
};
