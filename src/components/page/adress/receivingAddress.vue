<template>
  <!-- 收货地址管理-->
  <div style="height: 100%">
    <yd-layout >
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="addresspage scrollViewDiv">

        <!-- 默认地址-->
        <div class="addr">
          <div v-for="(addressList,index) in addressLists" :key="index" >
            <div class="choose">
              <label class="yd-checklist-item-icon" @click='putDefaultAddr(addressList.Id)' >
                <input  type="radio" :value="addressList.Id" name="defaultAddr" v-model="defaultAddr" >
          <span class="yd-checklist-icon">
            <i></i>
          </span>
                <span class="yd-checkbox-text" >默认收货地址</span>
              </label>
            </div>
            <div v-if="fromPage" class="modify">
              <router-link :to="{path:'/newReceivingAddress',query: {num:index}}">
                修改
              </router-link>
            </div>
            <div v-else class="delete" @click.prevent="openConfrim(addressList.Id,index)">
              删除
            </div>
            <router-link :to="{path:'/newReceivingAddress',query: {num:index,Id:addressList.Id}}">
              <div class="addrInfo">
                {{addressList.Consignee}}
                <span class="phone">{{addressList.Mobile.substr(0,3)+"****"+addressList.Mobile.substr(7)}}</span>
                <p class="address">{{addressList.Address}}</p>
                <p v-if="addressList.Card">身份证：{{addressList.Card.substr(0,4)+"**********"+addressList.Card.substr(14)}}</p>
              </div>
            </router-link>
          </div>
        </div>
        <!-- 新建收货地址-->

      </div>
      <div class="addAddress" slot="tabbar">
        <router-link :to="{path:'/newReceivingAddress'}">
          <span>新建收货地址</span>
        </router-link>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL, _recevingAddress, _modifyAddress,_modifyOrder } from '../../../common/request.js'
  import { isLogin, reqUrl, getTimes } from '../../../common/index.js'
  import { mapMutations } from 'vuex'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '收货地址管理'},
        userInfos: '',
        writeUrl: '',
        addressLists: [],// 保存地址信息
        defaultAddr: '',
        fromPage:'', // 判断是那个路由进来的
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      //获取地址列表
      this.getAddress()
      this.fromPage = this.$route.query.from
    },
    beforeRouteLeave (to, from, next) {
      // 将要修改的地址清晰传递给新建地址页面
      // 如何是从订单位置处来选择地址的 那边跳回订单页面
      if(this.fromPage == '/confirmOrder' && to.query.Id) {
        let url = this.writeUrl
        let index = to.query.num
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Order","Items":{"Id":this.$route.query.Id,"Delivery_AddressId":to.query.Id,"Consignee":this.addressLists[index].Consignee,"Mobile":this.addressLists[index].Mobile,"Address":this.addressLists[index].Address,
"Delete":"False"},"Status":"Existed"},"ModifyOperationId":_modifyOrder}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            window.sessionStorage.removeItem('comfirmOrderInfo')
            this.$router.go(-1)
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
        return
        //let addr = JSON.parse(window.sessionStorage.address)
        //addr.addressId = to.query.Id
        //window.sessionStorage.address = JSON.stringify(addr)
        //this.$router.go(-1)
      }
      if(to.name==='newReceivingAddress'){
        let index = to.query.num
        this.refRecevingInfo(this.addressLists[index])
        next()
      } else {
        next()
      }
    },
    methods: {
      ...mapMutations({
        refRecevingInfo: 'refRecevingInfo'
      }),
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        }
      },
      getAddress () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _recevingAddress,"Order":"${Default} DESC"})
            .then((res) => {
          this.$dialog.loading.close()
          this.addressLists = res.data.Datas
          if (res.data.Datas.length>0 && res.data.Datas[0].Default =='True') {
            this.defaultAddr = res.data.Datas[0].Id
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      openConfrim (id,index) {
        this.$dialog.confirm({
          title: ' ',
          mes: '确定删除这个地址',
          opts: [
            {txt: '取消', color: 'dodgerblue'},
            {txt: '确定', color: 'dodgerblue', callback: () => { this.deletAddress(id,index) }}]
        })
      },
      deletAddress (id,index) {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Delivery_address","Items":{"Delete":"True","Id":id},"Status":"Existed"},"ModifyOperationId":_modifyAddress}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.addressLists.splice(index, 1)
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      putDefaultAddr(id){
        let url = this.writeUrl
        let _this = this
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Delivery_address","Items":{"Default":"True","Id":id},"Status":"Existed"},"ModifyOperationId": _modifyAddress}]}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            _this.$dialog.toast({mes: '设置成功', timeout: 1500})
          }
        }).catch((err) => {
          _this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>

<style scoped>
  .addr>div {
    text-align: left;
    position: relative;
  }
  .yd-checklist-item-icon>input[type=radio]:checked+.yd-checklist-icon>i {
    -webkit-transform: translate(-50%,-50%) rotate(45deg) scale(1);
    transform: translate(-50%,-50%) rotate(45deg) scale(1);
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
  .yd-checklist-item-icon>input[type=radio] {
    position: absolute;
    left: -9999em;
  }
  .yd-checklist-item-icon>input[type=radio]:checked+.yd-checklist-icon {
    background-color:#715329;
    border-color: #715329;
  }
  .addr div:first-child .choose{
    margin-top:0;
  }
  .choose{
    padding: 0.1rem 0.15rem;
    background: #fff;
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #ddd;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    z-index: 1;
    margin-left: 0;
    margin-top:0.2rem;
    min-height: .8rem;
  }
  .choose label{
    padding:0.08rem;
  }
  .choose .yd-checklist-icon{
    margin:0 0.2rem;
  }
  .choose .yd-checkbox-text{
    font-size:0.3rem;
  }
  .delete,.modify{
    color:#666 ;
    font-size:0.3rem;
    position: absolute;
    right:0;
    top: 0;
    z-index:9;
    padding:0.23rem 0.6rem;
    padding-right:0.25rem;
  }
  .delete{
    background: url("../../../img/delete.png") no-repeat left center;
    background-size:0.5rem;
  }
  .addrInfo{
    background: #fff;
    padding:0.3rem 0.2rem ;
    font-size: 0.3rem;
    color:#000;
  }
  .phone{
    float: right;
  }
  .addrInfo p{
    color:#666;
    margin-top:0.15rem;
  }
  .addAddress{
    position: fixed;
    width:100%;
    bottom:0;
    left:0;
    z-index: 999;
  }
  .addAddress span{
    display: inline-block;
    height:0.94rem;
    width:100%;
    line-height:0.94rem;
    background: #C7AF7E;
    color: #fff;
    font-size: 0.32rem;
  }
</style>
