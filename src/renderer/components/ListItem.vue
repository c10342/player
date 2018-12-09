<template>
    <div class="flexbetween my-list-item"
         @click="playing"
         :style="{'color': isCurrentVideo?'#00B400':''}">
        <div class="left">
            <span class="fa fa-caret-right" v-if="isCurrentVideo"></span>
            <span class="fa fa-eye" v-if="oldVideo && oldVideo.id == item.id && !isPlaying && !currentVideo"></span>
            <span>{{item.filename}}</span>
        </div>
        <div class="flexrowcenter right">
            <span class="time">12:15</span>
            <span @click.stop="playing" v-if="!isPlaying || !isCurrentVideo" title="播放"
                  class="my-fa fa fa-play-circle-o"></span>
            <span @click.stop="setPlaying(false)" v-if="isPlaying && isCurrentVideo" title="暂停"
                  class="my-fa fa fa-pause-circle-o"></span>
            <span
                    title="打开文件所在位置"
                    class="my-fa fa fa-file-archive-o"></span>
            <span title="从播放列表中删除" class="my-fa fa fa-close"></span>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "list-item",
        props: {
            item: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        data() {
            return {
                isShowEye: false
            }
        },
        methods: {
            ...mapMutations(['setCurrentVideo', 'setPlaying','setOldVideo']),
            playing() {
                if (!this.isCurrentVideo) {
                    this.setCurrentVideo(this.item)
                }
                this.setPlaying(true)
            }
        },
        computed: {
            ...mapGetters(['currentVideo', 'currentVideoIndex', 'videoList', 'isPlaying','oldVideo']),
            // 是否为当前的歌曲
            isCurrentVideo() {
                return this.currentVideo ? this.item.id == this.currentVideo.id : false
            }
        },
        watch: {
            currentVideo(newVal) {
                if (newVal) {
                    this.setOldVideo(newVal)
                }
            }
        }
    }
</script>

<style scoped lang="less">
    .my-list-item {
        max-height: 32px;
        height: 32px;
        line-height: 32px;
        overflow: hidden;
        font-size: 13px;
        cursor: default;
        padding: 0 15px;
        transition: width 1s;
        color: #CCCCCC;
        .left {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .my-fa {
            padding: 0 5px;
            cursor: pointer;
        }
        &:hover {
            color: white;
            background-color: #5D5D5E;
            .right {
                .time {
                    display: none;
                }
                > span:not(.time) {
                    display: block;
                }

            }
        }
        .right {
            /*.time{*/
            /*overflow: hidden;*/
            /*white-space: nowrap;*/
            /*text-overflow: ellipsis;*/
            /*}*/
            > span:not(.time) {
                display: none;
            }
            &:hover {
                .time {
                    display: none;
                }
                > span:not(.time) {
                    display: block;
                }
            }
        }
    }
</style>