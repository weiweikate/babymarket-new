<template>
    <div>
      <div class="indexPrd">
        <h4> {{otherAtrr.name}}
          <div class="more" v-if="theme0 ===4 ">
            <router-link :to="{path: '/prdMore', query:otherAtrr }">更多 &gt;</router-link>
          </div>
        </h4>
        <div class="prdIntr">
          <yd-list :theme="theme0">
            <yd-list-item  v-for="BKlist, key in getBKPrdInfos" :key="key" @click.native="goDetailPage(BKlist.ProductId,BKlist.ImgId)">
              <img slot="img" v-lazy="getIndexPic(BKlist.ImgId)">
              <span slot="title">{{BKlist.Name}}</span>
              <yd-list-other slot="other">
                <div class="priceDiv" v-if="otherAtrr.isLogin && otherAtrr.type =='3'" >
                  <span class="AccPrice">￥ {{BKlist.AccPrice}}</span>
                  合作尊享
                </div>
                <div class="priceDiv">
                  <span class="LYPrice">￥ {{BKlist.LYPrice}}</span>
                  老友专享
                </div>
                <div class="priceDiv">
                  <span class="SalePrice">￥ {{BKlist.SalePrice}}</span>
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
        getBKPrdInfos: {
          type:Array,
          default: function () {
            return []
          }
        },
        otherAtrr: {
          type: Object,
          default: function () {
            return  { prdId:'', name: '老友爆款',theme:'4', isLogin: false,type:'' }
          }
        }
      },
      computed : {
        theme0 () {
          if(this.$route.query.theme){
            return 2
          }else{
            return 4
          }
        }
      },
      methods: {
        getIndexPic (picId) {
          return getImgs(picId)
        },
        goDetailPage (prdId,imgId) {
          //传递主图id 和产品id
          this.$router.push({path: '/prdDetail', query: {prdId: prdId,imgId: imgId}})
        }
      }
    }
</script>
<style scoped>
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
  .indexPrd h4{
    position: relative;
    font-size: 0.32rem;
    height: 1rem;
    line-height: 1rem;
    font-weight: normal;
  }
  .indexPrd .more{
    position: absolute;
    right: 0.3rem;
    top:0;
    padding-right: 0.3rem;
    color:#C5A563;
  }
</style>
