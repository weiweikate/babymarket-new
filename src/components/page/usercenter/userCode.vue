<template>
  <div  class="codePage">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="bg-view scrollViewDiv">
        <div class="name">{{userInfos.user}}</div>
        <div class="invite-code">分享码：{{userInfos.InvitationCode}}</div>
        <div id="qrcode"></div>
        <div class="desp">扫一扫上面的二维码图案，注册购物</div>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import QRCode from 'qrcodejs2'
  import { isLogin, getUUID, reqUrl, validatePwd, validateMobile} from '../../../common/index.js'
  import { _writeURL, _readURL, _addCode, _checkCode, _passwordRetake,_userLevel  } from '../../../common/request.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '邀请码'},
        userInfos:'',
        url:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.userInfos = this.$route.query
      this.Aqrcode()
    },
    methods: {
      Aqrcode() {
        let qrcode0 = new QRCode('qrcode', {
//          width: 300,
//          height: 300, // 高度
          text: 'https://www.babymarkt.com.cn/react/?action=download&inApp=false&fromId='+ this.userInfos.InvitationCode // 二维码内容
          // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f'
          // foreground: '#ff0'
        })
        console.log(qrcode0)
      },
      getIsEntry(){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos = isLogin(_readURL)
      }
    }
  }
</script>
<style>

</style>
<style scoped>
  .codePage{
    background:#1a1c1f;
    height: 100%;
  }

  .bg-view{
    background: white;
    border-radius: .15rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: .66rem .32rem;
    margin-top: 1.8rem !important;
    padding-bottom: .20rem;
  }

  .name{
    font-size: .32rem;
    color: #1a1c1f;
    margin-top: .50rem;
  }

  .invite-code{
    font-size: .28rem;
    color: #5e6064;
    margin-top: .22rem;
  }

  #qrcode{
    margin-top: .35rem;
    /*width: 6.54rem;*/
    /*height: 6.54rem;*/
  }

  .desp{
    font-size: .26rem;
    color: #7d7f81;
    margin-top: .50rem;
  }

</style>
