<template>
 <div style="height: 100%">
   <yd-layout>
     <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
     <div class="demo-iframe-holder " style="box-sizing:border-box;width:100%">
       <div class="prdInfoDiv" style="width:100%">
         <iframe ref="topicInfo" id="show-iframe" @load="resetUrl()" :src="iframeUrl"  style="width:100%;border:0" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
       </div>
     </div>
   </yd-layout>
 </div>

</template>

<script>
  import VTopbar from './../../base/topBar.vue'
  import { _baseUrl, _subjectWebUrl } from '../../../common/request.js'
  import { browserRedirect } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow':true, 'name': ''},
        prdId:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      //this.$dialog.loading.open('拼命加载中')
      this.titleAttr.name = this.$route.query.title
    },
    computed:{
      iframeUrl () {
        return _baseUrl + _subjectWebUrl + this.$route.query.prdId
      }
    },
    methods: {
      resetUrl () {
        // 重置Iframe的高度
        let _this = this
        let getAgent = browserRedirect()
        const oIframe = document.getElementById('show-iframe')
        let deviceWidth = ''
        if(!getAgent.isMobile){
          deviceWidth = getAgent.width
        }else{
          deviceWidth = document.documentElement.clientWidth
        }
        let deviceHeight = document.documentElement.clientHeight
        oIframe.style.width = deviceWidth + 'px'
        oIframe.style.height = deviceHeight + 'px'
        let a = this.$refs.topicInfo.contentWindow.document.getElementsByTagName('a')
        let img = this.$refs.topicInfo.contentWindow.document.getElementsByTagName('img')
        for(let i = 0; i<img.length;i++){
          img[i].style.width = '100% !important'
        }
        let id = a[0].href
        let index = id.match('Id').index
        _this.prdId = id.slice(index+3)
        // window.sessionStorage.subId = id.slice(index+3)
        // let hrefB = '/#/prdDetail?prdId='+ id.slice(index+3)
        a[0].href = 'javascript:void(0)'
        a[0].onclick = function() {
          _this.goDetailPage()
        }
        //this.$dialog.loading.close()
      },
      goDetailPage() {
        this.$router.push({path:'/prdDetail',query:{prdId:this.prdId}})
      }
    }
  }
</script>

<style scoped>
</style>
