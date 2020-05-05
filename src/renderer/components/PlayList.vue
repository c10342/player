<template>
  <div
    ref="playList"
    :id="currentVideo&&!isLock?'position':''"
    class="playList"
    :style="{'height':currentVideo?`${playListHeight}px`:'100%','color':theme.textColor}"
  >
    <div class="my-arrow" v-show="isShowArrow">
      <span
        @click="hideList"
        v-show="!isHidenList&&!currentVideo"
        :title="$t('common.packUpList')"
        class="fa fa-arrow-circle-o-right"
      ></span>
      <span
        @click="hideList"
        v-show="!isHidenList&&isFullScreen"
        :title="$t('common.packUpList')"
        class="fa fa-arrow-circle-o-right"
      ></span>
      <span
        @click="hideList"
        v-show="isHidenList"
        :title="$t('common.unrollList')"
        class="fa fa-arrow-circle-o-left"
      ></span>
      <span
        @click="lockList"
        v-show="currentVideo&&!isLock&&!isHidenList&&!isFullScreen"
        class="fa fa-lock"
        :title="$t('common.lockList')"
      ></span>
      <span
        @click="unLockList"
        v-show="currentVideo&&isLock&&!isHidenList"
        class="fa fa-unlock"
        :title="$t('common.releaseList')"
      ></span>
    </div>
    <div class="content-container" v-show="!isHidenList">
      <div class="top">
        <span>{{$t('common.playList')}}</span>
        <div class="my-icon">
          <span :title="$t('common.add')" class="fa fa-plus-square-o"></span>
          <span :title="$t('common.delete')" class="fa fa-trash-o fa-lg delete"></span>
          <span
            @click.stop="showExtendMenu"
            :title="$t('common.extensionMenu')"
            class="fa fa-angle-double-down"
          ></span>
        </div>
        <div class="file" v-show="isShowOther && videoList.length==0">
          <div class="no-file">
            <span class="fa fa-file-o"></span>
            <p>{{$t('common.noDocuments')}}</p>
          </div>
          <div :style="{'border': `1px solid ${theme.textColor}`}" class="open-file">
            <div @click="openFile" class="flexrowcenter">
              <span class="fa fa-folder-open-o"></span>
              <span>{{$t('common.addFile')}}</span>
            </div>
            <span @click.stop="showMenu" class="fa fa-angle-down"></span>
            <ul :style="{'background-color':theme.bgColor}" v-show="isShowFileMenu" class="my-file">
              <li :class="theme.hover" @click="openFolder">
                <span class="fa fa-file-excel-o"></span>
                {{$t('common.addFolder')}}
              </li>
              <li :class="theme.hover">
                <span class="fa fa-link"></span>
                {{$t('common.addUrl')}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <transition name="router" mode="out-in">
        <ul
          :style="{'background-color': theme.bgColor}"
          class="extend-menu"
          v-show="isShowExtendMenu"
        >
          <li :class="theme.hover" class="line">{{$t('common.clearList')}}</li>
          <li
            v-for="(item,index) in soreModeList"
            :key="item.title"
            :class="{[theme.hover]:true,'line':index==soreModeList.length-1}"
            @click="changeSoreMode(item.soreMode)"
          >
            <span v-show="sortMode==item.soreMode" class="fa fa-check"></span>
            {{item.title}}
          </li>
          <li
            v-for="item in playModeList"
            :key="item.title"
            :class="theme.hover"
            @click="changeMode(item.playMode)"
          >
            <span v-if="playMode==item.playMode" class="fa fa-check"></span>
            {{item.title}}
          </li>
        </ul>
      </transition>
      <div
        @contextmenu.stop="contextmenu"
        class="list-content"
        :style="{'height':`${playListHeight-40}px`}"
      >
        <div style="padding-bottom: 10px;">
          <ListItem
            @contextmenu="itemContextmenu(video)"
            :item="video"
            v-for="(video,index) in videoList"
            :key="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import connect from "../api/bus.js";
import OpenDialog from "../api/OpenDialog";
import { remote, shell } from "electron";
import path from "path";
import storage from "good-storage";
import fs from "fs";
import { playOrderList, sortList } from "../config";

const openDialog = new OpenDialog();
const { Menu } = remote;

let isLock = storage.get("isLock", false);

export default {
  name: "play-list",
  props: {
    // 是否显示列表最左边的按钮
    isShowArrow: {
      type: Boolean,
      default: false
    },
    // 列表高度
    playListHeight: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 是否显示添加文件菜单
      isShowFileMenu: false,
      // 是否隐藏播放列表
      isHidenList: false,
      // 是否隐藏其他
      isShowOther: true,
      // 是否显示扩展菜单
      isShowExtendMenu: false,
      // 是否锁定播放列表
      isLock: isLock,
      // 定时器时间
      time: 3000
    };
  },
  mounted() {
    // 保存列表原有的的宽度
    this.savePlayListWidth = 300;
    // 定时器
    this.playListTimer = null;
    this.initEventListener();
    this.initListener();
  },
  methods: {
    ...mapMutations([
      "setPlayMode",
      "setSortMode",
      "setCurrentVideo",
      "setPlaying",
      "clearVideoList"
    ]),
    ...mapActions([
      "sortVideoList",
      "deleteVideo",
      "clearInvalidVideo",
      "changeVideoList"
    ]),
    // 开启定时器
    createSetTimeOut() {
      if (this.playListTimer) {
        clearTimeout(this.playListTimer);
      }
      this.playListTimer = setTimeout(this.createTimeOut, this.time);
    },
    initEventListener() {
      this.$refs.playList.addEventListener("mouseleave", this.onMouseLeave);
      this.$refs.playList.addEventListener("mouseenter", this.onMouseEnter);
      window.addEventListener("click", this.onClick);
    },
    // 初始化事件监听器
    initListener() {
      // 非全屏的时候显示头部和尾部
      connect.$on("showFooterAndHeader", () => {
        this.showFooterAndHeader();
      });
      // 全屏的时候隐藏头部和尾部
      connect.$on("hideFooterAndHeader", () => {
        this.hideFooterAndHeader();
      });

      connect.$on("showPlayList", () => {
        if (!this.isHidenList) {
          return;
        }
        this.hideList();
        if (!this.currentVideo) {
          return;
        }
        this.createSetTimeOut();
      });
    },
    // 移除事件监听器
    removeListener() {
      connect.$off("showFooterAndHeader");
      connect.$off("hideFooterAndHeader");
      connect.$off("showPlayList");
    },
    // 显示或者隐藏列表最中间菜单
    showMenu() {
      if (!this.isShowFileMenu) {
        document.body.click();
      }
      this.isShowFileMenu = !this.isShowFileMenu;
    },
    onClick() {
      // 隐藏列表右上角的扩展菜单
      this.isShowExtendMenu = false;
      // 隐藏列表最中间的菜单
      this.isShowFileMenu = false;
    },
    // 隐藏或者显示播放列表
    hideList() {
      this.isHidenList = !this.isHidenList;
    },
    // 切换播放模式
    changeMode(mode) {
      this.setPlayMode(mode);
    },
    // 切换排序模式
    changeSoreMode(mode) {
      this.setSortMode(mode);
    },
    // 显示或者隐藏右上角的扩展菜单
    showExtendMenu() {
      if (!this.isShowExtendMenu) {
        document.body.click();
      }
      this.isShowExtendMenu = !this.isShowExtendMenu;
    },
    // 锁定列表
    lockList() {
      if (this.playListTimer) {
        clearTimeout(this.playListTimer);
      }
      this.isLock = !this.isLock;
    },
    // 定时器方法
    createTimeOut() {
      if (!this.currentVideo) {
        //当前没有正在播放的视频就不用隐藏列表
        clearTimeout(this.playListTimer);
        return;
      }
      this.hideList();
      clearTimeout(this.playListTimer);
    },
    // 释放列表
    unLockList() {
      this.isLock = false;
    },
    onMouseEnter() {
      if (
        this.playListTimer &&
        this.currentVideo &&
        !this.isLock &&
        !this.isHidenList
      ) {
        clearTimeout(this.playListTimer);
      }
    },
    onMouseLeave(e) {
      if (this.playListTimer) {
        clearTimeout(this.playListTimer);
      }
      if (!this.currentVideo) {
        return;
      }
      if (!e) {
        return;
      }
      if (this.currentVideo && !this.isLock && !this.isHidenList) {
        this.createSetTimeOut();
      }
    },
    // 非全屏的时候显示头部和脚部，调整播放列表高度
    showFooterAndHeader() {
      if (this.currentVideo) {
        this.resetPositionToOriginal();
        this.setPlayListHeight(`${this.playListHeight}px`);
      } else {
        //不存在播放歌曲说明是点击停止按钮后退出全屏的
        this.resetPositionToZero();
        this.setPlayListHeight(`${this.playListHeight}px`);
      }
    },
    // 全屏的时候隐藏头部和脚部，调整播放列表高度
    hideFooterAndHeader() {
      this.resetPositionToZero();
      this.setPlayListHeight("100%");
    },
    // 把列表定位置为0
    resetPositionToZero() {
      this.$refs.playList.style.top = "0";
      this.$refs.playList.style.bottom = "0";
    },
    // 把列表定位恢复为原样
    resetPositionToOriginal() {
      this.$refs.playList.style.top = "37px";
      this.$refs.playList.style.bottom = "56px";
    },
    // 设置列表高度
    setPlayListHeight(height) {
      this.$refs.playList.style.height = height;
    },
    // 打开文件
    openFile() {
      openDialog.openFile();
    },
    // 打开文件夹
    openFolder() {
      openDialog.openFolder();
    },
    clearTimerAndListener() {
      this.$refs.playList.removeEventListener("mouseleave", this.onMouseLeave);
      if (this.playListTimer) {
        clearTimeout(this.playListTimer);
      }
    },
    resetTimerAndListener() {
      if (this.playListTimer) {
        clearTimeout(this.playListTimer);
      }
      this.$refs.playList.addEventListener("mouseleave", this.onMouseLeave);
    },
    contextmenu() {
      this.clearTimerAndListener();
      document.body.click();
      const commonTemp = this.createContextmenuList();
      let playListMenuTemplate = [
        {
          label: this.$t("common.add"),
          submenu: [
            {
              label: this.$t("common.addFile"),
              click: () => {
                openDialog.openFile();
              }
            },
            {
              label: this.$t("common.addFolder"),
              click: () => {
                openDialog.openFolder();
              }
            },
            {
              label: this.$t("common.addUrl"),
              click: () => {
                connect.$emit("openUrl");
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: this.$t("common.clearPlayList"),
          click: () => {
            this.clearVideoList();
          }
        },
        {
          label: this.$t("common.deleteInvalid"),
          click: () => {
            this.clearInvalidVideo();
          }
        },
        {
          type: "separator"
        },
        ...commonTemp,
        {
          type: "separator"
        }
      ];

      let m = Menu.buildFromTemplate(playListMenuTemplate);

      m.popup({ window: remote.getCurrentWindow() });

      m.addListener("menu-will-close", () => {
        this.resetTimerAndListener();
      });
    },
    itemContextmenu(video) {
      this.clearTimerAndListener();
      document.body.click();
      let flag = false;
      let isCurrentVideo = this.currentVideo
        ? video.id == this.currentVideo.id
        : false;
      if (this.currentVideo && isCurrentVideo && this.isPlaying) {
        flag = true;
      }
      const commonTemp = this.createContextmenuList();
      let playListMenuTemplate = [
        {
          label: flag ? this.$t("common.suspend") : this.$t("common.play"),
          click: () => {
            if (isCurrentVideo) {
              this.setPlaying(!flag);
            } else {
              this.setCurrentVideo(video);
            }
          }
        },
        {
          label: this.$t("common.deleteItem"),
          click: () => {
            this.deleteVideo(video);
          }
        },
        {
          label: this.$t("common.add"),
          submenu: [
            {
              label: this.$t("common.addFile"),
              click: () => {
                openDialog.openFile();
              }
            },
            {
              label: this.$t("common.addFolder"),
              click: () => {
                openDialog.openFolder();
              }
            },
            {
              label: this.$t("common.addUrl"),
              click: () => {
                connect.$emit("openUrl");
              }
            }
          ]
        },
        {
          type: "separator"
        },
        {
          label: this.$t("common.clearPlayList"),
          click: () => {
            this.clearVideoList();
          }
        },
        {
          label: this.$t("common.deleteInvalid"),
          click: () => {
            this.clearInvalidVideo();
          }
        },
        {
          type: "separator"
        },
        ...commonTemp,
        {
          type: "separator"
        },
        {
          label: this.$t("common.fileInfo"),
          click: () => {
            connect.$emit("videoInfo", video);
          }
        },
        {
          label: this.$t("common.openLocation"),
          click: () => {
            if (!fs.existsSync(video.src) && video.mode == "local") {
              // 保存文件错误信息
              let newVideo = Object.assign({}, video, { msg: "无效文件" });
              // 修改播放列表
              this.changeVideoList(newVideo);
              return;
            }
            let url = path.dirname(video.src);
            shell.openExternal(url);
          }
        }
      ];
      let m = Menu.buildFromTemplate(playListMenuTemplate);

      Menu.setApplicationMenu(m);

      m.popup({ window: remote.getCurrentWindow() });
      m.addListener("menu-will-close", () => {
        this.resetTimerAndListener();
      });
    },
    // 创建共同右键菜单Template
    createContextmenuList() {
      const playOrderArr = playOrderList.map(item => {
        return {
          label: this.$t(item.label),
          type: "checkbox",
          checked: this.playMode == item.playMode,
          click: () => {
            this.setPlayMode(item.playMode);
          }
        };
      });
      const sortArr = sortList.map(item => {
        return {
          label: this.$t(item.label),
          type: "checkbox",
          checked: this.sortMode == item.sortMode,
          click: () => {
            this.setSortMode(item.sortMode);
          }
        };
      });
      return [
        {
          label: this.$t("common.playOrder"),
          submenu: playOrderArr
        },
        {
          label: this.$t("common.sort"),
          submenu: sortArr
        }
      ];
    }
  },
  computed: {
    ...mapGetters([
      "playMode",
      "sortMode",
      "currentVideo",
      "videoList",
      "isFullScreen",
      "isPlaying",
      "theme"
    ]),
    // 播放模式列表
    playModeList() {
      return [
        { title: this.$t("common.singlePlay"), playMode: 1 },
        { title: this.$t("common.singleCycle"), playMode: 2 },
        { title: this.$t("common.loopList"), playMode: 3 },
        { title: this.$t("common.sequentialPlay"), playMode: 4 },
        { title: this.$t("common.randomPlay"), playMode: 5 }
      ];
    },
    // 分类模式列表
    soreModeList() {
      return [
        { title: this.$t("common.defaultSort"), soreMode: 1 },
        { title: this.$t("common.sizeSort"), soreMode: 2 },
        { title: this.$t("common.timeSort"), soreMode: 3 },
        { title: this.$t("common.randomSort"), soreMode: 4 },
        { title: this.$t("common.nameSort"), soreMode: 5 }
      ];
    }
  },
  watch: {
    sortMode: {
      immediate: true,
      handler: function(newVal) {
        this.sortVideoList(newVal);
      }
    },
    isFullScreen(newVal) {
      if (!newVal) {
        //从全屏切换回非全屏的时候需要显示头部和尾部
        this.showFooterAndHeader();
      } else {
        //全屏的时候不能锁定播放列表
        this.isLock = false;
      }
    },
    isLock(newVal) {
      storage.set("isLock", newVal);
      //上锁的时候是相对定位,全屏的时候是相对定位，可能会修改定位，这里是重置定位，不上锁同理
      if (newVal) {
        this.resetPositionToZero();
      } else {
        this.resetPositionToOriginal();
        if (this.isFullScreen) {
          this.createSetTimeOut();
        }
      }
    },
    currentVideo(newVal) {
      if (!newVal) {
        this.resetPositionToZero();
        this.setPlayListHeight(`${this.playListHeight}px`);
      } else {
        if (!this.isFullScreen) {
          this.resetPositionToOriginal();
        }
        if (!this.isFullScreen && this.isLock) {
          this.resetPositionToZero();
        }
      }
    },
    isPlaying(newVal) {
      if (newVal && this.isLock) {
        this.resetPositionToZero();
      }
      if (newVal && !this.isLock && !this.isHidenList) {
        this.createSetTimeOut();
      }
    }
  },
  beforeDestroy() {
    if (this.playListTimer) {
      clearTimeout(this.playListTimer);
    }
    this.$refs.playList.removeEventListener("mouseleave", this.onMouseLeave);
    this.$refs.playList.removeEventListener("mouseenter", this.onMouseEnter);
    window.removeEventListener("click", this.onClick);
    this.removeListener();
  }
};
</script>

<style scoped lang="less">
#position {
  position: fixed;
  top: 36px;
  bottom: 56px;
  right: 0;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  .my-arrow {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.playList {
  height: 100%;
  border-left: 1px solid #2f2f31;
  position: relative;
  .content-container {
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 300px;
  }
  .my-arrow {
    position: absolute;
    top: 50%;
    left: -31px;
    transform: translateY(-50%);
    width: 30px;
    height: 66px;
    line-height: 66px;
    text-align: center;
    border: 1px solid #303031;
    border-right: none;
    cursor: pointer;
    &:hover {
      border: 1px solid #45b000;
      border-right: none;
      > span {
        color: #45b000;
      }
    }
    > span {
      width: 100%;
      line-height: 66px;
    }
  }
  .top {
    padding: 15px 15px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    > span {
      font-size: 15px;
    }
    .my-icon {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 15px;
      position: relative;
      > span {
        cursor: pointer;
        &:hover {
          color: #1bb017;
        }
      }
      > span + span {
        margin-left: 10px;
      }
      > .delete {
        font-size: 14px;
      }
    }
  }
  .file {
    flex: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .no-file {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      > span {
        font-size: 50px;
        margin-bottom: 10px;
      }
      margin-bottom: 30px;
    }
    .open-file {
      position: relative;
      width: 150px;
      height: 40px;
      border-radius: 40px;
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
        border-radius: 5px;
        &:before {
          content: "";
          height: 0;
          width: 0;
          position: absolute;
          top: -10px;
          left: 23px;
          border: 5px solid transparent;
          border-bottom-color: #252527;
        }
        > li {
          width: 100%;
          height: 40px;
          padding: 10px 15px;
          color: #878788;
          border-radius: 5px;
          cursor: pointer;
          &:hover {
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
  }
}

.list-content {
  overflow: auto;
}
.top {
  max-height: 40px;
  transition: width 1s;
  overflow: hidden;
}

.extend-menu {
  position: absolute;
  right: 5px;
  top: 40px;
  z-index: 5;
  width: 100px;
  color: #878788;
  padding: 3px 0;
  border-radius: 5px;
  > .line {
    border-bottom: 1px solid #878788;
  }
  &:after {
    content: "";
    position: absolute;
    left: 80%;
    top: -10px;
    height: 0;
    width: 0;
    border: 5px solid transparent;
    border-bottom-color: greenyellow;
  }
  > li {
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
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
      margin-left: -10px;
    }
  }
}
</style>