<template>
  <div @click="handlerAboutClick" v-if="isShow" class="about-box">
    <div @click.stop class="box">
      <div class="img">
        <img src="../assets/default.png" class="avatar" />
      </div>
      <el-row v-for="(item,index) in info" :key="index" :class="{'mt20':index!=0}" :gutter="20">
        <el-col :span="span1">
          <div>{{item.key}}</div>
        </el-col>
        <el-col :span="span2">
          <div>{{item.val}}</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      span1: 4,
      span2: 20
    };
  },
  methods: {
    handlerAboutClick() {
      this.$emit("handlerAboutClick");
    }
  },
  computed: {
    info() {
      return [
        { key: `${this.$t("common.author")}：`, val: "c10342" },
        {
          key: `${this.$t("common.technology")}：`,
          val: "electron , vue , node"
        },
        {
          key: `${this.$t("common.address")}：`,
          val: "https://github.com/c10342/player"
        },
        { key: `${this.$t("common.version")}：`, val: "v1.0.0" }
      ];
    }
  },
  watch: {
    "$i18n.locale": {
      immediate: true,
      handler: function(newVal) {
        if (newVal === "cn") {
          this.span1 = 4;
          this.span2 = 20;
        } else {
          this.span1 = 7;
          this.span2 = 17;
        }
      }
    }
  }
};
</script>


<style lang="less" scoped>
.about-box {
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
    background-color: rgba(0, 0, 0, 0.7);
    padding: 20px;
    width: 430px;
    height: 320px;
    border-radius: 5px;
  }
  div {
    font-size: 16px;
  }
  .img {
    text-align: center;
    .avatar {
      border-radius: 50%;
    }
  }
}
</style>

