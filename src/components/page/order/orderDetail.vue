<template>
  <!-- 订单详情页-->
  <div style="height: 100%">
    <yd-layout >
      <div class="orderDetailPage">
        <div class="orderDetail" v-show="showItems[0]">
          <v-topbar :title="titleAttr"  slot="navbar"></v-topbar>
          <!-- 订单状态-->
          <div class="orderStatus">
            <p>订单状态：{{orderStatus}}</p>
            <p>订单号：{{orderLists.OrderNo}}</p>
            <p v-if="orderLists.StatusKey ==0">{{time}}</p>
            <p v-if="orderLists.StatusKey ==6">原因：支付超时</p>
          </div>
          <!-- 支付金额-->
          <div class="orderPrice">
            支付金额：{{orderLists.Money}}
          </div>
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
          <div v-if="orderLists.StatusKey>1&&orderLists.StatusKey<6" class="pLogistics" @click.prevent="showDiv">
            <yd-icon name="location" size=".5rem"></yd-icon>
            {{logistics}}
          </div>
          <p style="margin-bottom:.18rem">{{orderLists.WarehouseName}}</p>
          <!-- 产品明细-->
          <div>
            <div class="productInfo" v-for="( prdList, index) in orderLists.Line" :key="index">
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
            <p>结算</p>
            <ul>
              <li>
                <span class="fl">商品总额</span>
                <span class="fr">¥ {{orderLists.Money}}</span>
              </li>
              <li>
                <span class="fl">优惠卷</span>
                <span class="fr">¥ {{orderLists.Discount}}</span>
              </li>
              <li>
                <span class="fl">物流费用</span>
                <span class="fr">¥ {{orderLists.Discount}}</span>
              </li>
              <li>
                <span class="fl">关税</span>
                <span class="fr">¥ {{orderLists.Tax}}</span>
              </li>
              <li>
                <span class="fl">支付方式</span>
                <span class="fr">¥ {{orderLists.PaywayName}}</span>
              </li>
              <li>
                <span class="fl">已省金额</span>
                <span class="fr">¥ {{orderLists.BuyerCommission}}</span>
              </li>
              <li>
                <span class="fl">应付总额</span>
                <span class="fr">¥ {{orderLists.Due}}</span>
              </li>
            </ul>
          </div>
          <div class="spanBtnDiv">
            <span class="btn" v-if="Number(orderLists.StatusKey) != 6 && Number(orderLists.StatusKey) != 9">
          <a href="tel://4006286698">联系客服</a>
        </span>
            <span class="btn" v-if="Number(orderLists.StatusKey) >1 &&Number(orderLists.StatusKey) <6 " @click.prevent="showDiv">查看物流</span>
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
  import { isLogin, getImgs, reqUrl,ordersStatus } from '../../../common/index.js'
  import { _readURL, _writeURL, _comfrimOrder } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '订单详情页'},
        userInfos: '',
        writeUrl: '',
        orderId:'',// 订单编号
        orderLists:'',// 订单明细
        orderStatus: {name:'',res:''}, // 订单状态
        time:'',
        endTime:'',
        logistics: '', // 物流信息
        showItems:[true,false] // 0.订单详情 1.物流信息
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
            this.$nextTick(() => {
              this.$refs.logistics.getLogistics(this.orderLists)
            })
          }
          this.$dialog.loading.close()
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
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
  .orderDetail>p{
    padding:0 .24rem;
  }
  .payLists ul li{
    overflow: hidden;
  }
  .orderStatus>p{
    margin-bottom: .08rem;
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
  }
  .spanBtnDiv span.btn{
    display: inline-block;
    width:1.5rem;
    height: .5rem;
    line-height: .5rem;
    text-align: center;
    margin-right:.14rem;
    border-radius: .3rem;
    border: 1px solid #b0b1b3;
    font-size: .28rem;
    margin-top: .32rem;
    background: #fff;
  }
  .orderDetailPage #scrollView>div{
    margin-top: 0;
  }
</style>
