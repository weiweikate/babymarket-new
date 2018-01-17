<template>
  <!-- 产品详情页-->
  <div class="detailPage">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div>
        <div class="picsShow">
          <v-slider :getSubPagePics="deltailPics"></v-slider>
        </div>
        <div class="prdIntr">
          <h5>{{prdInfos.ShowName}}</h5>
          <ul class="priceDiv">
            <li v-if="isLogin.login &&( isLogin.MemberTypeKey == '3')">
              <span class="AccPrice">￥{{prdInfos.AccPrice}}</span>
              合作尊享
            </li>
            <li>
              <span class="LYPrice">￥{{prdInfos.LYPrice}}</span>
              老友专享
            </li>
            <li>
              <span class="SalePrice">￥{{prdInfos.SalePrice}}</span>
              市场价
            </li>
          </ul>
          <div class="prdWareHouse">{{prdInfos.Warehouse}}供货</div>
          <p > 配送费：{{"至 "+province}} <span>{{prdFreight}}</span></p>
          <div class="promiseDiv">
            <yd-grids-group :rows="4" >
              <yd-grids-item>
                <img slot="icon" src="../../../img/product_share_logo.png" >
                <span slot="text">码头自营</span>
              </yd-grids-item >
              <yd-grids-item>
                <img slot="icon" src="../../../img/product_zheng_logo.png">
                <span slot="text">正品保证</span>
              </yd-grids-item>
              <yd-grids-item>
                <img slot="icon" src="../../../img/product_tui_logo.png">
                <span slot="text">七天退货</span>
              </yd-grids-item>
              <yd-grids-item>
                <img slot="icon" src="../../../img/product_ziying_logo.png">
                <span slot="text">分享有礼</span>
              </yd-grids-item>
            </yd-grids-group>
          </div>
        </div>
        <div class="prdInfoDiv" style="box-sizing: border-box;width: 100%;padding: 0">
          <iframe :src="iframeUrl" style="width:100%;border: 0" @load="resetSize" id="prdDetail-iframe" ref="prdDetailIframe"></iframe>
        </div>
      </div>
      <div class="shopDiv" ref="shopCart" slot="tabbar">
        <ul >
          <li class="shopCare">
            <router-link :to="{path:'/shoppingCare'}"></router-link>
          </li>
          <li :class="prdCol? 'star-c':'star'" @click="collection"></li>
          <li class="buy" @click="showType(true)">立即购买</li>
          <li class="addCare" @click="showType(false)">加入购物车</li>
        </ul>
      </div>
    </yd-layout>
    <!-- 规格选择弹框-->
    <div class="typeDiv">
      <yd-popup v-model="show" position="bottom" height="5rem">
        <div class="typeInfo">
          ￥ <span class="price">{{myPrice}}</span>(库存{{myStore}}件)
          <span class="close" @click="show=!show">
            <img  src="../../../img/close-button.png" alt="" />
          </span>
        </div>
        <div class="container">
          <div class="specification" v-if="SpecificationKey">
            <p>规格</p>
            <ul>
              <li v-for="type, key in prdSpecificationItem" :key="key" @click="choose(key)" :class="typeIndex === key? 'active': ''">{{type.S_FullName}}</li>
            </ul>
          </div>
          <div class="buyNum">
            <span>数量</span>
            <yd-spinner  unit="1" v-model="number" width="2.42rem" height="0.7rem"></yd-spinner>
          </div>
        </div>
        <div style="padding: 0.2rem 0.25rem">
          <span class="btn" v-show='showBtn' @click="newOrder">立即购买</span>
          <span class="btn" v-show='!showBtn' @click="addShoppingCarts">加入购物车</span>
        </div>
      </yd-popup>
    </div>
    <div id="login">
      <v-login ref="loginDiv"></v-login>
    </div>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import VSlider from '../../base/slider.vue'
  import VLogin from '../../base/login.vue'
  import { _baseUrl, _readURL, _writeURL, _detailPicBelowShow, _prdInfo, _freight, _specificationGroup, _specificationKey, _specification, _collection, _addCollection, _deleteCollection, _addShoppingCarts, _newOrder, _newOrderDetails, _productWebUrl } from '../../../common/request.js'
  import { isLogin, getImgs, reqUrl, getUUID, userPrice, getTimes,browserRedirect,myMixinLyMap } from '../../../common/index.js'
  export default {
    mixins: [myMixinLyMap],
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '商品详情页'},
        prdId: '',
        isLogin: { login:false, session: '',userId: ''},
        writeUrl:'',
        deltailPics: [],
        prdInfos:{},
        prdFreight:'',
        province:'',
        SpecificationKey: '',
        SpecificationItem1Id: '',
        prdSpecificationItem: [],
        prdCol:false,
        prdColId: '',
        show: false,
        showBtn: false,
        number:0,
        typeIndex:'',
        priceItems:[''],
        myPrice:'',
        myStore: '',
        myType: '',
        orderId: '',
        myTypeId: ''
      }
    },
    components: {
      VTopbar,
      VSlider,
      VLogin
    },
    computed:{
      iframeUrl () {
        return _baseUrl+ _productWebUrl + this.$route.query.prdId
      }
    },
    mounted: function () {
      //判断是否登录 并给获取url
      this.getisEntry()
      //获取产品id 无id跳转到首页
      this.getPrdId()
      //获取详情页轮播图
      // this.getDetailPicsShow()
      //获取商品信息
      this.getDetailPrdInfos()
      // 是否被收藏
      this.getIsCollection()
      //获取产品的规格
      this.getSpecification()
      this.$dialog.loading.open('拼命加载中')
    },
    methods: {
      getPrdId() {
        this.prdId = this.$route.query.prdId
        if (this.prdId === undefined ) {
          this.$router.push({path: '/index'})
        }
      },
      getisEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.isLogin= isLogin(_readURL)
        if(this.isLogin.login){
          this.writeUrl = reqUrl(_writeURL,this.isLogin.session)
        }
      },
      getDetailPicsShow () {
        // 详情页轮播图片
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${RelevancyId} == '"+ this.prdId +"' && ${RelevancyBizElement} == 'Attachments'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id"],"Operation":_detailPicBelowShow,"Order":"${CreateTime} ASC"})
            .then((res) => {
          let resArr = res.data.Datas
          for(let i =0;i<resArr.length;i++){
            this.$set(this.deltailPics,i+1, { ImgId:resArr[i].Id })
          }
        }).catch((err) => {
          alert(err)
        })
      },
      getDetailPrdInfos () {
        // 产品产品信息
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Id} == '"+ this.prdId +"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_prdInfo})
            .then((res) => {
            let _this = this
            this.prdInfos = res.data.Datas[0]
            //console.log(this.prdInfos)
            this.$set(this.deltailPics,0,{ImgId:this.prdInfos.ImgId})
            if(window.sessionStorage.address) {
              this.province = JSON.parse(window.sessionStorage.address).province
              this.getFreight()
            }else{
              this.getAdress (this.getFreight())
            }
            // 加载轮播图片
            this.getDetailPicsShow ()
        }).catch((err) => {
          alert(err)
        })
      },
//      getAdress () {
//        // 获取地理位置
//        let _this  = this
//        let geolocation = new BMap.Geolocation()
//        let gc = new BMap.Geocoder()
//        geolocation.getCurrentPosition(function (r) {
//          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
//            let pt = r.point
//            gc.getLocation(pt, function (rs) {
//              let addComp = rs.addressComponents
//              let address = {province:addComp.province, city:addComp.city, area:addComp.district }
//              _this.province = address.province
//              _this.getFreight ()
//              window.sessionStorage.address = JSON.stringify(address)
//            })
//          }else{
//            alert('GPS信号弱')
//          }
//        }, { enableHighAccuracy: true })
//      },
      getFreight () {
        // 获取运费
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Area_Name} like %"+ this.province+ "% && ${WarehouseId} == '"+this.prdInfos.StoreId +"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Express_Fee"],"MaxCount":"1","Operation": _freight})
            .then((res) => {
          if(res.data.Datas.length===0){
            this.prdFreight = '包邮'
          } else {
            this.prdFreight = '首重' + res.data.Datas[0].Express_Fee+"元"
          }
        }).catch((err) => {
            console.log(err)
        })
      },
      getIsCollection () {
        // 是否收藏
        if (!this.isLogin.login) {
          return
        }
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"Condition":"${CreatorId} == '"+this.isLogin.userId+"' && ${FavoriteObjectId} == '"+this.prdId+"'","Items":["Id"],"MaxCount":"1","Operation": _collection})
            .then((res) => {
          if (res.data.Datas.length > 0) {
            this.prdCol= true
            this.prdColId = res.data.Datas[0].Id
          }
        }).catch((err) => {
          alert(err)
        })
      },
      getSpecification () {
        // 获取产品规格
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductId} == '"+this.prdId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["SpecificationKey","SpecificationName"],"Operation":_specificationGroup})
            .then((res) => {
            if (res.data.Datas.length === 0) {
              this.SpecificationKey = null
              //查默认规格
              this.getDefaultSpecification()
            }else{
              this.SpecificationKey = res.data.Datas[0].SpecificationKey
              this.getSpecificationKey()
            }
        }).catch((err) => {
          console.log(err)
        })
      },
      getDefaultSpecification () {
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductId} == '"+this.prdId+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Items":["Id","Price","PriceInside","Inv","S_FullName","LYPrice"],"MaxCount":"1","Operation":_specification,"Subtables":["ShopLevelPrice"]}
        )
            .then((res) => {
          this.$dialog.loading.close()
          this.prdSpecificationItem = res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
        })
      },
      getSpecificationKey () {
        let url = this.isLogin.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductId} == '"+this.prdId+"' && ${SpecificationKey} == '"+this.SpecificationKey+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","S_Value_Name","Inv"],"Operation": _specificationKey })
            .then((res) => {
          this.SpecificationItem1Id = res.data.Datas
          this.getSpecificationItem1Id()
        }).catch((err) => {
          console.log(err)
        })
      },
      getSpecificationItem1Id () {
        let url = this.isLogin.reqUrl
        let _this = this
        let promises = this.SpecificationItem1Id.map(function (obj) {
          return _this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${SpecificationItem1Id} == '"+obj.Id+"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Items":["Id","Price","PriceInside","Inv","S_FullName","LYPrice"],"MaxCount":"1","Operation": _specification,"Subtables":["ShopLevelPrice"]})
        })
        Promise.all(promises).then(function (posts) {
          _this.$dialog.loading.close()
          let price = []
          for (let i= 0; i< posts.length;i++) {
            price[i]= posts[i].data.Datas[0]
          }
          _this.prdSpecificationItem =price
        }).catch(function(reason){
          _this.$dialog.loading.close()
        })
      },
      collection () {
        if(!this.toLogin ()){
          return
        }
        if( this.prdCol){
          this.deleteCollection ()
        }else{
          this.addCollection ()
        }
      },
      deleteCollection () {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"Data":{"EntityName":"Favorite","Items":{"Id":this.prdColId},"Status":"Deleted"},"DeleteOperationId": _deleteCollection}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '取消收藏', timeout: 1500})
            this.prdCol= false
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '取消收藏失败，请重试', timeout: 1500})
          this.prdCol= true
        })
      },
      addCollection () {
        let url = this.writeUrl
        // 随机生成 收藏夹id
        this.prdColId= getUUID()
        this.axios.post(url,{"Items":[{"AddOperationId":_addCollection,"Data":{"EntityName":"Favorite","Items":{"CreatorId":this.isLogin.userId,"FavoriteObjectId":this.prdId,"FavoriteObjectType":"Product","Id":this.prdColId,"MemberId":this.isLogin.userId,"ProductId":this.prdId},"Status":"New"}}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '已收藏', timeout: 1500})
            this.prdCol= true
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '收藏失败,请重试', timeout: 1500})
          this.prdCol= false
        })
      },
      showType (obj) {
        if(!this.toLogin ()){
          return
        }
        this.showBtn = obj
        this.show = !this.show
        this.priceItems = userPrice(this.isLogin,this.prdSpecificationItem)
        this.myPrice = this.priceItems[0]
        this.myStore = this.prdSpecificationItem[0].Inv
      },
      choose (key) {
        this.typeIndex = key
        this.number = 1
        this.myPrice = this.priceItems[key]
        this.myStore = this.prdSpecificationItem[key].Inv
        this.myType = this.prdSpecificationItem[key].S_FullName
        this.myTypeId = this.prdSpecificationItem[key].Id
        //console.log(this.myPrice,this.myStore,this.myType,this.myTypeId)
      },
      addShoppingCarts () {
        let url = this.writeUrl
        if (this.SpecificationKey && !this.myType){
          this.$dialog.toast({mes: '请选择产品规格', timeout: 1500})
          return
        }
        this.axios.post(url,{"Items":[{"AddOperationId": _addShoppingCarts,"Data":{"EntityName":"Shopping_Cart","Items":{"CreatorId":this.isLogin.userId,"MemberId":this.isLogin.userId,"Price":this.myPrice,"ProductId":this.prdId,"Product_SId":this.myTypeId,"Qnty":String(this.number),"isSelect":false},"Status":"New"}}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.toast({mes: '已加入购物车', timeout: 1500})
            this.show = !this.show
          }
        }).catch((err) => {
          this.$dialog.toast({mes: '加入购物车失败,请重试', timeout: 1500})
        })
      },
      newOrder () {
        this.$dialog.loading.open('正在提交订单...')
        let url = this.writeUrl
        if (this.SpecificationKey && !this.myType){
          this.$dialog.toast({mes: '请选择产品规格', timeout: 1500})
          return
        }
        let time = getTimes()
        //产生一个订单编号
        this.orderId = getUUID()
        this.axios.post(url,{"Items":[{"AddOperationId": _newOrder,"Data":{"EntityName":"Order","Items":{"Address_Refresh": time,"CreatorId": this.isLogin.userId,"Formal":"False","Id": this.orderId,"Line":[],"MemberId": this.isLogin.userId, 'Delivery_AddressId':this.isLogin.addressId},"Status":"New"}}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.newOrderDetails()
          }
        }).catch((err) => {
          this.$dialog.loading.close()
           this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      newOrderDetails () {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"AddOperationId": _newOrderDetails,"Data":{"EntityName":"Order_Line","Items":{"ImgId":this.prdInfos.ImgId,"OrderId": this.orderId,"Price": this.myPrice,"ProductId":this.prdId,"Product_SId": this.myTypeId,"Product_ShowName": this.prdInfos.ShowName,"Qnty":String(this.number),"S_Name":this.myType},"Status":"New"}}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.loading.close()
            window.sessionStorage.buyPrd = JSON.stringify([{prdName:this.prdInfos.ShowName,img:this.prdInfos.ImgId,price:this.myPrice,type:this.myType,pcs:this.number}])
            this.$router.push({path: '/confirmOrder', query: {prdId: this.prdId,orderId: this.orderId}})
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      toLogin () {
        if(!this.isLogin.login){
          this.$refs.loginDiv.toLogin()
          return false
        } else {
          return true
        }
      },
      resetSize () {
        let getAgent = browserRedirect()
        let oIframe = document.getElementById('prdDetail-iframe')
        let deviceWidth = ''
        if(!getAgent.isMobile){
          deviceWidth = getAgent.width
        }else{
          deviceWidth = document.documentElement.clientWidth
        }
        let deviceHeight = document.documentElement.clientHeight
        oIframe.style.width = deviceWidth + 'px'
        oIframe.style.height = deviceHeight + 'px'
        let img = this.$refs.prdDetailIframe.contentWindow.document.getElementsByTagName('img')
        for(let i = 0; i<img.length;i++){
          img[i].style.width = '100% !important'
        }
      }
    }
  }
</script>
<style>
  .detailPage .yd-grids-item{
    padding:0.18rem 0;
  }
  .detailPage .yd-slider-item img{
    height: 6.2rem;
  }
  .detailPage .yd-grids-4 .yd-grids-item:not(:nth-child(4n)):before,.yd-grids-4:before{
    border-right: 0
  }
  .detailPage .yd-grids-4:before{
    border-bottom:0;
  }
</style>
<style scoped>
  .detailPage{
    height: 100%;
    padding-bottom: .7rem;
  }
  .shopDiv{
    width:100%;
    position: fixed;
    bottom:0;
    border-top:1px solid #DBDBDB ;
    background: #fff;
  }
  .shopDiv ul{
    overflow: hidden;
  }
  .shopDiv ul li{
    box-sizing: border-box;
    float: left;
    height: 1rem;
    width:30%;
    line-height: 1rem;
    color:#fff;
    font-size:0.32rem;
  }
  .shopDiv ul li:first-child{
    border-right: 1px solid #DBDBDB ;
  }
  .shopDiv .shopCare{
    width:20%;
    background: url("../../../img/shopCare.png") no-repeat center center;
    background-size:0.46rem;
  }
  .shopCare a{
    width:100%;
    display: inline-block;
    height: 100%;
  }
  .shopDiv .buy{
    background: #E99F1B;
  }
  .shopDiv .addCare{
    background: #715329
  }
  .shopDiv .star{
    width:20%;
    background: url("../../../img/star.png") no-repeat center center;
    background-size:0.46rem;
  }
  .shopDiv .star-c{
    width:20%;
    background: url("../../../img/star-c.png") no-repeat center center;
    background-size:0.46rem;
  }
  .prdIntr h5{
    height: 0.85rem;
    line-height: 0.85rem;
    font-size: 0.32rem;
    text-align: left;
    padding:0 0.1rem;
    color: #252525;
    background: #fff;
    width: 100%;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  ul.priceDiv {
    overflow: hidden;
    background: #fff;
    padding-bottom: 0.15rem;
  }
  ul.priceDiv li{
    float: left;
    width: 1.45rem;
    border-left: 1px solid #989898;
    font-size: 0.18rem;
  }
  ul.priceDiv li:first-child{
    border-left: 0px;
  }
  .prdIntr p{
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.24rem;
    text-align: left;
    padding: 0.05rem 0.25rem;
    color: #000;
  }
  .promiseDiv img{
    height: 0.6rem;
  }
  .prdWareHouse{
    height: 0.65rem;
    line-height: 0.65rem;
    text-align: left;
    padding-left: 0.25rem;
    background: #fff;
    font-size: 0.26rem;
    color: #6E6E6E;
  }
  .prdIntr>p span{
    margin-left:0.25rem ;
  }
  .typeDiv{
    font-size: 0.25rem;
  }
  .typeDiv .typeInfo{
    height: 1rem;
    line-height: 1rem;
    box-sizing: border-box;
    text-align: left;
    padding: 0 0.25rem;
    border-bottom: 1px solid #ddd;
  }
  .typeDiv .typeInfo .price{
    color: #af8326;
    margin-right:0.1rem;
  }
  .typeDiv .typeInfo .close{
    float: right;
    height: 100%;
  }
  .typeDiv .typeInfo .close img{
    vertical-align:middle;
    width: 0.54rem;
  }
  .typeDiv .container{
    padding: 0.25rem;
    height: 2.8rem;
    overflow-y: scroll;
  }
  .specification p {
    text-align: left;
    color: #000;
  }
  .specification ul{
    overflow: hidden;
  }
  .specification ul li{
    float: left;
    border:1px solid #ddd;
    border-radius: 6px;
    height:0.6rem;
    line-height: 0.6rem;
    padding: 0 0.3rem;
    margin-right:0.2rem;
    margin-top:0.2rem;
  }
  .specification ul li.active{
    border:1px solid #af8326;
    color: #af8326;
  }
  .buyNum{
    height: 0.7rem;
    text-align: left;
    margin-top: 0.25rem;
  }
  .buyNum span {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
    line-height: 0.7rem;
    margin-right: 0.35rem;
    color:#000
  }
  .btn {
    display: inline-block;
    width: 100%;
    height:0.8rem;
    line-height: 0.8rem;
    border-radius:0.2rem;
    color:#fff;
    background:#af8326;
    font-size:0.35rem;
  }
</style>
