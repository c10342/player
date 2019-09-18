<template>
  <div class="footer-container">
    <div v-if="currentVideo" class="video-progress">
      <video-progress />
    </div>
    <div class="footer">
      <div class="left">
        <span @click="openFile" :title="$t('common.openFile')" class="fa fa-folder-open-o"></span>
        <span :title="title" @click.stop="showPlayMode" class="fa fa-random"></span>
        <span v-if="currentVideo" class="video-time">{{getCurrentTime}} / {{getTotalTime}}</span>
        <transition name="router" mode="out-in">
          <ul :style="{'background-color': theme.bgColor}" class="play-mode" v-if="isShowPlayMode">
            <li
              v-for="(item,index) in playModeList"
              :key="index"
              :class="theme.hover"
              @click="changeMode(item.playMode)"
            >
              <span v-if="playMode==item.playMode" class="fa fa-check"></span>
              {{item.title}}
            </li>
          </ul>
        </transition>
      </div>
      <div class="middle">
        <span
          :style="{'color':currentVideo?'':'#454548'}"
          :title="$t('common.stop')"
          class="fa fa-stop"
          @click="stop"
        ></span>
        <span
          :style="{'color':(videoList.length<=1)?'#454548':''}"
          @click="prev"
          :title="$t('common.previous')"
          class="fa fa-step-backward"
        ></span>
        <span
          @click.stop="switchPlaying(true)"
          v-if="!isPlaying"
          :title="$t('common.play')"
          class="fa fa-play-circle-o"
          style="font-size: 50px;"
        ></span>
        <span
          v-if="isPlaying"
          :title="$t('common.suspend')"
          class="fa fa-pause-circle-o"
          style="font-size: 50px;"
          @click.stop="switchPlaying(false)"
        ></span>
        <span
          :style="{'color':(videoList.length<=1)?'#454548':''}"
          @click="next"
          :title="$t('common.next')"
          class="fa fa-step-forward"
        ></span>
        <span
          :title="$t('common.mute')"
          v-if="isVolumeOn"
          style="width: 40px;height: 20px;"
          @click.stop="setVolume(false)"
          class="fa fa-volume-up"
        ></span>
        <span
          :title="$t('common.cancelMute')"
          v-if="!isVolumeOn"
          style="width: 40px;height: 20px;"
          @click.stop="setVolume(true)"
          class="fa fa-volume-off"
        ></span>
        <my-progress ref="progress" width="62px" />
      </div>
      <div class="right">
        <span
          :title="$t('common.noTrace')"
          class="fa fa-snowflake-o"
          :style="{'color':isTrace?'#1bb017':''}"
          @click="noTrace"
        ></span>
        <span
          :style="{'color':currentVideo?'':'#454548'}"
          @click="fullScreen"
          :title="isFullScreen?$t('common.exitScreen'):$t('common.fullScreen')"
          class="fa fa-expand my-expand"
        ></span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { formatTime } from "../api/util";
import Mousetrap from "mousetrap";
import OpenDialog from "../api/OpenDialog";
import connect from "../api/bus";
const openDialog = new OpenDialog();

export default {
  name: "my-footer",
  data() {
    return {
      // 是否展开播放模式列表菜单
      isShowPlayMode: false
    };
  },
  mounted() {
    this.initGlobalShortcut();
    window.addEventListener("click", this.onClick);
    connect.$on("deleteCurrentVideo", () => {
      this.stop();
    });
  },
  methods: {
    ...mapMutations([
      "setIsVolumeOn",
      "setPlaying",
      "setPlayMode",
      "setCurrentVideo",
      "setCurrentVideoIndex",
      "setFullScreen",
      "setSpeed",
      "setOldVideo",
      "setTrace"
    ]),
    // 点击音量图标，开启或者关闭
    setVolume(flag) {
      // 音量一开始0，再点一次恢复还是0，音量图标应该还是关闭
      if (
        flag &&
        this.volumePercent == 0 &&
        this.$refs.progress.oldInWidth == 0
      ) {
        return;
      }
      this.setIsVolumeOn(flag);
    },
    // 切换播放状态，播放或者暂停
    switchPlaying(flag) {
      if (flag && !this.currentVideo) {
        //播放状态，但是当前没有视频被暂停
        if (this.videoList.length == 0) {
          return;
        }
        if (this.oldVideo) {
          //点击停止按钮后，被停止前的视频被保存下来
          // 把被保存的视频设置为当前播放的视频，即还原被停止前的视频状态
          this.setCurrentVideo(this.oldVideo);
        } else {
          //没有视频被保存下来
          // 把播放列表中的第一项设置为当前播放的视频
          this.setCurrentVideo(this.videoList[0]);
        }
      }
      // 设置播放状态
      this.setPlaying(flag);
    },
    // 切换播放模式
    changeMode(mode) {
      this.setPlayMode(mode);
    },
    // 显示或者隐藏播放模式列表
    showPlayMode(e) {
      if (!this.isShowPlayMode) {
        document.body.click();
      }
      // 选择完播放模式后就隐藏播放模式列表菜单
      this.isShowPlayMode = !this.isShowPlayMode;
    },
    onClick() {
      // 隐藏播放模式列表菜单
      this.isShowPlayMode = false;
    },
    // 停止播放
    stop() {
      // 当前没有视频正在播放
      if (!this.currentVideo) {
        return;
      }
      if (!this.isTrace) {
        // 保存当前视频
        this.setOldVideo(
          Object.assign({}, this.currentVideo, {
            currentTime: this.currentTime
          })
        );
      }
      // 清空当前正在播放的视频
      this.setCurrentVideo(null);
      // 停止播放
      this.setPlaying(false);
      // 退出全屏
      if (this.isFullScreen) {
        this.setFullScreen(false);
      }
    },
    // 下一个视频
    next() {
      // 当播放列表中只有一个视频或者没有
      if (this.videoList.length <= 1) {
        return;
      }
      // 随机播放模式
      if (this.playMode == 5) {
        // 随机选取一个视频
        let index = Math.floor(Math.random() * this.videoList.length);
        // 随机出来的索引等于当前视频索引
        while (index == this.currentVideoIndex) {
          // 重新生成一个，防止随机的是同一个视频
          index = Math.floor(Math.random() * this.videoList.length);
        }
        // 设置视频索引
        this.setCurrentVideoIndex(index);
        return;
      }
      // 当前视频索引是最后一个
      if (this.videoList.length - 1 == this.currentVideoIndex) {
        // 设置视频索引为第一个
        this.setCurrentVideoIndex(0);
      } else {
        // 否则视频索引加一
        let index = this.currentVideoIndex + 1;
        this.setCurrentVideoIndex(index);
      }
    },
    // 上一个视频
    prev() {
      // 当播放列表中只有一个视频或者没有
      if (this.videoList.length <= 1) {
        return;
      }
      // 随机播放模式
      if (this.playMode == 5) {
        // 随机选取一个视频
        let index = Math.floor(Math.random() * this.videoList.length);
        while (index == this.currentVideoIndex) {
          index = Math.floor(Math.random() * this.videoList.length);
        }
        this.setCurrentVideoIndex(index);
        return;
      }
      if (this.currentVideoIndex == 0) {
        //当前视频索引是第一个
        // 设置当前视频索引的最后一个
        this.setCurrentVideoIndex(this.videoList.length - 1);
      } else {
        // 视频索引减一
        let index = this.currentVideoIndex - 1;
        this.setCurrentVideoIndex(index);
      }
    },
    // 进入或者退出全屏
    fullScreen() {
      if (!this.currentVideo) {
        return;
      }
      this.setFullScreen(!this.isFullScreen);
    },
    // 监听空格键
    onSpaceKeyUp() {
      if (!this.currentVideo) {
        return;
      }
      this.switchPlaying(!this.isPlaying);
    },
    // 监听esc键
    onEscKeyUp() {
      if (!this.currentVideo) {
        return;
      }
      if (this.isFullScreen == true) {
        this.setFullScreen(false);
      }
    },
    // 监听ctrl+r组合键
    onCtrlAndRKeyUp() {
      if (!this.currentVideo && this.speed == 1) {
        return;
      }
      this.setSpeed(1);
    },
    // 初始化快捷键
    initGlobalShortcut() {
      // 监听快捷键
      Mousetrap.bind("space", () => {
        this.onSpaceKeyUp();
        // 返回 false 以防止默认行为，并阻止事件冒泡
        return false;
      });
      Mousetrap.bind("esc", () => {
        this.onEscKeyUp();
        return false;
      });
      Mousetrap.bind("r", () => {
        this.onCtrlAndRKeyUp();
        return false;
      });
    },
    // 打开文件
    openFile() {
      openDialog.openFile();
    },
    // 开启无痕模式
    noTrace() {
      this.setTrace(!this.isTrace);
    }
  },
  computed: {
    ...mapGetters([
      "isVolumeOn",
      "isPlaying",
      "currentVideo",
      "playMode",
      "currentVideoIndex",
      "videoList",
      "playMode",
      "oldVideo",
      "currentTime",
      "totalTime",
      "isFullScreen",
      "theme",
      "volumePercent",
      "isTrace"
    ]),
    title() {
      if (this.playMode == 1) {
        return this.$t('common.singlePlay');
      } else if (this.playMode == 2) {
        return this.$t('common.singleCycle');
      } else if (this.playMode == 3) {
        return this.$t('common.loopList');
      } else if (this.playMode == 4) {
        return this.$t('common.sequentialPlay');
      } else if (this.playMode == 5) {
        return this.$t('common.randomPlay');
      }
    },
    // 当前视频播放状态
    getCurrentTime() {
      // 格式化事件
      return formatTime(this.currentTime);
    },
    // 当前视频总时长
    getTotalTime() {
      // 格式化时间
      return formatTime(this.totalTime);
    },
    // 播放模式列表
    playModeList(){
      return [
        { title: this.$t('common.singlePlay'), playMode: 1 },
        { title: this.$t('common.singleCycle'), playMode: 2 },
        { title: this.$t('common.loopList'), playMode: 3 },
        { title: this.$t('common.sequentialPlay'), playMode: 4 },
        { title: this.$t('common.randomPlay'), playMode: 5 }
      ]
    }
  },
  watch: {
    currentVideoIndex(newVal) {
      if (newVal == null || newVal == -1) {
        return;
      }
      if (!this.oldVideo) {
        // 设置当前播放的视频
        this.setCurrentVideo(this.videoList[newVal]);
        this.setPlaying(true);
        return;
      }
      // 视频索引发生变化时查找出索引对应的视频
      const currentVideo = this.videoList[newVal];
      // 判断是否为同一首歌，排序可能会使当前歌曲索引改变
      if (this.oldVideo.id == currentVideo.id) {
        return;
      }
      // 设置当前播放的视频
      this.setCurrentVideo(currentVideo);
    },
    videoList(newVal) {
      if (newVal.length == 0) {
        this.stop();
        this.setOldVideo(null);
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("click", this.onClick);
    connect.$off("deleteCurrentVideo");
  }
};
</script>

<style scoped lang="less">
.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .video-progress {
    width: 100%;
    padding: 0 5px;
  }
}

.footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  position: relative;
  width: 100%;
  span {
    font-size: 18px;
    color: white;
    cursor: pointer;
    &:hover:not(.video-time) {
      color: #5dee00;
    }
    &.video-time {
      font-size: 14px;
      max-height: 19px;
      width: 150px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 80px;
    }
  }
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    span {
      padding: 0 10px;
    }
    .play-mode {
      position: absolute;
      left: 7px;
      top: -167px;
      width: 100px;
      color: #999999;
      padding: 3px 0;
      border-radius: 5px;
      z-index: 1000;
      &:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -10px;
        height: 0;
        width: 0;
        border: 5px solid transparent;
        border-top-color: #252528;
      }
      > li {
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 12px;
        color: #878788;
        cursor: pointer;
        &:hover {
          color: #1bb017;
          > span {
            color: #1bb017;
          }
        }
        > span {
          font-size: 10px;
          padding: 0;
          color: #999999;
          margin-left: -10px;
        }
      }
    }
  }
  .middle {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    z-index: 10;
    span {
      padding: 0 10px;
    }
    .progress {
      background-color: #cccccc;
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      padding: 0 10px;
    }
  }
}

.my-expand {
  transform: rotate(90deg);
}
</style>