import type { PiniaPluginContext } from "pinia";
import { watch } from "vue";

interface PersistOptions {
  key: string;
  pick?: string[];
}

interface StoreOptionsWithPersist {
  persist?: PersistOptions;
}

export const piniaElectronStore = ({ options, store }: PiniaPluginContext) => {
  const persist = (options as StoreOptionsWithPersist).persist;
  if (!persist) return;

  const { key, pick } = persist;

  const loadPersistedState = async () => {
    const data = await window.electronAPI.getStoreValue(key);
    if (data && typeof data === "object") {
      if (pick) {
        for (const k of pick) {
          if (k in data) {
            store.$patch({ [k]: data[k] });
          }
        }
      } else {
        store.$patch(data);
      }
    }
  };

  const stateToPersist = () => {
    const state = store.$state;
    if (pick) {
      const picked: Record<string, any> = {};
      for (const k of pick) {
        picked[k] = state[k];
      }
      return picked;
    }
    return state;
  };

  let initialized = false;

  watch(
    () => stateToPersist(),
    (val) => {
      if (!initialized) return;
      // store.$state 返回的是 Vue 3 的 响应式 Proxy 对象 。
      // Electron 的 IPC 通信使用浏览器的 结构化克隆算法（Structured Clone） 来序列化数据，该算法不支持 Proxy 对象，所以报 An object could not be cloned 。
      // 所以需要将 Proxy 对象 转换为普通对象，再序列化。
      window.electronAPI.setStoreValue(key, JSON.parse(JSON.stringify(val)));
    },
    { deep: true }
  );

  loadPersistedState().then(() => {
    initialized = true;
  });
};
