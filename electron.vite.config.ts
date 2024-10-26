import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";

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
        "@renderer": resolve("src/renderer/src"),
        "@share": resolve("src/share")
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({}),
      Components({
        // extensions: ["vue", "tsx"],
        // exclude: "src/components/*.vue"
        // 自动注册src/components 一级目录以及二级目录
        // 一级目录下的vue,tsx文件都会被注册
        // 二级目录自注册index开头的，防止注册太多，以及一些不相关的文件都会被注册进去
        globs: [
          "src/components/*.vue",
          "src/components/*.tsx",
          "src/components/*/index.vue",
          "src/components/*/index.tsx",
          "src/components/*/index.ts"
        ]
      })
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    }
  }
});
