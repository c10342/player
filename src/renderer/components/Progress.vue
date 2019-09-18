<template>
  <div
    :title="title"
    @click="onClick($event)"
    class="out-line"
    ref="outLine"
    :style="{'width':width}"
  >
    <div class="in-line" :style="{'width':inLineWidth}">
      <span @mousedown.stop="ballMouseDown" @click.stop class="ball"></span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "my-progress",
  data() {
    return {
      // 音量的百分比
      volumePercent: 0
    };
  },
  props: {
    // 音量进度条最外层的宽度
    width: {
      type: String,
      default: "100%"
    }
  },
  mounted() {
    // 移动前里面的进度条的长度
    this.oldInWidth = null;
    // 鼠标是否按下
    this.mousedown = false;
  },
  methods: {
    ...mapMutations(["setInWidth", "setIsVolumeOn", "setVolumePercent"]),
    // 点击最外层进度条
    onClick(e) {
      // 记录鼠标点击的位置距离最外层进度条最左边的距离
      this.oldInWidth = e.offsetX;
      this.setInWidth(e.offsetX);
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
        // 获取最外层进度条到页面最左边距离
        let outLineX = this.$refs.outLine.getBoundingClientRect().x;
        // 获取最外层进度条的宽度
        let outLineWidth = this.$refs.outLine.getBoundingClientRect().width;
        // 获取鼠标移动距离相对最外层进度条的距离
        let offsetX = e.pageX - outLineX;
        if (offsetX <= 0) {
          //小于0关闭音量
          offsetX = 0;
        } else if (offsetX > outLineWidth) {
          offsetX = outLineWidth;
        }
        // 记录鼠标点击的位置距离最外层进度条最左边的距离
        this.oldInWidth = offsetX;
        this.setInWidth(offsetX);
      }
    },
    onMouseUp() {
      this.mousedown = false;
      window.removeEventListener("mouseup", this.onMouseUp);
      window.removeEventListener("mousemove", this.onMouseMove);
    }
  },
  watch: {
    // 监听音量图标的关闭和开启
    isVolumeOn: {
      // 初始化的时候执行一次是因为需要在播放器初始化的时候初始化音量图标的状态
      immediate: true,
      handler: function(newVal) {
        if (!newVal) {
          //关闭
          // 保存现在最内层进度条的宽度，以便在开启音量时恢复原来的状态
          this.oldInWidth = this.inWidth;
          this.setInWidth(0);
        } else {
          //开启
          this.setInWidth(this.oldInWidth || this.inWidth);
        }
      }
    },
    inWidth: {
      // 初始化的时候执行一次是因为需要在播放器初始化的时候初始化最内层进度条的宽度
      immediate: true,
      handler: function(newVal) {
        // 四舍五入
        let volumePercent =
          Math.round((this.inWidth / parseInt(this.width)) * 100) / 100;
        this.setVolumePercent(volumePercent);
        if(volumePercent == 0){
          this.setIsVolumeOn(false)
        }else{
          this.setIsVolumeOn(true)
        }
      }
    }
  },
  computed: {
    ...mapGetters(["inWidth", "isVolumeOn"]),
    // 计算里面进度条的宽度
    inLineWidth() {
      return `${this.inWidth}px`;
    },
    // 鼠标悬停时显示当前音量是多少
    title() {
      this.volumePercent = Math.round(
        (this.inWidth / parseInt(this.width)) * 100
      );
      return `${this.$t('common.volume')}:${this.volumePercent}%`;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>

<style scoped lang="less">
.out-line {
  position: relative;
  height: 3px;
  background-color: #363739;
  cursor: pointer;
  .in-line {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
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
    }
  }
}
</style>