<template>
    <div class="footer-container">
        <div v-if="currentVideo" class="video-progress">
            <video-progress/>
        </div>
        <div class="footer">
            <div class="left">
                <span title="打开文件" class="fa fa-folder-open-o"></span>
                <span
                        :title="title"
                        @click.stop="showPlayMode"
                        class="fa fa-random"></span>
                <span v-if="currentVideo" class="video-time">{{getCurrentTime}} / {{getTotalTime}}</span>
                <transition name="router" mode="out-in">
                <ul class="play-mode" v-if="isShowPlayMode">
                    <li @click="changeMode(1)">
                        <span v-if="playMode==1" class="fa fa-check"></span>
                        单个播放
                    </li>
                    <li @click="changeMode(2)">
                        <span v-if="playMode==2" class="fa fa-check"></span>
                        单个循环
                    </li>
                    <li @click="changeMode(3)">
                        <span v-if="playMode==3" class="fa fa-check"></span>
                        循环列表
                    </li>
                    <li @click="changeMode(4)">
                        <span v-if="playMode==4" class="fa fa-check"></span>
                        顺序播放
                    </li>
                    <li @click="changeMode(5)">
                        <span v-if="playMode==5" class="fa fa-check"></span>
                        随机播放
                    </li>
                </ul>
                </transition>
            </div>
            <div class="middle">
                <span :style="{'color':currentVideo?'':'#454548'}" title="停止" class="fa fa-stop" @click="stop"></span>
                <span
                :style="{'color':(videoList.length<=1)?'#454548':''}"
                        @click="prev"
                        title="上一个文件"
                        class="fa fa-step-backward"></span>
                <span
                        @click.stop="switchPlaying(true)"
                        v-if="!isPlaying"
                        title="播放"
                        class="fa fa-play-circle-o"
                        style="font-size: 50px;"></span>
                <span
                        v-if="isPlaying"
                        title="暂停"
                        class="fa fa-pause-circle-o"
                        style="font-size: 50px;"
                        @click.stop="switchPlaying(false)"></span>
                <span
                :style="{'color':(videoList.length<=1)?'#454548':''}"
                        @click="next"
                        title="下一个文件"
                        class="fa fa-step-forward"></span>
                <span
                        title="静音"
                        v-if="isVolumeOn"
                        style="width: 40px;height: 20px;"
                        @click.stop="setVolume(false)"
                        class="fa fa-volume-up"></span>
                <span
                        title="取消静音"
                        v-if="!isVolumeOn"
                        style="width: 40px;height: 20px;"
                        @click.stop="setVolume(true)"
                        class="fa fa-volume-off"></span>
                <my-progress width="62px"/>
            </div>
            <div class="right">
                <span title="无痕模式" class="fa fa-snowflake-o"></span>
                <span 
                :style="{'color':currentVideo?'':'#454548'}"
                @click="fullScreen" 
                :title="isFullScreen?'退出全屏':'全屏'" 
                class="fa fa-expand my-expand"></span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from "vuex";
import { formatTime } from "../api/util";

export default {
  name: "my-footer",
  data() {
    return {
      // 是否展开播放模式列表菜单
      isShowPlayMode: false
    };
  },
  mounted() {
    window.addEventListener("keyup", this.onKeyUp);
  },
  methods: {
    ...mapMutations([
      "setIsVolumeOn",
      "setPlaying",
      "setPlayMode",
      "setCurrentVideo",
      "setCurrentVideoIndex",
      "setFullScreen"
    ]),
    // 点击音量图标，开启或者关闭
    setVolume(flag) {
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
    // 监听键盘
    onKeyUp(e) {
      if (!this.currentVideo) {
        return;
      }
      // 按下Esc键
      if (e.keyCode == 27 && this.isFullScreen == true) {
        this.setFullScreen(false);
      }
      // 按下空格键
      if (e.keyCode == 32) {
        this.switchPlaying(!this.isPlaying);
      }
    },
    // 切换播放模式
    changeMode(mode) {
      this.setPlayMode(mode);
    },
    // 显示或者隐藏播放模式列表
    showPlayMode() {
      // 触发一次点击是因为可能还有其他的菜单在显示，此时需要隐藏其他菜单
      document.body.click();
      // 选择完播放模式后就隐藏播放模式列表菜单
      this.isShowPlayMode = !this.isShowPlayMode;
      if (this.isShowPlayMode) {
        window.addEventListener("click", this.onClick);
      } else {
        window.removeEventListener("click", this.onClick);
      }
    },
    onClick() {
      // 隐藏播放模式列表菜单
      this.isShowPlayMode = false;
      window.removeEventListener("click", this.onClick);
    },
    // 停止播放
    stop() {
      // 当前没有视频正在播放
      if (!this.currentVideo) {
        return;
      }
      // 清空当前正在播放的视频
      this.setCurrentVideo(null);
      // 停止播放
      this.setPlaying(false);
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
      "isFullScreen"
    ]),
    title() {
      if (this.playMode == 1) {
        return "单个播放";
      } else if (this.playMode == 2) {
        return "单个循环";
      } else if (this.playMode == 3) {
        return "顺序播放";
      } else if (this.playMode == 4) {
        return "顺序循环";
      } else if (this.playMode == 5) {
        return "随机播放";
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
    }
  },
  watch: {
    currentVideoIndex(newVal) {
      // 视频索引发生变化时查找出索引对应的视频
      const currentVideo = this.videoList[newVal];
      // 判断是否为同一首歌，排序可能会使当前歌曲索引改变
      if (this.oldVideo.id == currentVideo.id) {
        return;
      }
      // 设置当前播放的视频
      this.setCurrentVideo(currentVideo);
    }
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("click", this.onClick);
  }
};
</script>

<style scoped lang="less">
.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  // background-color: #151616;
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
      background-color: #252528;
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
        cursor: pointer;
        &:hover {
          background-color: #373333;
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