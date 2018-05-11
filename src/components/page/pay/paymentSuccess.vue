<template>
  <!-- 支付成功页面-->
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr"  slot="navbar"></v-topbar>
      <div class="paymentResultPage scrollViewDiv">
        <div class="paysucc">
          <span>付款成功，打包发货中....</span>
        </div>
        <div class="orderInfo">
          <ul>
            <li>订单号：{{orderLists.orderId}}</li>
            <li>支付金额：{{orderLists.price}}</li>
            <li>支付方式：{{orderLists.way}}</li>
          </ul>
          <p>
            <router-link :to="{path:'/orderDetail',query:{Id:orderLists.Id}}">
              <span class="fl">查看订单</span>
            </router-link>
            <router-link :to="{path:'/index'}">
              <span class="fr">去逛逛</span>
            </router-link>
          </p>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  export default {
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '支付成功'},
        userInfos: '',
        writeUrl: '',
        orderLists:{Id:'',price:'',way:''}
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.orderLists = JSON.parse(window.sessionStorage.orderInfo)
    }
  }
</script>

<style scoped>
 .paysucc{
   height:2rem;
   line-height: 2rem;
   font-size: .36rem;
   background: #fff;
   margin-bottom: .2rem;
 }
 .paysucc span{
   padding-left: .46rem;
   background: url("../../../img/order.png") no-repeat left center;
   background-size: .35rem;
 }
 .orderInfo {
   padding:.4rem .24rem;
   background: #fff;
 }
 .orderInfo li{
   margin-bottom:.35rem;
   font-size: .28rem;
   text-align: left;
 }
 .orderInfo p{
    overflow: hidden;
  }
 .orderInfo p span{
    width:3.4rem;
    height: .72rem;
    line-height: .72rem;
    border:1px solid #ddd;
 }
</style>
