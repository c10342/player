import fs from "fs";

export const isDir = (str: string) => {
  const stat = fs.statSync(str);
  return stat.isDirectory();
};
