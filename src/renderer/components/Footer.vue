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
                <span v-if="currentVideo" class="video-time">01:43/07:44</span>
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
            </div>
            <div class="middle">
                <span class="fa fa-stop"></span>
                <span title="上一个文件" class="fa fa-step-backward"></span>
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
                <span title="下一个文件" class="fa fa-step-forward"></span>
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
                <span title="全屏" class="fa fa-expand my-expand"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapMutations, mapGetters} from 'vuex'

    export default {
        name: "my-footer",
        data() {
            return {
                isShowPlayMode:false
            }
        },
        mounted() {
            window.addEventListener('keyup', this.onKeyUp)
        },
        methods: {
            ...mapMutations(['setIsVolumeOn', 'setPlaying', 'setPlayMode']),
            // 点击音量图标，开启或者关闭
            setVolume(flag) {
                this.setIsVolumeOn(flag)
            },
            // 切换播放状态
            switchPlaying(flag) {
                this.setPlaying(flag)
            },
            // 监听键盘
            onKeyUp(e) {
                // 按下空格键
                if (e.keyCode == 32) {
                    this.setPlaying(!this.isPlaying)
                }
            },
            // 切换播放模式
            changeMode(mode){
                this.setPlayMode(mode)
            },
            // 显示播放模式列表
            showPlayMode(){
                document.body.click()
                this.isShowPlayMode = !this.isShowPlayMode
                if(this.isShowPlayMode){
                    window.addEventListener('click',this.onClick)
                }else{
                    window.removeEventListener('click',this.onClick)
                }
            },
            onClick(){
                this.isShowPlayMode = false
                window.removeEventListener('click',this.onClick)
            }
        },
        computed: {
            ...mapGetters(['isVolumeOn', 'isPlaying', 'currentVideo', 'playMode']),
            title(){
                if(this.playMode==1){
                    return '单个播放'
                }else if(this.playMode==2){
                    return '单个循环'
                }else if(this.playMode==3){
                    return '顺序播放'
                }else if(this.playMode==4){
                    return '顺序循环'
                }else if(this.playMode==5){
                    return '随机播放'
                }
            }
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.onKeyUp)
            window.removeEventListener('click',this.onClick)
        }
    }
</script>

<style scoped lang="less">
    .footer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        background-color: #151616;
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
            &:hover {
                color: #5DEE00;
            }
            &.video-time {
                font-size: 14px;
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
                &:after {
                    content: '';
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
                        color: #1BB017;
                        > span {
                            color: #1BB017;
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