import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import path from "path";
import fs from "fs";

const input: Record<string, string> = {};

const pagesDir = path.resolve(__dirname, "src/renderer/pages");
const pages = fs.readdirSync(pagesDir);

pages.forEach((page) => {
  input[page] = path.resolve(pagesDir, page, "index.html");
});

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@share": resolve("src/share")
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
        "@share": resolve("src/share")
      }
    },
    optimizeDeps: {
      exclude: ["koffi"]
    },
    build: {
      rollupOptions: {
        external: ["koffi"],
        input: input
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ["legacy-js-api"]
        }
      }
    },
    plugins: [vue(), vueJsx()]
  }
});
