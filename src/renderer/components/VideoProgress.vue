<template>
  <div :title="subTitle" class="progress-container" ref="progress">
    <span @click.stop="speedDown" class="fa fa-backward my-icon" title="减速"></span>
    <span v-if="speed!=1" class="speed speed-back">{{speed}}x</span>
    <div @click="onClick($event)" class="video-out-line" ref="outLine">
      <div ref="inLine" class="in-line" :style="{'width':`${videoPercent}%`}">
        <span @mousedown.stop="ballMouseDown" @click.stop class="ball"></span>
      </div>
    </div>
    <span v-if="speed!=1" class="speed speed-forward">{{speed}}x</span>
    <span @click.stop="speedUp" title="加速" class="fa fa-forward my-icon"></span>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from "vuex";
import connect from "../api/bus.js";
import { formatTime } from "../api/util.js";
export default {
  name: "video-progress",
  data() {
    return {
      // 进度条的百分比
      videoPercent: 0,
      // 最内层进度条长度
      inLineWidth: 0,
      // 鼠标在进度条上移动时候显示的内容
      subTitle: 0
    };
  },
  mounted() {
    // 移动前里面的进度条的长度
    this.oldInWidth = null;
    // 鼠标是否按下
    this.mousedown = false;

    this.$refs.progress.addEventListener("mousemove", this.mouseMove);
  },
  methods: {
    ...mapMutations(["setSpeed", "setCurrentTime", "setOldVideo"]),
    ...mapActions(["changeVideoList"]),
    // 点击最外层进度条
    onClick(e) {
      // 过渡
      this.$refs.inLine.style.transition = "width .2s";
      this.inLineWidth = e.offsetX;
      this.$refs.inLine.addEventListener("transitionend", this.transitionend);
    },
    // 过渡结束
    transitionend() {
      // 取消过渡
      this.$refs.inLine.style.transition = "";
    },
    // 鼠标在进度球按下
    ballMouseDown() {
      this.mousedown = true;
      window.addEventListener("mousemove", this.onMouseMove);
      window.addEventListener("mouseup", this.onMouseUp);
    },
    // 鼠标移动
    onMouseMove(e) {
      // 实现拖拽移动事件
      if (this.mousedown) {
        // 最外层进度条距离窗口最左边距离
        let outLineX = this.$refs.outLine.getBoundingClientRect().x;
        // 最外层进度条的宽度
        let outLineWidth = this.$refs.outLine.getBoundingClientRect().width;
        // 获取鼠标移动距离相对最外层进度条的距离
        let offsetX = e.pageX - outLineX;
        if (offsetX <= 0) {
          offsetX = 0;
        } else if (offsetX > outLineWidth) {
          offsetX = outLineWidth;
        }
        this.inLineWidth = offsetX;
      }
    },
    onMouseUp() {
      this.mousedown = false;
      window.removeEventListener("mouseup", this.onMouseUp);
      window.removeEventListener("mousemove", this.onMouseMove);
    },
    // 减速播放
    speedDown() {
      if (this.speed == 0.1) {
        return;
      }
      // 只取小数点后一位
      let speed = parseFloat((this.speed - 0.1).toString().substring(0, 3));
      this.setSpeed(speed);
    },
    // 加速播放
    speedUp() {
      if (this.speed == 2) {
        return;
      }
      let speed = parseFloat(
        ((this.speed * 10 + 1) / 10).toString().substring(0, 3)
      );
      this.setSpeed(speed);
    },
    mouseMove(e) {
      if (!this.$refs.outLine) {
        return;
      }
      // 最外层进度条距离窗口最左边距离
      let outLineX = this.$refs.outLine.getBoundingClientRect().x;
      // 最外层进度条的宽度
      let outLineWidth = this.$refs.outLine.getBoundingClientRect().width;
      // 获取鼠标移动距离相对最外层进度条的距离
      let offsetX = e.pageX - outLineX;
      if (offsetX <= 0) {
        offsetX = 0;
      } else if (offsetX > outLineWidth) {
        offsetX = outLineWidth;
      }
      // 内层进度条占外层进度条的比例
      let videoPercent = offsetX / outLineWidth;
      // 计算出当前播放的进度，并格式化时间
      let currentTime = formatTime(this.totalTime * videoPercent);
      this.subTitle = currentTime;
    }
  },
  computed: {
    ...mapGetters([
      "speed",
      "totalTime",
      "currentTime",
      "oldVideo",
      "currentVideo"
    ])
  },
  watch: {
    currentTime: {
      immediate: true,
      handler: function(newVal) {
        if (!this.oldVideo) {
          this.videoPercent = 0;
          return;
        }
        // 计算出内层占外层进度条的百分比
        this.videoPercent = (newVal / this.oldVideo.totalTime) * 100;
      }
    },
    inLineWidth() {
      // 最外层进度条宽度
      let outLineWidth = this.$refs.outLine.getBoundingClientRect().width;
      // 最内层进度条占最外层进度条的百分比
      this.videoPercent = (this.inLineWidth / outLineWidth) * 100;
      // 设置当前时间
      this.setCurrentTime(this.totalTime * (this.inLineWidth / outLineWidth));
      // 发射事件修改video的当前播放进度
      connect.$emit("setCurrentTime");
    }
  },
  beforeDestroy() {
    this.outLineX = null;
    this.outLineWidth = null;
    this.$refs.progress.removeEventListener("mousemove", this.mouseMove);
    this.$refs.inLine.removeEventListener("transitionend", this.transitionend);
  }
};
</script>

<style scoped lang="less">
.progress-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  .my-icon {
    color: #505050;
    cursor: pointer;
    &:hover {
      color: #999999;
    }
  }
  .speed {
    color: #ffffff;
    font-size: 10px;
    &.speed-back {
      padding-left: 5px;
    }
    &.speed-forward {
      padding-right: 5px;
    }
  }
}
.video-out-line {
  position: relative;
  height: 3px;
  background-color: #363739;
  cursor: pointer;
  flex: 1;
  margin: 0 10px;
  .in-line {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    max-width: 100%;
    background-color: #45b000;
    .ball {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #cccccc;
      position: absolute;
      top: 50%;
      left: 100%;
      transform: translate(-50%, -50%);
      display: block;
      z-index: 3;
    }
  }
}
</style>