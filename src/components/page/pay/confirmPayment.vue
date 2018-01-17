<template>
  <!-- 确认支付-->
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="orderPage">
        <div class="order">
          <span>订单已提交</span>
          <p>(请在30分钟内完成支付)</p>
        </div>
        <div class="orderInfo">
          <p >订单号：{{orderLists.OrderNo}}</p>
          <p class="orderPrice">订单金额：¥ {{orderLists.Money}}</p>
        </div>
        <div class="payInfo">
          <p>支付明细</p>
          <ul class="payPrice">
            <li>优惠卷：¥ {{parseFloat(orderLists.Discount).toFixed(2)}} </li>
            <li>余额支付：¥ {{parseFloat(orderLists.Money2).toFixed(2)}} </li>
            <li>支付宝支付：¥ {{parseFloat(orderLists.Due).toFixed(2)}} </li>
          </ul>
          <div class="payWay" v-if="orderLists.Due!= '0'">
            <span>支付宝支付</span>
          </div>
        </div>
      </div>
      <div class="payBtn" slot="tabbar">
        <button @click="payOrder">确认支付</button>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL, _comfrimOrder, _baseUrl,_modifyOrder } from '../../../common/request.js'
  import { isLogin, getImgs, reqUrl } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '确认支付'},
        userInfos: '',
        writeUrl: '',
        orderId:'', // 订单编号
        orderLists: '', // 订单信息
        payWay: '', // 支付方式
        orderStatus:0, // 订单状态 6为关闭
        payBtnClick: false // 是否点击了确认支付按钮
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getOrderInfos()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        }
        // 页面生成时候 清空 订单session 交易关闭时候返回此页面
        window.sessionStorage.orderInfo = ''
      },
      getOrderInfos () {
        this.orderId = this.$route.query.Id
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+this.orderId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation":_comfrimOrder}
        ).then((res) => {
          this.$dialog.loading.open('请稍后')
          this.orderLists = res.data.Datas[0]
          this.orderStatus = res.data.Datas[0].StatusKey
          // 如果订单状态不是6关闭 而且点击了支付按钮 那么开始支付
          if(this.payBtnClick && this.orderStatus != '6') {
            window.sessionStorage.orderInfo = JSON.stringify({Id:this.orderId,orderId:this.orderLists.OrderNo,price:this.orderLists.Due,way:'支付宝支付'})
            // 如何应付金额大于0 那么打开支付支付 否则 告诉系统支付状态
            if( Number(this.orderLists.Due)>0 ) {
              location.href = _baseUrl+"/pay.aspx?Id="+this.orderId
            } else {
              this.useOtherPayWay()
            }
          } else if (this.orderStatus == '6') {
            this.$dialog.toast({mes: '订单已经超时', timeout: 1500})
            this.$router.push({path:'/index'})
          }
          this.$dialog.loading.close()
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      payOrder () {
        this.payBtnClick = true
        this.getOrderInfos()
      },
      useOtherPayWay () {
        this.$dialog.loading.open('正在支付中')
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"Paid":'True',"StatusKey":"1","Delete":"False",'Target':'1'},"Status":"Existed"},"ModifyOperationId":_modifyOrder}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            if (Number(this.orderLists.Money2)>0) {
              window.sessionStorage.orderInfo = JSON.stringify({Id:this.orderId,orderId:this.orderLists.OrderNo,price:this.orderLists.Money2,way:'余额支付'})
            } else {
              window.sessionStorage.orderInfo = JSON.stringify({Id:this.orderId,orderId:this.orderLists.OrderNo,price:this.orderLists.Money,way:'优惠卷'})
            }
            this.$dialog.loading.close()
            this.$router.push({path:'/paymentResult'})
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>

<style scoped>
  .orderPage{
    color: #636262;
    font-size: .28rem;
  }
  .order,.orderInfo,.payInfo {
    margin-bottom:.2rem;
    background: #fff;
    text-align: left;
    padding: .2rem .3rem;
  }
  .order{
    height: 2rem;
    padding-top:.55rem;
    padding-bottom: .25rem;
    text-align: center;
  }
  .order span{
    display: inline-block;
    padding-left: .5rem;
    background: url("../../../img/order.png") no-repeat left center;
    background-size:.34rem;
    font-size:.36rem;
    color: #000;
  }
  .order p,.orderPrice,.payPrice li{
    margin-top: .12rem;
  }
  .payInfo p{
    border-bottom: 1px solid #efefef;
    padding-bottom: .18rem;
  }
  .payBtn button{
    display: inline-block;
    width:92%;
    height:.8rem;
    line-height:.8rem;
    color: #fff;
    background: #715329;
    border-radius:.15rem;
    font-size: .34rem;
    border:0;
  }
  .payBtn{
    background:#fff;
    position: fixed;
    bottom:0;
    left: 0;
    width: 100%;
    z-index:999;
  }
  .payWay{
    margin-top: .15rem;
    height: .65rem;
    line-height: .65rem;
    background: url("../../../img/zhifubao.png") no-repeat left center;
    background-size:.65rem;
    padding-left: .9rem;
  }
  .payWay span{
    display: inline-block;
    width: 100%;
    background: url("../../../img/pay_c.png") no-repeat right center;
    background-size: .32rem;
  }
</style>
