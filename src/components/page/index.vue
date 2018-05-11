<template>
 <div style="height: 100%" class="index">
   <yd-layout >
     <v-topbar :title="titleAttr"  slot="navbar">
       <router-link :to="{path:'/search'}">
        <span id="opt" style="right:0.3rem">
        <yd-icon name="search" size=".3rem" color="#fff"></yd-icon>
      </span>
       </router-link>
     </v-topbar>
     <div class="indexPage prdListTheme scrollViewDiv">
       <div class="itemDiv">
         <!-- tab 切换栏目 需请求后台-->
         <yd-tab active-color="#715329" :callback="getSubInfo" ref="ydTab">
           <yd-tab-panel v-for="(item,index) in topBar0" :label="item.Name" :tabkey="item.Id" :key="index">
             <div v-if="index === 0">
               <!-- 首页轮播-->
               <v-slider :getSubPagePics="indexPics" ></v-slider>
               <!-- 码头快报-->
               <div class="notice" style="text-align: left">
                 <div>码头<span>快报</span></div>
                 <p v-if="LYnotice.Title" @click="clickedJumpPage(LYnotice)">
                   {{LYnotice.Title}}
                 </p>
               </div>
               <!-- 为你推荐-->
               <div class="indexType recommend" v-for="(hotReads,index) in hotReadList" :key="index" >
                 <p>—— {{hotReads.Name}} ——</p>
                 <ul>
                   <li v-for="(hotRead,hotReadIndex) in hotReads.SelectDetail" :key="hotReadIndex" @click="clickedJumpPage(hotRead)">
                     <img v-lazy='getIndexPic(hotRead.ImgId)' alt=""/>
                   </li>
                 </ul>
               </div>
               <!-- 专题精选-->
               <div class="indexType">
                  <p>—— 专题惊选 ——
                    <span>
                      <router-link :to="{path: '/topic'}">更多>></router-link>
                    </span>
                  </p>
                 <v-topic-items v-for="(topicList,index) in topicLists"
                                 :key="index" :topicList="topicList" :userInfos="userInfos">
                 </v-topic-items>
               </div>
             </div>
             <div v-else-if="item.Name == '众筹'">
               <v-crowdfunding-list :crowdfundingList="subPrdInfos[index-1]"></v-crowdfunding-list>
             </div>
             <div v-else>
               <!-- 二级标题页面轮播-->
               <v-slider :getSubPagePics="subPagePics[index-1]" ></v-slider>
               <!-- 二级标题产品展示-->
               <v-product-info :getSubPrdInfos="subPrdInfos[index-1]" :otherAtrr="showMoreAtrr">
                 <v-icon :icons="iconId[index-1]" ></v-icon>
               </v-product-info>
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
  import VTopicItems from '../base/topicItems.vue'
  import VCrowdfundingList from '../base/crowdfundingList.vue'
  import VIcon from '../base/icon.vue'
  import VSlider from '../base/slider.vue'
  import VProductInfo from '../base/productInfo.vue'
  import VTopbar from '../base/topBar.vue'
  import VNavbar from '../base/navBar.vue'
  import { mapMutations } from 'vuex'
  import { _readURL, _prdType, _LYnotice, _prdLabel, _prdTarget,_picBelowShow, _prdInfo, _topic, _hotRead } from '../../common/request.js'
  import { isLogin, myMixinClickedJump} from '../../common/index.js'
  export default {
    mixins: [myMixinClickedJump],
    data () {
      return {
        titleAttr: {'isShow': false, 'name': '老友码头'},
        topBar0: [], // tab路面标题
        lists: [], // 首页的产品信息
        subPrdInfos: [], // 二级标题产品信息
        crowdfundingProducts:[],// 众筹项目
        userInfos:{}, // 用户信息
        indexPics:[], // 主页轮播
        subPagePics:[], // 二级标题轮播图片
        indexBelowShows:[],// 海报
        LYnotice:{}, // 老友快报
        times: [], // tab栏目被点击的次数 二次点击的时候不请求
        showMoreAtrr: {theme: 2,show: true,isLogin: false,type:''},
        outIndex: false, // 是否跳转到更多产品的页面
        iconId:[],// 保存icon图标
        topicLists:[], // 首页专题精选
        hotReadList:'',// 首页为你推荐等精选
      }
    },
    components: {
      VTopbar,
      VNavbar,
      VSlider,
      VProductInfo,
      VIcon,
      VTopicItems,
      VCrowdfundingList
    },
    beforeRouteLeave (to, from, next) {
      if(to.name==='prdMore'){
        this.outIndex = true
        this.refSubPicsShow( [])
        this.refSubPrdInfo( [])
        if(to.query.theme){
          this.getLYexplosion()
        }else{
          this.getSubInfoShow(this.userInfos.reqUrl,to.query.prdId)
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
      // 获取首页精选推荐
      this.getHotread()
      //获取首页专题介绍
      this.getTopicInfos()
    },
    methods: {
      ...mapMutations({
        refSubPicsShow: 'refSubPicsShow',
        refSubPrdInfo:'refSubPrdInfo'
      }),
      getSubInfo (label,tabkey0) {
        let tabkey = tabkey0.slice(0,tabkey0.length-1)
        let index = parseInt(tabkey0.substring(tabkey0.length-1))
        let url = this.userInfos.reqUrl
        // 点击首页按钮不请求 第一次点击标题栏目的时候请求内容 并存在数组中 第二次点击不请求
        if( label ==='首页'|| this.times[index] !== undefined) {
          return
        } else if (label ==='众筹'){
          this.getCrowdfundingProducts(url,tabkey,index)
        } else {
          this.getSubInfoShow(url,tabkey,index)
        }
        this.times[index] =1
      },
      getCrowdfundingProducts(url,tabkey,index){
        // 获取众筹
        this.$dialog.loading.open('拼命加载中')
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductCategoryInsideId} == '"+tabkey+"' || ${Product_CategoryId} == '"+tabkey+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","ShowName","Subtitle","SalePrice","LYPrice","PriceInside","ImgId","Inv","Unit","ProductCategoryInsideId","Import","LimitQnty","Order","AccPrice"],"MaxCount":"9999","Operation": _prdInfo,"Order":"${Order} ASC"})
          .then((res) => {
          console.log(res.data.Datas)
          if(res.data.Datas.length>0){
            this.$set(this.subPrdInfos,index,res.data.Datas)
          }
          this.$dialog.loading.close()
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getSubInfoShow (url,tabkey,index) {
        this.showMoreAtrr.isLogin = this.userInfos.login
        this.showMoreAtrr.type = this.userInfos.MemberTypeKey
        this.showMoreAtrr.show = false
        // 请求二级标题的轮播图片
        this.getSubPicShow(url,tabkey,index)
        // 获取二级标题的分类
        this.getSubPrdIcons(url,tabkey,index)
      },
      getSubPicShow (url,tabkey,index){
        // 请求二级标题的轮播图片
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ProductCategoryId} == '" + tabkey +"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _picBelowShow})
            .then((res) => {
          if(this.outIndex){
            this.refSubPicsShow(res.data.Datas)
          }
          this.$set(this.subPagePics,index,res.data.Datas)
        }).catch((err) => {
          alert(err)
        })
      },
      getSubPrdIcons (url,tabkey,index){
        // 获取二级标题的分类
        let _this = this
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${IsShow} == 'True' && ${ParentId} == '" + tabkey +"'","IsIncludeSubtables":true,"IsReturnTotal":true,"Items":["Id","Name","ImgId","Description","CategoryMaxShow","Order",'IconId'],"Operation":_prdType,"Order":"${Order} ASC"}
        ).then((res) => {
          let prdIntr =[]
          this.iconId[index] = res.data.Datas
          for (let i= 0; i<this.iconId[index].length;i++){
            this.iconId[index][i].link = '/prdItems?showIndex='+i+"&name="+this.iconId[index][i].Name
            this.iconId[index][i].rows = this.iconId[index].length
          }
          let res0 =  res.data.Datas
          for (let i=0;i<res0.length;i++){
            prdIntr[res0[i].Name] = res0[i].Id
          }
          this.getSubPrdIntr(prdIntr,url,index)

        }).catch((err) => {
          _this.getSubInfoShow()
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
          _this.refSubPrdInfo(resArr)
        }).catch(function(reason){
          this.getSubPrdIntr()
        })
      },
      getIndexPicShow () {
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${IsHomePageShow} == 'True' || ${BelowShow} == 'True'","IsIncludeSubtables":false,"IsReturnTotal":true,'Operation': _picBelowShow })
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
      getisEntry () {
        //判断是否登录 并获取session
        this.userInfos = isLogin(_readURL)
        //this.readUrl=this.userInfos.reqUrl
        //this.userInfos = entry.login
      },
      getLYnotice () {
        // 获得老友快报内容
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Items":['Id', 'Title', 'LinkTypeKey', 'ProductId', 'SubjectId', 'CategoryId', 'KeyWord'],"Order": "${CreateTime} DESC",'Operation': _LYnotice})
          .then((res) => {
            if(res.data.Datas.length>0){
              this.LYnotice = res.data.Datas[0]
            }
          }).catch((err) => {
            alert(err)
        })
      },
      getHotread () {
        // 首页为你推荐等精选
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":true,"IsReturnTotal":true,"MaxCount":999,"Operation": _hotRead})
          .then((res) => {
          this.$dialog.loading.close()
          this.hotReadList = res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getIndexPrdItem () {
        // 获得首页产品分类（二级导航栏）
        let url = this.userInfos.reqUrl
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
            //this.getIndexPrd (indexItem,url)
          }).catch((err) => {
            alert(err)
          })
      },
      getTopicInfos () {
        // 获取首页的精选
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${Deleted} == 'False'&& ${Hide} == 'False'","IsIncludeSubtables":true,"IsReturnTotal":true,"Operation": _topic})
          .then((res) => {
          this.$dialog.loading.close()
          this.topicLists = res.data.Datas
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>
<style>

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
      line-height: 0.85rem;
  }
  .notice div span{
      padding:0.05rem 0.1rem;
      border-radius: 0.08rem;
      color: #fff;
      background: #BD0E00;
  }
  .indexType p{
    height: 1rem;
    line-height: 1rem;
    background: #fff;
    position: relative;
    font-size: .3rem;
  }
  .indexType span{
    position: absolute;
    right: .3rem;
  }
  .recommend {
    background: #fff;
    margin: .15rem 0;
  }
  .recommend ul{
    overflow: hidden;
    padding: 0 .26rem .26rem .26rem;
    width: 100%;
  }
  .recommend ul li{
    float: left;
    margin:.03rem .02rem;
    width:3.44rem;
    height: 2.02rem;
    overflow: hidden;
    box-sizing: border-box;
  }
  .recommend ul li img{
    width: 100%;
  }

</style>

