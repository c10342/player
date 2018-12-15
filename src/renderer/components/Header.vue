<template>
    <div class="header">
        <div class="left"  v-if="!isFullScreen">
            <span class="fa fa-youtube-play"></span>
            <div @click.stop="showMenu">
                <span ref="title" class="title" v-if="!currentVideo">播放器</span>
                <span ref="icon" class="fa fa-angle-down my-angle-down" :style="{'margin-left':currentVideo?'10px':''}"></span>
            </div>
            <span v-if="currentVideo" :title="currentVideo.filename" class="filename">{{currentVideo.filename}}</span>
            <transition name="router" mode="out-in">
                <ul v-if="isShowMenu" class="my-menu">
                    <li>
                        <span class="fa fa-list-alt"></span>
                        访问官网
                    </li>
                    <li>
                        <span class="fa fa-cloud-upload"></span>
                        在线升级
                    </li>
                    <li>
                        <span class="fa fa-question-circle-o"></span>
                        在线帮助
                    </li>
                    <li>
                        <span class="fa fa-envelope-open-o"></span>
                        意见反馈
                    </li>
                    <li class="set">
                        <span class="fa fa-cog fa-fw"></span>
                        设置
                    </li>
                    <li>
                        <span class="fa fa-user-circle"></span>
                        关于
                    </li>
                    <li class="set">
                        <span class="fa fa-sign-out"></span>
                        退出
                    </li>
                </ul>
            </transition>
        </div>
        <div class="middle" v-if="!isFullScreen"></div>
        <div class="right" v-if="!isFullScreen">
            <span title="用户" class="fa fa-user-o"></span>
            <span title="更换皮肤" class="fa fa-tv"></span>
            <span title="播放记录" class="fa fa-clock-o"></span>
            <span @click="minWindow" title="最小化" class="fa fa-window-minimize"></span>
            <span v-if="!isMaxed" @click="maxWindow" title="最大化" class="fa fa-window-maximize"></span>
            <span v-else @click="maxWindow" title="还原窗口" class="fa fa-window-restore"></span>
            <span @click="close" title="关闭" class="fa fa-close"></span>
        </div>
        <div  v-if="isFullScreen" class="fullScreen-title">{{currentVideo.filename}}</div>
        <div class="flexbetween" v-if="isFullScreen">
          <span class="fullScreen-title">{{time}}</span>
          <span class="fullScreen-title exit-fullScreen" @click="setFullScreen(false)">退出全屏</span>
        </div>
    </div>
</template>

<script>
import WindowUtil from "../api/window";
import { mapGetters, mapMutations } from "vuex";

const winUtil = new WindowUtil();

export default {
  name: "my-header",
  data() {
    return {
      // 是否显示最大化
      isMaxed: false,
      // 是否显示左上角的菜单
      isShowMenu: false,
      // 当前时间
      time: null
    };
  },
  mounted() {
    this.timer = null;
  },
  methods: {
    ...mapMutations(["setFullScreen"]),
    // 最小化窗口
    minWindow() {
      winUtil.minWindow();
    },
    // 最大化或者还原窗口
    maxWindow() {
      this.isMaxed = !this.isMaxed;
      winUtil.maxWindow();
    },
    // 关闭窗口
    close() {
      winUtil.close();
    },
    // 点击左上角播放器文字后显示或者隐藏菜单
    showMenu() {
      // 触发一次点击是因为可能还有其他的菜单在显示，此时需要隐藏其他菜单
      document.body.click();
      // 隐藏左上角的菜单
      this.isShowMenu = !this.isShowMenu;
      if (!this.isShowMenu) {
        window.removeEventListener("click", this.onClick);
      } else {
        window.addEventListener("click", this.onClick);
      }
    },
    onClick() {
      // 隐藏左上角的菜单
      this.isShowMenu = false;
      window.removeEventListener("click", this.onClick);
    },
    getTime() {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      this.time = `${h}:${m}:${s}`;
    }
  },
  computed: {
    ...mapGetters(["isFullScreen", "currentVideo"])
  },
  watch: {
    isFullScreen(newVal) {
      winUtil.setFullScreen(newVal);
      if (newVal) {
        this.timer = setInterval(this.getTime, 1000);
      } else {
        if (this.timer) {
          clearInterval(this.timer);
        }
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("click", this.onClick);
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  /*设置可以拖拽导航栏移动窗口*/
  /*-webkit-app-region: drag;*/
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  // background-color: #1e1e20;
  padding: 0 10px;
  .middle {
    -webkit-app-region: drag;
    flex: 1;
    height: 100%;
    margin: 0 10px;
  }
  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    .my-menu {
      padding: 5px 0;
      position: absolute;
      font-size: 13px;
      top: 38px;
      left: 5px;
      background-color: #252528;
      color: #b4b4b4;
      z-index: 1;
      width: 150px;
      border-radius: 5px;
      &:before {
        position: absolute;
        top: -10px;
        left: 10px;
        content: "";
        height: 0;
        width: 0;
        border: 5px solid transparent;
        border-bottom-color: #252528;
      }
      > li {
        cursor: pointer;
        padding: 10px 15px;
        color: #878788;
        position: relative;
        &.set:before {
          content: "";
          height: 1px;
          position: absolute;
          width: 100%;
          top: 0;
          left: 0;
          background-color: #2e2e30;
        }
        &:hover {
          background-color: #373333;
          color: #5dee00;
        }
      }
    }
    > span:nth-child(1) {
      color: #5dee00;
      font-size: 16px;
    }
    > div {
      position: relative;
      cursor: pointer;
      .title {
        color: #b0b0b0;
        font-size: 16px;
        padding: 0 5px;
      }
      .my-angle-down {
        color: #b0b0b0;
        font-size: 16px;
      }
      &:hover {
        > span {
          color: #ffffff;
        }
      }
    }
  }
  .right {
    display: flex;
    flex-direction: row;
    align-items: center;
    span {
      color: #b0b0b0;
      height: 36px;
      width: 36px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      &:hover {
        color: #5dee00;
      }
    }
  }
}

.filename {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #b0b0b0;
  font-size: 14px;
  padding: 0 10px;
  max-width: 200px;
  cursor: default;
}
.fullScreen-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #b0b0b0;
  font-size: 14px;
  padding: 0 10px;
  cursor: default;
}
.exit-fullScreen {
  cursor: pointer;
  &:hover {
    color: #5dee00;
  }
}
</style>