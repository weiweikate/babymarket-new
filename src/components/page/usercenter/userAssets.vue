<template>
  <div style="height: 100%">
    <!-- 我的奖励 -->
    <yd-layout>
      <v-topbar :title="titleAttr" ref="topBar" slot="navbar"></v-topbar>
      <div class="userAssetsPage">
        <div class="totalCommission">
          <div>我的资产 （元）</div>
          <span> ¥ {{totalBalance}} 元</span>
          <!--<span class="fr">提现</span>-->
        </div>
        <div class="list">
          <v-award-cell-datepiker :datetime="datetime" @choose="choose"></v-award-cell-datepiker>
          <div  v-for="(balanceLog,index) in balanceLogs" :key="index">
            <v-award-cell-header :items="balanceLog"></v-award-cell-header>
            <v-award-cell-line v-for="(item,keys) in balanceLog.OrderDetail" :key="keys" :datas="item" :index='index' :section='keys' @cellCliked="cellCliked"></v-award-cell-line>
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
  import { _readURL, _balanceLog, _userLevel,_balanceType } from '../../../common/request.js'
  import { isLogin, reqUrl, getImgs} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的资产'},
        userInfos:'',
        totalBalance:'',
        balanceLogs:[],
        type:[],
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
      this.getType()
      this.getBalanceLog()
      this.getBalance()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        this.datetime.endDate = new Date().getFullYear() + '-' + (new Date().getMonth()+1)
      },
      getType(){
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _balanceType}
        ).then((res) => {
           this.type =res.data.Datas
        }).catch((err) => {
          alert(err)
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getBalanceLog (date) {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let params ={"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _balanceLog}
        if(date){
          params.Condition += date
        }
        this.axios.post(url,params).then((res) => {
          this.$dialog.loading.close()
          let userBalance = 0
          if(res.data.Total > 0){
            this.balanceLogs = res.data.Datas
            this.balanceLogs.forEach((item,index) =>{
              item.Month =item.Month.slice(0,7)
              item.Commissioin = item.Sum
              item.OrderDetail.forEach((item0,index0) =>{
                item0.Date = item0.DateTime
                item0.Commissioin = item0.Money
                item0.ImgId = getImgs(item0.TypeImgId)
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
      getBalance () {
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Id} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          this.totalBalance = res.data.Datas[0].Balance
        }).catch((err) => {
          alert(err)
        })
      },
      choose(time){
        if(this.num>1){
          let date = " && ${Month} <= '"+time+"'"
          this.getBalanceLog(date)
        }
        this.num += 1
      },
      cellCliked(index,key){
        let item = this.crowdfundingMonthList[index].Detail[key]
        this.$router.push({path:'/userCrowdfundingDetailInfos',query:{orderId:item.OrderId,commissioin:item.Commissioin,buyer:item.BuyerName}})
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
