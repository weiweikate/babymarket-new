<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userRewardPage">
        <div class="totalCommission">
          <div>我的奖励 （元）</div>
          <span> ¥ {{totalcommission}} 元</span>
        </div>
        <div class="commission">
          <div v-for="(commissionInfo,index) in commissionInfos" :key="index">
            <yd-flexbox>
              <yd-flexbox-item>{{commissionInfo.Type}}</yd-flexbox-item>
              <yd-flexbox-item>+ {{commissionInfo.Commission}}</yd-flexbox-item>
              <yd-flexbox-item>{{commissionInfo.CreateTime.slice(5,16)}}</yd-flexbox-item>
            </yd-flexbox>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _commissionLog } from '../../../common/request.js'
  import { isLogin, reqUrl} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的奖励'},
        userInfos: '',
        totalcommission: '',
        commissionInfos: []
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getCommissionLog()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
      },
      getCommissionLog () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _commissionLog}
        ).then((res) => {
          this.$dialog.loading.close()
          this.commissionInfos = res.data.Datas
          let commission = 0
          for (let i = 0; i< this.commissionInfos.length; i++){
            commission += Number(this.commissionInfos[i].Commission)
          }
          this.totalcommission = commission.toFixed(2)
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>

<style>

</style>
