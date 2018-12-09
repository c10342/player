<template>
    <div class="header">
        <div class="left">
            <span class="fa fa-youtube-play"></span>
            <div @click.stop="showMenu">
                <span ref="title" class="title">播放器</span>
                <span ref="icon" class="fa fa-angle-down my-angle-down"></span>
            </div>
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
        <div class="middle"></div>
        <div class="right">
            <span title="用户" class="fa fa-user-o"></span>
            <span title="更换皮肤" class="fa fa-tv"></span>
            <span title="播放记录" class="fa fa-clock-o"></span>
            <span @click="minWindow" title="最小化" class="fa fa-window-minimize"></span>
            <span v-if="!isMaxed" @click="maxWindow" title="最大化" class="fa fa-window-maximize"></span>
            <span v-else @click="maxWindow" title="还原窗口" class="fa fa-window-restore"></span>
            <span @click="close" title="关闭" class="fa fa-close"></span>
        </div>
    </div>
</template>

<script>
    import WindowUtil from '../api/window'

    const winUtil = new WindowUtil()

    export default {
        name: "my-header",
        data() {
            return {
                // 是否显示最大化
                isMaxed: false,
                // 是否显示左上角的菜单
                isShowMenu: false
            }
        },
        methods: {
            // 最小化窗口
            minWindow() {
                winUtil.minWindow()
            },
            // 最大化或者还原窗口
            maxWindow() {
                this.isMaxed = !this.isMaxed
                winUtil.maxWindow()
            },
            // 关闭窗口
            close() {
                winUtil.close()
            },
            // 点击播放器后显示菜单
            showMenu() {
                document.body.click()
                this.isShowMenu = !this.isShowMenu
                if (!this.isShowMenu) {
                    window.removeEventListener('click', this.onClick)
                } else {
                    window.addEventListener('click', this.onClick)
                }
            },
            onClick() {
                this.isShowMenu = false
                window.removeEventListener('click', this.onClick)
            }
        },
        beforeDestroy() {
            window.removeEventListener('click', this.onClick)
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
        background-color: #1E1E20;
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
                color: #B4B4B4;
                z-index: 1;
                width: 150px;
                border-radius: 5px;
                &:before {
                    position: absolute;
                    top: -10px;
                    left: 10px;
                    content: '';
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
                        content: '';
                        height: 1px;
                        position: absolute;
                        width: 100%;
                        top: 0;
                        left: 0;
                        background-color: #2E2E30;
                    }
                    &:hover {
                        background-color: #373333;
                        color: #5DEE00;
                    }
                }
            }
            > span:nth-child(1) {
                color: #5DEE00;
                font-size: 16px;
            }
            > div {
                position: relative;
                cursor: pointer;
                .title {
                    color: #B0B0B0;
                    font-size: 16px;
                    padding: 0 5px;
                }
                .my-angle-down {
                    color: #B0B0B0;
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
                color: #B0B0B0;
                height: 36px;
                width: 36px;
                text-align: center;
                line-height: 36px;
                cursor: pointer;
                &:hover {
                    color: #5DEE00;
                }
            }
        }
    }
</style>