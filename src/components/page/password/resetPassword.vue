<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="resetPasswordPage">
        <div class="putPhone" v-if="show">
          <input type="text" placeholder="请输入账号" v-model="phone"/>
          <span class="subBtn" @click.prevent="checkNumber">下一步</span>
        </div>
        <div class="code" v-show="showCode">
          <p>您正在修改账号</p>
          <p>{{userInfos.Mobile}} 的密码</p>
          <div class="codeDiv">
            <input type="text" placeholder="请输入短信验证码" v-model="code"/>
            <yd-sendcode  v-model="codeBtn"  @click.native="getCode"  init-str="获取验证码"></yd-sendcode>
          </div>
          <button type="button" class="subBtn" :disabled="disabled" @click.prevent="checkCode">确认</button>
        </div>
        <div class="resetPwd" v-show="showReset">
          <p>设置新密码</p>
          <yd-cell-group>
            <yd-cell-item>
              <span slot="left">密码：</span>
              <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入6-16位的密码"></yd-input>
            </yd-cell-item>
          </yd-cell-group>
          <span class="subBtn" @click.prevent="comfirmPwd">确认</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, getUUID, reqUrl, validatePwd, validateMobile} from '../../../common/index.js'
  import { _writeURL, _readURL, _addCode, _checkCode, _passwordRetake,_userLevel  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '修改密码'},
        userInfos:'',
        userIntr:'', // 忘记密码时候的客户信息
        writeUrl:'',
        show:false,
        showCode:false,
        showReset:false,
        codeBtn: false, // 倒计时按钮是否能倒计时
        phone:'', // 手机号
        code:'', // 验证码
        codeId:'', // 验证码ID
        pwd:'',// 密码
        disabled: true
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
        console.log(1)
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        if (this.userInfos.login || window.sessionStorage.userIntr) {
          this.show = false
          this.showCode = true
        }
//        else if (JSON.parse(window.sessionStorage.code).code) {
//          this.show = false
//          this.showCode = false
//          this.showReset = true
//        }
        else {
          this.show = true
        }
        this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
      },
      getCode () {
        console.log(2)
        this.codeId = getUUID()
        let url = this.writeUrl
        this.showItems = [false,false,true,false]
        this.axios.post(url,{"Items":[{"AddOperationId": _addCode,"Data":{"EntityName":"Check_Code","Items":{"Id":this.codeId,"Mobile":this.userInfos.Mobile,"TypeKey":"1"},"Status":"New"}}]}
        ).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            window.sessionStorage.code = JSON.stringify({Id:this.codeId,code:''})
            this.codeBtn = true
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      checkCode () {
        console.log(3)
        let url = this.userInfos.reqUrl
        if (!this.codeId){
          this.codeId = JSON.parse(window.sessionStorage.code).Id
        }
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+this.codeId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _checkCode}
        ).then((res) => {
          if( res.data.Datas[0].Code == this.code ) {
            window.sessionStorage.code = JSON.stringify({Id:this.codeId,code:this.code})
            this.showCode= false
            this.showReset = true
          } else {
            this.$dialog.toast({mes: '验证码有误', timeout: 1500})
          }
        }).catch((err) => {
          alert(err)
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      checkNumber () {
        console.log(4)
        // 判断会员账号是否存在
        if (!validateMobile(this.phone).statu) {
          this.$dialog.toast({mes: validateMobile(this.phone).mes, timeout: 1500})
          return
        }
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Mobile} == '"+this.phone+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          if(res.data.Datas.length == 0) {
            this.$dialog.toast({mes: '该账号不存在，请重新输入', timeout: 1500})
          } else {
            this.userIntr = res.data.Datas[0]
            window.sessionStorage.userIntr = JSON.stringify(this.userIntr)
            this.userInfos.Mobile = this.userIntr.Mobile
            this.show = false
            this.showCode = true
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      comfirmPwd () {
        console.log(5)
        let url = this.writeUrl
        if (!validatePwd(this.pwd).statu) {
          this.$dialog.toast({mes: validatePwd(this.pwd).mes, timeout: 1500})
          return
        }
        if( !this.codeId || !this.code) {
          let codeInfo = JSON.parse(window.sessionStorage.code)
          this.codeId = codeInfo.Id
          this.code = codeInfo.code
        }
        let mobile = ''
        let userId = ''
        if (this.userInfos.login) {
          userId = this.userInfos.userId
          mobile = this.userInfos.Mobile
        } else if (!this.userIntr){
          userId = JSON.parse(window.sessionStorage.userIntr).Id
          mobile = JSON.parse(window.sessionStorage.userIntr).Mobile
        } else {
          userId = this.userIntr.Id
          mobile = this.userIntr.Mobile
        }
        this.axios.post(url,{"Items":[{"AddOperationId": _passwordRetake,"Data":{"EntityName":"Password_Retake","Items":{"MemberId":userId,"Mobile":mobile,"Check_Code":this.code,"Check":this.code,"Password_New":this.pwd,"Password_Check":this.pwd,"Formal":"True"},"Status":"New"}}]}
        ).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '修改成功，请重新登录', timeout: 1500, icon: 'success',
              callback: () => {
                window.sessionStorage.removeItem('userInfos')
                window.sessionStorage.removeItem('userIntr')
                window.sessionStorage.removeItem('code')
                this.$router.push({path:'/userCenter'})
              }
            })
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      makeSure () {
        console.log(6)
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
<style>

</style>
<style scoped>
  .yd-cell-item{
    border: 1px solid #ddd;
    margin-top: .35rem;
  }
</style>
