<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userRewardPage scrollViewDiv">
        <div class="totalCommission">
          <div>我的奖励 （元）<span class="choose fr" @click.prevent="showFilter(true)">筛选</span></div>
          <span> ¥ {{totalcommission}} 元</span>
        </div>
        <div class="list">
          <v-award-cell-datepiker :datetime="datetime" @choose="choose"></v-award-cell-datepiker>
          <div  v-for="(balanceLog,index) in commissionInfos" :key="index">
            <v-award-cell-header :items="balanceLog"></v-award-cell-header>
            <v-award-cell-line v-for="(item,keys) in balanceLog.CommissionDetail" v-if='item.Commission!=0' :key="keys" :datas="item" :index='index' :section='keys' @cellCliked="cellCliked"></v-award-cell-line>
          </div>
        </div>
      </div>
    </yd-layout>
    <v-type-filter :datas="type" v-show="show" @showFilter="showFilter" @typeClicked="typeClicked"></v-type-filter>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VAwardCellDatepiker from '../../base/award-cell-datepiker.vue'
  import VAwardCellLine from '../../base/award-cell-line.vue'
  import VAwardCellHeader from '../../base/award-cell-header.vue'
  import VTypeFilter from '../../base/type-filter.vue'
  import { _readURL, _commissionLog,_balanceType,_userLevel,_awardTypeRead} from '../../../common/request.js'
  import { isLogin, reqUrl, getImgs} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的奖励'},
        userInfos: '',
        totalcommission: '',
        commissionInfos: [],
        datetime:{endDate:'2018-04',date:'2016-06'},
        num:0,
        totalcommission:'',
        show:false,
        type:[]
      }
    },
    components: {
      VTopbar,
      VAwardCellDatepiker,
      VAwardCellLine,
      VAwardCellHeader,
      VTypeFilter
    },
    mounted: function () {
      this.getIsEntry()
      this.getCommissionLog()
      this.getBalance()
      this.getType()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        let date = new Date()
        let month = date.getMonth()+1+''
        month = month.length==1? '0'+month: month
        this.datetime.endDate= this.datetime.date = date.getFullYear() + '-' + month
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
              item.CommissionDetail.reverse()
              item.CommissionDetail.forEach((item0,index0) =>{
                item0.Date = item0.OrderDate
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
      cellCliked(index,key){s
        let item = this.commissionInfos[index].CommissionDetail[key]
        this.$router.push({path:'/userCrowdfundingDetailInfos',query:{orderId:item.OrderId,commissioin:item.Commissioin,buyer:item.BuyerName,type:2,typeName:item.TypeName}})
      },
      getBalance () {
        let url = this.userInfos.reqUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Id} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
          this.totalcommission = res.data.Datas[0].Commission
        }).catch((err) => {
          alert(err)
        })
      },
      showFilter(type){
        this.show = type
      },
      typeClicked(index){
        let item = this.type[index]
        this.$router.push({path:'/awardDetailInfos',query:{type:item.Value,typeName:item.Name}})
      },
      getType(){
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":true,"IsReturnTotal":true,'Order':"${Ordinal} ASC","Operation": _awardTypeRead}
        ).then((res) => {
          this.type =res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
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
