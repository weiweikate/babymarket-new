<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userCrowdfundingDetail">
        <v-user-crowdfunding-list  :crowdfoundingData="crowdfundingList" :inList="inList">
        </v-user-crowdfunding-list>
        <div class="lists">
           <span class="timeDiv">
               <yd-datetime v-model="datetime.date" slot="right" type="month" :end-date="datetime.endDate" :callback="choose"></yd-datetime>
           </span>
          <div v-for="(items,index) in monthDatas" :key="index" >
            <div class="userCommissioin">
              <p>{{items.month}}</p>
              <p>收益：{{items.totalCommissioin}}</p>
            </div>
            <div class="crowdfoundingContent" v-for="(item,key) in items.detailArray" :key="key">
              <div>
               <router-link :to="{path:'/userCrowdfundingDetailInfos',query:{orderId:item.OrderId,commissioin:item.Commissioin,buyer:item.BuyerName}}">
                 <div class="fl">
                   <img v-lazy="item.BuyerImgId" alt=""/>
                 </div>
                 <div class="fr">
                   <p class="buyerName">
                     <span class="fl">{{item.BuyerName}}</span>
                     <span class="fr">+{{item.Commissioin}}元</span>
                   </p>
                   <p class="buyWhat">
                     <span class="fl">{{crowdfundingList.Name}}</span>
                     <span class="fr">{{item.Date}}</span>
                   </p>
                 </div>
               </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../../base/topBar.vue'
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
        monthDatas:[],
        monthSpliceArr:[],
        inList:false,
        datetime:{endDate:'',date:''}
      }
    },
    components: {
      VTopbar,
      VUserCrowdfundingList
    },
    mounted: function () {
      this.getCommissionLog()
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
      },
      getCommissionLog () {
        this.getIsEntry()
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let RaiseId = this.crowdfundingList.Id
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${RaiseId} =='"+RaiseId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,'Order':"${Month} DESC","Operation": _MyRaiseCommissionMonthRead}
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total > 0){
            this.crowdfundingMonthList = res.data.Datas[0]
          }
          let self = this
          let monthDatasArray= {}
          this.crowdfundingMonthList.Detail.forEach((detail) =>{
            detail.Month = detail.Month.slice(0,7)
            detail.Date =  detail.Date.slice(0,10)
            detail.Commissioin = Number(detail.Commissioin)
            detail.BuyerImgId = getImgs(detail.BuyerImgId)
            if(monthDatasArray[detail.Month] == undefined){
              let val = Number(detail.Month.slice(0,4)+detail.Month.slice(5,7))
              monthDatasArray[detail.Month]= {totalCommissioin:detail.Commissioin,detailArray:[detail],month:detail.Month,val:val}
            } else {
              monthDatasArray[detail.Month].totalCommissioin += detail.Commissioin
              monthDatasArray[detail.Month].detailArray.push(detail)
            }
          })
          // 将对象转化为数组
          for (let i in monthDatasArray) {
            this.monthDatas.unshift(monthDatasArray[i])
          }
          this.datetime= {endDate:this.monthDatas[0].month,date:this.monthDatas[0].month}
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      choose() {
        this.monthDatas =  this.monthSpliceArr.concat(this.monthDatas)
        let chooseTime = Number(this.datetime.date.slice(0,4)+this.datetime.date.slice(5,7))
        for(let i=0;i< this.monthDatas.length;i++){
          if(this.monthDatas[i].val <= chooseTime ){
            this.monthSpliceArr = this.monthDatas.splice(0,i)
            return
          }
        }
      }
    }
  }
</script>
<style>
  .timeDiv .yd-datetime-input{
    height: .5rem;
    font-size: 0px;
  }
</style>
<style scoped>
  .userCrowdfundingDetail{
    text-align: left;
    font-size:.24rem ;
    color:#979797;
  }
  .crowdfoundingContent{
     padding-left: .3rem;
     background: #fff;
  }
  .lists{
    border-bottom: 1px solid #DCDCDC;
    position: relative;
  }
  .lists>div>div:nth-child(2),.crowdfoundingContent>div{
    border-top: 1px solid #DCDCDC;
  }
  .lists>div>div:nth-child(2)>div{
    border-top:0
  }
  .crowdfoundingContent>div{
    overflow: hidden;
    padding: .3rem;
    padding-left: 0;
  }
  .crowdfoundingContent div.fl{
    width: .84rem;
    height: .84rem;
    border-radius: .84rem;
    overflow: hidden;
  }
  .crowdfoundingContent img{
    width: 100%;
  }
  .userCommissioin{
    height: 1.18rem;
    box-sizing: border-box;
    padding: .25rem .3rem;
    border-top: 1px solid #DCDCDC;
  }
  .userCommissioin p:first-child{
    color:#252525;
    font-weight: bold;
    font-size: .28rem;
  }
  .crowdfoundingContent div.fr{
    width:5.8rem;
  }
  .crowdfoundingContent div.fr .buyWhat,.crowdfoundingContent div.fr .buyerName{
    overflow: hidden;
  }
  .crowdfoundingContent div.fr .buyerName{
    font-size: .28rem;
    font-weight: bold;
    color:#252525;
    margin-bottom: .08rem;
  }
  .crowdfoundingContent div.fr .buyerName span.fr{
    font-size: .36rem;
  }
  .crowdfoundingContent div.fr .buyWhat span.fl{
    width: 3.18rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .timeDiv{
    width: .5rem;
    height: .5rem;
    background: url("../../../../img/rili.png") no-repeat left top;
    background-size:100% ;
    position: absolute;
    right: .3rem;
    top: .35rem;
  }
</style>
