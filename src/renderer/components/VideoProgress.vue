<template>
    <div class="progress-container">
        <span @click.stop="speedDown" class="fa fa-backward my-icon" title="减速"></span>
        <span v-if="speed!=1" class="speed speed-back">{{speed}}x</span>
        <div
                @click="onClick($event)"
                class="video-out-line"
                ref="outLine">
            <div class="in-line" :style="{'width':`${videoPercent}%`}">
            <span
                    @mousedown.stop="ballMouseDown"
                    @click.stop
                    class="ball"></span>
            </div>
        </div>
        <span  v-if="speed!=1" class="speed speed-forward">{{speed}}x</span>
        <span @click.stop="speedUp" title="加速" class="fa fa-forward my-icon"></span>
    </div>
</template>

<script>
    import {mapMutations,mapGetters} from 'vuex'
    import connect from '../api/bus.js'
    export default {
        name: "video-progress",
        data() {
            return {
                // 进度条的百分比
                videoPercent: 0,
                // 最内层进度条长度
                inLineWidth: 0,
                // 鼠标在进度条上移动时候显示的内容
                subTitle:0
            }
        },
        mounted() {
            // 移动前里面的进度条的长度
            this.oldInWidth = null
            // 鼠标是否按下
            this.mousedown = false

            window.addEventListener('mousemove',this.mouseMove)

        },
        methods: {
            ...mapMutations(['setSpeed','setCurrentTime']),
            // 点击最外层进度条
            onClick(e) {
                this.inLineWidth = e.offsetX
            },
            // 鼠标在进度球按下
            ballMouseDown() {
                this.mousedown = true
                window.addEventListener('mousemove', this.onMouseMove)
                window.addEventListener('mouseup', this.onMouseUp)
            },
            // 鼠标移动
            onMouseMove(e) {
                // 实现拖拽移动事件
                if (this.mousedown) {
                    // 最外层进度条距离窗口最左边距离
                    let outLineX = this.$refs.outLine.getBoundingClientRect().x
                    // 最外层进度条的宽度
                    let outLineWidth = this.$refs.outLine.getBoundingClientRect().width
                    // 获取鼠标移动距离相对最外层进度条的距离
                    let offsetX = e.pageX - outLineX
                    if (offsetX <= 0) {
                        offsetX = 0
                    } else if (offsetX > outLineWidth) {
                        offsetX = outLineWidth
                    }
                    this.inLineWidth = offsetX
                }
            },
            onMouseUp() {
                this.mousedown = false
                window.removeEventListener('mouseup', this.onMouseUp)
                window.removeEventListener('mousemove', this.onMouseMove)
            },
            // 减速播放
            speedDown(){
                if(this.speed == 0.1){
                    return
                }
                // 只取小数点后一位
                let speed = parseFloat((this.speed-0.1).toString().substring(0,3))
                this.setSpeed(speed)
            },
            // 加速播放
            speedUp(){
                if(this.speed == 2){
                    return
                }
                let speed = parseFloat(((this.speed*10+1)/10).toString().substring(0,3))
                this.setSpeed(speed)
            },
            mouseMove(e){
                // 最外层进度条距离窗口最左边距离
                    let outLineX = this.$refs.outLine.getBoundingClientRect().x
                    // 最外层进度条的宽度
                    let outLineWidth = this.$refs.outLine.getBoundingClientRect().width
                    // 获取鼠标移动距离相对最外层进度条的距离
                    let offsetX = e.pageX - outLineX
                    if (offsetX <= 0) {
                        offsetX = 0
                    } else if (offsetX > outLineWidth) {
                        offsetX = outLineWidth
                    }
                    this.inLineWidth = offsetX
                    let currentTime = 
            }
        },
        computed: {
            ...mapGetters(['speed','totalTime','currentTime']),
            // 计算里面进度条的宽度
            // getInLineWidth() {
            //     // 一开始的时候最外层元素是不存在的
            //     if(!this.$refs.outLine){
            //         return `${this.inLineWidth}px`
            //     }
            //     let outLineWidth = this.$refs.outLine.getBoundingClientRect().width
            //     this.videoPercent = this.inLineWidth/outLineWidth*100
            //     return `${this.inLineWidth/outLineWidth*100}%`
            // }
        },
        watch:{
            currentTime(newVal){
                this.videoPercent = newVal/this.totalTime*100
            },
            inLineWidth(){
                let outLineWidth = this.$refs.outLine.getBoundingClientRect().width
                this.videoPercent = this.inLineWidth/outLineWidth*100
                this.setCurrentTime(this.totalTime*(this.inLineWidth/outLineWidth))
                connect.$emit('setCurrentTime')
            }
        },
        beforeDestroy() {
            this.outLineX = null;
            this.outLineWidth = null
        }
    }
</script>

<style scoped lang="less">
    .progress-container{
        display: flex;
        flex-direction: row;
        align-items: center;
        .my-icon{
            color: #505050;
            cursor: pointer;
            &:hover{
                color: #999999;
            }
        }
        .speed{
            color: #ffffff;
            font-size: 10px;
            &.speed-back{
                padding-left: 5px;
            }
            &.speed-forward{
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
            background-color: #45B000;
            .ball {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #CCCCCC;
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