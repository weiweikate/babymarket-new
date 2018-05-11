<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">姓名：</span>
            <yd-input slot="right" required v-model="username" max="20" placeholder="请输入姓名"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">账号：</span>
            <yd-input slot="right" required v-model="username"  placeholder="请输入支付宝账号"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">确认账号：</span>
            <yd-input slot="right" required v-model="username"  placeholder="请确认支付宝账号"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          请确保支付宝账号正确
        </div>
        <div>
          <span class="lBtn Btn">绑定支付宝</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl} from '../../../common/index.js'
  import {  _readURL, _alipayAccountAdd  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '提现'},
        userInfos:'',
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    watch: {
      code:'makeSure'
    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
      },
      addCollection () {
        let url = this.writeUrl
        // 随机生成 收藏夹id
        this.isCollection.colId= getUUID()
        this.axios.post(url,{"Items":[{"AddOperationId": _alipayAccountAdd,"Data":{"EntityName":"AlipayBind","Items":{"AplipayAccount":this.isLogin.userId,"FavoriteObjectId":this.prdId,"FavoriteObjectType":"Product","Id":this.isCollection.colId,"MemberId":this.isLogin.userId,"ProductId":this.prdId},"Status":"New"}}]})
          .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '已收藏', timeout: 1500})
            this.isCollection.status= true
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '收藏失败,请重试', timeout: 1500})
          this.isCollection.status= false
        })
      },
    }
  }
</script>
<style>

</style>
<style scoped>
  .tips{
    font-size: .26rem;
    text-align: left;
    padding-left: .3rem;
    margin-bottom: .5rem;
  }
</style>
