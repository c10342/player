import ElectronStore from "electron-store";

import { defaultLang } from "@share/config";
import { PlayerListItem } from "@share/type";

interface StoreSchema {
  lang: string;
  player: { playerList: PlayerListItem[] };
  [key: string]: any;
}

let store: ElectronStore<StoreSchema>;

export const initStore = () => {
  store = new ElectronStore<StoreSchema>({
    defaults: {
      lang: defaultLang,
      player: { playerList: [] }
    }
  });
};

export const getStore = (key: string): any => {
  return store.get(key);
};

export const setStore = (key: string, value: any): void => {
  store.set(key, value);
};

export const deleteStore = (key: string): void => {
  store.delete(key);
};
