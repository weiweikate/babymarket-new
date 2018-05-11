<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <p class="mobile">手机号码：<span>1111111</span></p>
        <yd-cell-group>
          <yd-cell-item class="bg-view">
            <input class="codeInput" type="text" slot="right" placeholder="请输入你收到的验证码" storage-key="dashuaibi" max="10">
            <yd-sendcode slot="right"
                         v-model="code"
                         @click.native="sendCode1"
                         type="warning">
            </yd-sendcode>

          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">用户名：</span>
            <yd-input slot="right" required v-model="username" max="20" placeholder="请输入用户名"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">新密码：</span>
            <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入新密码"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">确认密码：</span>
            <yd-input slot="right" type="password" v-model="pwd" placeholder="请再次输入新密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          密码由<span>6-18位</span>数字或字母组成
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
        titleAttr: {'isShow': true, 'name': '设置支付密码'},
        userInfos:'',
        code:''
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
  .yd-cell-item.bg-view:not(:last-child):after{
    border-bottom: 0 !important;
  }
  .bg-view .yd-cell-right{
    min-height: .8rem;
  }
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
  .mobile{
    font-size: .26rem;
    height: .8rem;
    line-height: .8rem;
    text-align:left;
    padding-left: .3rem;
    background: #fff;
  }
  .mobile span{
    font-weight: bold;
  }
  .bg-view{
    margin: 0 .24rem;
    background:#f1f3f4;
    font-size:.28rem;
    border-radius: .1rem;
    overflow: hidden;
  }
  .bg-view .yd-cell-right .codeInput{
    height: .7rem;
    font-size:.28rem;
  }
  .bg-view .yd-btn-warning {
    background-color: transparent;
    color: #7697C6;
    border-left: 1px solid #DCDCDC;
    border-radius: 0;
  }
</style>
