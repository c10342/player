import { LangEnum } from "@share/enum";
import { isUndef } from "@share/helper";
import { isPlainObject, has } from "lodash";
import ZhCNLang from "./lang/zh-CN";
import EnUSLang from "./lang/en-US";
import ZhTWLang from "./lang/en-US";
import { store } from "../services/store";

const langMap = {
  [LangEnum.EnUs]: EnUSLang,
  [LangEnum.ZhCN]: ZhCNLang,
  [LangEnum.ZhTW]: ZhTWLang
};

const RE_NARGS = /(%|)\{([0-9a-zA-Z_]+)\}/g;

// 当前语言
let lang: LangEnum = LangEnum.ZhCN;
// 设置语言
export const getLang = () => {
  return lang;
};
// 获取语言
export const setLang = (l: LangEnum) => {
  if (l !== store?.get("lang")) {
    store?.set("lang", l);
  }
  lang = l;
};
// 处理动态参数，eg：days{num} --> getLangText('days',{num:1}) --> days1
const format = (string: string, ...args: any) => {
  if (args.length === 1 && isPlainObject(args[0])) {
    args = args[0];
  }

  if (!args || !args.hasOwnProperty) {
    args = {};
  }

  return string.replace(RE_NARGS, (match, _prefix, i, index) => {
    if (string[index - 1] === "{" && string[index + match.length] === "}") {
      return i;
    }
    const result = has(args, i) ? args[i] : null;
    if (isUndef(result)) {
      return "";
    }

    return result;
  });
};

type Path = { [k in keyof typeof ZhCNLang]: (typeof ZhCNLang)[k] };
// 根据语言获取对应的label
export const getLangText = (path: keyof Path, options?: any) => {
  const array = path.split(".");
  let current: Record<string, any> | string = langMap[lang];
  let value = "";
  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    if (i === j - 1) return format(value, options);
    if (!value) return path;
    current = value;
  }
  return path;
};
