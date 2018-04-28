<template>
  <div class="topicItems">
    <div>
      <router-link :to="{path:'/topicDetail',query:{prdId:topicList.Id,title:topicList.Title}}">
        <img :src="getPic(topicList.ShowImgId)" alt=""/>
      </router-link>
    </div>
    <div class="indexPrd prdListTheme">
      <div class="prdIntr">
        <ul class="indexTopicList">
          <li v-for="(listDel, key ) in topicList.ProductDetail" :key="key" v-if="key<5" >
            <router-link :to="{path: '/prdDetail', query: {prdId: listDel.ProudctId,imgId: listDel.ImgId}}">
              <div>
                <img  v-lazy="getPic(listDel.ImgId)">
              </div>
              <p>
                <span>{{listDel.ProductName}}</span>
              </p>
              <div class="indexTopicListPrice">
                <div class="priceDiv" v-if="userInfos.login&& (userInfos.MemberTypeKey=='3')">
                  <span class="AccPrice">￥ {{listDel.HSPrice}}</span>
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
              </div>
            </router-link>
          </li>
          <li class="showMore">
            <router-link :to="{path:'/topicDetail',query:{prdId:topicList.Id,title:topicList.Title}}">
              <h4><span>查看全部</span></h4>
              <h5>MORE>></h5>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
    import { getImgs } from '../../common/index.js'
    export default {
      props: {
        topicList: {
          type: Object,
          default: function () {
            return {}
          }
        },
        userInfos:{
          type: Object,
          default: function () {
            return {}
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
  .topicItems img,.indexTopicList li img{
    width: 100%;
  }
  .indexTopicList{
    overflow-y: hidden;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    font-size: 0;
  }
  .prdIntr{
    margin-bottom: 0.15rem;
    height:4.59rem;
    overflow:hidden;
  }
  .indexTopicList::-webkit-scrollbar{
    /*去除滚动条*/
    display:none;
  }
  ul.indexTopicList li{
    display: inline-block;
    width: 3.1rem;
    height: 4.7rem;
    margin-right:.1rem;
    vertical-align: top;
    color: #515151;
    background: #fff;
  }

  .prdIntr .priceDiv{
    display: inline-block;
    width: 33.3% !important;
    font-size: .16rem;
  }
  .indexTopicList li>div{
    background: #fff;
  }
  .indexTopicListPrice{
    padding: .11rem 0;
    padding-bottom: .3rem;
  }
  .indexTopicList .showMore{
    font-size: .24rem;
    padding-top:1.85rem;
    background: #EBEBEB;
    margin-right: 0;
  }
  .showMore span{
    border-bottom: 1px solid;
  }
  .showMore h4 span{
    padding: .1rem 0;
  }
  .showMore h5{
    padding-top: .2rem;
   }
</style>
