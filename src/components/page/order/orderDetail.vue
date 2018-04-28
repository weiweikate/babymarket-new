<template>
  <!-- 订单详情页-->
  <div style="height: 100%">
    <yd-layout >
      <div class="orderDetailPage">
        <div class="orderDetail" v-show="showItems[0]">
          <v-topbar :title="titleAttr"  slot="navbar"></v-topbar>
          <!-- 收货地址-->
          <div class="address">
            <p>
              <span class="fl">{{orderLists.Consignee}}</span>
              <span class="fr">{{orderLists.Mobile}}</span>
            </p>
            <div class="addressInfo">
              {{orderLists.Address}}
            </div>
          </div>
          <!-- 支付金额-->
          <!--<div class="orderPrice">-->
            <!--支付金额：¥ {{orderLists.Money}}-->
          <!--</div>-->
          <!--<div v-if="orderLists.StatusKey>1&&orderLists.StatusKey<6" class="pLogistics" @click.prevent="showDiv">-->
            <!--<yd-icon name="location" size=".5rem"></yd-icon>-->
            <!--{{logistics}}-->
          <!--</div>-->
          <!-- 产品明细-->
          <div v-for="( prdList, index) in orderLists.Line" :key="index">
            <div class="orderStatusP">
              <span class="fl">{{prdList.WarehouseName}}</span>
              <span class="fr">{{orderStatus}}</span>
            </div>
            <div class="productInfo">
              <yd-flexbox>
                <img :src="getPic(prdList.ImgId)" class="demo-checklist-img">
                <yd-flexbox-item align="top">
                  <p>{{prdList.Product_ShowName}}</p>
                  <span>{{prdList.S_Name}}</span>
                </yd-flexbox-item>
                <div class="items">
                  <p>¥ {{prdList.Price}}</p>
                  <span>×{{prdList.Qnty}}</span>
                </div>
              </yd-flexbox>
            </div>
          </div>
          <!-- 支付明细-->
          <div class="pay">
            <!--<p>结算</p>-->
            <ul >
              <li>
                <span class="fl">应付总额</span>
                <span class="fr">¥ {{orderLists.Due}}</span>
              </li>
              <li>
                <span class="fl">商品总价</span>
                <span class="fr">¥ {{orderLists.Money}}</span>
              </li>
              <li>
                <span class="fl">运费</span>
                <span class="fr">¥ {{orderLists.Discount}}</span>
              </li>
              <li>
                <span class="fl">税费</span>
                <span class="fr">¥ {{orderLists.Tax}}</span>
              </li>
              <li>
                <span class="fl">优惠卷</span>
                <span class="fr">- ¥ {{orderLists.Discount}}</span>
              </li>
              <li>
                <span class="fl">已省金额</span>
                <span class="fr">- ¥ {{orderLists.BuyerCommission}}</span>
              </li>
            </ul>
          </div>
          <!-- 订单状态-->
          <div class="orderStatus">
            <p>订单号：<span>{{orderLists.OrderNo}}</span></p>
            <p>订单方式：<span>{{orderLists.PaywayName?  ('¥ '+orderLists.PaywayName):'第三方付款'}}</span></p>
            <p>下单时间：<span>{{orderLists.Modify}}</span></p>
            <p>买家留言：<span>{{orderLists.Remark? orderLists.Remark:'无'}}</span></p>
            <p v-if="orderLists.StatusKey ==0">{{time}}</p>
          </div>
          <!-- 联系客服-->
          <div class="callUs">
            <p>服务时间：9:00 - 22:00 </p>
            <p><span class="btn"><a href="tel://4006286698">电话联系客服</a></span></p>
          </div>
          <div class="spanBtnDiv">
            <!--<span class="btn" v-if="Number(orderLists.StatusKey) != 6 && Number(orderLists.StatusKey) != 9">-->
              <!--<a href="tel://4006286698">联系客服</a>-->
            <!--</span>-->
            <div>
              <p class="fl">实付：¥ {{orderLists.Due}}</p>
              <p class="fr">
                <span class="btn" v-if="Number(orderLists.StatusKey) ==0 " @click.prevent="cancelOrder">取消订单</span>
                <span class="btn" v-if="Number(orderLists.StatusKey) == 6 || Number(orderLists.StatusKey) == 8" @click.prevent="deleteOrder">删除订单</span>
                <router-link :to="{path:'/payment',query:{Id:orderLists.Id}}">
                  <span class="btn" v-if="Number(orderLists.StatusKey) ==0 " >立即付款</span>
                </router-link>
                <span class="btn" v-if="Number(orderLists.StatusKey) ==2 " @click.prevent="arrivalOrder()">确认收货</span>
                <span class="btn" v-if="Number(orderLists.StatusKey) >1 &&Number(orderLists.StatusKey) <6 " @click.prevent="showDiv">查看物流</span>
              </p>
            </div>
          </div>
        </div>
        <div v-show="showItems[1]" v-if="orderLists.StatusKey>1&&orderLists.StatusKey<6">
          <v-order-logistics ref="logistics" v-on:back="makeSure" v-on:logisticsCallback="logisticsCallback"></v-order-logistics>
        </div>
      </div>
    </yd-layout>

  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VOrderLogistics from './orderLogistics.vue'
  import { isLogin, getImgs, reqUrl,ordersStatus,formatTime } from '../../../common/index.js'
  import { _readURL, _writeURL, _comfrimOrder,_cancelOrder,_arrivalOrder,_deleteOrder,_refundReadOperation } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '订单详情'},
        userInfos: '',
        writeUrl: '',
        orderId:'',// 订单编号
        orderLists:'',// 订单明细
        orderStatus: {name:'',res:''}, // 订单状态
        time:'',
        endTime:'',
        logistics: '', // 物流信息
        showItems:[true,false], // 0.订单详情 1.物流信息
        refund:false // 是否是退换货订单
      }
    },
    components: {
      VTopbar,
      VOrderLogistics
    },
    mounted: function () {
      this.getIsEntry()
      this.getOrderInfos()
    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        if (this.userInfos.login) {
          this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
        }
        this.orderId = this.$route.query.Id
      },
      getOrderInfos () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+this.orderId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation":_comfrimOrder}
        ).then((res) => {
          this.orderLists = res.data.Datas[0]
          this.orderStatusKey(Number(this.orderLists.StatusKey))
          // 如果是待付款的状态那么开始请求倒计时
          if (this.orderLists.StatusKey == 0) {
            this.timeOut(this.orderLists.CreateTime,this.time )
          } else if (this.orderLists.StatusKey > 0 && this.orderLists.StatusKey<6){
//            this.$nextTick(() => {
//              this.$refs.logistics.getLogistics(this.orderLists)
//            })
          }
          this.$dialog.loading.close()
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      cancelOrder () {
        // 取消订单
        let url = this.writeUrl
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '确定取消这个订单吗',
          opts: () => {
            let time0 = formatTime()
            this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"StatusKey":"6","Cancel_DateTime":time0},"Status":"Existed"},"ModifyOperationId": _cancelOrder}]}
            ).then((res) => {
                if(JSON.stringify(res.data) == "{}"){
                  this.$router.push({path:'/userOrders'})
                }
              }).catch((err) => {
                this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
              })
          }
        })
      },
      arrivalOrder () {
        // 确认到货
        let url = this.writeUrl
        let time0 = formatTime()
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '是否确认到货',
          opts: () => {
            this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"StatusKey":"3","Confirm_DateTime":time0},"Status":"Existed"},"ModifyOperationId": _arrivalOrder}]}
            ).then((res) => {
                if(JSON.stringify(res.data) == "{}"){
                  this.$router.push({path:'/userOrders'})
                }
              }).catch((err) => {
                this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
              })
          }
        })
      },
      deleteOrder () {
        // 删除订单
        let url = this.writeUrl
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '确定删除这个订单吗',
          opts: () => {
            this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"Delete":"True"},"Status":"Existed"},"DeleteOperation":_deleteOrder}]}
            ).then((res) => {
                if(JSON.stringify(res.data) == "{}"){
                  this.$router.push({path:'/userOrders'})
                }
              }).catch((err) => {

                this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
              })
          }
        })
      },
      orderStatusKey (n) {
       // 判断订单状态
        this.orderStatus = ordersStatus(n)
      },
      getPic(id){
        return getImgs(id)
      },
      logisticsCallback (obj) {
        this.logistics = obj.remark
      },
      showDiv () {
        this.$refs.logistics.getLogistics(this.orderLists)
        this.showItems = [false,true]
      },
      makeSure () {
        this.showItems = [true,false]
      },
      timeOut (time) {
        if (time) {
          let date = new Date(time.replace("-","/"))
          let b = 30 // 30分钟
          date.setMinutes(date.getMinutes() + b, date.getSeconds(), 0)
          this.endTime = new Date(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours()+ ":" + date.getMinutes()+ ":" + date.getSeconds())
        }
        let end = this.endTime.getTime()
        // 获取当前时间
        let nowTime = new Date()
        let now  = nowTime.getTime()
        // 时间差
        var dd,hh,mm,ss
        let leftTime = end-now
        if (leftTime>=0) {
          dd = Math.floor(leftTime/1000/60/60/24)
          hh = Math.floor(leftTime/1000/60/60%24)
          mm = Math.floor(leftTime/1000/60%60)
          ss = Math.floor(leftTime/1000%60)
          dd = dd<10?("0" + dd):dd  //天
          hh = hh<10?("0" + hh):hh   //时
          mm = mm<10?("0" + mm):mm   //分
          ss = ss<10?("0" + ss):ss;  //秒
        } else {
          orderLists.StatusKey = 6
          return
        }
        setTimeout(this.timeOut,1000)
        this.time =(" 剩余 "+mm+" 分钟"+ss+" 秒关闭订单，请抓紧时间支付")
      }
    }
  }
</script>

<style scoped>
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
