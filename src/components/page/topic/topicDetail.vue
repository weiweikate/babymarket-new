<template>
  <div style="height:100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="topicDelPage">
        <div class="content">
          <img :src="imgSrc" alt=""/>
          <div>
            <p class="title">{{topicLists.Title}}</p>
            <div class="infos"  v-html="content"></div>
          </div>
        </div>
        <div class="indexPrd prdListTheme">
          <div class="prdIntr">
            <yd-list :theme="2">
              <yd-list-item v-for="listDel, key in topicLists.ProductDetail" :key="key"  @click.native="goDetailPage(listDel.ProudctId,listDel.ImgId)">
                <img slot="img" v-lazy="getPic(listDel.ImgId)">
                <span slot="title">{{listDel.ProductName}}</span>
                <yd-list-other slot="other">
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
                </yd-list-other>
              </yd-list-item>
            </yd-list>
          </div>
        </div>

      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VNavbar from '../../base/navBar.vue'
  import { isLogin, getImgs } from '../../../common/index.js'
  import { _readURL, _topic } from  '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '专题简介'},
        userInfos: {},
        topicLists: [],
        imgSrc:'',
        content:'',
      }
    },
    components: {
      VTopbar,
      VNavbar,
    },
    mounted: function () {
      this.getIsEntry()
      this.getTopicDelInfos()
    },
    methods: {
      getIsEntry (){
        this.userInfos= isLogin(_readURL)
      },
      getTopicDelInfos () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.prdId = this.$route.query.prdId
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+ this.prdId +"'","IsIncludeSubtables":true,"IsReturnTotal":true,IsIncludeLong:true,"MaxCount":"1","Operation":_topic})
            .then((res) => {
           this.$dialog.loading.close()
           this.topicLists = res.data.Datas[0]
           this.imgSrc = this.getPic(this.topicLists.ShowImgId)
           this.content = this.topicLists.Content.replace(/\n/g, "<br/>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")

        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
          alert(err)
        })
      },
      goDetailPage (prdId,ImgId) {
        //传递主图id 和产品id
        console.log(prdId,ImgId)
        this.$router.push({path: '/prdDetail', query: {prdId: prdId,imgId: ImgId}})
      },
      getPic (id) {
        return getImgs(id)
      }
    }
  }
</script>
<style scoped>
  .topicDelPage .content{
    text-align: left;
    font-size:0rem;
  }
  .topicDelPage .content>div{
    background: #fff;
    margin-bottom:.2rem;
  }
  .topicDelPage .content img{
    width: 100%;
    min-height: 3.7rem;
  }
  .topicDelPage .title{
    text-align: center;
    color:#252525;
    padding-top:.45rem;
    font-size: .34rem;
  }
  .topicDelPage .infos{
    color:#979797;
    font-size: .26rem;
    padding: .3rem;
  }


</style>
