<template>
  <!-- 优惠卷管理-->
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" ref="topBar" slot="navbar">
        <span id="opt" v-if="orderPrice" @click.prevent="makeSure">确认</span>
      </v-topbar>
      <div class="couponPage scrollViewDiv">
        <yd-tab active-color="#af8327">
          <yd-tab-panel label="未使用">
            <div class="coupon" v-for="(unused,index) in unusedCoupon" :key="index" @click.prevent="chooseCoupon(unused.Id,unused.Min_Money)">
              <yd-flexbox>
                <div class="couponPrice" :class="Number(orderPrice) < Number(unused.Min_Money)? 'active_n': ''">
                  {{unused.Money}}
                  <p>{{'满'+unused.Min_Money+'可用'}}</p>
                </div>
                <yd-flexbox-item>
                  <p>{{unused.Money}}元 - {{unused.Type}} </p>
                  <p class="useful_Line">有效期到 {{unused.Useful_Line}}</p>
                </yd-flexbox-item>
                <yd-radio-group v-model="chooseItem" color="#715329" v-if="Number(orderPrice) > Number(unused.Min_Money)">
                  <yd-radio :val="unused.Id">&nbsp;</yd-radio>
                </yd-radio-group>
              </yd-flexbox>
            </div>
          </yd-tab-panel>
          <yd-tab-panel label="已使用">
            <div class="coupon" v-for="(used,index) in usedCoupon" :key="index">
              <yd-flexbox>
                <div class="couponPrice_n">
                  {{used.Money}}
                  <p>{{ '满'+used.Min_Money+'可用'}}</p>
                </div>
                <yd-flexbox-item>
                  <p>{{used.Money}}元 - {{used.Type}}</p>
                  <p class="useful_Line">有效期到 {{used.Useful_Line}}</p>
                </yd-flexbox-item>
              </yd-flexbox>
            </div>
          </yd-tab-panel>
          <yd-tab-panel label="已过期">
            <div class="coupon" v-for="(expire,index) in expireCoupon" :key="index">
              <yd-flexbox>
                <div class="couponPrice_n">
                  {{expire.Money}}
                  <p>{{ '满'+expire.Min_Money+'可用'}}</p>
                </div>
                <yd-flexbox-item>
                  <p>{{expire.Money}}元 - {{expire.Type}}</p>
                  <p class="useful_Line">有效期到 {{expire.Useful_Line}}</p>
                </yd-flexbox-item>
              </yd-flexbox>
            </div>
          </yd-tab-panel>
        </yd-tab>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL, _coupons,_modifyOrder } from '../../../common/request.js'
  import { isLogin, reqUrl} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的优惠卷'},
        userInfos: '',
        writeUrl: '',
        usedCoupon: '', // 已使用的优惠卷
        unusedCoupon: '', // 未使用的优惠卷
        expireCoupon: '' ,// 过期的优惠卷
        orderPrice: '', // 订单金额
        chooseItem: '', // 客户的选择
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      // 获取优惠卷明细
      this.getCoupons()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        }
        // 如果该页面是从订单确认页面跳转过来的 那么存下订单金额
        if(this.$route.query.num){
          this.orderPrice = this.$route.query.num
          this.chooseItem = (this.$route.query.couponId == '00000000-0000-0000-0000-000000000000'? "":this.$route.query.couponId)
        }
      },
      getCoupons () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation":_coupons}
        ).then((res) => {
          this.$dialog.loading.close()
          let arr = res.data.Datas
          let usedArr = []
          let unusedArr = []
          let expireArr = []
          for (let i=0;i<arr.length;i++){
            if(arr[i].Used == 'True') {
              usedArr.push(arr[i])
              continue
            } else if (arr[i].Overdue == 'True') {
              expireArr.push(arr[i])
              continue
            } else if( arr[i].Overdue == 'False' && arr[i].Used == 'False') {
              unusedArr.push(arr[i])
            }
          }
          this.usedCoupon = usedArr
          this.unusedCoupon = unusedArr
          this.expireCoupon = expireArr
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      chooseCoupon (couponId,minPrice) {
        if(this.$route.query.num < minPrice) {
          return
        } else if (this.$route.query.couponId == this.chooseItem) {
          this.chooseItem = ''
        } else {
          this.chooseItem = couponId
        }
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.$route.query.Id,"CouponId":this.chooseItem,"Coupon_Number":this.chooseItem,"Delete":"False"},"Status":"Existed"},"ModifyOperationId":_modifyOrder}]}).then((res) => {
          if((JSON.stringify(res.data) == "{}") && (this.chooseItem != '')){
            this.$router.go(-1)
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      makeSure () {
        this.$refs.topBar.back()
      }
    }
  }

</script>
<style>
  .couponPage .yd-tab-panel{
    background: transparent;
  }
  .couponPage .yd-radio{
    padding-right: 0;
  }
</style>
<style scoped>
 .coupon{
   padding: 0 .26rem;
   margin-top:.22rem;
   background: #fff;
 }
  .couponPrice,.couponPrice_n {
    width:1.6rem;
    padding:.26rem 0;
    font-size: .4rem;
    color:#fff;
    line-height: .34rem;
    margin-right: .24rem;
  }
 .couponPrice {
   background: #715329;
 }
 .couponPrice_n,.couponPrice.active_n {
   background: #dbdbdb;
 }
  .couponPrice p,.couponPrice_n p{
    font-size: .2rem;
  }
  .yd-flexbox-item{
    text-align:left;
    font-size: .32rem;
    color: #000000;
  }
  .useful_Line{
    font-size: .24rem;
    color: #b4b5b2;
  }
</style>
