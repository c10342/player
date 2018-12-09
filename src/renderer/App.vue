<template>
  <div id="app">
    <div ref="header" class="app-header">
      <my-header />
    </div>
    <div class="video" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
      <my-video />
      <play-list
              :play-list-height="playListHeight"
              :is-show-arrow="isShowArrow" />
    </div>
    <div ref="footer" class="app-footer">
      <my-footer />
    </div>
  </div>
</template>

<script>
  import {client} from './api/util'
  import {mapGetters} from 'vuex'

  export default {
    name: 'player',
      data(){
        return {
            isShowArrow:false,
            playListHeight:null,
        }
      },
      mounted(){
        this.initPlayListHeight()
          window.addEventListener('resize',this.initPlayListHeight)
      },
      methods:{
          onMouseEnter(){
              this.isShowArrow = true
          },
          onMouseLeave(){
              this.isShowArrow = false
          },
          initPlayListHeight(){
              let footerHeight = this.$refs.footer.getBoundingClientRect().height
              let headerHeight = this.$refs.header.getBoundingClientRect().height
              this.playListHeight = client().height-footerHeight-headerHeight+1
          }
      },
      computed:{
          ...mapGetters(['currentVideo'])
      },
      watch:{
          currentVideo:{
              immediate:true,
              handler:function(){
                  this.$nextTick(()=>{
                      this.initPlayListHeight()
                  })
              }
          }
      },
      beforeDestroy(){
          window.removeEventListener('resize',this.initialInputHeight)
      }
  }
</script>

<style lang="less" scoped>
  #app{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .app-header{
      border-bottom: 1px solid #2F2F31;
    }
    .video{
      display: flex;
      flex-direction: row;
      flex: 1;
    }
    .app-footer{
      border-top: 1px solid #2F2F31;
    }
  }
</style>
