import { contextBridge } from "electron";
import api from "./api";

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electronAPI", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electronAPI = api;
}
