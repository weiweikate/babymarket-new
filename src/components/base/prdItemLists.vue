<template>
    <div class="indexPrd">
      <div class="prdIntr">
        <yd-list theme="2">
          <yd-list-item v-for="listDel, key in prdLists" :key="key" v-if="key>0" @click.native="goDetailPage(listDel.Id)">
            <img slot="img" v-lazy="getIndexPic(listDel.ImgId)">
            <span slot="title">{{listDel.ShowName}}</span>
            <yd-list-other slot="other">
              <div class="priceDiv" v-if="prdListsAtrr.isLogin&& (prdListsAtrr.type=='3')">
                <span class="AccPrice">￥ {{listDel.AccPrice}}</span>
                合作尊享
              </div>
              <div class="priceDiv">
                <span class="LYPrice">￥ {{listDel.LYPrice}}</span>
                老友专享
              </div>
              <div class="priceDiv">
                <span class="SalePrice">￥ {{listDel.SalePrice}}</span>
                市场价
              </div>
            </yd-list-other>
          </yd-list-item>
        </yd-list>
      </div>
    </div>
</template>

<script>
    import { getImgs } from '../../common/index.js'
    export default {
      props: {
        prdLists: {
          type:Array,
          default: function () {
            return []
          }
        },
        prdListsAtrr: {
          type: Object,
          default: function () {
            // yd-list的主题 是否展示更多 展示数据的第几项 是否登录  用户的MemberTypeKey
            return { theme:2, show: false, isLogin:false,type:''}
          }
        }
      },
      data () {
        return {

        }
      },
      mounted: function () {
        if(this.$route.query.type != undefined){
          this.prdListsAtrr.type = this.$route.query.type
        }
      },
      methods: {
        getIndexPic (picId) {
          return getImgs(picId)
        },
        goDetailPage (prdId) {
          //传递主图id 和产品id
          this.$router.push({path: '/prdDetail', query: {prdId: prdId}})
        },
        goShowMorePage (){

        }
      }
    }
</script>
<style>
  .indexPrd{
    width:100%;
    height:100%;
    overflow: hidden;
  }
  .prdIntr .priceDiv span{
    display: block;
    font-size: 0.3rem;
  }
  .more{
    color:#C5A563;
  }
  .indexPrd h4{
    position: relative;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    font-weight: normal;
  }
  .indexPrd .more{
    float: right;
    padding-right: 0.3rem;
    position: absolute;
    right: 0.3rem;
    top:0
  }
</style>
