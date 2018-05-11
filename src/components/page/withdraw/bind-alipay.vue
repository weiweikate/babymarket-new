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
            <yd-input slot="right" required v-model="account"  placeholder="请输入支付宝账号"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">确认账号：</span>
            <yd-input slot="right" required v-model="checkAccount"  placeholder="请确认支付宝账号"></yd-input>
          </yd-cell-item>
        </yd-cell-group>
        <div class="tips">
          请确保支付宝账号正确
        </div>
        <div>
          <span class="lBtn Btn" @click.prevent="alipayAccountAdd">绑定支付宝</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl,isEmpty} from '../../../common/index.js'
  import {  _readURL, _alipayAccountAdd, _writeURL  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '提现'},
        userInfos:'',
        writeUrl:'',
        username:'',
        account:'',
        checkAccount:''
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
      alipayAccountAdd () {
        let url = this.writeUrl
        if(isEmpty(this.username) || isEmpty(this.checkAccount) || isEmpty(this.account) ){
          this.$dialog.toast({mes: '姓名或账号不能为空', timeout: 1500})
          return
        } else if(this.checkAccount != this.account){
          this.$dialog.toast({mes: '两次输入账号不一致', timeout: 1500})
          return
        }
        this.axios.post(url,{"Items":[{"AddOperationId": _alipayAccountAdd,"Data":{"EntityName":"AlipayBind","Items":{"AplipayAccount":this.account,"CheckAccount":this.checkAccount,"Name":this.username,"MemberId":this.userInfos.userId},"Status":"New"}}]})
          .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$router.replace({path:'/withdraw'})
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '绑定失败,请重试', timeout: 1500})
          this.isCollection.status= false
        })
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
</style>
