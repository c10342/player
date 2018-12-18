<template>
  <div id="app" ref="app">
    <div 
    :class="{'header-fullScreen':isFullScreen}"
    ref="header" 
    class="app-header">
      <my-header />
    </div>
    <div 
    class="video" 
    @mouseenter="onMouseEnter" 
    @mouseleave="onMouseLeave">
      <my-video />
      <play-list
              :play-list-height="playListHeight"
              :is-show-arrow="isShowArrow" />
    </div>
    <div 
    :class="{'footer-fullScreen':isFullScreen}"
    ref="footer" 
    class="app-footer">
      <my-footer />
    </div>
  </div>
</template>

<script>
import { client } from "./api/util";
import connect from "./api/bus.js";
import { mapGetters } from "vuex";

export default {
  name: "player",
  data() {
    return {
      isShowArrow: false,
      playListHeight: null
    };
  },
  mounted() {
    this.initPlayListHeight();
    this.mouseMoveTimer = null;
    this.FullScreenTimer = null;
    window.addEventListener("resize", this.initPlayListHeight);
  },
  methods: {
    onMouseEnter() {
      this.isShowArrow = true;
    },
    onMouseLeave() {
      this.isShowArrow = false;
    },
    // 初始化播放列表高度
    initPlayListHeight() {
      let footerHeight = this.$refs.footer.getBoundingClientRect().height;
      let headerHeight = this.$refs.header.getBoundingClientRect().height;
      this.playListHeight = client().height - footerHeight - headerHeight;
    },
    // 显示头部和脚部
    showFooterAndHeader() {
      this.$refs.footer.style.height = "auto";
      this.$refs.header.style.height = "auto";
      this.initPlayListHeight();
    },
    // 隐藏头部和脚部
    hideFooterAndHeader() {
      this.$refs.footer.click();
      this.$refs.footer.style.height = "0";
      this.$refs.header.style.height = "0";
      this.initPlayListHeight();
    },
    onMouseMove(e) {
      if (!this.isFullScreen) {
        return;
      }
      if (this.mouseMoveTimer) {
        clearTimeout(this.mouseMoveTimer);
      }
      if (this.FullScreenTimer) {
        clearTimeout(this.FullScreenTimer);
      }
      this.mouseMoveTimer = setTimeout(() => {
        // 计算鼠标是否移动到头部或者是脚部的位置
        if (e.screenY <= 36 || client().height - e.screenY <= 85) {
          this.showFooterAndHeader();
          connect.$emit("showFooterAndHeader");
        } else {
          this.FullScreenTimer = setTimeout(() => {
            this.hideFooterAndHeader();
            connect.$emit("hideFooterAndHeader");
            clearTimeout(this.FullScreenTimer);
          }, 2000);
        }
      }, 50);
    }
  },
  computed: {
    ...mapGetters(["currentVideo", "isFullScreen", "videoList", "isPlaying"])
  },
  watch: {
    // videoList: {
    //   immediate: true,
    //   handler: function(newVal,oldVal) {
    //     this.$nextTick(() => {
    //       if(!oldVal){
    //         this.initPlayListHeight();
    //         return
    //       }
    //       if(newVal.length !=oldVal.length){
    //         this.initPlayListHeight();
    //       }
    //     });
    //   }
    // },
    isPlaying() {
      // 播放的时候脚部的高度会发生变化，所以需要重新计算播放列表的高度
      this.$nextTick(() => {
        this.initPlayListHeight();
      });
    },
    isFullScreen(newVal) {
      // 全屏的时候
      if (newVal) {
        this.$refs.app.addEventListener("mousemove", this.onMouseMove);
        if (this.FullScreenTimer) {
          clearTimeout(this.FullScreenTimer);
        }
        this.FullScreenTimer = setTimeout(() => {
          this.hideFooterAndHeader();
          connect.$emit("hideFooterAndHeader");
          clearTimeout(this.FullScreenTimer);
        }, 2000);
      } else {
        if (this.FullScreenTimer) {
          clearTimeout(this.FullScreenTimer);
        }
        this.$refs.app.removeEventListener("mousemove", this.onMouseMove);
        this.showFooterAndHeader();
      }
    }
  },
  beforeDestroy() {
    if (this.mouseMoveTimer) {
      clearTimeout(this.mouseMoveTimer);
    }
    if (this.FullScreenTimer) {
      clearTimeout(this.FullScreenTimer);
    }
    window.removeEventListener("resize", this.initialInputHeight);
    this.$refs.app.removeEventListener("mousemove", this.onMouseMove);
  }
};
</script>

<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .app-header {
    background-color: #1e1e20;
    border-bottom: 1px solid #2f2f31;
  }
  .video {
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .app-footer {
    background-color: #151616;
    border-top: 1px solid #2f2f31;
  }
  .header-fullScreen {
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }
  .footer-fullScreen {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
}
</style>
