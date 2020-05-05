@[TOC](基于electron的音视频播放器)

# 前言

我是一个前端工程师，前一段时间想着搞一个属于自己的作品，所以就突发奇想搞了一个基于electron的音视频播放器桌面应用程序。经过几个月的开发，终于实现了大部分的功能，所以我想在这里总结一下前面一段时间的工作，以及在开发的时候遇见的各种坑坑洼洼，希望可以对想要从事electron桌面软件开发的朋友有点帮助吧。

## 选择做一个音视频播放器桌面应用程序原因

一开始我是打算做个网站或者webAPP那种的，但是作为一名前端工程师来说，网站或者webAPP并没有什么可以吸引我的地方，因为那种东西都是司空见惯的，千篇一律，所以我就想着使用electron做一个音视频播放器，搞点与众不同的东西。虽然网上有很多视频播放器，但是那些播放器基本都是使用C写出来的，并没有使用electron做出来的播放器。

## 技术的选型

我主要使用的技术是electron、node、vue、express、HTML5相关技术、DPlayer。Electron主要是用来构建音视频播放器所需要的环境，提供访问系统资源的api（调用资源管理器，浏览器等等）以及打包成桌面应用程序。其实说白了electron就是相当于一个浏览器和服务器后台的结合，但是electron打破了传统浏览器的界限，提供了调用系统底层资源的api，使得开发者可以使用系统的资源，比如摄像头，麦克风等等。同时开发者还可以在electron中调用node的模块，搭建一个后台等等。electron有2种进程，一种是渲染进程，另一种是主进程。主进程只能有一个，负责调用系统底层资源，管理窗口那些。渲染进程可以有多条，负责渲染页面的。Node主要使用了fs和path这2个模块，因为这个音视频播放器涉及到了的文件读取操作，所以这2个模块是必不可少的。Vue是负责构建界面的。Express是用来在应用程序中构建一个微型后台，负责把视频读取出来变成流的形式，然后返回给前端界面。html5主要使用了拖拽api、全屏api、Notification消息通知等技术。DPlayer是整个音视频播放器的核心组件，负责播放音视频的。


## 已经实现了的功能

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


## 音视频播放实现
音视频播放实现。一开始我是想着直接使用HTML5提供的<video>标签，但是这个标签局限性很大，它只支持三种视频格式：MP4、WebM、Ogg，但是目前主流视频格式还有avi、mkv、wmv等视频格式。然后我就想着对那些不是MP4、WebM、Ogg的视频格式进行转码，但是需要使用ffmepg来进行转码，electron进行打包的时候是不会把ffmepg这个工具打包进去的，所以这就要求每一个使用这个音视频播放器的用户需要自己去手动安装ffmepg和配置环境，这种做法显然是不行的。同时转码的过程是需要时间，一旦遇见那些几个G是视频，起码要花费几分钟进行转码，然后才能响应用户的操作，这对于用户来说是极其差的用户体验。最后我选择了使用express在electron中搭建一个微型服务器，当express接收到前端界面的请求时，就把所需要的视频读取出来，以流的形式返回给前端，因为实在electron环境下，所以使用的是localhost，这样就可以快速的响应用户的操作，逼近原生播放器的体验。

代码：
``` javascript
let pathSrc = req.query.video;
let stat = fs.statSync(pathSrc);
let fileSize = stat.size;
let range = req.headers.range;
if (range) {
    //有range头才使用206状态码
    let parts = range.replace(/bytes=/, "").split("-");
    let start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : start + 999999;

    // end 在最后取值为 fileSize - 1 
    end = end > fileSize - 1 ? fileSize - 1 : end;

    let chunksize = (end - start) + 1;
    let file = fs.createReadStream(pathSrc, {
        start,
        end
    });
    let head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
} else {
    let head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(pathSrc).pipe(res);
}


```

## 右键菜单实现
右键菜单我一开始的做法是监听右键事件，通过动态生成DOM，然后插入到页面中。但是这种做法并不可行。因为生成的右键菜单需要出现在用户鼠标点击的位置附近，用户鼠标出现的位置可能是应用程序中间，可能是左上角，右上角等等。因为是使用DOM生成，渲染出来的右键菜单不能超出文档的范围，否则就会出现滚动条。所以当用户的鼠标位置在界面边界的时候，需要计算出右键菜单应该出现在鼠标所在位置的上面、下面或者左上角等等，这需要经过一系列大量的计算才能得出结果，这在electron的渲染进程显然是不可行，因为这么复杂的计算可能会造成页面卡顿。所以后面我是用electron的Menu模块，在主进程中生成右键菜单，减轻渲染进程的负担，同是还减少了大量的DOM操作，但是是用electron的Menu模块生成的右键菜单就是白底黑字，样式可能没有符合预期的效果。但是通过2种生成右键菜单的利益权衡后，采用electron的Menu模块生成右键菜单才是最佳的选择。

代码
```javascript
 let contextMenuTemplate = [
        {
          label: "打开",
          submenu: [
            {
              label: "打开文件",
              click() {
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: "窗口置顶",
          submenu: [
            {
              label: this.isAlwaysOnTop ? "     从不" : "√   从不",
              click: () => {
                this.setAlwaysOnTop(false);
              }
            },
            {
              label: this.isAlwaysOnTop ? "√   始终" : "     始终",
              click: () => {
                this.setAlwaysOnTop(true);
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: "播放列表"
        },
        {
          label: "播放顺序",
          submenu: [
            {
              label: this.playMode == 1 ? "√ 单个播放" : "   单个播放",
              click: () => {
                this.setPlayMode(1);
              }
            },
            {
              label: this.playMode == 2 ? "√ 单个循环" : "   单个循环",
              click: () => {
                this.setPlayMode(2);
              }
            },
            {
              label: this.playMode == 3 ? "√ 循环列表" : "   循环列表",
              click: () => {
                this.setPlayMode(3);
              }
            },
            {
              label: this.playMode == 4 ? "√ 顺序播放" : "   顺序播放",
              click: () => {
                this.setPlayMode(4);
              }
            },
            {
              label: this.playMode == 5 ? "√ 随机播放" : "   随机播放",
              click: () => {
                this.setPlayMode(5);
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: "声音",
          submenu: [
            {
              label: this.volumePercent == 0.1?"√ 10%":"   10%",
              click:()=>{
                let inWidth = 0.1*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.2?"√ 20%":"   20%",
              click:()=>{
                let inWidth = 0.2*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.3?"√ 30%":"   30%",
              click:()=>{
                let inWidth = 0.3*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.4?"√ 40%":"   40%",
              click:()=>{
                let inWidth = 0.4*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.5?"√ 50%":"   50%",
              click:()=>{
                let inWidth = 0.5*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.6?"√ 60%":"   60%",
              click:()=>{
                let inWidth = 0.6*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.7?"√ 70%":"   70%",
              click:()=>{
                let inWidth = 0.7*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.8?"√ 80%":"   80%",
              click:()=>{
                let inWidth = 0.8*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 0.9?"√ 90%":"   90%",
              click:()=>{
                let inWidth = 0.9*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: this.volumePercent == 1?"√ 100%":"   100%",
              click:()=>{
                let inWidth = 1*62
                this.setInWidth(inWidth)
              }
            },
            {
              label: (this.volumePercent != 0.1&&this.volumePercent != 0.2&&this.volumePercent != 0.3&&this.volumePercent != 0.4&&this.volumePercent != 0.5&&this.volumePercent != 0.6&&this.volumePercent != 0.7&&this.volumePercent != 0.8&&this.volumePercent != 0.9&&this.volumePercent != 1&&this.volumePercent != 0)?`√ 其他(${Math.round(this.volumePercent*100)}%)`:"   其他",
            },
            {
              label: this.volumePercent == 0?"√ 静音":"   静音",
              click:()=>{
                let inWidth = 0
                this.setInWidth(inWidth)
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: "设置"
        }
      ];
      if (this.currentVideo) {
        let addMenu = [
          {
            label: this.isPlaying ? "暂停" : "播放",
            click: () => {
              this.setPlaying(!this.isPlaying);
            }
          },
          {
            type: "separator"
          }
        ];
        contextMenuTemplate.unshift(...addMenu);

        contextMenuTemplate.splice(4, 0, {
          label: this.isFullScreen ? "退出全屏" : "全屏",
          click: () => {
            this.setFullScreen(!this.isFullScreen);
          }
        });

        contextMenuTemplate.push({
          label:'文件信息',
          click:()=>{
            this.videoInfo = this.currentVideo
            this.isShowInfo = true
          }
        })
      }
      let m = Menu.buildFromTemplate(contextMenuTemplate);
      Menu.setApplicationMenu(m);
      m.popup({ window: remote.getCurrentWindow() });
```

## 总结
为什么直说音视频播放和右键菜单实现？因为这2个功能是我重写的次数最多的功能，特别是音视频播放这个功能，我还写了很多demo去测试不同的播放方法，测试不同播放方法的性能问题，最终才选择了搭建一个微型服务器这个方法。其他的功能没什么需要特别讲解的地方，其他功能都是细节问题，同住还要注意封装公共代码，降低耦合度，分模块，分功能去编写代码。因为一开始我并没有注意到这些地方，写到后面代码越来越多，出现问题的时候都无从下手，不知道改哪里，这使得我花费了大量的时间对代码进行重构，整理。

## 效果图
<p align="center">
<img src="http://zhifa.daiqee.com/player1.png">
</p>
<h1 align="center">效果图1</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player2.png">
</p>
<h1 align="center">效果图2</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player3.png">
</p>
<h1 align="center">效果图3</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player4.png">
</p>
<h1 align="center">效果图4</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player5.png">
</p>
<h1 align="center">效果图5</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player6.png">
</p>
<h1 align="center">效果图6</h1>

<p align="center">
<img src="http://zhifa.daiqee.com/player7.png">
</p>
<h1 align="center">效果图7</h1>

<!-- https://segmentfault.com/a/1190000018533945?utm_source=tag-newest -->

### 安装包下载：[http://zhifa.daiqee.com/player%20Setup%200.0.1.exe](http://zhifa.daiqee.com/player%20Setup%200.0.1.exe)

### 最后如果大家觉得我这个音视频播放器还可以的话，欢迎去我的github：[https://github.com/c10342/player](https://github.com/c10342/player)  给个star
