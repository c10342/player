<template>
  <div
    class="flexbetween my-list-item"
    :class="`${isCurrentVideo?'currentVideo':''} ${theme.itemHover}`"
    :title="item.msg?item.msg:item.src"
    @dblclick="dblPlaying"
    :style="{'color': isCurrentVideo?'#00B400':theme.textColor}"
    @contextmenu.stop="contextmenu"
  >
    <div class="out-progress" v-if="isCurrentVideo"></div>
    <div :style="{'width':currentVideoPercent}" class="in-progress" v-if="isCurrentVideo"></div>
    <div class="left">
      <span class="fa fa-caret-right" v-if="isCurrentVideo"></span>
      <span
        class="fa fa-eye"
        v-if="oldVideo && oldVideo.id == item.id && !isPlaying && !currentVideo"
      ></span>
      <span>{{item.filename}}</span>
    </div>
    <span class="msg" v-if="item.msg">{{item.msg}}</span>
    <div class="flexrowcenter right" v-if="!item.msg">
      <span class="time" v-if="item.totalTime>0">{{item.totalTime | formatTime}}</span>
      <span
        @click.stop="playing"
        v-if="!isPlaying || !isCurrentVideo"
        :title="$t('common.play')"
        class="my-fa fa fa-play-circle-o"
      ></span>
      <span
        @click.stop="setPlaying(false)"
        v-if="isPlaying && isCurrentVideo"
        :title="$t('common.suspend')"
        class="my-fa fa fa-pause-circle-o"
      ></span>
      <span :title="$t('common.openLocation')" class="my-fa fa fa-file-archive-o"></span>
      <span :title="$t('common.deleteFile')" class="my-fa fa fa-close"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import fs from "fs";
import { formatTime } from "../api/util";

export default {
  name: "list-item",
  props: {
    // 播放列表中的一项
    item: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  filters: {
    formatTime
  },
  data() {
    return {
      // 点击停止后是否显示停止的视频
      isShowEye: false
    };
  },
  methods: {
    ...mapMutations(["setCurrentVideo", "setPlaying", "setOldVideo"]),
    ...mapActions(["changeVideoList"]),
    setplaying() {
      if (this.item.mode == "local" && !fs.existsSync(this.item.src)) {
        //文件不存在
        if (this.item.msg) {
          //存在文件错误信息
          return;
        }
        // 保存文件错误信息
        let video = Object.assign({}, this.item, { msg: "无效文件" });
        // 修改播放列表
        this.changeVideoList(video);
      } else {
        if (!this.isCurrentVideo) {
          //不是当前播放的视频
          // 设置当前播放的视频为该视频
          this.setCurrentVideo(this.item);
        }
        // 存在文件错误信息
        if (this.item.msg) {
          // 清空文件错误信息
          let video = Object.assign({}, this.item, { msg: "" });
          // 修改播放列表
          this.changeVideoList(video);
        }
        // 设置为播放状态
        this.setPlaying(true);
      }
    },
    playing() {
      this.setplaying();
    },
    dblPlaying() {
      // 要播放的视频是当前正在播放的视频
      if (this.isCurrentVideo) {
        return;
      }
      this.setplaying();
    },
    contextmenu(){
      this.$emit('contextmenu')
    }
  },
  computed: {
    ...mapGetters([
      "currentVideo",
      "currentVideoIndex",
      "videoList",
      "isPlaying",
      "oldVideo",
      "currentTime",
      "theme"
    ]),
    // 是否为当前的歌曲
    isCurrentVideo() {
      return this.currentVideo ? this.item.id == this.currentVideo.id : false;
    },
    // 计算当前视频进度占中时间的百分比
    currentVideoPercent() {
      if(!this.oldVideo){
        return `0%`
      }
      return `${(this.currentTime / this.oldVideo.totalTime) * 100}%`;
    }
  }
};
</script>

<style scoped lang="less">
.my-list-item {
  max-height: 32px;
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  font-size: 13px;
  cursor: default;
  padding: 0 15px;
  transition: width 1s;
  position: relative;
  > .in-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
  > .out-progress {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background-color: #5d5d5e;
    z-index: -1;
  }
  .left {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .my-fa {
    padding: 0 5px;
    cursor: pointer;
  }
  &:hover:not(.currentVideo) {
    color: white;
  }
  &:hover {
    .right {
      .time {
        display: none;
      }
      > span:not(.time) {
        display: block;
      }
    }
  }
  .right {
    > span:not(.time) {
      display: none;
    }
    &:hover {
      .time {
        display: none;
      }
      > span:not(.time) {
        display: block;
      }
    }
  }
}
.msg {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: red;
}
</style>