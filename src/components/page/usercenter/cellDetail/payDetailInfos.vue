<template>
  <div style="height: 100%;background: #fff">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <v-cell-detail-header :queryString="queryString"></v-cell-detail-header>
      <v-cell-detail-line :datas="orderLine"></v-cell-detail-line>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../../base/topBar.vue'
  import VCellDetailHeader from '../../../base/cell-detail-header.vue'
  import VCellDetailLine from '../../../base/cell-detail-line.vue'
  import { _readURL, _orderDetail,_cashRead  } from '../../../../common/request.js'
  import { isLogin, reqUrl,getImgs,ordersStatus} from '../../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': ''},
        userInfos: '',
        queryString:{},
        orderLine:[],
        orderList:''
      }
    },
    components: {
      VTopbar,
      VCellDetailHeader,
      VCellDetailLine
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.$route.query.orderId){
          this.queryString = this.$route.query
        } else {
          this.$router.push({path: '/index'})
        }
        this.titleAttr.name =this.queryString.typeName+'明细'
        if(this.queryString.type == 3){
          this.getOrderListRead()
        } else{
          this.getMyRaiseCommission()
        }
      },
      getOrderListRead () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${OrderId} == '"+this.queryString.orderId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _orderDetail }
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total>0){
            this.orderList = res.data.Datas[0]
            this.orderLine = [
              {title:'当前状态',content:ordersStatus(this.orderList.order_stateKey)},
              {title:'购买商品',content:this.orderList.Product_Name},
              {title:'支付时间',content:this.orderList.CreateTime},
              {title:'订单单号',content:this.orderList.OrderNo},
            ],
            this.orderList.Date = this.orderList.Date.slice(0,10)
          }
        }).catch((err) => {
          alert(err)
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getMyRaiseCommission(){
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${Id} =='"+this.queryString.orderId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation":_cashRead }
        ).then((res) => {
          this.$dialog.loading.close()
          console.log(res.data.Datas)
          if(res.data.Total>0){
            let data = res.data.Datas[0]
            this.orderLine = [
              {title:'当前状态',content:(data.Post == 'Ture'? '已到账':'未到账')},
              {title:'申请时间',content:data.CreateTime},
              {title:'到账时间',content:data.PostTime},
              {title:'提现方式',content:'支付宝'},
              {title:'提现帐号',content:data.Alipay},
            ]
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

  #scrollView>div{
   padding-bottom: 0 !important;
  }

</style>
