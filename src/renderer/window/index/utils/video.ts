export const formatTime = (time: number) => {
  let h: number | string = Math.floor(time / 60 / 60);
  let m: number | string = Math.floor((time / 60) % 60);
  let s: number | string = Math.floor(time % 60);
  h = h === 0 ? "" : h < 10 ? `0${h}` : h;
  m = m < 10 ? `0${m}` : m;
  s = s < 10 ? `0${s}` : s;
  return h ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// 支持的视频文件后缀
export const videoExt = ["mp4", "wmv"];
