import Vue from 'Vue'
import Vuex from 'vuex'
Vue.use(Vuex)

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

export default store
