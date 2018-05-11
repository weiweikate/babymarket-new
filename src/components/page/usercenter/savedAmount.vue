<template>
  <div style="height:100%;">
    <yd-layout>
      <v-topbar :title="titleAttr" ref="topBar" slot="navbar"></v-topbar>
      <div class="savedAmountPage scrollViewDiv">
        <div class="totalCommission">
          <div>已省金额 （元）</div>
          <span> ¥ {{totalSavedAmount}} 元</span>
        </div>
        <div class="commission">
          <div v-for="(savedAmountInfo,index) in savedAmountInfos" :key="index">
            <yd-flexbox>
              <yd-flexbox-item>{{savedAmountInfo.Type}}</yd-flexbox-item>
              <yd-flexbox-item>+ {{savedAmountInfo.Commission}}</yd-flexbox-item>
              <yd-flexbox-item>{{savedAmountInfo.CreateTime.slice(5,16)}}</yd-flexbox-item>
            </yd-flexbox>
          </div>
        </div>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _savedAmount } from '../../../common/request.js'
  import { isLogin, reqUrl} from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '已省金额'},
        userInfos: '',
        totalSavedAmount: '',
        savedAmountInfos: []
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
      this.getSavedAmount()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
      },
      getSavedAmount () {
        this.$dialog.loading.open('拼命加载中')
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _savedAmount}
        ).then((res) => {
          this.$dialog.loading.close()
          this.savedAmountInfos = res.data.Datas
          let savedAmount = 0
          for (let i = 0; i< this.savedAmountInfos.length; i++){
            savedAmount += Number(this.savedAmountInfos[i].Commission)
          }
          this.totalSavedAmount = savedAmount
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
