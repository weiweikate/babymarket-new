<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="registerPage scrollViewDiv">
        <div class="code">
          <p style="margin-bottom: .2rem">您的手机号： {{userPhone}}</p>
          <p>将收到一条带有验证码的短信，点击获取验证码并输入</p>
          <div class="codeDiv">
            <input type="text" placeholder="请输入短信验证码" v-model="code"/>
            <yd-sendcode  v-model="codeBtn"  @click.native="getCode"  init-str="获取验证码" storage-key="codeKey"></yd-sendcode>
          </div>
          <button type="button" class="subBtn" :disabled="disabled" @click.prevent="checkCode">确认</button>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl, validatePwd, validateMobile, getUUID} from '../../../common/index.js'
  import { _writeURL, _readURL, _addCode, _checkCode  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow':true, 'name': '注册'},
        userPhone:'',
        codeId:'',
        disabled:'',
        codeBtn: false, // 倒计时按钮是否能倒计时
        code:''
      }
    },
    components: {
      VTopbar
    },
    watch: {
      code:'makeSure'
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getCode () {
        this.codeId = getUUID()
        let url = this.writeUrl
        this.codeBtn = true
        this.axios.post(url,{"Items":[{"AddOperationId": _addCode,"Data":{"EntityName":"Check_Code","Items":{"Id":this.codeId,"Mobile":this.userPhone,"TypeKey":"0"},"Status":"New"}}]}
        ).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '注册', timeout: 1500})
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      checkCode () {
        let url = this.userInfos.reqUrl
        let myReg = JSON.parse(window.sessionStorage.reg)
        if (!this.codeId){
          this.codeId = myReg.Id
        }
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+this.codeId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _checkCode}
        ).then((res) => {
          if( res.data.Datas[0].Code == this.code ) {
            myReg.code = this.code
            myReg.phone = this.userPhone
            window.sessionStorage.reg = JSON.stringify(myReg)
            this.$router.push({path:'/registerStep3',query:{Id:this.phone}})
          } else {
            this.$dialog.toast({mes: '验证码有误', timeout: 1500})
          }
        }).catch((err) => {
          alert(err)
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getIsEntry(){
        this.userInfos = isLogin(_readURL)
        this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
        this.userPhone = this.$route.query.Id
      },
      makeSure () {
        if(this.code.length >= 6) {
          this.disabled = false
        } else {
          this.disabled = true
          return
        }
      }
    }
  }
</script>

<style scoped>

</style>
