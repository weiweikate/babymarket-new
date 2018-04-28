<template>
  <!-- 众筹模板-->
    <div class="crowdfundingList">
      <ul>
        <li v-for="(item,index) in crowdfundingList" :key="index">
          <div class="fl">
            <img v-lazy="getPic(item.ImgId)" alt=""/>
          </div>
          <div class="fr">
            <h4>{{item.ShowName}}</h4>
            <h5>{{item.Subtitle}}</h5>
            <p class="fontColor-y">{{'¥ '+item.SalePrice}} <span>起</span></p>
            <router-link :to="{path: '/prdDetail', query: {prdId:item.Id,isCrowdfunding:'true'}}">
              <span class="Btn sBtn">立即众筹</span>
            </router-link>
          </div>
        </li>
      </ul>
    </div>
</template>

<script>
    import { getImgs } from '../../common/index.js'
    export default {
      props: {
        crowdfundingList: {
          type:Array,
          default: function () {
            return []
          }
        }
      },
      data () {
        return {

        }
      },
      mounted: function () {

      },
      methods: {
        getPic (picId) {
          return getImgs(picId)
        }
      }
    }
</script>
<style scoped>
 .crowdfundingList li{
   overflow: hidden;
   box-sizing: border-box;
   padding:.1rem;
   height: 2.8rem;
   text-align: left;
   margin-bottom: 10px;
   background: #fff;
 }
 .crowdfundingList li div.fl{
   width: 2.6rem;
   height: 2.6rem;
 }
 .crowdfundingList li div.fl img{
   width: 100%;
 }
 .crowdfundingList li div.fr{
   width: 4.4rem;
 }
 .crowdfundingList li h4{
   font-size: .28rem;
   color: #252525;
   overflow: hidden;
   text-overflow:ellipsis;
   white-space: nowrap;
   margin-top:.3rem;
 }
 .crowdfundingList li h5{
   font-size:.22rem ;
   color:#979797;
   margin:.14rem 0;
 }
 .crowdfundingList li p{
   font-size:.34rem;
   margin-bottom: .14rem;
 }
 .crowdfundingList li p span{
   font-size: .28rem;
 }
</style>
