<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userRewardPage">
        <div class="orderDetail">
          <div class="productInfo" v-for="( favoriteList, index) in favoriteLists" :key="index" v-if="favoriteList.ProductId!='00000000-0000-0000-0000-000000000000'">
            <router-link :to="{path:'/prdDetail',query:{prdId:favoriteList.ProductId}}">
              <yd-flexbox>
                <img :src="getPic(favoriteList.ImgId)" class="demo-checklist-img">
                <yd-flexbox-item align="top">
                  <p>{{favoriteList.Product_ShowName}}</p>
                  <p>¥ {{favoriteList.Price}}</p>
                </yd-flexbox-item>
              </yd-flexbox>
            </router-link>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _userFavorite } from '../../../common/request.js'
  import { isLogin, reqUrl, getImgs } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的收藏'},
        userInfos: '',
        favoriteLists:[]
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getUserFavorite()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
      },
      getUserFavorite () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _userFavorite}
        ).then((res) => {
          this.$dialog.loading.close()
          this.favoriteLists = res.data.Datas
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
  .userRewardPage .orderDetail .productInfo p:first-child{
    margin-bottom: .2rem;
  }
  .userRewardPage .orderDetail .productInfo{
    margin-bottom: 0;
  }
</style>
