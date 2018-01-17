<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="registerPage">
        <div class="putPhone">
          <input type="text" v-model="phone" placeholder="请输入您的手机号码" />
          <span class="subBtn" @click.prevent="checkPhone">下一步</span>
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
        phone:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      checkPhone () {
        // 判断会员账号是否存在
        if (!validateMobile(this.phone).statu) {
          this.$dialog.toast({mes: validateMobile(this.phone).mes, timeout: 1500})
          return
        }
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Mobile} == '"+this.phone+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          if(res.data.Datas.length == 0) {
            this.$router.push({path:'/registerStep2',query:{Id:this.phone}})
          } else {
            this.$dialog.toast({mes: '该账号已被注册', timeout: 1500})
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

<style >

</style>
