<template>
  <!-- 我的-->
  <div class="userCenter">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div>
        <div class='topBar'>
          <div class="user">
            <div class="userPic">
              <img :src="imgSrc" alt=""/>
            </div>
            <div v-if="!isLogin">
              <button class="loginBtn" @click="goToLogin">注册/登录</button>
            </div>
            <div v-else="!isLogin" class="userName">
              <span>{{userName}}</span>
            </div>
          </div>
          <div class="myOrder">
            <yd-cell-group>
              <yd-cell-item arrow type="link" href="/userOrders">
                <span slot="left">我的订单</span>
              </yd-cell-item>
            </yd-cell-group>
            <div class="myorderItem">
              <yd-flexbox>
                <yd-flexbox-item>
                  <router-link :to="{path:'/userOrders',query:{Id:0}}">
                    <span class="ReturnGood"></span>全部
                  </router-link>
                </yd-flexbox-item>
                <yd-flexbox-item>
                  <router-link :to="{path:'/userOrders',query:{Id:1}}">
                    <span class="my"></span>待付款
                  </router-link>
                </yd-flexbox-item>
                <yd-flexbox-item>
                  <router-link :to="{path:'/userOrders',query:{Id:2}}">
                    <span class="waitDeliver"></span>待发货
                  </router-link>
                </yd-flexbox-item>
                <yd-flexbox-item>
                  <router-link :to="{path:'/userOrders',query:{Id:3}}">
                    <span class="hasDeliver"></span>已发货
                  </router-link>
                </yd-flexbox-item>
                <yd-flexbox-item>
                  <router-link :to="{path:'/userOrders',query:{Id:4}}">
                    <span class="gotoShare"></span>已收货
                  </router-link>
                </yd-flexbox-item>
              </yd-flexbox>
            </div>
          </div>
        </div>
        <div class="myServer">
          <p>我的服务</p>
          <div class="myServerItem">
            <yd-flexbox>
              <yd-flexbox-item>
                <router-link :to="{path:'/userAssets'}">
                  <span class="myAssets"></span>我的资产
                </router-link>
              </yd-flexbox-item>
              <yd-flexbox-item>
                <router-link :to="{path:'/userReward'}">
                  <span class="myReward"></span>我的奖励
                </router-link>
              </yd-flexbox-item>
              <yd-flexbox-item>
                <router-link :to="{path:'/coupons'}">
                  <span class="MyCoupon"></span>优惠卷
                </router-link>
              </yd-flexbox-item>
              <yd-flexbox-item>
                <router-link :to="{path:'/receivingAddress'}">
                  <span class="receivingAddress"></span>地址管理
                </router-link>
              </yd-flexbox-item>
            </yd-flexbox>
          </div>
        </div>
        <div class="otherItems">
          <yd-cell-group>
            <yd-cell-item arrow type="link" href="/savedAmount">
              <p slot="left" class="saved">已省金额</p>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/userFavorite">
              <p slot="left" class="favorite">我的收藏</p>
            </yd-cell-item>
          </yd-cell-group>
          <yd-cell-group>
            <yd-cell-item arrow type="link" href="/resetPassword">
              <p slot="left" class="changePwd">修改密码</p>
            </yd-cell-item>
            <yd-cell-item arrow type="link" href="/userFeedback">
              <p slot="left" class="feedBack">意见反馈</p>
            </yd-cell-item>
            <yd-cell-item arrow type="a" href="tel://4006286698">
              <p slot="left" class="tel">客服热线：400 6286 698</p>
            </yd-cell-item>
          </yd-cell-group>
        </div>
        <div v-if="isLogin" style="text-align: center;background:#fff;margin-bottom: .3rem">
          <span class="subBtn" @click.prevet="logout">退出当前账号</span>
        </div>
        <div class="LYMT">
          <p>分享最好的</p>
        </div>
      </div>
      <!--navber-->
      <v-navbar slot="tabbar"></v-navbar>
    </yd-layout>
    <!--登录弹框-->
    <div >
      <v-login ref="loginDiv"></v-login>
    </div>
  </div>
</template>

<script>
import { isLogin } from '../../../common/index.js'
import VTopbar from '../../base/topBar.vue'
import VNavbar from '../../base/navBar.vue'
import VLogin from '../../base/login.vue'
import { mapMutations } from 'vuex'
import { _loginURL, _userLevel, _readURL } from '../../../common/request.js'
import { reqUrl } from '../../../common/index.js'

export default {
  data () {
    return {
      titleAttr: {'isShow': false, 'name': '我的'},
      userName: '',
      imgSrc: require('../../../img/avatar-placeholder.png'),
      isLogin: false,
      userInfos:{},
      readUrl:''
    }
  },
  components: {
    VTopbar,
    VNavbar,
    VLogin
  },
  watch:{
    $route(){
      if(this.$route.query.redirect) {
        this.goToLogin()
      }
    }
  },
  mounted: function () {
    let entry = isLogin()
    if (entry.login) {
      this.userName = JSON.parse(unescape(window.sessionStorage.userInfos)).name
      this.isLogin = true
    }
  },
  methods: {
    ...mapMutations({
      refLogin: 'refLogin'
    }),
    goToLogin () {
      this.$refs.loginDiv.toLogin()
    },
    logout () {
      window.sessionStorage.removeItem('userInfos')
      location.reload()
    }
  }
}
</script>
<style>
  .userCenter .yd-cell-item{
    padding-left: 0;
  }
  .userCenter .yd-cell-box{
    margin-bottom: .25rem;
  }
</style>
<style scoped>
  .userCenter{
    text-align: left;
    font-size: .28rem;
    height: 100%;
  }
  .topBar{
    width: 100%;
    background: #715329;
    margin-bottom:.2rem;
  }
  .user {
    text-align: left;
    box-sizing: border-box;
    padding:.5rem .3rem;
  }
  .user>div{
    display: inline-block;
  }
  .myOrder{
    height:2.56rem;
    background: #fff;
    border-top-left-radius: .16rem;
    border-top-right-radius: .16rem;
    overflow: hidden;
    padding-left: .3rem;
  }
  .loginBtn{
    height: 0.6rem;
    padding:0rem  0.2rem;
    border-radius: 4px;
    border:1px solid #fff;
    text-align: center;
    color:#fff;
    margin-left:.3rem;
  }
  .userPic img{
    vertical-align: middle;
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 1.4rem;
  }
  .userName{
    font-size: .34rem;
    color: #fff;
    margin-left: .3rem;
  }
  .myorderItem,.myServerItem{
    text-align: center;
    padding-right: .3rem;
  }
  .myServer{
    padding-left: .3rem;
    background: #fff;
  }
  .myServerItem{
    padding-bottom:.22rem;
    padding-top: .22rem;
    border-bottom: 1px solid #DCDCDC;
  }
  .myorderItem span,.myServerItem span{
    display:block;
    width:.6rem;
    height: .6rem;
    margin: 0 auto;
    background: url("../../../img/daifukuan.png") no-repeat center center;
    background-size:.6rem;
    margin-bottom: .06rem;
  }
  .myorderItem span.waitDeliver{
    background-image: url("../../../img/daifahuo.png");
  }
  .myorderItem span.hasDeliver{
    background-image: url("../../../img/yifahuo.png");
  }
  .myorderItem span.gotoShare{
    background-image: url("../../../img/qufenxiang.png");
  }
  .myorderItem span.ReturnGood{
    background-image: url("../../../img/tuihuo.png");
  }
  .myServerItem span.myAssets{
    background-image: url("../../../img/wodezichang.png");
  }
  .myServerItem span.myReward{
    background-image: url("../../../img/jiangli.png");
  }
  .myServerItem span.MyCoupon{
    background-image: url("../../../img/youhuijuan.png");
  }
  .myServerItem span.receivingAddress{
    background-image: url("../../../img/zongchou.png");
  }
  .myServer p{
    text-align: left;
    height: 1rem;
    line-height: 1rem;
    border-bottom: 1px solid #DCDCDC;
  }
  .otherItems p{
    padding-left: .65rem;
    background: url("../../../img/yijianfankui.png") no-repeat .15rem center;
    background-size: .4rem;
  }
  .otherItems p.saved{
    background-image: url("../../../img/yishengjiner.png");
  }
  .otherItems p.tel{
    background-image: url("../../../img/tel.png");
  }
  .otherItems p.favorite{
    background-image: url("../../../img/guanzhu.png");
  }
  .otherItems p.changePwd{
    background-image: url("../../../img/shouxian.png");
  }
  .otherItems{
    margin-bottom: .45rem;
  }
  .LYMT {
    height: 1.5rem;
    text-align: center;
    padding-top:.65rem;
    background:url("../../../img/logo.png") no-repeat center top;
    background-size:2.28rem;
  }
  .LYMT p{
    font-size: .26rem;
    color: #979797;
    width: 2.28rem;
    margin: 0 auto;
    text-align: center;
    letter-spacing:.15rem;
  }
</style>


