import { usePlayerStore } from "@renderer/stores";
const path = require("path");
const fs = require("fs");

export const formatFileSize = (size: number): string => {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

// 添加视频文件到播放列表
export const addVideoFile = async () => {
  const playerStore = usePlayerStore();
  const result = await window.electronAPI.openDialog({
    modal: true,
    filters: [
      {
        name: "视频",
        extensions: [
          "mp4",
          "avi",
          "mkv",
          "mov",
          "wmv",
          "flv",
          "webm",
          "m4v",
          "mpeg",
          "mpg",
          "3gp",
          "ts"
        ]
      }
    ],
    properties: ["openFile"]
  });

  if (result.filePaths?.length) {
    result.filePaths.forEach((filePath) => {
      playerStore.addPlayerList({
        path: filePath,
        name: path.basename(filePath),
        type: path.extname(filePath),
        size: fs.statSync(filePath).size
      });
    });
  }

  return result;
};
