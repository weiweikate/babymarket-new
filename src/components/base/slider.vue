<template>
    <div style="min-height: 3.7rem;overflow: hidden" class="sliderDiv">
      <yd-slider autoplay="3000">
        <yd-slider-item  v-for="(subPagePic,keys) in getSubPagePics" :key="keys">
          <a @click="clickedJumpPage(subPagePic)">
            <img :src="getIndexPic(subPagePic.ImgId)" alt=""/>
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>
</template>

<script>
    import { myMixinClickedJump } from '../../common/index.js'
    export default {
      mixins: [myMixinClickedJump],
      name:"slider",
      props: {
        getSubPagePics: {
          type:Array,
          default: function () {
            return []
          }
        }
      },
      data () {
        return {
          subject:''
        }
      },
      methods: {
      }
    }
</script>
<style scoped>
</style>
