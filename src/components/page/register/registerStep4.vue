<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="registerPage scrollViewDiv">
        <div class="resetPwd">
          <p>设置密码</p>
          <yd-cell-group>
            <yd-cell-item>
              <span slot="left">密码：</span>
              <yd-input slot="right" type="password" v-model="pwd" placeholder="请输入6-16位的密码"></yd-input>
            </yd-cell-item>
          </yd-cell-group>
          <span class="subBtn" @click.prevent="register">确认</span>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl, validatePwd, formatTime} from '../../../common/index.js'
  import { _writeURL, _readURL, _register  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow':true, 'name': '注册'},
        pwd:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      register () {
        if (!validatePwd(this.pwd).statu) {
          this.$dialog.toast({mes: validatePwd(this.pwd).mes, timeout: 1500})
          return
        }
        let LyCode = this.$route.query.code
        let regInfo = JSON.parse(window.sessionStorage.reg)
        let url = this.writeUrl
        this.axios.post(url, {"Items":[{"AddOperationId": _register,"Data":{"EntityName":"Member","Items":{"Mobile":regInfo.phone,"Name":regInfo.phone, "Code_Input":regInfo.code,"Password":this.pwd,"Password2":this.pwd,"RegisteTime":formatTime(),"RegisterCode":LyCode},"Status":"New"}}]}
        ).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '注册成功，请马上登录', timeout: 1500, icon: 'success',
              callback: () => {
              window.sessionStorage.removeItem('reg')
              this.$router.push({path:'/userCenter'})
            }
          })
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
      }
    }
  }
</script>

<style>

</style>
