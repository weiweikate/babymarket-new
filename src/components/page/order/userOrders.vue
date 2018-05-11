<template>
  <!-- 客户所有的订单-->
  <div class="userOrdersPage scrollViewDiv">
    <!-- 订单展示页面-->
    <div v-show="showItems[0]">
      <v-topbar :title="titleAttr"></v-topbar>
      <yd-tab active-color="#af8327" :callback="getTabIndex">
        <yd-tab-panel label="全部" tabkey="0" :active="active[0]">
          <v-user-orders-info :getMyOrderInfos="userOrderLists[0]" v-on:seeLogistics="Logistics"></v-user-orders-info>
        </yd-tab-panel>
        <yd-tab-panel label="待付款" tabkey="1" :active="active[1]">
          <v-user-orders-info :getMyOrderInfos="userOrderLists[1]"></v-user-orders-info>
        </yd-tab-panel>
        <yd-tab-panel label="待发货" tabkey="2"  :active="active[2]">
          <span></span>
          <v-user-orders-info :getMyOrderInfos="userOrderLists[2]" v-on:appliyRefund="appliy" v-on:cancelAppliyRefund="cancelAppliy"></v-user-orders-info>
        </yd-tab-panel>
        <yd-tab-panel label="待收货" tabkey="3" :active="active[3]">
          <span></span>
          <v-user-orders-info :getMyOrderInfos="userOrderLists[3]" v-on:appliyRefund="appliy" v-on:cancelAppliyRefund="cancelAppliy"  v-on:seeLogistics="Logistics"></v-user-orders-info>
        </yd-tab-panel>
        <yd-tab-panel label="已收货" tabkey="4" :active="active[4]">
          <v-user-orders-info :getMyOrderInfos="userOrderLists[4]" v-on:seeLogistics="Logistics"></v-user-orders-info>
        </yd-tab-panel>
      </yd-tab>
    </div>
    <!-- 申请退款-->
    <div class="AppliyRefund" v-show="showItems[1]">
        <span class="opt" @click.prevent="makeSure">取消</span>
      </v-topbar>
      <div class="comfirm">
        <p>温馨提示：</p>
        <p>1.显示特价、满减等购买优惠可能一并取消</p>
        <p>2.如遇订单拆分，包邮等条件可能新增运费</p>
        <p>3.退款按付款方式原路返回，不能返回的付款方式返余额中</p>
        <p>4.订单一旦取消，无法恢复</p>
      </div>
      <div class="appliy">
        <div @click.prevent="showReason = !showReason">退款原因：<span>{{reason.name}}</span></div>
        <!-- 申请退款的原因-->
        <yd-actionsheet :items="reasonItems" v-model="showReason"></yd-actionsheet>
      </div>
      <div class="appliyReason">
        <p>退款说明：</p>
        <yd-cell-group>
          <yd-cell-item style="padding-left:1.7rem">
            <yd-textarea slot="right" placeholder="选填" maxlength="100" v-model="otherReason"></yd-textarea>
          </yd-cell-item>
        </yd-cell-group>
      </div>
      <div class="appliyer">
        <p>退款联系人：{{appliyer.name}}</p>
        <p>联系方式：<span style="color: #0074D9">{{appliyer.tel}}</span></p>
      </div>
      <div class="btnDiv">
        <span class="subBtn" @click.prevent="submitApply">提交</span>
      </div>
    </div>
    <!-- 取消退款-->
    <div class="cancelRefound" v-show="showItems[2]">
      <v-topbar :title="cancleTitle">
        <span class="opt" @click.prevent="makeSure">确认</span>
      </v-topbar>
      <div class="cancelResult">
        <p>您的退款申请已经提交成功</p>
        <p>请耐心等待处理结果，谢谢您的理解！</p>
      </div>
      <p>如果您想取消退款申请，可以点击下方取消退款按钮</p>
      <div style="text-align: center;">
        <span class="subBtn" @click.prevent="">取消退款申请</span>
      </div>
    </div>
    <!-- 查看物流-->
    <div class="toShare" v-show="showItems[3]">
      <v-order-logistics ref="logistics" v-on:back="makeSure"></v-order-logistics>
    </div>
    <!-- 登录框-->
    <div>
      <v-login ref="loginDiv"></v-login>
    </div>
  </div>
</template>
<script>
  import VTopbar from '../../base/topBar.vue'
  import VLogin from '../../base/login.vue'
  import VOrderLogistics from './orderLogistics.vue'
  import VUserOrdersInfo from '../../base/userOrdersInfo.vue'
  import { isLogin, getImgs, reqUrl,ordersStatus,getUUID } from '../../../common/index.js'
  import { _readURL, _writeURL, _userOrdersCondition, _userOrders, _appliyRefund, _refundDetail, _refundReason, _logisticsKey, _logisticsCompanyUrl, _addAppliyRefund } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的订单'},
        AppliyTitle: {'isShow': false, 'name': '申请退款'},
        cancleTitle: {'isShow': false, 'name': '取消退款'},
        userInfos: '',
        writeUrl: '',
        orderId:'', // 订单号
        userOrderLists:[], // 用户订单
        orderInfoLists:[], // 产品图文介绍
        showReason: false, // 展示退款理由选项
        reason: {name:'',Id:''}, // 退款的理由
        reasonItems: [],
        otherReason: '', // 退款说明
        appliyer: {name:'',tel:''}, // 申请人联系方式
        active:[true,false,false,false,false], // 判断哪个tab栏目被激活
        showItems:[true,false,false,false], // 0.订单显示页面  1.申请退款  2.取消退 3 查看物流 默认都不显示
        PrimaryId:'',
        detailId:'',
        showLoadingTimes:[]
      }
    },
    components: {
      VTopbar,
      VUserOrdersInfo,
      VOrderLogistics,
      VLogin
    },
    mounted: function () {
      this.getIsEntry()
      if (this.$route.query.Id) {
        this.active =[]
        this.active[this.$route.query.Id] = true
        this.getUserOrderInfos(this.$route.query.Id)
      } else {
        this.active =[]
        this.active[0] = true
        this.getUserOrderInfos(0)
      }

    },
    methods: {
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
        if (this.userInfos.login) {
          this.writeUrl = reqUrl(_writeURL, this.userInfos.session)
        }else{
          this.$refs.loginDiv.toLogin()
        }
        this.orderId = this.$route.query.Id
        this.appliyer.name = this.userInfos.name
        this.appliyer.tel = this.userInfos.Mobile
      },
      getUserOrderInfos (index) {
        if(!this.showLoadingTimes[index]){
          this.showLoadingTimes[index] =1
          this.$dialog.loading.open('拼命加载中')
        }
        let operation = index == 0?  _userOrders: _userOrdersCondition
        let url = this.userInfos.reqUrl
        let conditions = this.getOrderParams(index)
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":conditions,"IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": operation,"Subtables":["Line"]}
        ).then((res) => {
            //console.log(res.data.Datas)
            res.data.Datas.sort(function (a, b) {
              return Date.parse(b.CreateTime.replace(/-/g, '/')) - Date.parse(a.CreateTime.replace(/-/g, '/')) ;// 时间降序
            });
          this.$set(this.userOrderLists,index,{key: index, lists: res.data.Datas})
          this.$dialog.loading.close()
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getTabIndex (label,tabkey) {
        this.active =[]
        let key = Number(tabkey)
        this.active[key] = true
        this.getUserOrderInfos(key)
      },
      appliy (id,index) {
        // 申请退款  请求申请退款的理由
        this.showItems = [false,true,false,false]
        this.orderId = id
        this.detailId = detailId
        let url = this.userInfos.reqUrl
        if (this.reasonItems.length>0) { // 请求过了 不在请求
          return
        }
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _refundReason}).then((res) => {
          let resArr = res.data.Datas
          this.reason = {name:resArr[0].Name,Id:resArr[0].Id}
          for (let i =0; i<resArr.length; i++){
            this.reasonItems.push({ label: resArr[i].Name, callback: () => { this.reason = {name:resArr[i].Name,Id:resArr[i].Id}}})
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      submitApply () {
        // 提交退款申请
        let url = this.writeUrl
        this.PrimaryId = getUUID()
        this.axios.post(url,{"Items":[{"AddOperationId": _addAppliyRefund,"Data":{"EntityName":"Refund","Items":{"Id":this.PrimaryId,"OrderId":this.orderId,"StatusKey":"0","ReasonId":this.reason.Id,"Remark":this.otherReason,"Contcats":this.appliyer.name,"Mobile":this.appliyer.tel,"Deleted":'False',"RefundTypeKey":'2','ReceiveStatusKey':'2'},"Status":"New"}}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.submitRefundDetail()
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      submitRefundDetail () {
        let url = this.writeUrl
    console.log(this.detailId)
        this.axios.post(url,{"Items":[{"AddOperationId":_refundDetail,"Data":{"EntityName":"RefundDetail","Items":{"Id":getUUID(),"OrderDetailId":'f47e7660-0c72-4dc6-a732-a85e0104e831',"PrimaryId":this.PrimaryId,'ReturnStatusKey':'1'},"Status":"New"}}]}).then((res) => {
          console.log(res.data)
//          if(JSON.stringify(res.data) == "{}"){
//            this.showItems = [false,false,true,false]
//          }
        }).catch((err) => {
      alert(err)
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      cancelAppliy (id,index) {
        let url = this.writeUrl
        this.showItems = [false,false,true,false]
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Refund","Items":{"OrderId":id,"Deleted":'True'},"Status":"Existed"},"ModifyOperationId": _appliyRefund}]}
        ).then((res) => {
          console.log(res.data)
          if(JSON.stringify(res.data) == "{}"){
            //this.showItems = [false,false,true,false]
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      Logistics (obj) {
       this.$refs.logistics.getLogistics(obj)
       this.showItems = [false,false,false,true]
      },
      logisticsCallback () {},
      makeSure () {
        this.reason = '不想买了'
        this.otherReason = ''
        this.showItems = [true,false,false,false]
      },
      getOrderParams (n) {
        let Params =''
        let userId = this.userInfos.userId
        switch (n) {
          case 0:
            // 查全部
            Params = "${MemberId} == '"+ userId +"'"
            break
          case 1:
            // 待付款
            Params = "${MemberId} == '"+ userId +"' && ${Child_Order} == 'False'&& ${Formal} =='True'&& ${StatusKey} =='0'"
            break;
          case 2:
            //   已支付
            Params = "${MemberId} == '"+ userId +"' && ${Child_Order} == 'True'&& ${Formal} =='True'&& ${StatusKey} =='1' || ${History} == 'True' "
            break
          case 3:
            // 待发货
            Params = "${MemberId} == '"+ userId +"' && ${Child_Order} == 'True'&& ${Formal} =='True'&& ${StatusKey} =='2' || ${History} == 'True' "
            break
          case 4:
             //  待评价
            Params = "${MemberId} == '"+ userId +"' && ${Child_Order} == 'True'&& ${Formal} =='True'&& ${StatusKey} =='3' || ${History} == 'True' "
            break
          case 5:
            Params = "${MemberId} == '"+ userId +"' && ${Child_Order} == 'False'&& ${Formal} =='True'"
        }
        return Params
      }
    }
  }
</script>

<style>

  .userOrdersPage .yd-tab-panel {
    background-color: #f1f3f4;
  }
  .userOrdersPage .yd-actionsheet-item{
    height: .7rem;
    line-height: .7rem;
    background:#ddd;
    color: #000;
  }
  .userOrdersPage .yd-actionsheet{
    height: 4rem;
    overflow-y: auto;
  }
  .userOrdersPage .yd-actionsheet-item:after{
    border-color: #fff;
  }
  .userOrdersPage .yd-cell:after{
    border:0;
  }
  .userOrdersPage .yd-badge{
    border: 1px solid #af8327;
  }
  .userOrdersPage .yd-tab{
    margin-top: .9rem;
  }
  .userOrdersPage #scrollView .orderLogisticsPage{
    margin-top: .894rem;
  }
</style>
<style scoped>
  .userOrdersPage{
    text-align: left;
    height: 100%;
    overflow: hidden;
  }
  .AppliyRefund{
    font-size: .3rem;
    font-size: .3rem;
  }
  .comfirm{
    padding: .2rem;
  }
  .AppliyRefund p{
    margin-top: .1rem;
  }
  .appliyReason{
    position: relative;
  }
  .appliyReason>p{
    position: absolute;
    top:0.06rem;
    left: .2rem;
    z-index: 50;
  }
  .appliy, .appliyer{
    padding:.2rem;
    background: #fff;
    margin-bottom:.22rem;
  }
  .btnDiv{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: .4rem;
    text-align: center;
  }
  .cancelResult{
    padding:1rem 1.4rem;
    font-size: .3rem;
    padding-right:0;
    color: #000;
    background: #fff;
    line-height: .4rem;
  }
  .cancelRefound>p{
    width:90%;
    margin:.45rem auto;
    font-size: .26rem;
    color: #808080;
  }
</style>
