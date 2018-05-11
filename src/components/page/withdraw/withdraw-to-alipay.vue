<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <p class="amout">当前最大提现金额：<span>333元</span></p>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">提现金额：</span>
            <yd-input slot="right" required v-model="username" max="20" placeholder="暂不收取手续费"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">支付密码：</span>
            <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入支付密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          <router-link :to="{path:'/payPwdSet'}">
            设置支付密码
          </router-link>
        </div>
        <div>
          <span class="lBtn Btn">提交</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl} from '../../../common/index.js'
  import {  _readURL, _addCode, _checkCode, _passwordRetake,_userLevel  } from '../../../common/request.js'
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
    },
    watch: {
      code:'makeSure'
    },
    methods: {
      Aqrcode() {

      },
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
      }
    }
  }
</script>
<style>

</style>
<style scoped>
  .amout{
    font-size: .26rem;
    height: .8rem;
    line-height: .8rem;
    text-align:left;
    padding-left: .3rem;
  }
  .amout span{
    color:#C7B07E;
  }
  .tips{
    font-size: .26rem;
    text-align: left;
    padding-left: .3rem;
    margin-bottom: .5rem;
    color:#7697C6;
  }
</style>
