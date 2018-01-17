<template>
 <div style="height: 100%">
   <yd-layout >
     <v-topbar :title="titleAttr"  slot="navbar">
       <router-link :to="{path:'/search'}">
        <span id="opt" style="right:0.3rem">
        <yd-icon name="search" size=".3rem" color="#fff"></yd-icon>
      </span>
       </router-link>
     </v-topbar>
     <div class="indexPage">
       <div class="itemDiv">
         <!-- tab 切换栏目 需请求后台-->
         <yd-tab active-color="#715329" :callback="getSubInfo" ref="ydTab">
           <yd-tab-panel v-for="(item,index) in topBar0" :label="item.Name" :tabkey="item.Id" :key="index">
             <div v-if="index === 0">
               <!-- 首页轮播-->
               <v-slider :getSubPagePics="indexPics"></v-slider>
               <!-- 码头快报-->
               <div class="notice" style="text-align: left">
                 <div>码头<span>快报</span></div>
                 <p>
                   <router-link :to="{path:'/prdDetail',query:{prdId:LYnotice.prdId}}">{{LYnotice.prdName}}</router-link>
                 </p>
               </div>
               <!-- 展示图片 不轮播-->
               <div v-for="(indexBelowShow,index) in indexBelowShows" :key="index">
                 <div @click="goDetailPage(indexBelowShow.ProductId,indexBelowShow.ImgId)">
                   <img :src="getIndexPic(indexBelowShow.ImgId)" width="100%" style="margin-top:0.25rem" alt=""/>
                 </div>
               </div>
               <!-- 老友爆款-->
               <v-product-info-bk :getBKPrdInfos=" BKlists" :otherAtrr="LYBK"></v-product-info-bk>
               <!--首页列表展示 -->
               <v-product-info :getSubPrdInfos="lists" :otherAtrr="showMoreAtrr"></v-product-info>
             </div>
             <div v-else="index !== 0">
               <!-- 二级标题页面轮播-->
               <v-slider :getSubPagePics="subPagePics[index-1]"></v-slider>
               <!-- 二级标题产品展示-->
               <v-product-info :getSubPrdInfos="subPrdInfos[index-1]" :otherAtrr="showMoreAtrr"></v-product-info>
             </div>
           </yd-tab-panel>
         </yd-tab>
       </div>
     </div>
     <v-navbar slot="tabbar"></v-navbar>
   </yd-layout>
 </div>

</template>

<script>
  import VSlider from '../base/slider.vue'
  import VProductInfo from '../base/productInfo.vue'
  import VProductInfoBk from '../base/productInfoBk.vue'
  import VTopbar from '../base/topBar.vue'
  import VNavbar from '../base/navBar.vue'
  import { mapMutations } from 'vuex'
  import { _readURL, _prdType, _LYnotice, _prdLabel, _prdTarget,_picBelowShow, _prdInfo } from '../../common/request.js'
  import { isLogin, getImgs} from '../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '老友码头'},
        topBar0: [], // tab路面标题
        lists: [], // 首页的产品信息
        BKlists:[], // 老友爆款产品
        subPrdInfos: [], // 二级标题产品信息
        readUrl: '',
        userInfos:'', // 用户信息
        indexPics:[], // 主页轮播
        subPagePics:[], // 二级标题轮播图片
        indexBelowShows:[],// 海报
        LYnotice: {prdName:'',prdId:''}, // 老友快报
        LYBK:{ prdId:'', name: '',theme:'4',isLogin:false,type:''},
        times: [], // tab栏目被点击的次数 二次点击的时候不请求
        showMoreAtrr: {theme: 2,show: true,isLogin: false,type:''},
        outIndex: false // 是否跳转到更多产品的页面
      }
    },
    components: {
      VTopbar,
      VNavbar,
      VSlider,
      VProductInfo,
      VProductInfoBk
    },
    beforeRouteLeave (to, from, next) {
      if(to.name==='prdMore'){
        this.outIndex = true
        this.refSubPicsShow( [])
        this.refSubPrdInfo( [])
        if(to.query.theme){
          this.getLYexplosion()
        }else{
          this.getSubInfoShow(this.readUrl,to.query.prdId)
        }
        next()
      }else{
        this.outIndex = false
        next()
      }
    },
    mounted: function () {
      this.$router.options.routes[1].meta.keepAlive = true
      //判断是否登录
      this.getisEntry ()
      //获取首页轮播和展示图片
      this.getIndexPicShow ()
      //获取首页产品信息
      this.getIndexPrdItem()
      //获取码头快报
      this.getLYnotice()
      //获取老友爆款
      this.getLYexplosion(3)
    },
    methods: {
      ...mapMutations({
        refSubPicsShow: 'refSubPicsShow',
        refSubPrdInfo:'refSubPrdInfo'
      }),
      getSubInfo (label,tabkey0) {
        if( label ==='首页') {
          return
        }
        let tabkey = tabkey0.slice(0,tabkey0.length-1)
        let index = parseInt(tabkey0.substring(tabkey0.length-1))
        let url = this.readUrl
        //this.showMoreAtrr.isLogin = this.userInfos
        // 第一次点击标题栏目的时候请求内容 并存在数组中 第二次点击不请求
        if(this.times[index] === undefined){
          this.getSubInfoShow(url,tabkey,index)
          this.times[index] =1
        }
      },
      getSubInfoShow (url,tabkey,index) {
        this.showMoreAtrr.isLogin = this.userInfos.login
        this.showMoreAtrr.type = this.userInfos.MemberTypeKey
        this.showMoreAtrr.show = false
        // 请求二级标题的轮播图片
        this.getSubPicShow(url,tabkey,index)
        // 获取二级标题的分类
        let _this = this
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${IsShow} == 'True' && ${ParentId} == '" + tabkey +"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","Name","ImgId","Description","CategoryMaxShow","Order"],"Operation":_prdType,"Order":"${Order} ASC"}
        ).then((res) => {
          let prdIntr =[]
          let res0 =  res.data.Datas
          for (let i=0;i<res0.length;i++){
            prdIntr[res0[i].Name] = res0[i].Id
          }
          this.getSubPrdIntr(prdIntr,url,index)
        }).catch((err) => {
          _this.getSubInfoShow()
        })
      },
      getSubPicShow (url,tabkey,index){
        // 请求二级标题的轮播图片
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductCategoryId} == '" + tabkey +"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","ImgId","LinkTypeKey","KeyWord","Url","ProductId","Name","BelowShow"],"Operation": _picBelowShow})
            .then((res) => {
          if(this.outIndex){
            this.refSubPicsShow(res.data.Datas)
          }
          this.$set(this.subPagePics,index,res.data.Datas)
        }).catch((err) => {
          alert(err)
        })
      },
      getSubPrdIntr (indexItem,url,index) {
        // 获取二级标题分类的具体产品
        let _this = this
        let  indexItemUrl= []
        let keyName =[]
        let reqArr = []
        let resArr =[]
        for (let key0 in indexItem){
          indexItemUrl.push(indexItem[key0])
          keyName.push(key0)
        }
        let promises = indexItemUrl.map(function (id) {
          return _this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductCategoryInsideId} == '"+id+"' || ${Product_CategoryId} == '"+id+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","ShowName","Subtitle","SalePrice","LYPrice","PriceInside","ImgId","Inv","Unit","ProductCategoryInsideId","Import","LimitQnty","Order","AccPrice"],"MaxCount":"9999","Operation": _prdInfo,"Order":"${Order} ASC"})
        })
        Promise.all(promises).then(function (posts) {
          for(let i =0;i<posts.length;i++){
            reqArr = posts[i].data.Datas
            reqArr.unshift({Name:keyName[i],isLogin:_this.userInfos.login})
            resArr.push(reqArr)
          }
          if(_this.outIndex){
            _this.refSubPrdInfo(resArr)
          }
          _this.$set(_this.subPrdInfos,index,resArr)
        }).catch(function(reason){
          this.getSubPrdIntr()
        })
      },
      getIndexPicShow () {
        let url = this.readUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${IsHomePageShow} == 'True' || ${BelowShow} == 'True'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","ImgId","LinkTypeKey","KeyWord","Url","ProductId","Name","BelowShow"],'Operation': _picBelowShow })
          .then((res) => {
           let picArr = []
           for(let i=0;i<res.data.Datas.length;i++){
             if(res.data.Datas[i].BelowShow === 'True') {
               let obj = {Name: res.data.Datas[i].Name, ProductId: res.data.Datas[i].ProductId, ImgId: res.data.Datas[i].ImgId, LinkTypeKey: res.data.Datas[i].LinkTypeKey, Url: res.data.Datas[i].Url}
               this.indexBelowShows.push(obj)
               //this.indexBelowShow= {Name: res.data.Datas[i].Name, ProductId: res.data.Datas[i].ProductId, ImgId: res.data.Datas[i].ImgId, LinkTypeKey: res.data.Datas[i].LinkTypeKey, Url: res.data.Datas[i].Url}
               //console.log(this.indexBelowShow)
             } else {
               picArr.push(res.data.Datas[i])
             }
           }
           this.indexPics = picArr
          //console.log(this.indexBelowShows)
        }).catch((err) => {
            alert(err)
        })
      },
      goDetailPage (prdId,imgId) {
        this.$router.push({path: '/prdDetail', query: {prdId: prdId,imgId:imgId}})
      },
      getIndexPic (id) {
        //获得产品的图片
        return getImgs(id)
      },
      getisEntry () {
        //判断是否登录 并获取session
        this.userInfos = isLogin(_readURL)
        this.readUrl=this.userInfos.reqUrl
        //this.userInfos = entry.login
      },
      getLYnotice () {
        // 获得老友快报内容
        let url = this.readUrl
        this.axios.post(url,{'Operation': _LYnotice})
          .then((res) => {
            this.LYnotice.prdName = res.data.Datas[0].Title
            this.LYnotice.prdId = res.data.Datas[0].ProductId
          }).catch((err) => {
            alert(err)
        })
      },
      getLYexplosion (num) {
        //获取老友爆款
        let url = this.readUrl
        let opt= ''
        let name  = ''
        this.axios.post(url,{'Operation':  _prdLabel})
          .then((res) => {
            opt = res.data.Datas[0].Id
            name = res.data.Datas[0].Name
            let BKimg = [{ImgId:res.data.Datas[0].ImgId}]
            let param = {"Appendixes":{"+Product":["Name","ImgId","SalePrice","Subtitle","Inv","LYPrice","AccPrice"]},"AppendixesFormatType":1,"Condition":"${TargetId} == '"+opt+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","Name","ProductId"],"Operation": _prdTarget}
            if (num){
              param["MaxCount"]= num
            }
            this.axios.post(url,param)
              .then((res) => {
                let LYprdArr = res.data.Appendixes
                for (let i=0;i<LYprdArr.length;i++){
                  LYprdArr[i].ProductId= res.data.Datas[i].ProductId
                  LYprdArr[i].Id= res.data.Datas[i].Id
                }
                if(this.outIndex){
                  this.refSubPrdInfo(LYprdArr)
                  this.refSubPicsShow(BKimg)
                } else {
                  this.BKlists =LYprdArr
                }

                this.LYBK = { prdId: opt , name: name,theme:'4', isLogin: this.userInfos.login,type:this.userInfos.MemberTypeKey}
              })
          }).catch((err) => {
            alert(err)
          })
      },
      getIndexPrdItem () {
        // 获得首页产品分类（二级导航栏）
        let url = this.readUrl
        this.axios.post(url, { 'Condition': '${IsShow} == True && ${ShowInHomepage} == True && ${Hierarchy} == 1', 'Operation': _prdType,  "IsReturnTotal":true, "Items":["Id", "Name", "ImgId", "MaxShow", "Order"], "Order":"${Order} ASC"})
          .then((res) => {
            let arr =res.data.Datas
            let indexItem =[]
            for (let i=0;i<arr.length;i++){
              indexItem[arr[i].Name]=arr[i].Id
              res.data.Datas[i].Id = res.data.Datas[i].Id+i
            }
            res.data.Datas.unshift({'Name':'首页'})
            this.topBar0 = res.data.Datas
            this.getIndexPrd (indexItem,url)
          }).catch((err) => {
            alert(err)
          })
      },
      getIndexPrd (indexItem,url) {
        // 首页的获得产品信息
        let _this = this
        let  indexItemUrl= []
        let keyName =[]
        let reqArr = []
        this.showMoreAtrr.isLogin = this.userInfos.login
        this.showMoreAtrr.type = this.userInfos.MemberTypeKey
        for (let key0 in indexItem){
            indexItemUrl.push(indexItem[key0])
            keyName.push(key0)
        }
        let promises = indexItemUrl.map(function (id) {
            return _this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${FirstCategoryId} == '"+id+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","ShowName","Subtitle","SalePrice","LYPrice","PriceInside","ImgId","Inv","Unit","ProductCategoryInsideId","Import","LimitQnty","Order","AccPrice"],"MaxCount":"4","Operation": _prdInfo,"Order":"${Order} ASC"})
        })
        Promise.all(promises).then(function (posts) {
           for(let i =0;i<posts.length;i++){
               reqArr = posts[i].data.Datas
               reqArr.unshift({Name:keyName[i],Id:indexItemUrl[i],isLogin: _this.userInfos.login})
               _this.lists.push(reqArr)
           }
        }).catch(function(reason){
            alert(reason)
        });
      }
    }
  }
</script>
<style>
  .indexPage .yd-list-theme4 .yd-list-item{
    padding-top: 0.7rem;
  }
  .indexPage .yd-list-theme4 .yd-list-item:not(:last-child):after{
    border:1px solid transparent;
  }
  .indexPage .yd-list-theme4 .yd-list-item .yd-list-title{
    padding-left: 0.15rem;
  }
  .indexPage .yd-list-img{
    background: #ffffff !important;
  }
  .indexPage .yd-list-theme2 .yd-list-item .yd-list-title{
    font-size: 0.25rem;
    text-align: center;
    padding:0 0.05rem;
    color:#95651E ;
    font-weight: normal;
    height: 0.6rem;
    line-height: 0.6rem;
    background: #F1ECE2;
  }
  .indexPage .yd-list-other{
    padding: 0.3rem 0;
  }
  .indexPage .yd-list-theme2 .yd-list-item .yd-list-mes{
    padding: 0;
  }
  .indexPage .yd-tab-panel-item{
    background: #F5F6F7;
  }

</style>
<style scoped>

  .searchbar{
    height: 0.65rem;
    line-height: 0.65rem;
    text-align: left;
    padding-left: 0.15rem;
    margin: 0.1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: #fff;
  }
  .indexPage{
    background: #F5F6F7 ;
  }
  .itemDiv{
    font-size:13px;
  }
  .yd-tab-nav-item:not(:last-child):after {
    border-right: 0px !important;
  }
  .notice{
      text-align: left;
      overflow: hidden;
      background: #fff;
      padding:0.2rem 0;
      border-bottom:1px solid #eeeff0;
  }
  .notice div{
      float: left;
      font-size:0.3rem;
      height: 0.85rem;
      line-height: 0.85rem;
      width: 24%;
      text-align: center;

  }
  .notice p{
      float: right;
      font-size:0.30rem ;
      color: #C5A563;
      height: 0.85rem;
      overflow: hidden;
      width:76%;
      box-sizing: border-box;
      border-left: 1px solid #dddfe0;
      padding:0 0.15rem;
      line-height: 0.42rem;
  }
  .notice div span{
      padding:0.05rem 0.1rem;
      border-radius: 0.08rem;
      color: #fff;
      background: #BD0E00;
  }
</style>

