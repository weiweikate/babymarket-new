<template>
  <div style="height: 100%">
    <!-- 我的奖励 -->
    <yd-layout>
      <v-topbar :title="titleAttr" ref="topBar" slot="navbar"></v-topbar>
      <div class="userAssetsPage">
        <div class="totalCommission">
          <div>我的资产 （元） <span class="choose fr" @click.prevent="showFilter(true)">筛选</span></div>
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
    <v-type-filter :datas="type" v-show="show" @showFilter="showFilter" @typeClicked="typeClicked"></v-type-filter>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VAwardCellDatepiker from '../../base/award-cell-datepiker.vue'
  import VAwardCellLine from '../../base/award-cell-line.vue'
  import VAwardCellHeader from '../../base/award-cell-header.vue'
  import VTypeFilter from '../../base/type-filter.vue'
  import { _readURL, _balanceLog, _userLevel,_balanceType,_balanceDetail } from '../../../common/request.js'
  import { isLogin, reqUrl, getImgs} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的资产'},
        userInfos:'',
        totalBalance:'',
        balanceDatail:'',
        balanceLogs:[],
        type:[],
        datetime:{endDate:'2018-04',date:'2016-06'},
        num:0,
        show:false
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
      this.getType()
      this.getBalanceLog()
      this.getTotalBalance()
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
      getType(){
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":true,"IsReturnTotal":true,'Order':"${Ordinal} ASC","Operation": _balanceType}
        ).then((res) => {
           res.data.Datas.unshift({Name:'全部'})
           this.type =res.data.Datas

        }).catch((err) => {
          alert(err)
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getBalanceLog (time,type) {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let date = " && ${Month} <= '"+time+"'"
        let params ={"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _balanceLog}
        if(time){
          params.Condition += date
        }
        this.axios.post(url,params).then((res) => {
          this.$dialog.loading.close()
          let userBalance = 0
          if(res.data.Total > 0){
            this.balanceLogs = res.data.Datas
            this.balanceLogs.forEach((item,index) =>{
              item.Month =item.Month.slice(0,7)
              item.Commissioin = item.InCome
              item.Expend =item.Expend.slice(1)
              item.OrderDetail.reverse()
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
          if(this.show == true){
            this.show = false
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getBalanceDetail(time,type){
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let params ={"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"' && ${Month} <= '"+time+"' && ${TypeKey} == '"+type+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _balanceDetail}
        this.axios.post(url,params).then((res) => {
          this.$dialog.loading.close()
          let userBalance = 0
          if(res.data.Total > 0){
            this.balanceDatail = res.data.Datas
            this.balanceDatail.forEach((item0,index0) =>{
              item0.Month = item0.Month.slice(0,7)
              item0.Date = item0.DateTime
              item0.Commissioin = item0.Money
              item0.ImgId = getImgs(item0.TypeImgId)
            })
            for(let j=0;j<this.balanceLogs.length;j++){
              let infos =  this.balanceLogs[j]
              infos.OrderDetail = []
              for(let i =0; i<this.balanceDatail.length;i++){
                if(this.balanceDatail[i].Month == this.balanceLogs[j].Month){
                  infos.OrderDetail.push(this.balanceDatail[i])
                }
                this.$set(this.balanceLogs,j,this.balanceLogs[j])
              }
            }
            this.showFilter(false)
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
      arrForEach(arr){
        arr.forEach((item,index) =>{
          item.Month =item.Month.slice(0,7)
          item.Commissioin = item.InCome
          item.Expend =item.Expend.slice(1)
          item.OrderDetail.reverse()

        })
      },
      getTotalBalance () {
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
          this.datetime.date = time
          this.getBalanceLog(time)
        }
        this.num += 1
      },
      cellCliked(index,key){
        let item = this.balanceLogs[index].OrderDetail[key]
        if(item.TypeKey == 1){
          this.$router.push({path:'/userCrowdfundingDetailInfos',query:{orderId:item.OrderId,commissioin:item.Commissioin,type:1}})
        } else {
          let Id = ''
          if(item.TypeKey == 3){
            Id = item.ShoppingOrderId
          } else if(item.TypeKey == 2){
            Id = item.CashApplyId
          }
          this.$router.push({path:'/payDetailInfos',query:{orderId:Id,commissioin:item.Commissioin,typeName:item.TypeName,type:item.TypeKey,imgId:item.ImgId}})
        }
      },
      showFilter(type){
        this.show = type
      },
      typeClicked(index){
        let time  = this.datetime.date
        if(index == 0 ){
          this.getBalanceLog(time)
        } else {
          let value = this.type[index].Value
          this.getBalanceDetail(time,value)
        }
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
