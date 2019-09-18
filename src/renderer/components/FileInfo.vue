<template>
    <div @click="handlerClick" v-if="isShow" class="fileInfo-box">
        <div @click.stop class="box">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.addTime')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{time}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.videoSize')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{size}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.playStatus')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?(video.isPlaying?$t('common.playing'):$t('common.suspend')):''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.fileType')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?(video.mode=='local'?$t('common.localFile'):$t('common.networkFile')):''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.playSpeed')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?`${video.speed}倍`:''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.filePath')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?video.src:''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>{{$t('common.fileName')}}：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?video.filename:''}}</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getTime,getVideoSize } from "../api/util";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    video: {
      type: Object
    }
  },
  methods: {
    handlerClick() {
      this.$emit("click");
    }
  },
  computed:{
      time(){
          return this.video?getTime(this.video.createTime) : ''
      },
      size(){
          return this.video?getVideoSize(this.video.size) :''
      }
  }
};
</script>


<style lang="less" scoped>
.fileInfo-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .box {
    // background-color: rgba(0, 0, 0, .7);
    background-color: #fafcfd;
    padding: 20px;
    width: 430px;
    height: 360px;
    border-radius: 5px;
    // color: #ffffff;
  }
}
</style>

