# Electron Player 项目架构文档

## 一、项目概述

Electron Player 是一款基于 Electron + Vue 3 的桌面视频播放器应用。其核心特点是**不依赖 VLC 自带窗口渲染**，而是通过 FFI（Foreign Function Interface）直接调用 LibVLC 的 C API，将视频帧数据提取到 Canvas 中进行自定义渲染，实现了完全自主可控的视频播放体验。

## 二、技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| **桌面框架** | Electron 31 | 主进程 + 渲染进程架构 |
| **构建工具** | electron-vite 2.3 | Electron 专用 Vite 构建方案 |
| **前端框架** | Vue 3.4 (Composition API) | 渲染进程 UI 层 |
| **状态管理** | Pinia 2 | 播放器状态管理 |
| **视频引擎** | LibVLC (通过 Koffi FFI) | 原生 C 库直接调用 |
| **FFI 桥接** | Koffi 2.16 | Node.js 调用 C 动态库 |
| **国际化** | vue-i18n 11 + i18next 26 | 前端 + 主进程双端国际化 |
| **样式方案** | SCSS + CSS Variables | 暗色主题设计系统 |
| **图标** | @vicons/ionicons5 + @vicons/fa | Vue 组件化图标 |
| **日志** | electron-log 5 | 多进程统一日志 |
| **自动更新** | electron-updater 6 | 应用版本更新 |
| **代码规范** | ESLint + Prettier + Stylelint + Husky + Commitlint | 全链路代码质量保障 |
| **打包工具** | electron-builder 24 | 多平台打包发布 |

## 三、工程架构

### 3.1 目录结构

```
electron-player/
├── build/                          # 打包资源（应用图标等）
├── resources/
│   ├── icon.png                    # 应用图标
│   └── vlc/                        # VLC 运行时库
│       ├── libvlc.dll              # VLC 核心 DLL
│       ├── libvlccore.dll          # VLC 基础 DLL
│       └── plugins/                # VLC 插件（编解码器、音频输出等）
├── src/
│   ├── main/                       # Electron 主进程
│   │   ├── index.ts                # 主进程入口
│   │   ├── window.ts               # 窗口管理
│   │   ├── tray.ts                 # 系统托盘
│   │   ├── bridge.ts               # IPC 通信桥接
│   │   ├── updater.ts              # 自动更新
│   │   ├── i18n.ts                 # 主进程国际化
│   │   └── logger.ts               # 日志初始化
│   ├── preload/                    # 预加载脚本
│   │   ├── index.ts                # preload 入口
│   │   ├── index.d.ts              # 类型声明
│   │   └── api.ts                  # 渲染进程 API 桥接
│   ├── renderer/                   # 渲染进程
│   │   ├── assets/styles/          # 全局样式
│   │   ├── hooks/                  # 全局 Hooks
│   │   ├── locales/                # 前端 i18n 配置
│   │   ├── utils/                  # 全局工具函数
│   │   └── pages/                  # 多页面入口
│   │       ├── player/             # 播放器页面
│   │       │   ├── components/     # UI 组件
│   │       │   ├── hooks/          # 播放器专用 Hooks
│   │       │   ├── player/         # VLC 播放器核心封装
│   │       │   ├── stores/         # 播放器状态管理
│   │       │   ├── types/          # 类型定义
│   │       │   └── utils/          # 播放器工具函数
│   │       └── traymenu/           # 托盘菜单页面
│   └── share/                      # 主进程与渲染进程共享代码
│       ├── enum.ts                 # 枚举常量（Bridge、事件、语言）
│       ├── type.ts                 # 共享类型定义
│       └── locales/                # 国际化语言包
├── electron.vite.config.ts         # electron-vite 配置
├── electron-builder.yml            # 打包配置
└── package.json                    # 项目配置
```

### 3.2 进程架构

```
┌─────────────────────────────────────────────────────────┐
│                     Electron 主进程                       │
│  ┌─────────┐  ┌─────────┐  ┌──────┐  ┌──────┐  ┌─────┐ │
│  │  Window  │  │  Tray   │  │Bridge│  │Updater│  │I18n │ │
│  │ Manager  │  │ Manager │  │ IPC  │  │       │  │     │ │
│  └─────────┘  └─────────┘  └──────┘  └──────┘  └─────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ IPC (ipcMain / ipcRenderer)
┌────────────────────────┼────────────────────────────────┐
│                    Preload 脚本                           │
│              ┌──────────────────┐                        │
│              │  electronAPI     │                        │
│              │  (contextBridge) │                        │
│              └──────────────────┘                        │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────┐
│                   渲染进程 (Chromium)                     │
│                                                          │
│  ┌─────────────────── Player 页面 ─────────────────────┐ │
│  │                                                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │ │
│  │  │   Vue 3  │  │  Pinia   │  │    VlcPlayer      │ │ │
│  │  │    App   │  │  Store   │  │  (Koffi → libvlc) │ │ │
│  │  └──────────┘  └──────────┘  └───────────────────┘ │ │
│  │         │            │               │              │ │
│  │         └────────────┼───────────────┘              │ │
│  │                      │                              │ │
│  │              ┌───────┴───────┐                      │ │
│  │              │  Canvas 渲染   │                      │ │
│  │              │  (requestAnim)│                      │ │
│  │              └───────────────┘                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────────────────── TrayMenu 页面 ───────────────────┐ │
│  │  托盘右键菜单（独立 BrowserWindow）                    │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 3.3 多页面架构

本项目采用 **electron-vite 多页面（MPA）** 架构，通过动态扫描 `src/renderer/pages/` 目录自动注册页面入口：

- **Player 页面** — 主播放器窗口，`frame: false` 无边框自定义标题栏
- **TrayMenu 页面** — 系统托盘右键菜单，透明无边框窗口，始终置顶

每个页面拥有独立的 `index.html`、`main.ts`、`App.vue`，在 `electron.vite.config.ts` 中通过 `fs.readdirSync` 动态生成 Rollup 的 `input` 配置。

## 四、设计思想

### 4.1 关注点分离

项目严格遵循 Electron 的进程模型进行分层：

| 层级 | 职责 | 通信方式 |
|------|------|----------|
| **主进程 (Main)** | 窗口管理、系统托盘、文件对话框、自动更新、日志 | ipcMain 接收 / webContents.send 广播 |
| **预加载脚本 (Preload)** | 安全的 IPC 桥接，暴露 `electronAPI` 给渲染进程 | contextBridge |
| **渲染进程 (Renderer)** | UI 渲染、用户交互、视频帧渲染 | ipcRenderer 发送 / ipcOn 接收 |

### 4.2 枚举驱动的 IPC 通信

所有 IPC 通道名通过 `BridgeEnum` 和 `GlobalEventEnum` 两个枚举集中管理：

- **`BridgeEnum`**：渲染进程 → 主进程的请求（如 `maximizeWindow`、`openDialog`）
- **`GlobalEventEnum`**：主进程 → 渲染进程的广播（如 `window:maximize`、`update:available`）

这确保了通道名在主进程和渲染进程之间保持一致，避免硬编码字符串带来的错误。

### 4.3 共享代码层（share）

`src/share/` 目录存放主进程和渲染进程共享的代码：

- **枚举定义** (`enum.ts`)：Bridge 通道名、全局事件名、语言枚举
- **类型定义** (`type.ts`)：跨进程共享的 TypeScript 类型
- **国际化语言包** (`locales/`)：中文简繁体、英文翻译

通过 TypeScript 的 `paths` 别名 `@share/*`，两端均可直接引用。

### 4.4 事件驱动架构

整个播放器基于事件驱动模式：

1. **VLC 事件** → C 回调函数 → Koffi 转发 → VlcPlayer EventEmitter
2. **VlcPlayer EventEmitter** → Vue Composition API hooks (`usePlayerEvent`)
3. **IPC 全局事件** → 主进程广播 → 渲染进程 hooks (`useIpcEvent`)
4. **用户交互** → Vue 组件事件 → Store / VlcPlayer 操作

### 4.5 无边框窗口 + 自定义 UI

主窗口使用 `frame: false` + `titleBarStyle: "hidden"` 实现无边框，所有窗口控制（最小化、最大化、关闭）通过自定义 `TitleBar` 组件 + IPC 通信实现。标题栏区域通过 CSS `-webkit-app-region: drag` 支持拖拽移动。

## 五、核心逻辑实现

### 5.1 LibVLC FFI 桥接（核心亮点）

**文件**：`src/renderer/pages/player/player/index.ts`

这是整个项目最核心的模块，通过 **Koffi** 库直接加载 VLC 的 C 动态链接库 (`libvlc.dll`)，将 VLC 的 C 函数映射为 JavaScript 可调用的函数。

#### 实现步骤

1. **加载 DLL**：根据开发/生产环境确定 `libvlc.dll` 路径，通过 `koffi.load()` 加载
2. **函数声明**：声明所有需要的 libvlc C 函数签名（约 20+ 个函数）
3. **回调注册**：通过 `koffi.register()` 注册视频帧回调（Lock/Unlock/Display）和事件回调
4. **初始化 VLC**：创建 VLC 实例 (`libvlc_new`) → 创建播放器 (`libvlc_media_player_new`) → 设置视频格式 (`libvlc_video_set_format`) → 绑定帧回调 (`libvlc_video_set_callbacks`)
5. **事件绑定**：获取事件管理器，注册播放/暂停/停止/结束/时间变更/位置变更/时长变更等事件

#### 视频帧渲染流程

```
LibVLC 解码视频帧
       │
       ▼
Lock Callback ─── 申请帧缓冲区（预分配 3840×2160×4 的 Buffer）
       │
       ▼
VLC 写入帧数据到 Buffer
       │
       ▼
Unlock Callback ─── 复制帧数据，触发 "frame" 事件
       │
       ▼
Display Callback ─── 空操作（帧已在 Unlock 中处理）
       │
       ▼
VideoPlayer.vue ─── 接收 "frame" 事件
       │
       ▼
RV32 → RGBA 像素格式转换（Uint32Array 通道重排）
       │
       ▼
离屏 Canvas (putImageData) → 主 Canvas (drawImage 等比缩放绘制)
       │
       ▼
requestAnimationFrame 调度渲染
```

### 5.2 播放器状态管理

**文件**：`src/renderer/pages/player/stores/playerStore.ts`

使用 Pinia 的 Composition API 风格定义 Store，管理以下状态：

- **`playerList`**：播放列表（支持添加/移除/去重）
- **`activeId`**：当前播放视频的路径标识
- **`currentVideo`**：计算属性，获取当前播放视频对象

核心操作：
- `changeCurrentVideo()` — 切换视频（含文件存在性校验）
- `nextVideo()` / `prevVideo()` — 上/下一首（循环播放逻辑）
- `removeCurrentVideo()` — 停止并移除当前视频
- `removeVideo()` — 移除指定视频（若正在播放则先停止）

### 5.3 IPC 通信桥接

**文件**：`src/main/bridge.ts` + `src/preload/api.ts`

#### 通信模式

| 模式 | 方法 | 使用场景 |
|------|------|----------|
| **单向通知** | `ipcMain.on` / `ipcRenderer.send` | 窗口控制（最大化/最小化/关闭）、语言切换 |
| **请求-响应** | `ipcMain.handle` / `ipcRenderer.invoke` | 获取窗口状态、打开文件对话框、获取版本号 |
| **主进程广播** | `webContents.send` / `ipcRenderer.on` | 窗口状态变化、更新事件、语言变更通知 |

#### 跨窗口通信

托盘菜单（TrayMenu 窗口）与主播放器（Player 窗口）之间通过主进程中转实现通信：

```
TrayMenu 渲染进程 ──ipcSend──→ 主进程 ──webContents.send──→ Player 渲染进程
  (上一首/下一首/       (遍历所有窗口,          (useIpcEvent
   播放/暂停/停止)       排除发送者窗口)          接收并执行)
```

### 5.4 系统托盘

**文件**：`src/main/tray.ts`

- 创建系统托盘图标，支持右键弹出自定义菜单窗口
- 菜单窗口使用独立 BrowserWindow，设置为透明、无边框、置顶
- 通过 `positionMenu()` 计算菜单在屏幕上的弹出位置（考虑任务栏、屏幕边界）
- 窗口失焦自动隐藏，双击托盘图标显示主窗口
- 播放状态通过 `setTrayPlaying()` 同步到菜单窗口

### 5.5 自动更新

**文件**：`src/main/updater.ts` + `src/renderer/pages/player/components/About/AboutDialog.vue`

完整的自动更新流程：

```
检查更新 → 发现新版本 → 用户确认下载 → 下载进度通知 → 下载完成 → 安装重启
```

所有状态通过 `GlobalEventEnum` 广播到渲染进程，由 `AboutDialog` 组件展示更新状态。

### 5.6 国际化（i18n）

项目实现了**双端国际化**：

- **渲染进程**：`vue-i18n` + `createI18n`，在 `createApp` 工具函数中统一注册
- **主进程**：`i18next`，用于主进程可能需要的翻译
- **语言包**：统一存放在 `src/share/locales/`，支持简体中文、繁体中文、英文
- **切换流程**：渲染进程调用 `electronAPI.setLocale()` → 主进程 `setLocale()` → 广播 `LocaleChanged` 事件 → 所有窗口更新语言

### 5.7 日志系统

**文件**：`src/main/logger.ts` + `src/renderer/utils/logger.ts`

- **主进程**：`electron-log/main`，记录到按日期命名的文件，同时输出到控制台和 IPC
- **渲染进程**：`electron-log/renderer`，通过 IPC 传输到主进程统一处理
- **全局错误捕获**：主进程 `errorHandler` + 渲染进程 `errorHandler` + `window.error` / `unhandledrejection`

## 六、UI 组件结构

```
Player 页面
├── TitleBar                    # 自定义标题栏
│   ├── LanguageSwitcher        # 语言切换下拉菜单
│   └── AboutDialog             # 关于对话框（含自动更新）
├── Background                  # 动态背景（渐变光球 + 噪点纹理）
├── VideoPlayer                 # 视频画面区域
│   ├── Canvas                  # 视频帧渲染画布
│   └── PlayList                # 播放列表侧边栏
│       └── PlayListItem        # 播放列表项（含动画指示器）
└── PlayerBar                   # 底部控制栏
    ├── ProgressBar             # 进度条（支持拖拽 seek + hover 预览时间）
    ├── 时间显示                # 当前时间 / 总时长
    ├── PlayerControls          # 播放控制按钮（上一首/播放暂停/停止/下一首）
    ├── VolumeControl           # 音量控制（hover 展开滑块 + 静音切换）
    └── 全屏按钮                # 全屏切换

TrayMenu 页面
└── TrayMenu                    # 系统托盘菜单
    ├── 菜单头部（Logo + 应用名）
    ├── 播放控制（上一首/播放暂停/停止/下一首）
    └── 退出按钮
```

## 七、设计系统

### 7.1 主题色

项目使用暗色主题，通过 CSS Variables 定义完整的设计系统：

| 变量 | 值 | 用途 |
|------|-----|------|
| `--bg` | `#0a0a0c` | 主背景 |
| `--surface` | `rgb(14 14 16 / 60%)` | 卡片/面板背景 |
| `--accent` | `#e8a849` | 强调色（金色） |
| `--accent-hover` | `#f0c27f` | 强调色悬浮态 |
| `--text-primary` | `rgb(255 255 255 / 85%)` | 主要文字 |
| `--text-secondary` | `rgb(255 255 255 / 50%)` | 次要文字 |
| `--border` | `rgb(255 255 255 / 6%)` | 边框 |
| `--danger` | `#e81123` | 危险操作色 |

### 7.2 视觉效果

- **毛玻璃效果**：`backdrop-filter: blur(30px) saturate(1.2)` 用于底部控制栏
- **动态背景**：三个渐变光球 + SVG 噪点纹理，CSS 动画缓慢漂移
- **微交互**：按钮 hover 渐变、进度条拖拽手柄弹性缩放、播放列表项音频柱动画

## 八、构建与打包

### 8.1 开发模式

```bash
npm run dev          # 启动开发服务器（electron-vite dev --watch）
npm run typecheck    # TypeScript 类型检查（Node 端 + Web 端）
npm run lint         # ESLint 代码检查
```

### 8.2 生产构建

```bash
npm run build:win    # Windows 打包（NSIS 安装包）
npm run build:mac    # macOS 打包
npm run build:linux  # Linux 打包
```

### 8.3 打包配置要点

- VLC 运行时库 (`resources/vlc/`) 通过 `extraResources` 打包到应用根目录
- `asarUnpack` 解包 `resources/**` 确保原生 DLL 可被正确加载
- 开发环境 VLC DLL 路径回退到 `resources/vlc/libvlc.dll`
- 生产环境 VLC DLL 从 `process.resourcesPath/vlc/libvlc.dll` 加载

## 九、代码规范

| 工具 | 配置文件 | 用途 |
|------|----------|------|
| **Husky** | `.husky/` | Git Hook 管理 |
| **Commitlint** | `commitlint.config.js` | Git 提交信息规范（Conventional Commits） |
| **lint-staged** | `lint-staged.config.js` | 暂存区文件检查 |
| **ESLint** | `.eslintrc.cjs` | JS/TS/Vue 代码检查 |
| **Prettier** | `.prettierrc.yaml` | 代码格式化 |
| **Stylelint** | `.stylelintrc.js` | SCSS 样式检查 |
| **EditorConfig** | `.editorconfig` | 编辑器格式统一 |
| **Commitizen** | `.czrc` | 规范化提交向导 |
