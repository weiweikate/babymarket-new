<template>
  <!-- 退换货-->
  <div style="height:100%">
    <yd-layout >
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="order-refund">
        <div v-for="( order, index) in orderInfos" :key="index" class="refundList">
          <router-link :to="{path:'/orderRefundDetail',query:{Id:order.Id,refund:true}}">
            <p class="refund-type">
              <span class="fl">{{order.CreateTime}}</span>
              <span class="fr">{{order.StatusText}}</span>
            </p>
            <div v-for="( detail, key) in order.Detail" :key="key" class="orderDel">
              <img :src="getPic(detail.ImgId)" alt=""/>
              <div class="prdName">
                {{detail.ProductName}}
                <p>{{detail.ProductSize}}</p>
              </div>
              <div class="prdPrice">
                <p>X {{detail.Qnty}}</p>
                <p>￥ {{detail.Price}}</p>
              </div>
            </div>
            <div class="type">
              <p>
                <span class="label">{{order.RefundTypeKey == 2 ? '￥':'退'}}</span>
                <span>{{order.RefundTypeKey == 2 ? '仅退款':'退款退货'}}</span>
              </p>
              <span class="sBtn Btn" >
                  查看详情
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL, _refundReadOperation } from '../../../common/request.js'
  import { isLogin, getImgs, reqUrl, getUUID, getTimes } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '退换货'},
        userInfos: '',
        orderInfos:''
      }
    },
    watch: {
      balanceSwitch:'useBalance'
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
      },
      getOrderInfos () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation":_refundReadOperation}
        ).then((res) => {
          this.$dialog.loading.close()
          this.orderInfos = res.data.Datas
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
      getPic (id) {
        return getImgs(id)
      }
    }
  }
</script>
<style>

</style>
<style scoped>
  .refund-type,.orderDel{
    border-bottom:1px solid #DCDCDC;
  }
  .refundList{
    background: #fff;
    margin-bottom: .2rem;
    font-size: .28rem;
    color: #515151;
    text-align: left;
  }
  .refund-type{
    padding: .33rem;
    overflow: hidden;
  }
  .order-refund img{
    width: 1.46rem;
    height: 1.46rem;
    border:1px solid #DCDCDC;
  }
  .orderDel,.type{
    padding: .2rem .33rem ;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .orderDel{
    padding-left: 0;
    margin-left: .33rem;
  }
  .prdName{
    width: 3.75rem;
    font-size: .26rem;
  }
  .prdPrice{
    text-align:right;
    color: #979797;
    font-size: .22rem;
  }
  .refund-type span.fr,.label, .sBtn{
    color:#AF383A;
  }
  .refund-type span.fr{
    font-size: .26rem;
  }
  .label{
    border-radius: 10rem;
    border: 1px solid;
    font-size: .21rem;
    padding: .03rem .06rem;
  }
</style>
