<template>
  <!-- 订单提交确认页面-->
  <div style="height:100%">
    <yd-layout >
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="confirmOrder">
        <div class="orderDetail">
          <div class="address">
            <p>
              <span class="fl">{{orderLists.Consignee}}</span>
              <span class="fr">{{orderLists.Mobile}}</span>
            </p>
            <router-link :to="{path:'receivingAddress',query:{from:'/confirmOrder',Id:orderId}}">
              <div class="addressInfo">
                {{orderLists.Address}}
              </div>
            </router-link>
          </div>
          <!-- 产品明细-->
          <div>
            <div class="productInfo" v-for="( prdList, index) in prdLists" :key="index">
              <yd-flexbox>
                <img :src="getPic(prdList.img)" class="demo-checklist-img">
                <yd-flexbox-item align="top">
                  <p>{{prdList.prdName}}</p>
                  <span>{{prdList.type}}</span>
                </yd-flexbox-item>
                <div class="items">
                  <p>¥ {{prdList.price}}</p>
                  <span>×{{prdList.pcs}}</span>
                </div>
              </yd-flexbox>
            </div>
          </div>
          <!-- 优惠卷-->
          <div>
            <router-link :to="{path:'/coupons',query:{from:'/confirmOrder',Id:orderId,num:orderLists.Total,couponId:orderLists.CouponId}}">
              <yd-cell-group>
                <yd-cell-item arrow >
                  <span slot="left">优惠卷</span>
                  <span slot="right" v-if="!couponNum && (orderLists.Coupon_Number == '')" style="color:#acadaa">您没有可用的优惠卷</span>
                  <span slot="right" v-if="couponNum" style="color:#af8327">{{orderLists.Coupon_Number != ""? '您已使用优惠卷' :'您有'+ couponNum +'张可用优惠卷'}}</span>
                </yd-cell-item>
              </yd-cell-group>
            </router-link>
          </div>
          <!-- 结算明细-->
          <div class="pay">
            <p >结算</p>
            <ul>
              <li>
                <span class="fl">商品合计</span>
                <span class="fr">¥ {{parseFloat(orderLists.Total).toFixed(2)}}</span>
              </li>
              <li >
                <span class="fl">优惠</span>
                <span class="fr">¥ {{parseFloat(orderLists.Discount).toFixed(2)}}</span>
              </li>
              <li>
                <span class="fl">运费</span>
                <span class="fr">¥ {{parseFloat(orderLists.ExpressSum).toFixed(2)}}</span>
              </li>
              <li>
                <span class="fl">已省金额</span>
                <span class="fr">¥ {{parseFloat(orderLists.BuyerCommission).toFixed(2)}}</span>
              </li>
              <li>
                <span class="fl">应付总额</span>
                <span class="fr">¥ {{parseFloat(orderLists.Due).toFixed(2)}}</span>
              </li>
              <li>
                <span class="fl">使用钱包 <span style="color: red">{{orderLists.Balance=='0'? '...':orderLists.Balance+'元'}}</span></span>
                <span class="fr" ><yd-switch color='#af8327' :disabled="switchdisabled" v-model="balanceSwitch"></yd-switch></span>
              </li>
              <li>
                <yd-flexbox>
                  <span class="fl">买家留言:</span>
                  <yd-flexbox-item><input type="text" class="leavingMes" v-model="leavingMes" placeholder="选填：对本次交易的说明"/></yd-flexbox-item>
                </yd-flexbox>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <!-- 结算金额-->
      <div class="amount" slot="tabbar">
        <span class="fl">实付： <span class="payMoney">¥ {{parseFloat(orderLists.Due).toFixed(2)}}</span></span>
        <span class="fr payBtn" @click.prevent="comfirmOrder">提交订单</span>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL, _comfrimOrder,_coupons,_modifyOrder } from '../../../common/request.js'
  import { isLogin, getImgs, reqUrl, getUUID, getTimes } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '订单确认'},
        userInfos: '',
        writeUrl: '',
        orderId:'',// 订单编号
        prdLists: [], // 产品明细
        orderLists: '', // 支付信息
        couponShow: false,  // 显示是否有优惠卷
        couponNum: 0, // 可用优惠卷
        balanceSwitch: false, // 是否使用钱包余额
        switchdisabled:true, // 钱包开关是否都能点击
        leavingMes: '', // 买家留言
        Delivery_AddressId: '', // 收货人信息
        CouponId: '', // 优惠卷号码
      }
    },
    watch: {
      balanceSwitch:'useBalance'
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.orderId = this.$route.query.orderId
      this.getIsEntry()
      if(window.sessionStorage.comfirmOrderInfo){
        this.orderLists = JSON.parse(unescape(window.sessionStorage.comfirmOrderInfo))
        this.isSwitchDisabled()
      } else {
        this.getOrderInfos()
      }
      this.prdInfos()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        }
      },
      prdInfos() {
        this.prdLists = JSON.parse(window.sessionStorage.buyPrd)
      },
      getOrderInfos () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+this.orderId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation":_comfrimOrder}
        ).then((res) => {
          this.orderLists = res.data.Datas[0]
          this.isSwitchDisabled()
          // 获取优惠卷
          if (this.couponNum == 0) {
            this.getCoupons()
          }
          window.sessionStorage.comfirmOrderInfo = escape(JSON.stringify(this.orderLists))
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getCoupons () {
        // 获取优惠卷
        this.couponNum = 0
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation":_coupons}
        ).then((res) => {
          this.$dialog.loading.close()
          let arr = res.data.Datas
          for(let i=0;i<arr.length;i++) {
            // 产品金额大于优惠卷的使用条件 且优惠卷没使用未过期
            if((Number(arr[i].Min_Money)<this.orderLists.Money) && (arr[i].Overdue == 'False') && (arr[i].Used == 'False')){
              this.couponNum += 1
            }
          }
          this.couponShow = true
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      useBalance () {
        let url = this.writeUrl
        let isUse = String(this.balanceSwitch)
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"UseBalance":isUse,"Delete":"False"},"Status":"Existed"},"ModifyOperationId":_modifyOrder}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.getOrderInfos()
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      comfirmOrder () {
        this.$dialog.loading.open('正在提交订单...')
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.orderId,"Formal":'True',"Remark":this.leavingMes,"Delete":"False"},"Status":"Existed"},"ModifyOperationId":_modifyOrder}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.loading.close()
            this.$router.push({path:'/payment',query:{Id:this.orderId}})
          }
          // location.href = _baseUrl+"/pay.aspx?Id="+this.orderId
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getPic (id) {
        return getImgs(id)
      },
      isSwitchDisabled () {
        if(Number(this.orderLists.Balance)> 0) {
          this.switchdisabled =false
        }
        if(this.orderLists.UseBalance === 'True') {
          this.balanceSwitch = true
        }
      }
    },
    destroyed () {
      window.sessionStorage.removeItem('comfirmOrderInfo')
    }
  }
</script>
<style>
  .confirmOrder .yd-cell:after{
    border:0;
  }
  .pay li .yd-switch{
    margin-top: .08rem;
  }
</style>
<style scoped>
  .pay li .leavingMes{
    height: .86rem;
    width: 98%;
    margin-left: .24rem;
  }
  .amount {
    height: .9rem;
    line-height: .9rem;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 999;
    background: #fff;
    padding-left:.24rem;
    color: #000;
  }
  .payBtn {
    width:1.60rem;
    height:100%;
    background: #af8327;
    color: #fff;
  }
  .payMoney{
    color:#af8327;
  }
</style>
