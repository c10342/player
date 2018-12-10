<template>
    <div class="video-container">
        <video
                ref="video"
                class="my-video"
                :src="currentVideo?currentVideo.src:''"></video>
        <div class="open-file" v-if="!currentVideo">
            <div class="flexrowcenter" @click="openFile">
                <span class="fa fa-folder-open-o"></span>
                <span>打开文件</span>
            </div>
            <span @click.stop="showMenu" class="fa fa-angle-down"></span>
            <transition name="router" mode="out-in">
            <ul v-if="isShowFileMenu" class="my-file">
                <li>
                    <span class="fa fa-file-video-o"></span>
                    打开文件夹
                </li>
                <li>
                    <span class="fa fa-link"></span>
                    打开URL
                </li>
            </ul>
            </transition>
        </div>
    </div>
</template>

<script>
    import {mapGetters,mapMutations} from 'vuex'
    import OpenDialog from '../api/OpenDialog'
    const openDialog = new OpenDialog()
    export default {
        data() {
            return {
                isShowFileMenu:false
            }
        },
        name: "my-video",
        methods:{
            ...mapMutations(['setPlaying','setCurrentVideoIndex']),
            // 点击按钮后显示菜单
            showMenu(){
                document.body.click()
                this.isShowFileMenu= !this.isShowFileMenu
                if(!this.isShowFileMenu){
                    window.removeEventListener('click',this.onClick)
                }else{
                    window.addEventListener('click',this.onClick)
                }
            },
            onClick(){
                this.isShowFileMenu = false
                window.removeEventListener('click',this.onClick)
            },
            // 打开文件
            openFile(){
                openDialog.openFile()
            }
        },
        computed:{
            ...mapGetters(['currentVideo','isPlaying','videoList'])
        },
        watch:{
            isPlaying(newVal){
                this.$nextTick(()=>{
                    if(newVal){
                        this.$refs.video.play()
                    }else {
                        this.$refs.video.pause()
                    }
                })
            },
            currentVideo(newVal){
                if(!newVal){
                    return
                }
                const index = this.videoList.findIndex(i=>i.id==newVal.id)
                this.setCurrentVideoIndex(index)
                this.$nextTick(()=>{
                    this.setPlaying(true)
                    this.$refs.video.play()
                })
            }
        },
        beforeDestroy(){
            window.removeEventListener('click',this.onClick)
        }
    }
</script>

<style lang="less" scoped>
    .video-container{
        /*width: 100%;*/
        /*height: 100%;*/
        flex: 1;
        position: relative;
    }
    .my-video {
        width: 100%;
        height: 100%;
        /*object-fit: fill;*/
        background-color: #000000;
    }
    .open-file{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
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
        .my-file{
            z-index: -1;
            position: absolute;
            top: 45px;
            left: 0;
            width: 100%;
            background-color: #0C0C0C;
            border-radius: 5px;
            &:before{
                content: '';
                height: 0;
                width: 0;
                position: absolute;
                top: -10px;
                left: 23px;
                border: 5px solid transparent;
                border-bottom-color: #0C0C0C;
            }
            >li{
                width: 100%;
                height: 40px;
                padding: 10px 15px;
                cursor: pointer;
                &:hover{
                    background-color: #373333;
                    color: #5DEE00;
                }
            }
        }
        >div{
            cursor: pointer;
            span:nth-child(1){
                padding-right: 10px;
            }
            &:hover{
                color: #5DEE00;
            }
        }
        >span{
            font-size: 20px;
            border-left: 1px solid #818181;
            padding-left: 10px;
            cursor: pointer;
            &:hover{
                color: #5DEE00;
            }
        }
    }
</style>