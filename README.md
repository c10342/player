# electron-player

> 音视频播放器

#### Build Setup

``` bash
# install dependencies(安装依赖)
npm install

# serve with hot reload at localhost:9080(运行开发环境)
npm run dev

# build electron application for production(打包生产环境)
npm run build


```

安装包：[http://120.79.209.208:9093/player.exe](http://120.79.209.208:9093/player.exe)

---

## 音视频播放器介绍
### 相关技术
- [electron](https://electronjs.org/)：负责构建播放器的所需要的环境，提供访问系统资源的api（调用资源管理器，浏览器等等）以及打包成桌面应用程序
- [vue](https://cn.vuejs.org/)：负责构建播放器的界面
- [node](https://nodejs.org/zh-cn/)：负责处理文件和路径问题，主要使用fs和path这2个模块
- [express](http://www.expressjs.com.cn/)：负责把视频读取出来，把视频以流的形式返回
- [html5相关技术](http://www.w3school.com.cn/html5/index.asp)：拖拽api，全屏api，Notification消息通知
- [DPlayer](http://dplayer.js.org/#/zh-Hans/)：音视频播放器核心组件
- [vue-i18n](https://github.com/kazupon/vue-i18n) : 实现国际化(中英文切换)
- [mousetrap](https://github.com/ccampbell/mousetrap) : 实现键盘组合监听
- [electron-updater](https://www.npmjs.com/package/electron-updater) : 实现自动更新功能

### 已实现功能
- 视频播放：目前已经支持大多数视频格式，比如 MP4、WebM、mkv、avi、WMV、FLV、rmvb 等，后续会添加更多的视频格式
- 音频播放：目前已经支持大多是音频格式，比如 MP3 等，后续会添加更多的音频格式
- 换肤功能：该功能类似其他软件的换肤功能，用户可以根据自己的喜好选择不同的主题皮肤
- 历史记录：音视频播放器会自动记录用户播放已经过的的视频或音频，比如音频或视频播放到那个时间
- 记忆功能：音视频播放器会自动保存用户的操作和修改的配置，比如用户更换了主题皮肤，用户关闭了应用后再次打开，音视频播放器会应用用户已经修改的主题皮肤。用户对视频或音频进行加速等操作都会被记忆下来，用户再次点击该视频或音频就会恢复用户的操作
- 播放模式：播放模式主要有5种，分别是 单个播放、单个循环、循环播放列表、顺序播放、随机播放
- 排序模式：排序模式主要有5种，分别是 默认排序、大小排序、时间排序、随机排序、名称排序
- 置顶功能：保持应用界面始终在最顶端
- 加减速功能：音视频加速或者减速播放
- 拖拽文件或文件夹：用户可以把文件或者文件夹拖拽进音视频播放器中，应用会过滤掉不能播放的文件
- 全屏功能：实现了应用的全屏功能，这里是使用了electron提供的全屏api，没有使用html5的全屏api
- 右键菜单功能：目前已经实现了大多数右键菜单的功能，没实现的后续实现
- 国际化：目前已经实现了中英文切换，后期有需要再继续实现其他语言
- 自动更新功能

### 效果图
<p align="center">
<img src="http://player.linjiafu.top/player1.png?raw=true">
</p>
<h1 align="center">效果图1</h1>
<p align="center">
<img src="http://player.linjiafu.top/player2.png?raw=true">
</p>
<h1 align="center">效果图2</h1>
<p align="center">
<img src="http://player.linjiafu.top/player3.png?raw=true">
</p>
<h1 align="center">效果图3</h1>
<p align="center">
<img src="http://player.linjiafu.top/player4.png?raw=true">
</p>
<h1 align="center">效果图4</h1>
<p align="center">
<img src="http://player.linjiafu.top/player5.png?raw=true">
</p>
<h1 align="center">效果图5</h1>
<p align="center">
<img src="http://player.linjiafu.top/player6.png?raw=true">
</p>
<h1 align="center">效果图6</h1>
<p align="center">
<img src="http://player.linjiafu.top/player7.png?raw=true">
</p>
<h1 align="center">效果图7</h1>
<p align="center">
<img src="http://player.linjiafu.top/player8.png?raw=true">
</p>
<h1 align="center">效果图8</h1>


## 如果有喜欢的欢迎给我点赞star
