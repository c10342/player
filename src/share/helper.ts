export const isUndef = (data: any): data is undefined | null => {
  return data === undefined || data === null;
};
