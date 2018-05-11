<template>
  <div style="height: 100%" class="prdListTheme">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="indexPage scrollViewDiv">
        <v-product-info :getSubPrdInfos="SubPrdInfo" ></v-product-info>
      </div>
    </yd-layout>
  </div>
</template>

<script>
    import VTopbar from '../../base/topBar.vue'
    import VProductInfo from '../../base/productInfo.vue'
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
        console.log(JSON.parse(unescape(window.sessionStorage.getItem('infos'))))
//        if(window.sessionStorage.getItem('pics')) {
//          this.refSubPicsShow(JSON.parse(unescape(window.sessionStorage.getItem('pics'))))
//        }
      },
      computed: {
        ...mapState({
          SubPrdInfo : state => state.SubPrdInfo
        })
//        BKtheme () {
//          this.BKAttr = this.$route.query
//          return this.$route.query.theme
//        }
      },
      components: {
        VTopbar,
        VProductInfo
      },
      methods: {
        ...mapMutations({
          refSubPrdInfo:'refSubPrdInfo'
        })
      }
    }
</script>
<style scoped>

</style>
