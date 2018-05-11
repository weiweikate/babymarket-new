<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="registerPage scrollViewDiv">
        <div class="putPhone">
          <input type="text" v-model="LYcode" placeholder="请输入您的邀请码" />
          <span class="subBtn" @click.prevent="checkYQM">下一步</span>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl, validatePwd, validateMobile} from '../../../common/index.js'
  import { _writeURL, _readURL,_userLevel  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow':true, 'name': '注册'},
        LYcode:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      checkYQM () {
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${InvitationCode} == '"+this.LYcode+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          if(res.data.Datas.length == 0) {
            this.$dialog.toast({mes: '输入邀请码有误', timeout: 1500})
          } else {
            this.$router.push({path:'/registerStep4',query:{Id:this.phone,code:this.LYcode}})
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
