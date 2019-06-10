<template>
  <div :style="{'color':theme.textColor}" class="header">
    <transition name="router" mode="out-in">
      <About @handlerAboutClick='handlerAboutClick' :isShow="showAbout"/>
    </transition>
    <div class="left" v-if="!isFullScreen">
      <span class="fa fa-youtube-play"></span>
      <div @click.stop="showMenu">
        <span ref="title" class="title" v-if="!currentVideo">播放器</span>
        <span
          ref="icon"
          class="fa fa-angle-down my-angle-down"
          :style="{'margin-left':currentVideo?'10px':''}"
        ></span>
      </div>
      <span
        v-if="currentVideo"
        :title="currentVideo.filename"
        class="filename"
      >{{currentVideo.filename}}</span>
      <transition name="router" mode="out-in">
        <ul
          @click="handlerClick"
          :style="{'background-color': theme.bgColor}"
          v-if="isShowMenu"
          class="my-menu"
        >
          <li
            :data-title="item.title"
            v-for="(item,index) in lis"
            :key="index"
            :class="{[theme.hover]:true,'set':item.set}"
          >
            <span :class="item.icion"></span>
            {{item.title}}
          </li>
        </ul>
      </transition>
    </div>
    <div class="middle" v-if="!isFullScreen"></div>
    <div class="right" v-if="!isFullScreen">
      <span
        @click="setAlwaysOnTop(true)"
        v-if="!isAlwaysOnTop"
        title="置顶"
        class="fa fa-hand-o-left"
      ></span>
      <span
        @click="setAlwaysOnTop(false)"
        v-if="isAlwaysOnTop"
        title="取消置顶"
        class="fa fa-hand-o-down"
      ></span>
      <span title="用户" class="fa fa-user-o"></span>
      <span @click.stop="showTheme" title="更换皮肤" class="fa fa-tv"></span>
      <span @click.stop="showHistory" title="播放记录" class="fa fa-clock-o"></span>
      <span @click="minWindow" title="最小化" class="fa fa-window-minimize"></span>
      <span v-if="!isMaxed" @click="maxWindow" title="最大化" class="fa fa-window-maximize"></span>
      <span v-else @click="maxWindow" title="还原窗口" class="fa fa-window-restore"></span>
      <span @click="close" title="关闭" class="fa fa-close"></span>
      <transition name="router" mode="out-in">
        <div :style="{'background-color':theme.bgColor}" v-show="isShowHistory" class="m-history">
          <div class="history">
            <div
              :style="{'background-color':theme.bgColor}"
              class="no-history"
              v-if="historicalRecords.length == 0"
            >暂无历史记录</div>
            <HistoryItem :item="video" v-for="(video,index) in historicalRecords" :key="index"/>
            <div
              :style="{'background-color':theme.bgColor}"
              v-if="historicalRecords.length != 0"
              @click="clearHistoricalRecords"
              class="clear-history"
            >清空历史记录</div>
          </div>
        </div>
      </transition>
      <transition name="router" mode="out-in">
        <ul :style="{'background-color':theme.bgColor}" v-show="isShowTheme" class="change-skin">
          <li
            @click="changeTheme(theme)"
            :style="{'background-image': `url('${theme.bgUrl}')`}"
            v-for="(theme,index) in themes"
            :key="index"
          ></li>
        </ul>
      </transition>
    </div>
    <div v-if="isFullScreen" class="fullScreen-title">{{currentVideo.filename}}</div>
    <div class="flexbetween" v-if="isFullScreen">
      <span class="fullScreen-title">{{time}}</span>
      <span class="fullScreen-title exit-fullScreen" @click="setFullScreen(false)">退出全屏</span>
    </div>
  </div>
</template>

<script>
import WindowUtil from "../api/window";
import { mapGetters, mapMutations } from "vuex";
import { remote, shell } from "electron";
import { themes } from "../api/util";

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
      time: null,
      // 是否显示历史记录
      isShowHistory: false,
      // 主题颜色
      themes,
      // 是否显示主题
      isShowTheme: false,
      // 左上角菜单
      lis: [
        { title: "访问官网", icion: "fa fa-list-alt", set: false },
        { title: "在线升级", icion: "fa fa-cloud-upload", set: false },
        { title: "在线帮助", icion: "fa fa-question-circle-o", set: false },
        { title: "意见反馈", icion: "fa fa-envelope-open-o", set: false },
        { title: "设置", icion: "fa fa-cog fa-fw", set: true },
        { title: "关于", icion: "fa fa-user-circle", set: false },
        { title: "退出", icion: "fa fa-sign-out", set: true }
      ],
      // 是否显示关于页面
      showAbout: false
    };
  },
  mounted() {
    this.timer = null;
    remote.getCurrentWindow().addListener("maximize", this.maximize);
    remote.getCurrentWindow().addListener("unmaximize", this.unmaximize);
    window.addEventListener("click", this.onClick);
  },
  methods: {
    ...mapMutations([
      "setFullScreen",
      "clearHistoricalRecords",
      "setAlwaysOnTop",
      "setTheme"
    ]),
    maximize() {
      this.isMaxed = true;
    },
    unmaximize() {
      this.isMaxed = false;
    },
    // 最小化窗口
    minWindow() {
      winUtil.minWindow();
    },
    // 最大化或者还原窗口
    maxWindow() {
      // this.isMaxed = !this.isMaxed;
      winUtil.maxWindow();
    },
    // 关闭窗口
    close() {
      winUtil.close();
    },
    // 点击左上角播放器文字后显示或者隐藏菜单
    showMenu() {
      // 触发一次点击是因为可能还有其他的菜单在显示，此时需要隐藏其他菜单
      if (!this.isShowMenu) {
        document.body.click();
      }
      // 隐藏左上角的菜单
      this.isShowMenu = !this.isShowMenu;
    },
    onClick() {
      this.isShowMenu = false;
      this.isShowHistory = false;
      this.isShowTheme = false;
    },
    getTime() {
      let date = new Date();
      let h = date.getHours();
      let m = date.getMinutes();
      let s = date.getSeconds();
      this.time = `${h}:${m}:${s}`;
    },
    showHistory() {
      if (!this.isShowHistory) {
        document.body.click();
      }
      this.isShowHistory = !this.isShowHistory;
    },
    changeTheme(theme) {
      this.setTheme(theme);
    },
    showTheme() {
      if (!this.isShowTheme) {
        document.body.click();
      }
      this.isShowTheme = !this.isShowTheme;
    },
    handlerClick(e) {
      const title = e.target.dataset.title;
      switch (title) {
        case "访问官网":
          shell.openExternal("https://github.com/c10342/player");
          break;
        case "退出":
          this.close();
          break;
        case "关于":
          this.showAbout = true;
          break;
      }
    },
    handlerAboutClick() {
      this.showAbout = false;
    }
  },
  computed: {
    ...mapGetters([
      "isFullScreen",
      "currentVideo",
      "historicalRecords",
      "isAlwaysOnTop",
      "theme"
    ])
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
    remote.getCurrentWindow().removeAllListeners();
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
      // background-color: #252528;
      color: #b4b4b4;
      z-index: 11;
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
        border-bottom-color: greenyellow;
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
          background-color: #878788;
        }
        &:hover {
          // background-color: #373333;
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
        // color: #b0b0b0;
        font-size: 16px;
        padding: 0 5px;
      }
      .my-angle-down {
        // color: #b0b0b0;
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
    position: relative;
    span {
      // color: #b0b0b0;
      height: 36px;
      width: 36px;
      text-align: center;
      line-height: 36px;
      cursor: pointer;
      &:hover {
        color: #5dee00;
      }
    }
    .history {
      max-height: 200px;
      width: 300px;
      // background-color: #333;
      border-radius: 5px;
      overflow: auto;
      color: #b4b4b4;
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

.m-history {
  position: absolute;
  top: 37px;
  right: -8px;
  z-index: 20;
  border-radius: 5px;
  &:before {
    position: absolute;
    top: -15px;
    left: 160px;
    width: 0;
    height: 0;
    content: "";
    border: 7px solid transparent;
    border-bottom-color: greenyellow;
  }
}
.clear-history,
.no-history {
  text-align: center;
  // color: #fff;
  font-size: 12px;
  padding: 10px;
  // background-color: #333333;
}
.clear-history {
  cursor: pointer;
  &:hover {
    color: #5dee00;
  }
}

.change-skin {
  width: 400px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  position: absolute;
  top: 38px;
  z-index: 2;
  right: 0;
  // background-color: #333333;
  border-radius: 5px;
  &:before {
    position: absolute;
    top: -14px;
    left: 230px;
    width: 0;
    height: 0;
    content: "";
    border: 7px solid transparent;
    border-bottom-color: greenyellow;
  }
  > li {
    width: 113px;
    height: 80px;
    margin: 10px;
    border-radius: 5px;
    cursor: pointer;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>