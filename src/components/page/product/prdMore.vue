<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="indexPage">
        <v-slider :getSubPagePics="SubPicsShow"></v-slider>
        <v-product-info-bk v-if="BKtheme"  :getBKPrdInfos="SubPrdInfo" :otherAtrr="BKAttr"></v-product-info-bk>
        <v-product-info v-else :getSubPrdInfos="SubPrdInfo" ></v-product-info>
      </div>
    </yd-layout>
  </div>
</template>

<script>
    import VTopbar from '../../base/topBar.vue'
    import VProductInfo from '../../base/productInfo.vue'
    import VProductInfoBk from '../../base/productInfoBk.vue'
    import VSlider from '../../base/slider.vue'
    import { mapState, mapMutations } from 'vuex'
    export default {
      data () {
        return {
         titleAttr: {'isShow': true, 'name': ''},
         BKAttr: ''
        }
      },
      mounted: function () {
        if(window.sessionStorage.getItem('infos')){
          this.refSubPrdInfo(JSON.parse(unescape(window.sessionStorage.getItem('infos'))))
        }
        if(window.sessionStorage.getItem('pics')) {
          this.refSubPicsShow(JSON.parse(unescape(window.sessionStorage.getItem('pics'))))
        }
      },
      computed: {
        ...mapState({
          SubPicsShow: state => state.SubPicsShow,
          SubPrdInfo : state => state.SubPrdInfo
        }),
        BKtheme () {
          this.BKAttr = this.$route.query
          return this.$route.query.theme
        }
      },
      components: {
        VTopbar,
        VProductInfo,
        VSlider,
        VProductInfoBk
      },
      methods: {
        ...mapMutations({
          refSubPicsShow: 'refSubPicsShow',
          refSubPrdInfo:'refSubPrdInfo'
        })
      }
    }
</script>
<style scoped>

</style>
