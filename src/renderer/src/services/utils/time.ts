/**
 * 秒数转化为 HH:MM:SS 格式
 * @param {Number} second
 * @returns {String}
 */
export const secondToTime = (second: number) => {
  second = second || 0;
  if (second === 0 || second === Infinity || second.toString() === "NaN") {
    return "0:00:00";
  }
  const add0 = (num: number) => (num < 10 ? `0${num}` : `${num}`);
  const hour = Math.floor(second / 3600);
  const min = Math.floor((second - hour * 3600) / 60);
  const sec = Math.floor(second - hour * 3600 - min * 60);
  return [hour, add0(min), add0(sec)].join(":");
};
