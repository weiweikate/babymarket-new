<template>
  <div style="height: 100%;">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="awardDetailInfosPage">
        <p class="type">{{queryString.typeName}}</p>
        <ul class="infos">
          <li  v-for="(item,index) in datas" :key="index">
            <div class="left">
              <img :src="getPic(item.BuyerImgId)" alt=""/>
              <div >
                <p class="buyer">{{item.BuyerName}}</p>
                <p>订单号:{{item.OrderNo}}</p>
              </div>
            </div>
            <div class="right">
              <p class="price">+{{item.Commission}}</p>
              <p>{{item.OrderDate}}</p>
            </div>
          </li>
        </ul>
        <p v-if="show" style="text-align: center"> --暂无数据--</p>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../../base/topBar.vue'

  import { _readURL, _orderDetail,_commissionRead  } from '../../../../common/request.js'
  import { isLogin, reqUrl,getImgs} from '../../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的奖励'},
        userInfos: '',
        queryString:{},
        datas:'',
        show:false,
        img:require('../../../../img/defaultUserPic.png')
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        this.queryString = this.$route.query
        this.getMyRaiseCommission()
      },
      getMyRaiseCommission(){
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'&& ${CommissionTypeKey} =='"+this.queryString.type+"'","IsIncludeSubtables":true,"IsReturnTotal":true,MaxCount: "999","Operation":_commissionRead }
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total>0){
            this.datas =res.data.Datas
          }else{
            this.show= true
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getPic(id){
        if(id == '00000000-0000-0000-0000-000000000000'||id == undefined ){
          return this.img
        } else {
          getImgs(id)
        }
      }
    }
  }
</script>
<style scoped>
  /*#scrollView>div{*/
   /*padding-bottom: 0 !important;*/
  /*}*/
  .awardDetailInfosPage{
    text-align: left;
  }
  .type{
    height:1.04rem;
    line-height: .6rem;
    padding:.28rem;
    padding-left:1rem ;
    font-size:.34rem;
    background: #fff url("../../../../img/my-award-active-icon.png") no-repeat .28rem .2rem;
    background-size:.62rem .62rem;
    border-bottom: 1px solid #DCDCDC;
    margin-bottom:.42rem;
  }
  .awardDetailInfosPage>ul{
    background: #fff;
  }
  .infos{
    border-top:.01rem solid #DCDCDC;
  }
  .infos li{
    padding: .3rem;
    border-bottom: .01rem solid #dcdcdc;
    font-size: .24rem;
    color: #B2B2B2;
  }
  .left,.infos li{
    display: flex;
    align-items:center;
    justify-content: space-between;
  }
  .infos li img{
    width: .64rem;
    height: .64rem;
    border-radius: 100rem;
    margin-right: .14rem;
  }
  .infos li p{
    margin-bottom: .05rem;
  }
  .buyer,.price{
    color: #252525;
  }
  .buyer{
    font-size: .28rem;
  }
  .price{
    font-size:.32rem;
    font-weight: bold;
  }
  .right{
    text-align: right;
  }
</style>
