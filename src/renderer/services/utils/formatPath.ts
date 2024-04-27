/**
 * 格式化路径，主要用于渲染进程到主进程，渲染进程有/@fs
 * /@fs/E:/project/aDrive/resources/icon.png?asset ->
 * E:/project/aDrive/resources/icon.png?asset
 * @param src 路径
 * @returns
 */
export const formatPath = (src: string) => {
  let str = src.replace(/^\/@fs\//, "");
  str = str.replace(/\?asset$/, "");
  return str;
};
