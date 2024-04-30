// 数据状态持久化
import { LangEnum } from "@share/enum";
import { StoreState } from "@share/type";
import Store from "electron-store";
import { name } from "../../../package.json";

export let store: Store<StoreState> | null = null;

/**
 * 初始化store
 * @param params { name: string }
 * @returns
 */
export const initStore = () => {
  store = new Store<StoreState>({
    name,
    watch: false,
    schema: {
      lang: {
        type: "string",
        default: LangEnum.ZhCN
      }
    }
  });
  return store;
};
