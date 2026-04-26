import ElectronStore from "electron-store";

import { defaultLang } from "@share/config";

interface StoreSchema {
  lang: string;
}

let store: ElectronStore<StoreSchema>;

export const initStore = () => {
  store = new ElectronStore<StoreSchema>({
    defaults: {
      lang: defaultLang
    }
  });
};

export const getStore = <T extends keyof StoreSchema>(key: T): StoreSchema[T] => {
  return store.get(key);
};

export const setStore = <T extends keyof StoreSchema>(key: T, value: StoreSchema[T]): void => {
  store.set(key, value);
};

export const deleteStore = <T extends keyof StoreSchema>(key: T): void => {
  store.delete(key);
};
