import player from "@renderer/player";
import { logError } from "../utils";

export const openFile = () => {
  return window.api
    .showOpenDialog({
      modal: true,
      filters: [{ name: "视频", extensions: ["mp4"] }],
      properties: ["openFile"]
    })
    .then(async (res) => {
      const filePath = res.filePaths?.[0];
      if (filePath) {
        await player.src(filePath);
        await player.play();
      }
    })
    .catch(logError);
};
