<template>
    <div @click="handlerAboutClick" v-if="isShow" class="about-box">
        <div @click.stop class="box">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div>作者：</div>
                </el-col>
                <el-col :span="16">
                    <div>c10342</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="8">
                    <div>使用技术：</div>
                </el-col>
                <el-col :span="16">
                    <div>electron , vue , node</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="8">
                    <div>github地址：</div>
                </el-col>
                <el-col :span="16">
                    <div>https://github.com/c10342/player</div>
                </el-col>
            </el-row>
            <el-row class="mt20" :gutter="20">
                <el-col :span="8">
                    <div>版本：</div>
                </el-col>
                <el-col :span="16">
                    <div>v1.0.0</div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        isShow:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        handlerAboutClick(){
            this.$emit('handlerAboutClick')
        }
    }
}
</script>


<style lang="less" scoped>
.about-box{
    position: fixed;
    top: 0;left: 0;right: 0;bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 100;
    background-color: rgba(0, 0, 0, .3);
    display: flex;
    justify-content: center;
    align-items: center;
    .box{
        background-color: rgba(0, 0, 0, .7);
        padding: 20px;
        width: 430px;
        height: 180px;
        border-radius: 5px;
    }
    div{
        font-size: 16px;
        // font-weight: bold; 
    }
}
</style>

