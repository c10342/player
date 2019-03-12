<template>
    <div 
    class="video-container" 
    @click="changePlayingMode">
        <!-- <video
        @loadedmetadata='loadedmetadata'
        @timeupdate='timeupdate'
        @durationchange='durationchange'
        @ended='ended'
                ref="video"
                class="my-video"
                :src="currentVideo?currentVideo.src:''"></video> -->
                <div id="dplayer" class="my-video"></div>
        <div class="open-file" v-if="!currentVideo">
            <div class="flexrowcenter" @click="openFile">
                <span class="fa fa-folder-open-o"></span>
                <span>打开文件</span>
            </div>
            <span @click.stop="showMenu" class="fa fa-angle-down"></span>
            <transition name="router" mode="out-in">
            <ul v-if="isShowFileMenu" class="my-file">
                <li @click="openFolder">
                    <span class="fa fa-file-video-o"></span>
                    打开文件夹
                </li>
                <li @click="openUrl">
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
const openDialog = new OpenDialog();
import connect from "../api/bus.js";
var Mousetrap = require("mousetrap");
const fs = require("fs");

import "DPlayer/dist/DPlayer.min.css";
import DPlayer from "DPlayer";

export default {
  data() {
    return {
      // 是否显示文件菜单
      isShowFileMenu: false
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
      "setCurrentVideo"
    ]),
    ...mapActions(["changeVideoList"]),
    // 点击按钮后显示或者隐藏菜单
    showMenu() {
      // 触发一次点击是因为可能还有其他的菜单在显示，此时需要隐藏其他菜单
      document.body.click();
      this.isShowFileMenu = !this.isShowFileMenu;
      if (!this.isShowFileMenu) {
        window.removeEventListener("click", this.onClick);
      } else {
        window.addEventListener("click", this.onClick);
      }
    },
    onClick() {
      // 隐藏菜单
      this.isShowFileMenu = false;
      window.removeEventListener("click", this.onClick);
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
        hotkey:false
      });
      this.dp.on("timeupdate", this.timeupdate);
      this.dp.on("durationchange", this.durationchange);
      this.dp.on("loadedmetadata", this.loadedmetadata);
      this.dp.on("ended", this.ended);
      this.dp.on("error", this.error);
      this.dp.volume(this.volumePercent)
    }
  },
  mounted() {
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
      "currentVideoIndex"
    ])
  },
  watch: {
    isPlaying(newVal) {
      // 同步video和store中的isPlaying的状态
      this.$nextTick(() => {
        if (newVal) {
          this.dp.play();
        } else {
          this.dp.pause();
        }
      });
    },
    currentVideo(newVal, oldVal) {
      // 当前视频发生变化时把旧的视频覆盖掉播放列表中对应的视频
      this.changeVideoList(
        Object.assign({}, this.oldVideo, {
          currentTime: this.currentTime,
          speed: this.speed
        })
      );
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
        // 切换视频
        this.dp.switchVideo({
          url: `http://localhost:6789/video?video=${newVal.src}`
        });
      } else {
        // this.dp.destroy();
        this.dp.switchVideo(
          {
            url: ''
          }
        );
      }
    },
    speed(newVal) {
      // 视频速度发生变化时修改video的速度
      this.$nextTick(() => {
         this.dp.speed(newVal);
      });
    },
    volumePercent: {
      // 立刻触发是因为需要在播放器初始化时初始化音量
      immediate: true,
      handler: function(newVal) {
        this.$nextTick(() => {
          this.dp.volume(newVal);
        });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("click", this.onClick);
  }
};
</script>

<style lang="less" scoped>
.video-container {
  flex: 1;
  position: relative;
}
.my-video {
  width: 100%;
  height: 100%;
  vertical-align: top;
  background-color: #000000;
}
.open-file {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #818181;
  width: 150px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid #818181;
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
    background-color: #0c0c0c;
    border-radius: 5px;
    &:before {
      content: "";
      height: 0;
      width: 0;
      position: absolute;
      top: -10px;
      left: 23px;
      border: 5px solid transparent;
      border-bottom-color: #0c0c0c;
    }
    > li {
      width: 100%;
      height: 40px;
      padding: 10px 15px;
      cursor: pointer;
      &:hover {
        background-color: #373333;
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
</style>