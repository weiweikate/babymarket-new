<template>
  <div style="height: 100%">
    <!-- 我的奖励 -->
    <yd-layout>
      <v-topbar :title="titleAttr" ref="topBar" slot="navbar"></v-topbar>
      <div class="userAssetsPage">
        <div class="totalCommission">
          <div>我的奖励 （元）</div>
          <span> ¥ {{totalBalance}} 元</span>
          <!--<span class="fr">提现</span>-->
        </div>
        <div class="commission" v-for="(balanceLog,index) in balanceLogs" :key="index">
          <div>{{balanceLog.Month.slice(0,4)+"年"+ balanceLog.Month.slice(5,7)+"月"}}</div>
          <div v-for="(balance,key) in balanceLog.Detail" :key="key">
            <div v-if="balance.TypeKey == '3'">
              <div class="title">{{balance.Title}}</div>
              <div>
                <yd-flexbox >
                  <yd-flexbox-item>支出</yd-flexbox-item>
                  <yd-flexbox-item>{{balance.Money}}</yd-flexbox-item>
                  <yd-flexbox-item>{{balance.DateTime.slice(5,16)}}</yd-flexbox-item>
                </yd-flexbox>
              </div>
            </div>
            <yd-flexbox v-else>
              <yd-flexbox-item>
                {{balance.Title}}
              </yd-flexbox-item>
              <yd-flexbox-item>{{balance.Money}}</yd-flexbox-item>
              <yd-flexbox-item>{{balance.DateTime.slice(5,16)}}</yd-flexbox-item>
            </yd-flexbox>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _balanceLog, _userLevel } from '../../../common/request.js'
  import { isLogin, reqUrl} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的资产'},
        userInfos:'',
        totalBalance:'',
        balanceLogs:[]
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getBalanceLog()
      this.getBalance()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
      },
      getBalanceLog () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _balanceLog}
        ).then((res) => {
          this.$dialog.loading.close()
          let userBalance = 0
          this.balanceLogs = res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getBalance () {
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Id} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          this.totalBalance = res.data.Datas[0].Balance
        }).catch((err) => {
          alert(err)
        })
      }
    }
  }
</script>

<style scoped>
  span.fr{
    width: 1.2rem;
    height: .6rem;
    line-height: .6rem;
    font-size: .26rem;
    border-radius: .5rem;
    background: #61441a;
    margin-top: .15rem;
    color: #ab8026;
    margin-right: .3rem;
  }
  .commission>div:first-child{
    background: transparent;
    text-align: left;
  }
  .title{
    text-align: left;
    height: auto !important;
    line-height: .22rem;
    padding-top:0.1rem;
  }
</style>
