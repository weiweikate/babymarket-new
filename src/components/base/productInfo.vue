<template>
    <div>
      <slot></slot>
      <div v-if="otherAtrr.showIndex">
        <v-prd-item-lists :prdLists="getSubPrdInfos[otherAtrr.showIndex]" :prdListsAtrr="otherAtrr"></v-prd-item-lists>
      </div>
      <div v-else class="indexPrd"  v-for="list, keys in getSubPrdInfos" :key="keys">
        <h4 v-if="list.length>1">{{list[0].Name}}
          <div  class="more" v-if="otherAtrr.show">
            <router-link :to="{path: '/prdMore', query: {prdId: list[0].Id,name:list[0].Name,type:otherAtrr.type}}">更多 &gt;</router-link>
          </div>
        </h4>
        <v-prd-item-lists :prdLists="list" :prdListsAtrr="otherAtrr"></v-prd-item-lists>
      </div>
    </div>
</template>

<script>
    import VPrdItemLists from './prdItemLists.vue'
    import { getImgs } from '../../common/index.js'
    export default {
      props: {
        getSubPrdInfos: {
          type:Array,
          default: function () {
            return []
          }
        },
        otherAtrr: {
          type: Object,
          default: function () {
            // yd-list的主题 是否展示更多 展示数据的第几项 是否登录  用户的MemberTypeKey
            return { theme:2, show: false,showIndex:'', isLogin:false,type:''}
          }
        }
      },
      components: {
        VPrdItemLists
      },
      data () {
        return {

        }
      },
      mounted: function () {
        if(this.$route.query.type != undefined){
          this.otherAtrr.type = this.$route.query.type
        }
        if (this.$route.query.showIndex != undefined) {
          this.otherAtrr.showIndex = this.$route.query.showIndex
        }
      },
      methods: {
        getIndexPic (picId) {
          return getImgs(picId)
        },
        goDetailPage (prdId,ImgId) {
          //传递主图id 和产品id
          this.$router.push({path: '/prdDetail', query: {prdId: prdId,imgId: ImgId}})
        },
        goShowMorePage (){

        }
      }
    }
</script>
<style>

</style>
