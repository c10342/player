<template>
  <div class="video-container" @contextmenu="contextmenu">
    <div class="message">
      <p>{{speedMsg}}</p>
      <p>{{volumeMsg}}</p>
      <p>{{playModeMsg}}</p>
    </div>
    <!-- <video
        @loadedmetadata='loadedmetadata'
        @timeupdate='timeupdate'
        @durationchange='durationchange'
        @ended='ended'
                ref="video"
                class="my-video"
    :src="currentVideo?currentVideo.src:''"></video>-->
    <div @click="changePlayingMode" v-show="currentVideo" id="dplayer" class="my-video"></div>
    <div v-show="!currentVideo" class="my-video"></div>
    <div
      :style="{'animation-play-state':animationPlayState}"
      @click="changePlayingMode"
      v-show="isMusic && currentVideo"
      class="music-bg"
    ></div>
    <div
      :style="{'color':theme.textColor,'border': `1px solid ${theme.textColor}`}"
      class="open-file"
      v-if="!currentVideo"
    >
      <div class="flexrowcenter" @click="openFile">
        <span class="fa fa-folder-open-o"></span>
        <span>打开文件</span>
      </div>
      <span @click.stop="showMenu" class="fa fa-angle-down"></span>
      <transition name="router" mode="out-in">
        <ul :style="{'background-color':theme.bgColor}" v-if="isShowFileMenu" class="my-file">
          <li :class="theme.hover" @click="openFolder">
            <span class="fa fa-file-video-o"></span>
            打开文件夹
          </li>
          <li :class="theme.hover" @click="openUrl">
            <span class="fa fa-link"></span>
            打开URL
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import OpenDialog from "../api/OpenDialog";
import connect from "../api/bus.js";
import Mousetrap from "mousetrap";
import fs, { truncate } from "fs";
import path from "path";
import "DPlayer/dist/DPlayer.min.css";
import DPlayer from "DPlayer";
import { musicReg } from "../api/util";
import { remote } from "electron";

const openDialog = new OpenDialog();

const { Menu } = remote;

export default {
  data() {
    return {
      // 是否显示文件菜单
      isShowFileMenu: false,
      // 左上角音量提示语
      volumeMsg: "",
      // 左上角视频速度提示语
      speedMsg: "",
      // 左上角视频状态提示语
      playModeMsg: "",
      // 判断是否为音乐
      isMusic: false,
      // 动画状态，停止或者播放
      animationPlayState: "running"
    };
  },
  name: "my-video",
  methods: {
    ...mapMutations([
      "setPlaying",
      "setCurrentVideoIndex",
      "setCurrentTime",
      "setTotalTime",
      "setSpeed",
      "setOldVideo",
      "setCurrentVideo",
      "setFullScreen",
      "setHistoricalRecords",
      "setAlwaysOnTop"
    ]),
    ...mapActions(["changeVideoList"]),
    // 点击按钮后显示或者隐藏菜单
    showMenu() {
      // 触发一次点击是因为可能还有其他的菜单在显示，此时需要隐藏其他菜单
      if (!this.isShowFileMenu) {
        document.body.click();
      }
      this.isShowFileMenu = !this.isShowFileMenu;
    },
    onClick() {
      // 隐藏菜单
      this.isShowFileMenu = false;
    },
    // 打开文件
    openFile() {
      openDialog.openFile();
      // connect.$emit('openFile')
    },
    // 视频播放进度改变
    timeupdate() {
      this.setCurrentTime(this.dp.video.currentTime);
    },
    // 视频长度发生变化
    durationchange() {
      this.setTotalTime(this.dp.video.duration);
    },
    // 当浏览器已加载音频/视频的元数据时,只触发一次，只有在视频发生变化时才触发
    loadedmetadata() {
      // 保存当前视频的总时长
      this.setOldVideo(
        Object.assign({}, this.currentVideo, {
          totalTime: this.dp.video.duration
        })
      );
      // 修改播放状态
      this.setPlaying(true);
      this.dp.play();
      // 还原上一次的播放状态
      this.dp.speed(this.currentVideo.speed);
      this.dp.seek(this.currentVideo.currentTime);
    },
    // 播放或者暂停视频
    changePlayingMode() {
      // 当前没有视频在播放
      if (!this.currentVideo) {
        return;
      }
      this.setPlaying(!this.isPlaying);
    },
    // 视频播放结束
    ended() {
      // 暂停播放
      this.setPlaying(false);
      // 重置进度
      this.setCurrentTime(0);
      switch (this.playMode) {
        // 单个播放
        case 1:
          this.setCurrentVideo(null);
          break;
        // 单个循环
        case 2:
          this.$nextTick(() => {
            this.setPlaying(true);
          });
          break;
        // 循环播放列表
        case 3:
          // 当前视频索引是最后一个
          if (this.videoList.length - 1 == this.currentVideoIndex) {
            // 设置视频索引为第一个
            this.setCurrentVideoIndex(0);
          } else {
            // 否则视频索引加一
            let index = this.currentVideoIndex + 1;
            this.setCurrentVideoIndex(index);
          }
          break;
        // 顺序播放
        case 4:
          // 当前视频索引是最后一个
          if (this.videoList.length - 1 == this.currentVideoIndex) {
            // 设置视频索引为第一个
            this.setCurrentVideo(null);
          } else {
            // 否则视频索引加一
            let index = this.currentVideoIndex + 1;
            this.setCurrentVideoIndex(index);
          }
          break;
        // 随机播放
        case 5:
          // 当播放列表中只有一个视频
          if (this.videoList.length <= 1) {
            this.$nextTick(() => {
              this.setPlaying(true);
            });
          } else {
            // 随机选取一个视频
            let index = Math.floor(Math.random() * this.videoList.length);
            // 随机出来的索引等于当前视频索引
            while (index == this.currentVideoIndex) {
              // 重新生成一个，防止随机的是同一个视频
              index = Math.floor(Math.random() * this.videoList.length);
            }
            this.setCurrentVideoIndex(index);
          }
          break;
      }
    },
    // 加载视频的时候发生错误
    error() {
      console.log("error");
    },
    // 初始化快捷键
    initGlobalShortcut() {
      // 监听快捷键
      Mousetrap.bind("ctrl+o", () => {
        this.openFile();
        // 返回 false 以防止默认行为，并阻止事件冒泡
        return false;
      });
    },
    // 打开文件夹
    openFolder() {
      openDialog.openFolder();
    },
    // 打开网络地址
    openUrl() {
      this.$prompt("请输入网络视频地址", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: this.inputValidator,
        inputErrorMessage: "邮箱格式不正确"
      })
        .then(({ value }) => {
          openDialog.openUrl(value);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // 校验url
    inputValidator(e) {
      // 校验url
      let reg1 = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
      // 校验是否为支持的视频类型
      let reg2 = /\.(mp4|webm|ogg)$/i;
      let flag1 = reg1.test(e);
      let flag2 = reg2.test(e);
      // return flag1 ? (flag2 ? true : "不支持该类型视频") : "url格式不正确";
      return true;
    },
    // 初始化dplayer播放器
    initDplayer() {
      this.dp = new DPlayer({
        container: document.getElementById("dplayer"),
        hotkey: false
      });
      this.dp.on("timeupdate", this.timeupdate);
      this.dp.on("durationchange", this.durationchange);
      this.dp.on("loadedmetadata", this.loadedmetadata);
      this.dp.on("ended", this.ended);
      this.dp.on("error", this.error);
      this.dp.volume(this.volumePercent);
    },
    // 双击退出全屏
    handelDBClick() {
      if (!this.currentVideo) {
        return;
      }
      if (this.isFullScreen) {
        this.setFullScreen(false);
      } else {
        this.setFullScreen(true);
      }
    },
    speedTimers(msg) {
      if (this.speedTimer) {
        clearTimeout(this.speedTimer);
      }
      this.speedMsg = msg;
      this.speedTimer = setTimeout(() => {
        this.speedMsg = "";
        clearTimeout(this.speedTimer);
      }, 5000);
    },
    volumeTimers(msg) {
      if (this.volumeTimer) {
        clearTimeout(this.volumeTimer);
      }
      this.volumeMsg = msg;
      this.volumeTimer = setTimeout(() => {
        this.volumeMsg = "";
        clearTimeout(this.volumeTimer);
      }, 5000);
    },
    playModeTimers(msg) {
      if (this.playModeTimer) {
        clearTimeout(this.playModeTimer);
      }
      this.playModeMsg = msg;
      this.playModeTimer = setTimeout(() => {
        this.playModeMsg = "";
        clearTimeout(this.playModeTimer);
      }, 5000);
    },
    // 右键菜单
    contextmenu() {
      document.body.click();
      let contextMenuTemplate = [
        {
          label: "打开",
          submenu: [
            {
              label: "打开文件",
              click() {
                console.log("打开文件11");
              }
            },
            {
              label: "打开文件夹",
              click() {
                console.log("打开文件夹");
              }
            },
            {
              label: "打开URL",
              click() {
                console.log("打开URL");
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
              label: "单个播放",
              click() {
                console.log("单个播放");
              }
            },
            {
              label: "单个循环",
              click() {
                console.log("单个循环");
              }
            },
            {
              label: "循环列表",
              click() {
                console.log("循环列表");
              }
            },
            {
              label: "随机播放",
              click() {
                console.log("随机播放");
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
              label: "10%",
              click() {
                console.log("10%");
              }
            },
            {
              label: "20%",
              click() {
                console.log("20%");
              }
            },
            {
              label: "30%",
              click() {
                console.log("30%");
              }
            },
            {
              label: "40%",
              click() {
                console.log("40%");
              }
            },
            {
              label: "50%",
              click() {
                console.log("50%");
              }
            },
            {
              label: "60%",
              click() {
                console.log("60%");
              }
            },
            {
              label: "70%",
              click() {
                console.log("70%");
              }
            },
            {
              label: "80%",
              click() {
                console.log("80%");
              }
            },
            {
              label: "90%",
              click() {
                console.log("90%");
              }
            },
            {
              label: "100%",
              click() {
                console.log("100%");
              }
            },
            {
              label: "静音",
              click() {
                console.log("静音");
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: "设置"
        },
        {
          label: "文件信息"
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
      }
      let m = Menu.buildFromTemplate(contextMenuTemplate);
      Menu.setApplicationMenu(m);
      m.popup({ window: remote.getCurrentWindow() });
    }
  },
  mounted() {
    window.addEventListener("click", this.onClick);
    this.initDplayer();
    // 视频进度条被用户手动改变时，会触发setCurrentTime这个事件
    this.$nextTick(() => {
      connect.$on("setCurrentTime", () => {
        this.dp.seek(this.currentTime);
      });
    });
    this.initGlobalShortcut();
  },
  computed: {
    ...mapGetters([
      "currentVideo",
      "isPlaying",
      "videoList",
      "currentTime",
      "speed",
      "oldVideo",
      "inWidth",
      "volumePercent",
      "playMode",
      "currentVideoIndex",
      "isFullScreen",
      "isAlwaysOnTop",
      "theme"
    ])
  },
  watch: {
    isPlaying(newVal) {
      // 同步video和store中的isPlaying的状态
      this.$nextTick(() => {
        if (newVal) {
          this.isMusic && (this.animationPlayState = "running");
          this.playModeTimers("已播放");
          this.dp.play();
        } else {
          this.isMusic && (this.animationPlayState = "paused");
          this.playModeTimers("已暂停");
          this.dp.pause();
        }
      });
    },
    currentVideo: {
      immediate: true,
      handler: function(newVal, oldVal) {
        this.$nextTick(() => {
          // 当前视频发生变化时把旧的视频覆盖掉播放列表中对应的视频
          this.changeVideoList(
            Object.assign({}, this.oldVideo, {
              currentTime: this.currentTime,
              speed: this.speed
            })
          );
          if (oldVal) {
            this.setHistoricalRecords(
              Object.assign({}, this.oldVideo, {
                currentTime: this.currentTime,
                speed: this.speed
              })
            );
          }
          // 新的视频不为空·
          if (newVal) {
            // 获取该视频以前的播放进度
            this.setCurrentTime(newVal.currentTime);
            // 获取该视频以前的视频速度
            this.setSpeed(newVal.speed);
            // 找出新的视频在播放列表中的索引
            const index = this.videoList.findIndex(i => i.id == newVal.id);
            // 设置视频的索引
            this.setCurrentVideoIndex(index);

            if (this.dp) {
              this.initDplayer();
            }
            // 获取后缀名
            let extname = path.extname(newVal.src);
            this.isMusic = musicReg.test(extname);
            // 切换视频
            this.dp.switchVideo({
              url: `http://localhost:6789/video?video=${encodeURIComponent(
                newVal.src
              )}`
            });
            // 设置播放历史记录
            this.setHistoricalRecords(newVal);
          } else {
            this.dp.switchVideo({
              url: ""
            });
          }
        });
      }
    },
    speed: {
      immediate: true,
      handler: function(newVal) {
        // 视频速度发生变化时修改video的速度
        this.$nextTick(() => {
          if (newVal > 1) {
            this.speedTimers(
              `加速播放（ctrl+up）：${newVal}倍（按R恢复正常速度）`
            );
          } else if (newVal < 1) {
            this.speedTimers(
              `减速播放（ctrl+down）：${newVal}倍（按R恢复正常速度）`
            );
          } else if (newVal == 1) {
            this.speedTimers(`正常速度：1.0倍（按R恢复正常速度）`);
          }
          this.dp.speed(newVal);
        });
      }
    },
    volumePercent: {
      // 立刻触发是因为需要在播放器初始化时初始化音量
      immediate: true,
      handler: function(newVal) {
        this.$nextTick(() => {
          this.volumeTimers(`音量：${Math.round(newVal * 100)}%`);
          this.dp.volume(newVal);
        });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("click", this.onClick);
    if (this.volumeTimer) {
      clearTimeout(this.volumeTimer);
    }
  }
};
</script>

<style lang="less" scoped>
.video-container {
  flex: 1;
  position: relative;
  .message {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10;
    color: #ffffff;
  }
}
.my-video {
  width: 100%;
  height: 100%;
  vertical-align: top;
  // background-color: #000000;
}
.music-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  margin-top: -200px;
  margin-left: -200px;
  background: url("../assets/musicBg.jpg") no-repeat center center;
  background-size: cover;
  border-radius: 50%;
  animation: rotate 10s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.open-file {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // color: #818181;
  width: 150px;
  height: 40px;
  border-radius: 40px;
  // border: 1px solid #818181;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  padding: 5px;
  .my-file {
    z-index: -1;
    position: absolute;
    top: 45px;
    left: 0;
    width: 100%;
    // background-color: #0c0c0c;
    border-radius: 5px;
    &:before {
      content: "";
      height: 0;
      width: 0;
      position: absolute;
      top: -10px;
      left: 23px;
      border: 5px solid transparent;
      border-bottom-color: greenyellow;
    }
    > li {
      width: 100%;
      height: 40px;
      padding: 10px 15px;
      color: #878788;
      cursor: pointer;
      &:hover {
        // background-color: #373333;
        color: #5dee00;
      }
    }
  }
  > div {
    cursor: pointer;
    span:nth-child(1) {
      padding-right: 10px;
    }
    &:hover {
      color: #5dee00;
    }
  }
  > span {
    font-size: 20px;
    border-left: 1px solid #818181;
    padding-left: 10px;
    cursor: pointer;
    &:hover {
      color: #5dee00;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>