<template>
    <div>
      <div class="indexPrd"  v-for="list, keys in getSubPrdInfos" :key="keys">
        <h4 v-if="list.length>1">{{list[0].Name}}
          <div  class="more" v-if="otherAtrr.show">
            <router-link :to="{path: '/prdMore', query: {prdId: list[0].Id,name:list[0].Name,type:otherAtrr.type}}">更多 &gt;</router-link>
          </div>
        </h4>
        <div class="prdIntr">
          <yd-list :theme="otherAtrr.theme">
            <yd-list-item v-for="listDel, key in list" :key="key" v-if="key>0" @click.native="goDetailPage(listDel.Id,listDel.ImgId)">
              <img slot="img" v-lazy="getIndexPic(listDel.ImgId)">
              <span slot="title">{{listDel.ShowName}}</span>
              <yd-list-other slot="other">
                <div class="priceDiv" v-if="list[0].isLogin&& (otherAtrr.type=='3')">
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
    </div>
</template>

<script>
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
          this.otherAtrr.type = this.$route.query.type
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
  .indexPrd{
    width:100%;
    height:100%;
    overflow: hidden;
  }
  .prdIntr .priceDiv span{
    display: block;
    font-size: 0.3rem;
  }
  .prdIntr .priceDiv{
    font-size: 0.18rem;
    border-left: 1px solid #ddd;
    text-align: center;
    /* padding-left: 0.1rem; */
    width: 100%;
  }
  .prdIntr .priceDiv:first-child{
    border-left: 0px;
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
