export const selectVideoFile = async () => {
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

  return result;
};
