<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userRewardPage">
        <div class="totalCommission">
          <div>我的奖励 （元）</div>
          <span> ¥ {{totalcommission}} 元</span>
        </div>
        <div class="list">
          <v-award-cell-datepiker :datetime="datetime" @choose="choose"></v-award-cell-datepiker>
          <div  v-for="(balanceLog,index) in commissionInfos" :key="index">
            <v-award-cell-header :items="balanceLog"></v-award-cell-header>
            <v-award-cell-line v-for="(item,keys) in balanceLog.CommissionDetail" :key="keys" :datas="item" :index='index' :section='keys' @cellCliked="cellCliked"></v-award-cell-line>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VAwardCellDatepiker from '../../base/award-cell-datepiker.vue'
  import VAwardCellLine from '../../base/award-cell-line.vue'
  import VAwardCellHeader from '../../base/award-cell-header.vue'
  import { _readURL, _commissionLog,_balanceType } from '../../../common/request.js'
  import { isLogin, reqUrl, getImgs} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的奖励'},
        userInfos: '',
        totalcommission: '',
        commissionInfos: [],
        datetime:{endDate:'2018-04',date:''},
        num:0
      }
    },
    components: {
      VTopbar,
      VAwardCellDatepiker,
      VAwardCellLine,
      VAwardCellHeader
    },
    mounted: function () {
      this.getIsEntry()
      this.getCommissionLog()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        this.datetime.endDate = new Date().getFullYear() + '-' + (new Date().getMonth()+1)
      },
      getCommissionLog (date) {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let params ={"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _commissionLog }
        if(date){
          params.Condition += date
        }
        this.axios.post(url,params).then((res) => {
          this.$dialog.loading.close()
          let userBalance = 0
          if(res.data.Total > 0){
            this.commissionInfos = res.data.Datas
            this.commissionInfos.forEach((item,index) =>{
              item.Month =item.Month.slice(0,7)
              item.Commissioin = item.Money
              item.CommissionDetail.forEach((item0,index0) =>{
                item0.Date = item0.ConfirmDate
                item0.Commissioin = item0.Money
                item0.IsExpend = 'False'
                item0.TypeName = '码头奖励'
              })
            })
          }else {
            this.$dialog.toast({
              mes: '没有相关数据',
              timeout: 1500
            });
          }
        }).catch((err) => {
          alert(err)
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })

      },
      choose(time){
        if(this.num>1){
          let date = " && ${Month} <= '"+time+"'"
          this.getCommissionLog(date)
        }
        this.num += 1
      },
      cellCliked(index,key){

      }
    }
  }
</script>


<style scoped>
  .list{
    text-align: left;
    position: relative;
  }
</style>
