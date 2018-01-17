<template>
  <!--<yd-layout>-->
    <div  ref="myView" id="myView" style="height: 100%;">
      <div id="app" ref="app" style="height: 100%;">
        <keep-alive v-if="$route.meta.keepAlive" exclude="slider" >
          <router-view ></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
      </div>
      <div v-if="show" id="pcBtn" ref="pcBtn">
        <a href="#">点击回到顶部导航</a>
        <br/>
        <a @click.prevent="goBottom">点击跳到底部导航</a>
      </div>
    </div>
  <!--</yd-layout>-->
</template>

<script>
  import { myMixinLyMap,browserRedirect } from './common/index.js'
  export default {
    mixins: [myMixinLyMap],
    data () {
      return {
        show:false
      }
    },
    mounted: function () {
      this.getWidth()
    },
    created: function () {
       this.getAdress()
    },
    methods: {
      getWidth() {
        let getAgent = browserRedirect()
        if(!getAgent.isMobile&&getAgent.smallscreen){
          this.show = false
        } else if(!getAgent.isMobile){
//          if(!getAgent.isMobile){
            let _this = this
            this.show = true
            window.onresize = function () {
              _this.onPcResize()
            }
            document.body.style.minWidth = '850px'
            this.$nextTick(() => {
              this.$refs.myView.style.width =getAgent.width+'px'
              this.$refs.app.style.transform = 'scaleX(1)'
              this.$refs.app.style.minHeight = document.body.clientHeight+'px'
              this.onPcResize()
            })
//          }
        }
      },
      goBottom() {
        document.body.scrollTop = document.documentElement.scrollTop =  document.body.scrollHeight
      },
      onPcResize () {
        this.$refs.pcBtn.style.left =''
        this.$refs.pcBtn.style.right =''
        if(document.body.clientWidth>850) {
          let right =Math.abs(( Number(document.body.clientWidth) -500)/2 -170)
          this.$refs.pcBtn.style.right = right+'px'
        } else {
          this.$refs.pcBtn.style.left = '10px'
        }
      }
    }
  }
</script>

<style>
  #myView{
    margin: auto;
    position: relative;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /*padding-top:0.9rem;*/
    /*padding-bottom: 1.2rem;*/
    box-sizing: border-box;
    width:100%;
    min-height: 100%;
  }
  #app .yd-spinner>a{
    width:31%;
  }
  #app .yd-spinner>input{
    width: 38%;
  }
  #app .yd-spinner{
    border-radius: 0.1rem;
  }
  #pcBtn{
    position: fixed;
    top:10px;
    right: 0px;
    cursor: pointer;
    font-size: 16px;
  }
  #pcBtn a{
    display: inline-block;
    padding:10px;
    color:#715329;
    border-radius: 8px;
    border: 1px solid #715329;
    margin-bottom: 20px;
  }
</style>
