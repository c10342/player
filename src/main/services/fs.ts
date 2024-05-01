import { GetAllFileRespond } from "@share/type";
import fs from "fs";
import path from "path";

export const isDir = (str: string) => {
  const stat = fs.statSync(str);
  return stat.isDirectory();
};

// 获取目录下的所有文件，包括子孙文件
export const getAllFile = (dir: string[]) => {
  const fileArr: Array<GetAllFileRespond> = [];
  const run = (pathArr: string[]) => {
    pathArr.forEach((item) => {
      if (isDir(item)) {
        run(fs.readdirSync(item).map((name) => path.join(item, name)));
      } else {
        fileArr.push({
          path: item,
          name: path.basename(item),
          ext: path.extname(item)
        });
      }
    });
  };
  run(dir);
  return fileArr;
};

// 判断文件是否在存在
export const fileExists = (pathStr: string) => {
  return fs.existsSync(pathStr);
};
