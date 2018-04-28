<template>
  <div style="height:100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="topicPage">
        <div class="content">
          <div v-for="(topicList,index) in topicLists" :key="index">
            <router-link :to="{path:'/topicDetail',query:{prdId:topicList.Id,title:topicList.Title}}">
              <!--<p class="topic">-->
                <!--<img v-lazy="getPic(topicList.Img2Id)" alt=""/>-->
                <!--{{topicList.Name}}-->
              <!--</p>-->
              <div class="imgDiv">
                <img :src="getPic(topicList.ImgId)" alt=""/>
              </div>
              <div class="info">
                <p>
                  <span class="fl Title">{{topicList.Title}}</span>
                  <!--<span class="fr PriceDes">{{topicList.PriceDes}}</span>-->
                </p>
                <div class="Subtitle">
                  {{topicList.Subtitle}}
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <v-navbar slot="tabbar"></v-navbar>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../base/topBar.vue'
  import VNavbar from '../base/navBar.vue'
  import { isLogin, getImgs } from '../../common/index.js'
  import { _readURL, _topic } from  '../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '专题'},
        userInfos: '',
        topicLists: [],
      }
    },
    components: {
      VTopbar,
      VNavbar,
    },
    mounted: function () {
      this.getIsEntry()
      this.getTopicInfos()
    },
    methods: {
      getIsEntry (){
        this.userInfos= isLogin(_readURL)
      },
      getTopicInfos () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Deleted} == 'False'&& ${Hide} == 'False'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items": ['Id', 'ImgId', 'Img2Id', 'Name', 'Title', 'Subtitle', 'PriceDes','ProductId'],"MaxCount":"25","Operation": _topic})
            .then((res) => {
           this.$dialog.loading.close()
           this.topicLists = res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getPic (id) {
        return getImgs(id)
      }
    }
  }
</script>
<style scoped>
  .content{
    text-align: left;
    font-size: .34rem;
  }
  .content>div{
    background: #fff;
    margin-bottom:.2rem;
  }
  .content p.topic{
    height:.9rem;
    font-size: .32rem;
    line-height: .9rem;
    padding-left: 0.28rem;
  }
  .content p.topic  img{
    width:.6rem;
    vertical-align: middle;
    margin-right:0.2rem ;
    border-radius: 100rem;
  }
  .content .imgDiv{
    min-height: 3.7rem;
  }
  .content .imgDiv img{
    width:100%;
  }
  .info{
    padding:.25rem;
    padding-bottom:0.5rem;
  }
  .info>p{
    overflow: hidden;
    margin-bottom:.15rem;
  }
  .info>div{
    font-size: .3rem;
  }
  span.Title{
    color: #000;
    width: 95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  span.PriceDes{
    color: #E99F1B;
  }
</style>
