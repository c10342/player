<template>
    <div @click="handlerClick" v-if="isShow" class="fileInfo-box">
        <div @click.stop class="box">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div>创建时间：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{time}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>视频大小：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?video.size:''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>播放状态：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?(video.isPlaying?'正在播放':'暂停播放'):''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>文件类型：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?(video.mode=='local'?'本地文件':'网络文件'):''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>播放速度：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?`${video.speed}倍`:''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>文件路径：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?video.src:''}}</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="6">
                    <div>文件名称：</div>
                </el-col>
                <el-col :span="18">
                    <div>{{video?video.filename:''}}</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { getTime } from "../api/util";
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

