<template>
<div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="userCrowdfunding scrollViewDiv">
        <v-user-crowdfunding-list v-for="(list,index) in crowdfundingList"
                                     :key="index" :crowdfoundingData="list" :inList="inList">
        </v-user-crowdfunding-list>
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../../base/topBar.vue'
  import VUserCrowdfundingList from './cell/userCrowdfundingList.vue'
  import { _readURL, _MyRaiseRead  } from '../../../../common/request.js'
  import { isLogin, reqUrl} from '../../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '我的众筹'},
        userInfos: '',
        crowdfundingList:'',
        inList:true
      }
    },
    components: {
      VTopbar,
      VUserCrowdfundingList
    },
    mounted: function () {
      this.getIsEntry()
      this.getCommissionLog()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
      },
      getCommissionLog () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _MyRaiseRead }
        ).then((res) => {
          this.$dialog.loading.close()
          if(res.data.Total > 0){
            this.crowdfundingList = res.data.Datas
          } else {
            this.$dialog.alert({mes: '你目前没有众筹项目哦~',
              callback: () => {
              this.$router.push({path: '/index'})
             }
            })
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

</style>
