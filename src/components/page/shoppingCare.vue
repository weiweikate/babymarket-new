<template>
  <div class="shoppingCarePage" style="height:100%;overflow: scroll;padding-bottom:0.85rem">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"><span id="opt" v-show="userInfos.login" @click.prevent="edit">{{opt}}</span></v-topbar>
      <div>
        <div v-if="show" class="nullCar">
          <p>购物车里空空如也，赶紧</p>
          去<router-link to="index" >逛逛</router-link>
        </div>
        <div class="shoppingList">
          <div v-for="(shoppingList,keys) in shoppingLists" :key="keys" >
            <div class="allBox" >
              <label class="yd-checklist-item-icon"  @click.prevent="chooseAll(keys)">
                <input type="checkbox" :checked="isCheckAllList[keys]"/>
          <span class="yd-checklist-icon" style="color:#715329" >
            <i></i>
          </span>
                <span class="yd-checkbox-text">{{shoppingList[0].Name}}</span>
              </label>
            </div>
            <yd-checklist v-model="checklist[keys]" :callback="changeChoose" :label="false" color="#715329"  :key="keys" :ref="shoppingList[0].WarehouseId">
              <yd-checklist-item  v-for='(list,index) in shoppingList' :val="list.Id" :key="index"  v-if="index>0" @click.native="getIndex(keys,index)">
                <v-move-delete :params="{key:keys,index:index,id:list.Id}" @deleteItem="deleteItem">
                  <router-link :to="{path:'/prdDetail',query:{prdId:list.ProductId}}">
                    <yd-flexbox>
                      <img v-lazy="getPic(list.ImgId)" class="demo-checklist-img">
                      <yd-flexbox-item align="top" v-show="showNum">
                        <p>{{list.Product_ShowName}}</p>
                        <span>{{list.S_Name}}</span>
                      </yd-flexbox-item>
                      <yd-flexbox-item align="top" v-show="!showNum">
                    <span  class="yd-spinner" style="height: 0.8rem; width: 2.5rem;">
                      <a @click.prevent.stop="changeItemNum(1,keys,index-1,list.Id)"></a>
                      <input type="number" pattern="[0-9]*" placeholder="" class="yd-spinner-input" v-model="numberLists[keys][index-1]" readonly="readonly">
                      <a @click.prevent.stop="changeItemNum(2,keys,index-1,list.Id)"></a>
                    </span>
                      </yd-flexbox-item>
                      <div class="items">
                        <p>￥{{list.Price}}</p>
                        <span>×{{numberLists[keys][index-1]}}</span>
                      </div>
                    </yd-flexbox>
                  </router-link>
                </v-move-delete>
              </yd-checklist-item>
            </yd-checklist>
          </div>
        </div>
      </div>
      <!-- 结算部分-->
      <div class="payment" slot="tabbar" v-show="userInfos.login">总计（不含运费、税费）：<span class="payPrice">¥ {{totalPrice}}</span> <span class="payBtn" @click.prevent="payment">去结算</span></div>
      <v-navbar slot="tabbar"></v-navbar>
    </yd-layout>
    <!-- 登录框-->
    <!--<div>-->
      <!--<v-login ref="loginDiv"></v-login>-->
    <!--</div>-->

  </div>
</template>

<script>
  import VTopbar from '../base/topBar.vue'
  import VNavbar from '../base/navBar.vue'
  import VLogin from '../base/login.vue'
  import VMoveDelete from '../base/moveDelete.vue'
  import { _readURL, _writeURL, _shoppingCart, _deleteShoppingCarts, _changeShoppingCarts, _newOrder, _newOrderDetails } from '../../common/request.js'
  import { isLogin, getImgs, reqUrl, getUUID, getTimes } from '../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '购物车'},
        show: false,
        userInfos: '',
        writeUrl: '',
        warehouse: '',
        shoppingLists: '', //仓库和物品相对应
        shoppingCareLists:'', // 只有物品的数组
        paymentLists: '', // 要购买的清单
        checklist: [],  // 保存每个仓库下面的清单
        isCheckAllList: [], // true or false 是否全选
        chooseIndex:'', // 当前点击的选项下标
        showNum: true,
        totalPrice: 0, //总价
        numberLists: [], // 购物车每个商品的件数
        opt: '编辑',
        orderId: '' //保存订单编号
      }
    },
    components: {
      VTopbar,
      VNavbar,
      VLogin,
      VMoveDelete
    },
    mounted: function () {
      if (!window.sessionStorage.userInfos) {
        // this.$refs.loginDiv.toLogin()
        this.show = true
      } else {
        // 判断是否登录
        this.getIsEntry()
        // 购物车清单
        this.getShoppingCart()
      }
    },
    watch: {
      checklist: 'getPaymentLists',
      numberLists: 'getPaymentLists'
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
      },
      getShoppingCart (obj) {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        let _this = this
        let  Warehouse =  _this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _shoppingCart,"View":{"EntityName":"ShoppingCart_View"}})
        let  ShoppingCart =  _this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"' && ${Useful} == 'True'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _shoppingCart,"Order":"${CreateTime} DESC"})
        Promise.all([Warehouse,ShoppingCart ]).then(function (posts) {
          _this.$dialog.loading.close()
          if(posts[1].data.Datas.length > 0){
            // 渲染dom
            _this.putShoppingCart(posts[0].data.Datas,posts[1].data.Datas)
            _this.shoppingCareLists = posts[1].data.Datas
          } else {
            _this.show = true
          }
        }).catch(function(reason){
          _this.$dialog.loading.close()
          _this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      putShoppingCart (warehouse,list) {
        let lists = []
        for(let i= 0 ;i<warehouse.length;i++){
          this.isCheckAllList[i] = false
          this.checklist[i] = []
          this.numberLists[i] =[]
          let arr = [];
          for(let j= 0 ;j<list.length;j++){
            if(list[j].Warehouse_Name == warehouse[i].Name){
              arr.push(list[j])
              this.numberLists[i].push(list[j].Qnty)
            }
          }
          arr.unshift(warehouse[i])
          lists[i] = arr
        }
        this.shoppingLists = lists
      },
      deleteItem (params) {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Shopping_Cart","Items":{"Id":params.id,"isSelect":false},"Status":"Deleted"},"DeleteOperationId": _deleteShoppingCarts}]}
        )
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.shoppingLists[params.key].splice(params.index, 1)
            if(this.shoppingLists[params.key].length ==1){
              document.getElementsByClassName('allBox')[params.key].style.display='none'
            }
            this.getShoppingCart()
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      changeItemNum (obj,key,index,id) {
        let num =this.numberLists[key]
        if(obj===1){
          if (num[index]>1 ){
            num[index] =  parseInt(num[index]) -1
          }else{
            return
          }
        }else{
          num[index] =  parseInt(num[index]) +1
        }
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Shopping_Cart","Items":{"Id":id,"Qnty":String(num[index])},"Status":"Existed"},"ModifyOperationId": _changeShoppingCarts}]}
        )
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            //this.$set(this.numberLists,key,num)
            this.getShoppingCart()
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      changeChoose(value, isCheckAll){
        let index = parseInt(this.chooseIndex.key)
        if(value.length >0 ){
          //let index =  parseInt(value[0].substring(value[0].length-1))
          if(value.length == this.shoppingLists[index].length-1){
            this.$set(this.isCheckAllList,index,true)
          } else {
            this.$set(this.isCheckAllList,index,false)
          }
        }else {
          this.$set(this.isCheckAllList,index,false)
        }
      },
      chooseAll (index) {
        this.chooseIndex = {key:index,index:''}
        this.$set(this.isCheckAllList,index,!this.isCheckAllList[index])
        if(!this.isCheckAllList[index]){
          this.$set(this.checklist,index,[])
        } else{
          let list =[]
          let listArr = this.shoppingLists[index]
          for(let i=1;i<listArr.length;i++){
            //list[i-1] = listArr[i].Id+[index]
            list[i-1] = listArr[i].Id
          }
          this.$set(this.checklist,index,list)
          this.$set(this.isCheckAllList,index,true)
        }
      },
      getPic (id) {
        return getImgs(id)
      },
      getIndex (key,index) {
        //this.chooseIndex = key
        this.chooseIndex = {key:key,index:index}
      },
      edit () {
        this.showNum = ! this.showNum
        if (this.opt === '编辑') {
          this.opt =  "完成"
        } else {
          this.opt = '编辑'
        }
      },
      getPaymentLists () {
        // 求总价
        if (!this.chooseIndex.index) {
          for (let i=0;i<this.numberLists[this.chooseIndex.key].length;i++){
            //let num = this.numberLists[this.chooseIndex.key][i]
            this.getPaymentListsMethod()
          }
        } else {
          //let num = this.numberLists[this.chooseIndex.key][this.chooseIndex.index-1]
          this.getPaymentListsMethod()
        }
      },
      getPaymentListsMethod () {
        this.totalPrice = 0
        // 将二维数组转化为一维数组
        let orderArr = [].concat.apply([],this.checklist)
        let orderLists =[]
        for (let i=0;i<orderArr.length;i++){
          for (let j=0;j<this.shoppingCareLists.length;j++){
            if(orderArr[i]== this.shoppingCareLists[j].Id) {
              orderLists.push(this.shoppingCareLists[j])
              this.totalPrice += Number(this.shoppingCareLists[j].Money)
            }
          }
        }
        this.paymentLists = orderLists
      },
      payment () {
        let url = this.writeUrl
        if (this.paymentLists.length == 0){
          this.$dialog.toast({mes: '您为选择任何商品', timeout: 1500})
          return
        }
        let time = getTimes()
        //产生一个订单编号
        this.orderId = getUUID()
        this.axios.post(url,{"Items":[{"AddOperationId":_newOrder,"Data":{"EntityName":"Order","Items":{"Address_Refresh":time,"CreatorId": this.userInfos.userId,"Formal":"False","Id": this.orderId,"Line":[],"MemberId":this.userInfos.userId, 'Delivery_AddressId':this.userInfos.addressId},"Status":"New"}}]}
        )
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.putPaymentLists()
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      putPaymentLists () {
        this.$dialog.loading.open('正在提交订单')
        let url = this.writeUrl
        let lists = this.paymentLists
        let params  = []
        let buyPrd =[]
        for (let i = 0; i<lists.length;i++) {
          let param = {"AddOperationId": _newOrderDetails,"Data":{"EntityName":"Order_Line","Items":{"ImgId":lists[i].ImgId,"Money": lists[i].Money,"OrderId":this.orderId,"Price":lists[i].Price,"ProductId":lists[i].ProductId,"Product_Name": lists[i].Product_Name,"Product_ShowName":lists[i].Product_ShowName,"Qnty":lists[i].Qnty,"S_Name":lists[i].S_Name,"Shopping_CartId":lists[i].Id},"Status":"New"}}
          params.push(param)
          buyPrd[i] ={prdName:lists[i].Product_ShowName,img:lists[i].ImgId,price:lists[i].Price,type:lists[i].S_Name,pcs:lists[i].Qnty}
        }
        this.axios.post(url,{"Items":params}).then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            window.sessionStorage.buyPrd = JSON.stringify(buyPrd)
            this.$dialog.loading.close()
            this.$router.push({path: '/confirmOrder', query: {orderId: this.orderId}})
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>
<style>
  .shoppingCarePage .yd-checklist-content{
    padding-right:0
  }
  .shoppingCarePage .yd-flexbox {
    padding-top:0.24rem;
  }
  .shoppingCarePage .yd-checklist-item:not(:last-child):after{
    border-bottom: 0px
  }
  .shoppingCarePage .yd-checklist-item{
    padding-left:0.15rem;
    border-bottom: 1px solid #ddd;
    margin-left: 0;
  }
</style>
<style scoped>
  .nullCar a{
    border-bottom: 1px solid #af8326;
    color: #af8326;
    padding: 0.05rem;
  }
  .nullCar{
    font-size: 16px;
    line-height: 0.5rem;
    padding-top: 4rem;
  }
  .shoppingList{
    text-align: left;
  }
  .shoppingList p{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
  .demo-checklist-img {
    width: 1rem;
    height:1rem;
    border: 1px solid #ddd;
    margin-right:0.25rem;
  }
  .shoppingList .items{
    margin-left:0.2rem;
    padding-right: 0.15rem;
    text-align: right;
    position: relative;
    top: -0.2rem;
  }
  .shoppingList>div:first-child .allBox{
    margin-top:0;
  }
  .shoppingList .allBox{
    padding: 0.1rem 0.15rem;
    background: #fff;
    border-top:1px solid #efefef;
    margin-top:0.3rem;
    border-bottom: 1px solid #ddd;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    z-index: 1;
    margin-left:0;
  }
  .shoppingList .allBox span{
    margin-left: 0.15rem;
  }
  .allBox i {
    width: 6px;
    height: 12px;
    content: "";
    position: absolute;
    top: 45%;
    left: 50%;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    -webkit-transform: translate(-50%,-50%) rotate(45deg) scale(0);
    transform: translate(-50%,-50%) rotate(45deg) scale(0);
  }
  .allBox>input[type=checkbox]:checked+.yd-checklist-icon>i {
    -webkit-transform: translate(-50%,-50%) rotate(45deg) scale(1);
    transform: translate(-50%,-50%) rotate(45deg) scale(1);
    -webkit-transition: all .2s ease-in-out;
    transition: all .2s ease-in-out;
  }
  .allBox label{
    padding: 0 0.08rem;
  }
  .payment{
    text-align: right;
    position:fixed;
    bottom:1.1rem;
    width:100%;
    height:0.85rem;
    line-height: 0.85rem;
    background: #fff;
    font-size:0.25rem;
    z-index: 999;
  }
  .payment .payPrice{
    color: #af8326;
  }
  .payment .payBtn{
    display: inline-block;
    height: 100%;
    width: 1.6rem;
    text-align: center;
    color: #fff;
    background: #af8326;
  }
</style>
