<template>
  <!-- 订单详情页-->
  <div style="height: 100%">
    <yd-layout >
      <div class="orderDetailPage">
        <div class="orderDetail">
          <v-topbar :title="titleAttr"  slot="navbar"></v-topbar>
          <!-- 收货地址-->
          <div class="address">
            <p>
              <span class="fl">{{orderLists.StatusText}}</span>
              <!--<span class="fr">{{orderLists.Mobile}}</span>-->
            </p>
            <div class="addressInfo">
              {{orderLists.CreateTime}}
            </div>
          </div>
          <div >
            <div class="orderStatusP">
              <span class="fl">退款信息</span>
            </div>
            <div class="productInfo" v-for="( prdList, index) in orderLists.Detail" :key="index">
              <yd-flexbox>
                <img :src="getPic(prdList.ImgId)" class="demo-checklist-img">
                <yd-flexbox-item align="top">
                  <p>{{prdList.ProductName}}</p>
                  <span>{{prdList.ProductSize}}</span>
                </yd-flexbox-item>
                <div class="items">
                  <p>¥ {{prdList.Qnty}}</p>
                  <span>×{{prdList.Price}}</span>
                </div>
              </yd-flexbox>
            </div>
          </div>
          <!-- 支付明细-->
          <div class="pay">
            <ul>
              <li>
                <span class="fl">退款总金</span>
                <span class="fr">¥ {{orderLists.Money}}</span>
              </li>
              <li>
                <span class="fl"> {{parseFloat(orderLists.Balance)>0 ? '我的资产':'支付宝'}}</span>
                <span class="fr">¥ {{parseFloat(orderLists.Balance)>0? orderLists.Balance : orderLists.AlipayBalance}}</span>
              </li>
              <li>
                <span class="fl">优惠卷</span>
                <span class="fr"> ¥ {{orderLists.Coupon}}</span>
              </li>
              <li>
                <span class="fl">税费</span>
                <span class="fr">¥ {{orderLists.TaxBalance}}</span>
              </li>
            </ul>
          </div>
          <!-- 退款订单-->
          <div class="orderStatus" >
            <p>退款原因：<span>{{orderLists.ReasonText}}</span></p>
            <p>订单编号：<span>{{orderLists.OrderNumber}}</span></p>
            <p>申请时间：<span>{{orderLists.CreateTime}}</span></p>
            <p>退款编号：<span>{{orderLists.SerialNumber}}</span></p>
          </div>
          <!-- 联系客服-->
          <div class="callUs">
            <p>服务时间：9:00 - 22:00 </p>
            <p><span class="btn"><a href="tel://4006286698">电话联系客服</a></span></p>
          </div>
        </div>
      </div>
    </yd-layout>

  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VOrderLogistics from './orderLogistics.vue'
  import { isLogin, getImgs, reqUrl,ordersStatus,formatTime } from '../../../common/index.js'
  import { _readURL,_refundReadOperation } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '退款详情'},
        userInfos: '',
        writeUrl: '',
        orderId:'',// 订单编号
        orderLists:'',// 订单明细
      }
    },
    components: {
      VTopbar,
        VOrderLogistics
    },
    mounted: function () {
      this.getIsEntry()
      this.getOrderRefoud()
    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        this.orderId = this.$route.query.Id
      },
      getOrderRefoud(){
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${Id} == '" + this.orderId + "'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation":_refundReadOperation}
        ).then((res) => {
            this.$dialog.loading.close()
            if(res.data.Total>0){
              this.orderLists = res.data.Datas[0]
              this.orderLists.AlipayBalance = 0
              this.orderLists.Coupon = 0
              this.orderLists.TaxBalance = 0
              this.orderLists.Detail.forEach((item, index) => {
                this.orderLists.AlipayBalance += Number(item.AlipayBalance)
                this.orderLists.Coupon += Number(item.Coupon)
                this.orderLists.TaxBalance += Number(item.TaxBalance)
              })
            }
          }).catch((err) => {
            this.$dialog.loading.close()
            this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
          })
      },
      getPic(id){
        return getImgs(id)
      }
    }
  }
</script>

<style scoped>
  .orderDetail .productInfo{
    margin-bottom: 0;
  }
  .orderDetail .productInfo:last-child{
    margin-bottom:.2rem;
  }
  .orderDetailPage{
    text-align: left;
    font-size: .28rem;
  }
  .orderStatus,.orderPrice{
    background:#fff;
    padding: .26rem .24rem;
    margin-bottom: .2rem;
  }
  .orderStatus span{
    color: #515151;
  }
  .orderDetail>p{
    padding:0 .24rem;
  }
  .payLists ul li{
    overflow: hidden;
  }
  .orderStatus>p{
    margin-bottom: .08rem;
    color: #979797;
  }
  .pLogistics{
    position: relative;
    padding:.3rem .55rem .4rem .75rem;
    background: #fff;
    margin-bottom: .2rem;
    color:#715329;
  }
  .pLogistics .yd-icon-location{
    font-size: 0.5rem;
    position: absolute;
    left: .1rem;
    top: 34%;
    color: #c9c9c9;
  }
  .spanBtnDiv{
    text-align: right;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    z-index: 100;
    padding-top: .15rem;
    background: #f5f5f5;
  }
  .spanBtnDiv>div{
    height: 1rem;
    line-height: 1rem;
    color: #C7AF7E;
    font-size: .28rem;
    padding: 0 .24rem;
    background: #fff;
    box-sizing: border-box;
  }
  .spanBtnDiv span.btn,.callUs span.btn{
    display: inline-block;
    width:1.5rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    margin-right:.14rem;
    border-radius: .09rem;
    border: 1px solid #b0b1b3;
    font-size: .28rem;
    margin-top: .2rem;
    background: #fff;
    color:#515151;
  }
  .orderDetailPage #scrollView>div{
    margin-top: 0;
  }
  .pay ul{
    margin-bottom:.18rem;
    color: #979797;
    padding-left: .2rem;
    background: #fff;
  }
  .pay ul li:first-child{
    color: #252525;
  }
  .pay ul li:first-child span.fr{
    color: #C7AF7E;
  }
  .orderDetail .orderStatusP{
    overflow: hidden;
    padding: .2rem;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
  }
  .orderStatusP span.fr{
    color:#AF383A;
  }
  .callUs{
    background: #fff;
    padding: .24rem;
  }
  .callUs span.btn{
    width:3.35rem ;
  }
</style>
