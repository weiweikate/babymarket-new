<template>
  <div  class="codePage">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar"></v-topbar>
      <div class="scrollViewDiv tips">
        <span class="tipsImg"></span>你的提现申请已经成功提交
      </div>
    </yd-layout>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'

  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '提现申请提交成功'},
        userInfos:'',
        url:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {

    },
    methods: {

    }
  }
</script>
<style>

</style>
<style scoped>
  .tips{
    font-size:.34rem;
    color:#454950;
    padding-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tipsImg{
    width: .4rem;
    height: .4rem;
    display: inline-block;
    background: url(../../../img/pay_c.png) no-repeat center center;
    background-size: 100%;
    margin-right: .1rem;
  }
</style>
