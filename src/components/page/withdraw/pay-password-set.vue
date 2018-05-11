<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <p class="mobile">手机号码：<span>{{userInfos.Mobile}}</span></p>
        <yd-cell-group>
          <yd-cell-item class="bg-view">
            <input class="codeInput" type="text" v-model="code" slot="right" placeholder="请输入你收到的验证码"  max="10">
            <yd-sendcode slot="right" storage-key="dashuaibi"
                          v-model="start" @click.native="getCode"
                          type="warning">
            </yd-sendcode>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">新密码：</span>
            <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入新密码"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">确认密码：</span>
            <yd-input slot="right" type="password" v-model="repwd" placeholder="请再次输入新密码"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          密码由<span>6-16位</span>数字或字母组成
        </div>
        <div>
          <span class="lBtn Btn" @click.prevent="addPwd">提交</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl, getUUID, isEmpty,validatePwd, validateRpwd } from '../../../common/index.js'
  import {  _readURL, _addCode, _checkCode, _writeURL,_payPasswordAddOperation  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '设置支付密码'},
        userInfos:'',
        writeUrl:'',
        code:'',
        start:false,
        pwd:'',
        repwd:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
      },
      getCode () {
        this.start = true
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"AddOperationId": _addCode,"Data":{"EntityName":"Check_Code","Items":{"Mobile":this.userInfos.Mobile,"TypeKey":"2"},"Status":"New"}}]}
        ).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '验证码已发送', timeout: 1500})
          } else{
            this.$dialog.alert({mes: res.data.brief})
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      payPasswordAdd () {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"AddOperationId":_payPasswordAddOperation,"Data":{"EntityName":"PayCode","Items":{"NewCode":this.pwd,"CheckPassword":this.repwd,"Mobile":this.userInfos.Mobile,"MemberId":this.userInfos.userId,"CheckCode":this.code},"Status":"New"}}]}
        ).then((res) => {
          console.log(res.data)
          if(JSON.stringify(res.data) == "{}"){
            this.$router.replace({path:'/withdraw'})
          } else{
            this.$dialog.alert({mes: res.data.brief});
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      addPwd(){
        if(isEmpty(this.code) || isEmpty(this.pwd) || isEmpty(this.repwd)){
          this.$dialog.toast({mes: '请输入验证码或者支付密码', timeout: 2500})
          return
        }  else {
          let pwdTips = validatePwd(this.pwd)
          let repwdTips = validateRpwd(this.pwd,this.repwd)
          if(!pwdTips.statu){
            this.$dialog.toast({mes: pwdTips.mes, timeout: 2500})
            return
          }
          if(!repwdTips.statu){
            this.$dialog.toast({mes:repwdTips.mes, timeout: 2500})
            return
          }
        }
        this.payPasswordAdd()
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
