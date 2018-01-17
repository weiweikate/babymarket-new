import Vue from 'vue'
import router from './router/index.js'
import App from './App.vue'
import axios from './common/config.js'
import YDUI from 'vue-ydui'
import 'vue-ydui/dist/ydui.rem.css'
import Vuex from 'vuex'
import './css/common.css'
import VueJsonp from 'vue-jsonp'
import VueLazyLoad from 'vue-lazyload'
import { imgdefualt } from './common/request.js'
import {  Toast } from 'vue-ydui/dist/lib.rem/dialog'
Vue.use(VueJsonp)
//import store from './store/store.js'
Vue.use(YDUI)
Vue.use(Vuex)
Vue.prototype.axios = axios
Vue.use(VueLazyLoad,{
  error:imgdefualt,
  loading:imgdefualt,
})

Vue.config.productionTip = false

const store= new Vuex.Store({
  state: {
    SubPicsShow:[],
    SubPrdInfo:[],
    recevingInfoLists :'',
    user:''
  },
  mutations: {
    refSubPicsShow (state,pic) {
      // 二级分类的轮播图片
      window.sessionStorage.setItem('pics',escape(JSON.stringify(pic)))
      state.SubPicsShow = pic
    },
    refSubPrdInfo (state,prd) {
      // 二级分类的产品信息
      state.SubPrdInfo =prd
      window.sessionStorage.setItem('infos',escape(JSON.stringify(prd)))
    },
    refRecevingInfo (state,addr) {
      // 地址管理
      state.recevingInfoLists = addr
      window.sessionStorage.setItem('recevingInfo',escape(JSON.stringify(addr)))
    },
    refLogin (state,user) {
      state.user = user
    }
  },
  actions:{

  }
})
// 登录拦截
router.beforeEach((to, from, next) => {
  // 防止刷新的时候 vuex值消失
  if(window.sessionStorage.userInfos){
    store.commit('refLogin', JSON.parse(unescape(window.sessionStorage.userInfos)))
  }
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (store.state.user) {  // 通过vuex state获取当前的token是否存在
      next()
    }
    else {
      Toast({mes: '请先登录', timeout: 1000,callback: () => {
        next({
          path: '/userCenter',
          query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
        })
      }})
    }
  }
  else {
    next()
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
