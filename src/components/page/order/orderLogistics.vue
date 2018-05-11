<template>
  <div style="height: 100%">
    <yd-layout >
      <v-topbar :title="titleAttr" slot="navbar">
      <span class="back" @click.prevent="back">
        <img  src="../../../img/jiantou.png" alt=""/>
      </span>
      </v-topbar>
      <div class="orderLogisticsPage scrollViewDiv">
        <div class="logistics">
          <!-- 物流单号-->
          <div class="logisticsCompany">
            <p style="margin-bottom: .1rem">物流公司：{{orderInfo.Express_Name}}</p>
            <p>物流单号：{{orderInfo.Express_No}}</p>
          </div>
          <!-- 商品信息-->
          <!--<div class="orderDetail">-->
            <!--<p>商品信息</p>-->
            <!--<div class="productInfo" v-for="( prdList, index) in orderInfo.Line" :key="index">-->
              <!--<yd-flexbox>-->
                <!--<img :src="getPic(prdList.ImgId)" class="demo-checklist-img">-->
                <!--<yd-flexbox-item align="top">-->
                  <!--<p>{{prdList.Product_ShowName}}</p>-->
                  <!--<span>{{prdList.S_Name}}</span>-->
                <!--</yd-flexbox-item>-->
                <!--<div class="items">-->
                  <!--<p>¥ {{prdList.Price}}</p>-->
                  <!--<span>×{{prdList.Qnty}}</span>-->
                <!--</div>-->
              <!--</yd-flexbox>-->
            <!--</div>-->
          <!--</div>-->
          <!-- 物流时间轴-->
          <div class="timeline">
            <p>订单跟踪</p>
            <div v-if="resultcode" class="noResult">查不到物流消息</div>
            <yd-timeline v-else>
              <yd-timeline-item v-for="( logistics, index) in logisticsInfo" :key="index">
                <p>{{logistics.remark}}</p>
                <p style="margin-top: 10px;">{{logistics.datetime}}</p>
              </yd-timeline-item>
            </yd-timeline>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _logisticsKey, _logisticsCompanyUrl } from '../../../common/request.js'
  import { isLogin, getImgs, reqUrl,ordersStatus } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '物流信息'},
        orderInfo:{},
        logisticsInfo:[],
        resultcode:false, // 是否查不到物流消息
      }
    },
    components: {
      VTopbar
    },
    methods: {
      getLogistics ( obj ) {
        console.log(obj)
        this.logisticsInfo = ''
        this.resultcode = false
        this.orderInfo = obj
        let _this = this
        this.$jsonp(_logisticsCompanyUrl, { key:_logisticsKey,	com:obj.Express_Code,no: obj.Express_No}).then(res => {
            console.log(res)
            if(res.resultcode == '200'){
              _this.logisticsInfo  = res.result.list.reverse()
              _this.$emit('logisticsCallback',_this.logisticsInfo[0])
            } else {
              this.resultcode = true
              _this.$emit('logisticsCallback',{remark:"暂无任何物流信息"})
            }
        }).catch(err => {
          console.log(err)
        })
      },
      back () {
        this.$emit('back')
      },
      getPic(id) {
        return getImgs(id)
      }
    }
  }
</script>
<style>
  #scrollView .orderLogisticsPage{
    margin-top: 0;
  }
  .orderLogisticsPage .yd-timeline-item:first-child>.yd-timeline-icon{
    background-color: #AF383A;
  }
  .orderLogisticsPage .yd-timeline-item:first-child:before {
    /*background-color: #a6e7bc;*/
  }
  .orderLogisticsPage .yd-timeline-item:first-child p {
    color: #AF383A;
  }
</style>
<style scoped>
 .logistics{
   text-align: left;
 }
  .logisticsCompany,.orderDetail>p{
    padding:.25rem .2rem;
    font-size: .3rem;
  }
 .orderDetail>p{
   background:#fafafa;
 }
 .logisticsCompany{
   background: #fff;
   margin-bottom: .2rem;
   padding-left: 1.2rem;
   background: #fff url("../../../img/company.png") no-repeat .2rem center;
   background-size: .72rem;
 }
 .timeline>p{
   padding: .25rem  .2rem;
   background: #fff;
 }
 .orderDetail .productInfo{
   border-bottom: 0;
 }
  .noResult{
    margin:0 .25rem;
    padding: .1rem 0;
    color: red;
    border-top: 1px solid #ddd;
    font-size: .28rem;
  }
</style>
