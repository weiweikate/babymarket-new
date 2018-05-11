<template>
  <div  class="withdrawPage ">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv">
        <p class="amout">当前最大提现金额：<span>{{accountInfos.num}}元</span></p>
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">提现金额：</span>
            <yd-input slot="right" required v-model="cash" max="20" placeholder="暂不收取手续费"></yd-input>
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
          <span class="lBtn Btn" @click="cashAdd">提交</span>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { isLogin, reqUrl, isEmpty} from '../../../common/index.js'
  import {  _readURL, _writeURL,_cashAdd  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '提现'},
        userInfos:'',
        writeUrl:'',
        cash:'',
        pwd:'',
        accountInfos:{}
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      cashAdd() {
        let url = this.writeUrl
        if(isEmpty(this.cash) || isEmpty(this.pwd) ){
          this.$dialog.toast({mes: '请输入提现金额和密码', timeout: 2500})
          return
        }
        if(this.cash > this.accountInfos.num){
          this.$dialog.toast({mes: '提现金额大于最大提现金额', timeout: 2500})
          return
        }
        this.axios.post(url,{"Items":[{"AddOperationId":_cashAdd,"Data":{"EntityName":"Cash","Items":{"Alipay":this.accountInfos.account,"AlipayName":this.accountInfos.name,"CashMoney":this.cash,"MemberId":this.userInfos.userId,'Password':this.pwd},"Status":"New"}}]})
          .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$router.replace({path:'/withdrawSuc'})
          }else{
            this.$dialog.alert({mes: res.data.brief})
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '提现失败', timeout: 1500})
          this.isCollection.status= false
        })
      },
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.accountInfos = this.$route.query
        this.userInfos = isLogin(_readURL)
        this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
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
