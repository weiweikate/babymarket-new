<template>
  <div style="height: 100%;background: #fff">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userCrowdfundingDetailInfos scrollViewDiv">
        <p v-if="queryString.type=='0'">回报明细</p>
        <p class="award" v-else>码头奖励</p>
        <div>
          <div class="raiseContent">
            <p class="raiseCommission clearFloat">
              <span class="fl">{{queryString.type=='0'? '回报金额':'奖励金额'}}</span>
              <span class="fr">¥ {{queryString.commissioin}}</span>
            </p>
            <ul class="clearFloat">
              <li  v-for="(raise,key) in raiseCommission" :key="key">
                {{queryString.type=='0'? raise.TypeName:raise.Type}}
                 :¥
                {{queryString.type=='0'? raise.Commissioin:raise.Commission}}
              </li>
            </ul>
            <div>
              <p class="buyerName clearFloat">
                <span class="fl">我的老友</span>
                <span class="fr">{{queryString.buyerName}}</span>
              </p>
              <div class="Product_Name">
                <p class="clearFloat">
                  <span class="fl">购买商品</span>
                  <span class="fr prdShowname">{{orderList.Product_Name}}</span>
                </p>
                <p class="clearFloat">
                  <span class="fr">数量:{{orderList.Qnty}}</span>
                </p>
              </div>
              <p class="arriveTime clearFloat" v-if="queryString.type=='0'">
                <span class="fl">确认收货时间</span>
                <span class="fr">{{orderList.Date}}</span>
              </p>
              <div class="awardDiv" v-else>
                <p class="arriveTime clearFloat">
                  <span class="fl">{{queryString.type=='1'? '资产生成时间':'奖励生产时间'}}</span>
                  <span class="fr">{{raiseCommission[0].CreateTime}}</span>
                </p>
                <p class="arriveTime clearFloat">
                  <span class="fl">{{queryString.type=='1'? '资产到账时间':'奖励到账时间'}}</span>
                  <span class="fr">{{raiseCommission[0].ConfirmDate}}</span>
                </p>
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
  import { _readURL, _orderDetail,_MyRaiseCommission,_commissionRead  } from '../../../../common/request.js'
  import { isLogin, reqUrl,getImgs} from '../../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的众筹奖励明细'},
        userInfos: '',
        queryString:{},
        orderList:{},
        totalCommission:'',
        raiseCommission:[{}],
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getMyRaiseLineRead()
      this.getMyRaiseCommission()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.$route.query.orderId){
          this.queryString = this.$route.query
          let name = ''
          if(this.queryString.type == 0){
            name = '众筹奖励明细'
          } else if(this.queryString.type == 1){
            name = '资产明细'
          } else {
            name = '奖励明细'
          }
          this.titleAttr.name = name
        } else {
          this.$router.push({path: '/index'})
        }
      },
      getMyRaiseLineRead () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${OrderId} == '"+this.queryString.orderId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _orderDetail }
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total>0){
            this.orderList = res.data.Datas[0]
            this.orderList.Date = this.orderList.Date.slice(0,10)
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getMyRaiseCommission(){
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        // 判断从哪个路口进来的 0是众筹 1是资产 2是奖励
        let type = this.queryString.type
        let opt = (type == '0'?  _MyRaiseCommission: _commissionRead)
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${OrderId} =='"+this.queryString.orderId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": opt }
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total>0){
            this.raiseCommission = res.data.Datas
            if(type != 0){
              this.queryString.buyerName = this.raiseCommission[0].BuyerName
//              this.raiseCommission.forEach((item) =>{
//                item.CreateTime = item.CreateTime.slice(0,10)
//                item.ConfirmDate = item.ConfirmDate.slice(0,10)
//              })
            }
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
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
  .userCrowdfundingDetailInfos{
    text-align: left;
    font-size: .26rem;
    color: #979797;
  }
  .userCrowdfundingDetailInfos>p,.raiseCommission span.fr{
    color:#252525 ;
    font-weight: bold;
  }
  .userCrowdfundingDetailInfos>p{
    height:1.04rem;
    line-height: .6rem;
    padding:.28rem;
    padding-left:1rem ;
    font-size:.34rem;
    background: url("../../../../img/award.png") no-repeat .28rem .2rem;
    background-size:.62rem .62rem;
    border-bottom: 1px solid #DCDCDC;
  }
  .userCrowdfundingDetailInfos>p.award{
    background: url("../../../../img/my-award-active-icon.png") no-repeat .28rem .2rem;
    background-size:.62rem .62rem;
  }
  .userCrowdfundingDetailInfos>div{
    background:#F6F6F6;
    padding-top: .4rem;
  }
  .raiseContent{
    background: #fff;
    border-top: 1px solid #DCDCDC;
  }
  .raiseContent ul,.raiseCommission,.buyerName,.arriveTime{
    margin: 0 .28rem;
  }
  .raiseCommission{
    padding-top: .34rem;
    font-size: .3rem;
    margin-bottom: .15rem;
  }
  .raiseCommission span.fr{
    font-size: .46rem;
  }
  .raiseContent ul li{
    float: left;
    color: #96661B;
    font-size:.2rem ;
    padding:.06rem .1rem;
    border: 1px solid;
    margin-right: .2rem;
    border-radius:.05rem;
    margin-bottom: .06rem;
  }
  .raiseContent ul{
    padding-bottom: .5rem;
    margin-right: 0;
    border-bottom: 1px solid #DCDCDC;
  }
  .buyerName{
    padding: .3rem 0;
  }
  .Product_Name{
    background:#F6F6F6;
    padding:.2rem .28rem;
  }
  .Product_Name span.fr{
    font-size: .22rem;
    text-align: right;
  }
  .arriveTime{
    padding: .28rem .28rem;
    margin: 0;
    border-bottom: 1px solid #DCDCDC;
  }
  .prdShowname{
    width: 4.18rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
  }
  .awardDiv>p.arriveTime{
    padding: .1rem .28rem;
  }
  .awardDiv>p.arriveTime:first-child{
    border: 0;

  }
</style>
