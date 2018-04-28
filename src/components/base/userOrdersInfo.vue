<template>
  <div style="padding-top: .86rem">
    <div class="userBuy" v-for="(userOrderList, key ) in getMyOrderInfos.lists" :key="key">
      <p class="orderTime">
        <span class="fl">{{userOrderList.CreateTime}}</span>
        <span class="fr">{{orderStatusKey(userOrderList.StatusKey)}}</span>
      </p>
      <div class="prdIntr" v-for="(orderInfoList, index ) in userOrderList.Line" :key="index">
        <router-link :to="{path:'/orderDetail',query:{Id:userOrderList.Id,refund:false}}">
          <yd-flexbox>
            <img v-lazy="getPic(orderInfoList.ImgId)" class="demo-checklist-img">
            <yd-flexbox-item align="top">
              <p class="showName">{{orderInfoList.Product_ShowName}}</p>
              <p>{{orderInfoList.S_Name}}</p>
              <span class="fl">¥ {{orderInfoList.Price}}</span>
              <span class="fr">×{{orderInfoList.Qnty}}</span>
            </yd-flexbox-item>
          </yd-flexbox>
        </router-link>
      </div>
      <div class="orderState">
        <p class="fl">订单金额：<span>¥ {{userOrderList.Total}}</span></p>
        <div class="fr">
           <!--<span class="btn" v-if="Number(userOrderList.StatusKey) != 6 && Number(userOrderList.StatusKey) != 9">-->
             <!--<a href="tel://4006286698">联系客服</a>-->
           <!--</span>-->
          <!-- 交易关闭和退款成功的时候显示删除订单-->
          <span class="btn" v-if="Number(userOrderList.StatusKey) == 6 || Number(userOrderList.StatusKey) == 8" @click.prevent="deleteOrder(userOrderList.Id,key)">删除订单</span>
          <!-- 只要待付款的时候才能取消订单-->
          <span class="btn" v-if="Number(userOrderList.StatusKey) ==0 " @click.prevent="cancelOrder(userOrderList.Id,key)">取消订单</span>
          <router-link :to="{path:'/payment',query:{Id:userOrderList.Id}}">
            <span class="btn" v-if="Number(userOrderList.StatusKey) ==0 " >立即付款</span>
          </router-link>
          <!-- 已支付的情况下和待收货可以申请推荐-->
          <!--<span class="btn" v-if="Number(userOrderList.StatusKey) == 1 || Number(userOrderList.StatusKey) == 2 " @click.prevent='appliyRefund(userOrderList.Id,key)'>申请退款</span>-->
          <!-- 待收货的时候显示物流信息 退款以后不显示-->
          <span class="btn" v-if="Number(userOrderList.StatusKey) >1 &&Number(userOrderList.StatusKey) <6 " @click.prevent="seeLogistics(userOrderList)">查看物流</span>
          <span class="btn" v-if="Number(userOrderList.StatusKey) ==2 " @click.prevent="arrivalOrder(userOrderList.Id,key)">确认收货</span>
          <!-- 退款时候显示-->
          <span class="btn" v-if="Number(userOrderList.StatusKey) == 7 " @click.prevent='cancelAppliyRefund(userOrderList.Id,key)'>取消退款</span>
          <!-- 待评价的时候显示可以分享-->
          <!--<span class="btn" v-if="Number(userOrderList.StatusKey) >2 &&Number(userOrderList.StatusKey) <6 ">立即分享</span>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {  getImgs,ordersStatus, reqUrl, isLogin, formatTime } from '../../common/index.js'
  import { _readURL, _writeURL, _userOrdersCondition, _deleteOrder, _cancelOrder, _arrivalOrder } from '../../common/request.js'
  export default {
    data () {
      return {
        userInfos: '',
        writeUrl: ''
      }
    },
    props: {
      getMyOrderInfos: {
        type:Object,
        default: function () {
          return {key:'',lists:''}
        }
      }
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        if (this.userInfos.login) {
          this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
        }
      },
      arrivalOrder (id,index) {
        // 确认到货
        let url = this.writeUrl
        let time0 = formatTime()
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '是否确认到货',
          opts: () => {
          this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":id,"StatusKey":"3","Confirm_DateTime":time0},"Status":"Existed"},"ModifyOperationId": _arrivalOrder}]}
          ).then((res) => {
            console.log(res.data)
            if(JSON.stringify(res.data) == "{}"){
              this.getMyOrderInfos.lists.splice(index, 1)
            }
          }).catch((err) => {
              console.log(err)
              alert(err)
            this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
          })
        }
      })
      },
      deleteOrder (id,index) {
        // 删除订单
        let url = this.writeUrl
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '确定删除这个订单吗',
          opts: () => {
            this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":id,"Delete":"True"},"Status":"Existed"},"DeleteOperation":_deleteOrder}]}
            ).then((res) => {
              if(JSON.stringify(res.data) == "{}"){
                this.getMyOrderInfos.lists.splice(index, 1)
              }
            }).catch((err) => {
                  alert(err)
              this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
            })
          }
        })
      },
      cancelOrder (id,index) {
        // 取消订单
        let url = this.writeUrl
        //let self = this
        this.$dialog.confirm({
          title: '温馨提示',
          mes: '确定取消这个订单吗',
          opts: () => {
            let time0 = formatTime()
            this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":id,"StatusKey":"6","Cancel_DateTime":time0},"Status":"Existed"},"ModifyOperationId": _cancelOrder}]}
            ).then((res) => {
              if(JSON.stringify(res.data) == "{}"){
                this.getMyOrderInfos.lists.splice(index, 1)
              }
            }).catch((err) => {
                console.log(err)
                alert(err)
              this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
            })
          }
        })
      },
      appliyRefund (id,index) {
        this.$emit('appliyRefund',id,index)
      },
      cancelAppliyRefund (id,detailId,index) {
        this.$emit('cancelAppliyRefund',id,index)
      },
      seeLogistics (obj) {
        this.$emit('seeLogistics',obj)
      },
      orderStatusKey (n) {
        // 判断订单状态
        return  ordersStatus(n)
      },
      getPic(id){
        return getImgs(id)
      }
    }
  }
</script>

<style scoped>
  .userBuy{
    margin-bottom: .22rem;
    background: #fff;
  }
  .userBuy>p,.userBuy>div{
    overflow: hidden;
    padding:0 .24rem;
    font-size:.26rem;
    text-align: left;
  }
  .orderTime {
    height:.7rem;
    line-height: .7rem;
    color:#7d7f81 ;
    border-bottom: 1px solid #dcdcdc;
  }
  .orderTime span.fr{
    color: #AF383A;
  }
  .userBuy .prdIntr{
    /* background: #f1f3f4; */
    padding: .24rem .24rem;
    /* margin-bottom: .06rem; */
    /*border-top: 1px solid #dcdcdc;*/
    border-bottom: 1px solid #dcdcdc;
  }
  .userBuy .prdIntr:first-child{
    border:0;
  }
  .demo-checklist-img{
    width: 1.5rem;
    height: 1.5rem;
    margin-right:.24rem;
  }
  .userBuy .orderState{

    padding-top:.3rem;
    padding-bottom: .15rem;
    overflow: hidden;
  }
  .orderState p {
    color: #C7AF7E;
  }
  .orderState span.btn{
    display: inline-block;
    width:1.5rem;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
    margin-left:.14rem;
    border-radius: .09rem;
    border: 1px solid #b0b1b3;
    font-size: .28rem;
  }
  .showName{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    margin-right: .1rem;
  }
</style>
