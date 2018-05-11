<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">支付宝用户名：</span>
            <yd-input slot="right"  v-model="account.Name" max="20" placeholder="请输入用户名"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">对方账户：</span>
            <yd-input slot="right" v-model="account.AplipayAccount" max="20" placeholder="请输入支付宝账号" ></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          请确保支付宝账号正确，
          <router-link :to="{path:'/bindAlipay'}">
            <span >
            绑定支付宝
            </span>
          </router-link>
        </div>
        <div>
          <span class="lBtn Btn" @click.prevent="next">下一步</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl} from '../../../common/index.js'
  import {  _readURL, _alipayAccountRead  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '提现'},
        userInfos:'',
        account:{}
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
        this.getAlipayAccount()
      },
      getAlipayAccount() {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,Items:["Id", "Name", "AplipayAccount"],Order:"${CreateTime} DESC","Operation": _alipayAccountRead }
          ).then((res) => {
            this.$dialog.loading.close()
            if(res.data.Total > 0){
              this.account = res.data.Datas[0]
            }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      next() {
        this.$router.replace({path: '/withdrawToAlipay',query:{name:this.account.Name,account:this.account.AplipayAccount,num:this.$route.query.num}})
      }
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
  .tips span{
    color:#7697C6;
  }
</style>
