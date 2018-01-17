<template>
  <div style="height:100%">
    <yd-layout>
      <!-- 搜索框-->
      <div class="searchBar" slot="navbar">
        <div>
          <yd-search placeholder="码头上线，惊喜多多" v-model="keyWord"  :on-submit="submitHandler"></yd-search>
        </div>
        <span class="cancel" @click.prevent="cancelHandler">取消</span>
      </div>
      <div class="search">

        <div class="searchContent" v-show="show">
          <!-- 最近搜索-->
          <div class="recentSearch">
            <p v-if="recentSearches.length>0">
              <span class="fl">最近搜索</span>
              <span class="fr" @click="deleteSearchKeyWords"><img src="../../img/delete.png" alt=""/></span>
            </p>
            <ul>
              <li v-for="(recentSearch,index) in recentSearches" :key="index" @click.prevent="searchKeyWords(recentSearch)">{{recentSearch}}</li>
            </ul>
          </div>
          <!-- 热门搜索-->
          <div class="hotSearch">
            <p ref="my">
              <span class="fl">热门搜索</span>
            </p>
            <ul>
              <li v-for="(hotSearch,index) in hotSearches" @click.prevent="searchKeyWords(hotSearch.Keyword)">{{hotSearch.Keyword}}</li>
            </ul>
          </div>
        </div>
        <!-- 搜索结果-->
        <div class="searhResult indexPrd indexPage" v-show="!show">
          <div class="prdIntr" v-if="searhResultLists.length>0">
            <yd-list theme="2">
              <yd-list-item v-for="searhResult, key in searhResultLists" :key="key"  @click.native="goDetailPage(searhResult.Id)">
                <img slot="img" v-lazy="getPic(searhResult.ImgId)">
                <span slot="title">{{searhResult.ShowName}}</span>
                <yd-list-other slot="other">
                  <div class="priceDiv" v-if="userInfos.login && (userInfos.MemberTypeKey == '3')">
                    <span class="AccPrice">￥ {{searhResult.AccPrice}}</span>
                    合作尊享
                  </div>
                  <div class="priceDiv">
                    <span class="LYPrice">￥ {{searhResult.LYPrice}}</span>
                    老友专享
                  </div>
                  <div class="priceDiv">
                    <span class="SalePrice">￥ {{searhResult.SalePrice}}</span>
                    市场价
                  </div>
                </yd-list-other>
              </yd-list-item>
            </yd-list>
          </div>
          <div v-if="showNo" class="noResult">
            抱歉，没有找到与“ <span class="keyword">{{keyWord}}</span>”相关的您可以换一个词试试
          </div>
        </div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import { reqUrl, isLogin, getImgs, Trim } from '../../common/index.js'
  import { _readURL, _topic, _writeURL, _hotKeyWords, _addSearchKeyWords, _searchKeyWords } from  '../../common/request.js'
  export default {
    data () {
      return {
        keyWord:'',
        userInfos: [],
        writeUrl: '',
        recentSearches: [], // 最近搜索
        hotSearches: [], // 热门搜索
        searhResultLists: '', // 保存搜索结果
        show:true,
        showNo:false //是否有结果
      }
    },
    mounted: function () {
      this.getIsEntry()
      // 查询热门搜索关键词
      this.getHotKeyWords()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        // 如何登入那么就渲染最近搜索
        if (window.localStorage.recentSearch) {
          this.recentSearches = JSON.parse(unescape(window.localStorage.recentSearch))
        }
        // 判断是否带有查询参数
        if (this.$route.query.keyword){
          this.show = false
          this.searchKeyWords(this.$route.query.keyword)
        }
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        }
      },
      getHotKeyWords () {
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","Keyword","HightLight","DateTime"],"MaxCount":"10","Operation": _hotKeyWords ,"Order":"${Count} DESC"}).then((res) => {
          this.hotSearches = res.data.Datas
        }).catch((err) => {
          alert(err)
        })
      },
      searchKeyWords (keyWord) {
        this.$dialog.loading.open('拼命加载中')
        // 去掉文字中的空格
        this.keyWord = keyWord.replace(/\s+/g,"")
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${KeyWord} like %"+ this.keyWord +"% || ${ShowName} like %"+ this.keyWord +"%","IsIncludeSubtables":false,"IsReturnTotal":false,"Items":["Id","ShowName","Subtitle","SalePrice","LYPrice","PriceInside","ImgId","Inv","Unit","ProductCategoryInsideId","Import","LimitQnty","Order","AccPrice"],"MaxCount":"20","Operation": _searchKeyWords,"Order":"${Order} ASC"}).then((res) => {
          this.show = false
          this.$dialog.loading.close()
          this.searhResultLists = res.data.Datas
          if (this.searhResultLists.length>0) {
            this.showNo = false
          } else {
            this.showNo = true
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      addSearchKeyWords (keyWord) {
        let url = this.writeUrl
        this.axios.post(url,{"Items":[{"AddOperationId":_addSearchKeyWords ,"Data":{"EntityName":"Search","Items":{"Keyword":keyWord},"Status":"New"}}]}).then((res) => {
          // 重新v-for 渲染
          if(JSON.stringify(res.data) == "{}"){
            for (let i = 0; i< this.recentSearches.length;i++) {
              if (keyWord == this.recentSearches[i]){
                this.recentSearches.splice(i,1)
              }
            }
            this.recentSearches.splice(0,0,keyWord)
            let storage = window.localStorage.recentSearch
            if(storage){
              window.localStorage.recentSearch= escape(JSON.stringify(this.recentSearches))
            } else {
              // 第一次添加
              window.localStorage.recentSearch = escape(JSON.stringify([keyWord]))
            }
          }
        }).catch((err) => {
          alert(err)
        })
      },
      deleteSearchKeyWords () {
        // 删除最近搜索
        window.localStorage.removeItem('recentSearch')
        this.recentSearches = []
      },
      submitHandler () {
        if (!this.keyWord){
          return
        }
        let keyWord = Trim(this.keyWord)
        // 如果客户登录了 就增加搜索记录
        this.addSearchKeyWords(keyWord)
        // 搜索相关内容
        this.searchKeyWords(keyWord)
      },
      cancelHandler () {
        this.$router.push({path: '/index'})
      },
      getPic (id) {
        return getImgs(id)
      },
      goDetailPage (prdId) {
        this.$router.push({path: '/prdDetail', query: {prdId: prdId}})
      }
    }
  }
</script>
<style>
  .searchBar .yd-search .yd-search-input{
    background:#715329;
  }
  .searchBar .yd-search-input>.search-input{
    background: #61441a;
  }
  .searchBar .yd-search .yd-search-input>.cancel-text{
    color: #fff;
    display: none !important;
  }
  .searchBar ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #b19e83;
  }
  .searchBar :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #b19e83;
  }
  .searchBar ::-webkit-input-placeholder { /* WebKit browsers */
    color: #b19e83;
  }
  .searchBar ::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #b19e83;
  }
  .searchBar .yd-input>input{
    color:#fff;
    font-size: 0.28rem;
  }
  .searchBar .yd-search-input:before,.searchBar .yd-search-input:after{
    border:0;
  }
</style>
<style scoped>
  .searchBar{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 999;
    text-align: left;
    background:#715329;
    font-size:0;
  }
  .searchBar> div{
    width:89%;
    display:inline-block;
  }
  .searchContent>div>p{
    overflow: hidden;
    font-size:.3rem;
    padding-top:.35rem;
    padding-bottom: .17rem;
    padding-right: .22rem;
  }
  .searchContent>div>p img{
    width:0.42rem;
    vertical-align: middle;
  }
  .searchContent{
    padding-left: .22rem;
  }
  .searchContent ul{
    overflow: hidden;
  }
  .searchContent ul li{
    float: left;
    font-size: .3rem;
    color:#5c5f65 ;
    border: 1px solid #dcdedf;
    border-radius: 5px;
    padding:.12rem .24rem;
    margin-right:.2rem ;
    margin-top:.18rem;
  }
  .cancel{
    display: inline-block;
    color:#fff;
    height:50px;
    line-height: 50px;
    font-size: .28rem;
  }
  .keyword{
    color:red
  }
  .noResult{
    position: absolute;
    top: 50vh;
    width: 100%;
    font-size: .32rem;
    padding:0 .4rem;
  }
</style>
