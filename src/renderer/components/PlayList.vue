<template>
    <div
            ref="playList"
            :id="currentVideo&&!isLock?'position':''"
            class="playList"
            :style="{'height':currentVideo?`${playListHeight}px`:'100%'}">
        <div class="my-arrow" v-if="isShowArrow">
            <span
                    @click="hideList"
                    v-if="!isHidenList&&!currentVideo"
                    title="收起列表"
                    class="fa fa-arrow-circle-o-right"></span>
                    <span
                    @click="hideList"
                    v-if="!isHidenList&&isFullScreen"
                    title="收起列表"
                    class="fa fa-arrow-circle-o-right"></span>
            <span
                    @click.stop="hideList"
                    v-if="isHidenList"
                    title="展开列表"
                    class="fa fa-arrow-circle-o-left"></span>
            <span
                    @click="lockList"
                    v-if="currentVideo&&!isLock&&!isHidenList&&!isFullScreen"
                    class="fa fa-lock"
                    title="锁定列表"></span>
            <span
                    @click="unLockList"
                    v-if="currentVideo&&isLock&&!isHidenList"
                    class="fa fa-unlock"
                    title="释放列表"></span>
        </div>
        <div class="content-container">
            <div class="top">
                <span>播放列表</span>
                <div class="my-icon">
                    <span title="添加" class="fa fa-plus-square-o"></span>
                    <span title="删除" class="fa fa-trash-o fa-lg delete"></span>
                    <span @click.stop="showExtendMenu" title="扩展菜单" class="fa fa-angle-double-down"></span>
                </div>
                <div class="file" v-if="isShowOther && videoList.length==0">
                    <div class="no-file">
                        <span class="fa fa-file-o"></span>
                        <p>没有符合条件的文件</p>
                    </div>
                    <div class="open-file">
                        <div @click='openFile' class="flexrowcenter">
                            <span class="fa fa-folder-open-o"></span>
                            <span>添加文件</span>
                        </div>
                        <span @click.stop="showMenu" class="fa fa-angle-down"></span>
                        <ul v-if="isShowFileMenu" class="my-file">
                            <li>
                                <span class="fa fa-file-excel-o"></span>
                                添加文件夹
                            </li>
                            <li>
                                <span class="fa fa-link"></span>
                                添加URL
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <transition name="router" mode="out-in">
                <ul class="extend-menu" v-if="isShowExtendMenu">
                    <li class="line">清空此列表</li>
                    <li @click="changeSoreMode(1)">
                        <span v-if="sortMode==1" class="fa fa-check"></span>
                        默认排序
                    </li>
                    <li @click="changeSoreMode(2)">
                        <span v-if="sortMode==2" class="fa fa-check"></span>
                        大小排序
                    </li>
                    <li @click="changeSoreMode(3)">
                        <span v-if="sortMode==3" class="fa fa-check"></span>
                        时间排序
                    </li>
                    <li @click="changeSoreMode(4)">
                        <span v-if="sortMode==4" class="fa fa-check"></span>
                        随机排序
                    </li>
                    <li class="line" @click="changeSoreMode(5)">
                        <span v-if="sortMode==5" class="fa fa-check"></span>
                        名称排序
                    </li>
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
                        顺序播放
                    </li>
                    <li @click="changeMode(4)">
                        <span v-if="playMode==4" class="fa fa-check"></span>
                        顺序循环
                    </li>
                    <li @click="changeMode(5)">
                        <span v-if="playMode==5" class="fa fa-check"></span>
                        随机播放
                    </li>
                </ul>
            </transition>
            <div ref="scroll" class="list-content" :style="{'height':`${playListHeight-40}px`}">
                <div style="padding-bottom: 10px;">
                    <ListItem
                            :item="video"
                            v-for="(video,index) in videoList"
                            :key="index"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import BScroll from "better-scroll";
import connect from "../api/bus.js";
import OpenDialog from "../api/OpenDialog";
const openDialog = new OpenDialog();

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
      isLock: false,
      // 定时器时间
      time: 3000,
      // 列表滚动的距离
      deltaY: 0
    };
  },
  mounted() {
    this.scroll = null;
    // 保存列表原有的的宽度
    this.savePlayListWidth = 300;
    // 定时器
    this.timer = null;
    this.playListTimer = null;
    this.$refs.playList.addEventListener("mouseleave", this.onMouseLeave);
    this.$refs.playList.addEventListener("mouseenter", this.onMouseEnter);
    this.$refs.playList.addEventListener("mousewheel", this.onMouseWheel);
    setTimeout(() => {
      // 初始化better-scroll
      this.initScroll();
    }, 40);
    // 全屏的时候显示头部和尾部
    connect.$on("showFooterAndHeader", () => {
      this.showFooterAndHeader();
    });
    // 全屏的时候头部和尾部
    connect.$on("hideFooterAndHeader", () => {
      this.hideFooterAndHeader();
    });
    // 点击video的打开文件按钮的时候
    // connect.$on("openFile", () => {
    //   if (this.playListTimer) {
    //     clearTimeout(this.playListTimer);
    //   }
    //   this.playListTimer = setTimeout(this.createTimeOut, this.time);
    // });
  },
  methods: {
    ...mapMutations(["setPlayMode", "setSortMode", "setCurrentVideo"]),
    ...mapActions(["sortVideoList"]),
    // 显示或者隐藏列表最中间菜单
    showMenu() {
      document.body.click();
      this.isShowFileMenu = !this.isShowFileMenu;
      if (!this.isShowFileMenu) {
        window.removeEventListener("click", this.onClick);
      } else {
        window.addEventListener("click", this.onClick);
      }
    },
    onClick() {
      // 隐藏列表右上角的扩展菜单
      this.isShowExtendMenu = false;
      // 隐藏列表最中间的菜单
      this.isShowFileMenu = false;
      window.removeEventListener("click", this.onClick);
    },
    // 隐藏或者显示播放列表
    hideList() {
      this.isHidenList = !this.isHidenList;
      if (this.isHidenList) {
        if (this.playListTimer) {
          clearTimeout(this.playListTimer);
        }
        //隐藏
        this.hidenList();
      } else {
        //显示
        this.showList();
      }
    },
    // 隐藏播放列表
    hidenList() {
      // 隐藏列表中间的内容
      this.isShowOther = false;
      this.$refs.playList.style.width = "0px";
    },
    // 显示播放列表
    showList() {
      // 还原列表的宽度
      this.$refs.playList.style.width = this.savePlayListWidth + "px";
      // 监听过渡结束
      this.$refs.playList.addEventListener(
        "transitionend",
        this.onTransitionEnd
      );
    },
    onTransitionEnd() {
      if (this.isHidenList) {
        return;
      }
      // 显示列表中间的内容
      this.isShowOther = true;
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
      document.body.click();
      this.isShowExtendMenu = !this.isShowExtendMenu;
      if (this.isShowExtendMenu) {
        window.addEventListener("click", this.onClick);
      } else {
        window.removeEventListener("click", this.onClick);
      }
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
      // 隐藏列表
      this.isHidenList = true;
      // 隐藏列表中间的内容
      this.isShowExtendMenu = false;
      this.hidenList();
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
        this.playListTimer = setTimeout(this.createTimeOut, this.time);
      }
    },
    // 初始化better-scroll
    initScroll() {
      this.$nextTick(() => {
        const wrapper = this.$refs.scroll;
        this.scroll = new BScroll(wrapper, {
          probeType: 1 //节流
        });
      });
    },
    // 强制 scroll 重新计算
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    // 全屏的时候显示头部和脚部，调整播放列表高度
    showFooterAndHeader() {
      if (this.currentVideo) {
        this.resetPositionToOriginal();
        this.setPlayListHeight(`${this.playListHeight}px`);
        this.refresh();
      } else {
        //不存在播放歌曲说明是点击停止按钮后退出全屏的
        this.resetPositionToZero();
        this.setPlayListHeight(`${this.playListHeight}px`);
        this.refresh();
      }
    },
    // 全屏的时候隐藏头部和脚部，调整播放列表高度
    hideFooterAndHeader() {
      this.resetPositionToZero();
      this.setPlayListHeight("100%");
      this.refresh();
    },
    // 把列表定位置为0
    resetPositionToZero() {
      this.$refs.playList.style.top = "0";
      this.$refs.playList.style.bottom = "0";
    },
    // 把列表定位恢复为原样
    resetPositionToOriginal() {
      this.$refs.playList.style.top = "36px";
      this.$refs.playList.style.bottom = "56px";
    },
    // 设置列表高度
    setPlayListHeight(height) {
      this.$refs.playList.style.height = height;
      this.refresh();
    },
    onMouseWheel(e) {
      // better-scroll可以进行滚动
      if (this.scroll.hasVerticalScroll) {
        // 滚动的距离
        let deltaY = this.deltaY + e.deltaY;
        if (-deltaY > 0) {
          //滚轮向上滚动
          return;
        }
        // 滚动的距离大于better-scroll可以滚动的最大距离
        if (-this.scroll.maxScrollY < deltaY) {
          this.scroll.scrollTo(0, this.scroll.maxScrollY);
          return;
        }
        this.deltaY += e.deltaY;
        this.scroll.scrollTo(0, -this.deltaY);
      }
    },
    // 打开文件
    openFile(){
      openDialog.openFile()
    }
  },
  computed: {
    ...mapGetters([
      "playMode",
      "sortMode",
      "currentVideo",
      "videoList",
      "isFullScreen",
      "isPlaying"
    ])
  },
  watch: {
    videoList(newVal, oldVal) {
      this.$nextTick(() => {
        // 重新计算列表的高度
        this.refresh();
      });
    },
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
        //全品的时候不能锁定播放列表
        this.isLock = false;
      }
    },
    isLock(newVal) {
      //上锁的时候是相对定位,全屏的时候是相对定位，可能会修改定位，这里是重置定位，不上锁同理
      if (newVal) {
        this.resetPositionToZero();
      } else {
        this.resetPositionToOriginal();
      }
    },
    currentVideo(newVal) {
      if (!newVal) {
        this.resetPositionToZero();
        this.setPlayListHeight(`${this.playListHeight}px`);
        this.refresh();
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
        if (this.playListTimer) {
          clearTimeout(this.playListTimer);
        }
        this.playListTimer = setTimeout(this.createTimeOut, this.time);
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.playListTimer) {
      clearTimeout(this.playListTimer);
    }
    this.$refs.playList.removeEventListener("mouseleave", this.onMouseLeave);
    this.$refs.playList.removeEventListener("mouseenter", this.onMouseEnter);
    this.$refs.playList.removeEventListener(
      "transitionend",
      this.onTransitionEnd
    );
    window.removeEventListener("click", this.onClick);
    this.$refs.playList.removeEventListener("mousewheel", this.onMouseWheel);
    this.scroll.destroy();
    this.scroll = null;
  }
};
</script>

<style scoped lang="less">
#position {
  position: fixed;
  top: 36px;
  bottom: 56px;
  width: 300px;
  right: 0;
  height: 100%;
  transition: all 1s;
  background-color: rgba(0, 0, 0, 0.7);
  .my-arrow {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

.playList {
  transition: all 1s;
  max-width: 50%;
  height: 100%;
  width: 300px;
  background-color: #0d0d0e;
  border-left: 1px solid #2f2f31;
  position: relative;
  transition: width 1s;
  .content-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
  }
  .my-arrow {
    position: absolute;
    top: 50%;
    left: -31px;
    transform: translateY(-50%);
    width: 30px;
    height: 66px;
    background-color: #030303;
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
      color: #b0b0b0;
      width: 100%;
      line-height: 66px;
    }
  }
  .top {
    padding: 15px 15px 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: #b0b0b0;
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
      color: #818181;
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
        background-color: #252527;
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
  }
}

.list-content {
  overflow: hidden;
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
  background-color: #27272a;
  z-index: 5;
  width: 100px;
  color: #999999;
  padding: 3px 0;
  border-radius: 5px;
  > .line {
    border-bottom: 1px solid #303032;
  }
  &:after {
    content: "";
    position: absolute;
    left: 80%;
    top: -10px;
    height: 0;
    width: 0;
    border: 5px solid transparent;
    border-bottom-color: #252528;
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
</style>