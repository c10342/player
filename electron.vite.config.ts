import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import fs from "fs";

const getInput = () => {
  const dirRoot = resolve(__dirname, "src/renderer/window");
  const list = fs.readdirSync(dirRoot);
  const map: Record<string, any> = {};
  list.forEach((name) => {
    if (fs.statSync(resolve(dirRoot, name)).isDirectory()) {
      map[name] = resolve(dirRoot, name, "index.html");
    }
  });

  return map;
};

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@share": resolve("src/share"),
        "@resources": resolve("resources")
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: {
        "@share": resolve("src/share")
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer"),
        "@share": resolve("src/share"),
        "@resources": resolve("resources")
      }
    },
    plugins: [vue()],
    build: {
      rollupOptions: {
        input: getInput()
      }
    }
  }
});
