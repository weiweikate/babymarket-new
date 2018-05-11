<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userCrowdfundingDetail scrollViewDiv">
        <v-user-crowdfunding-list  :crowdfoundingData="crowdfundingList" :inList="inList">
        </v-user-crowdfunding-list>
        <div class="lists">
          <v-award-cell-datepiker :datetime="datetime" @choose="choose"></v-award-cell-datepiker>
          <div v-for="(items,index) in crowdfundingMonthList" :key="index" >
            <v-award-cell-header :items="items"></v-award-cell-header>
            <v-award-cell-line v-for="(item,keys) in items.Detail" :key="keys" :datas="item" :index='index' :section='keys' @cellCliked="cellCliked"></v-award-cell-line>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../../base/topBar.vue'
  import VAwardCellDatepiker from '../../../base/award-cell-datepiker.vue'
  import VAwardCellLine from '../../../base/award-cell-line.vue'
  import VAwardCellHeader from '../../../base/award-cell-header.vue'
  import VUserCrowdfundingList from './cell/userCrowdfundingList.vue'
  import { _readURL, _MyRaiseCommissionMonthRead  } from '../../../../common/request.js'
  import { isLogin, reqUrl,getImgs} from '../../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的众筹'},
        userInfos: '',
        crowdfundingList:{},
        crowdfundingMonthList:'',
        inList:false,
        datetime:{endDate:'2018-04',date:''},
        num:0
      }
    },
    components: {
      VTopbar,
      VUserCrowdfundingList,
      VAwardCellDatepiker,
      VAwardCellLine,
      VAwardCellHeader
    },
    mounted: function () {
      this.getCrowdfundingLog()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.$route.query.json){
          this.crowdfundingList = JSON.parse(this.$route.query.json)
        } else {
          this.$router.push({path: '/userCrowdfunding'})
        }
        this.datetime.endDate = new Date().getFullYear() + '-' + (new Date().getMonth()+1)
      },
      getCrowdfundingLog (date) {
        this.getIsEntry()
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let RaiseId = this.crowdfundingList.Id
        let params = {"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${RaiseId} =='"+RaiseId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,'Order':"${Month} DESC","Operation": _MyRaiseCommissionMonthRead}
        if(date){
          params.Condition += date
        }
        this.axios.post(url,params).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total > 0){
            this.crowdfundingMonthList = res.data.Datas
            let self = this
            let monthDatasArray= {}
            this.crowdfundingMonthList.forEach((item,index) =>{
              item.Month = item.Month.slice(0,7)
              item.Detail.reverse()
              item.Detail.forEach((detail) =>{
                detail.Date =  detail.Date.slice(0,10)
                detail.TypeName = detail.BuyerName
                detail.ImgId = getImgs(detail.BuyerImgId)
                detail.IsExpend = 'False'
              })
            })
          } else {
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
      choose(time) {
        if(this.num>1){
          let date = " && ${Month} <= '"+time+"'"
          this.getCrowdfundingLog(date)
        }
        this.num += 1
      },
      cellCliked(index,key){
        let item = this.crowdfundingMonthList[index].Detail[key]
        this.$router.push({path:'/userCrowdfundingDetailInfos',query:{orderId:item.OrderId,commissioin:item.Commissioin,buyerName:item.BuyerName,type:0}})
      }
    }
  }
</script>
<style scoped>
  .userCrowdfundingDetail{
    text-align: left;
    font-size:.24rem ;
    color:#979797;
  }
  .lists{
    border-bottom: 1px solid #DCDCDC;
    position: relative;
  }
</style>
