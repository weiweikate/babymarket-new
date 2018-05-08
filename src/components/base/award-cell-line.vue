<template>
  <div :class="section==0? 'crowdfoundingContent fristLine':'crowdfoundingContent' " @click.prevent="cellCliked(index,section)">
    <div>
      <div class="fl" v-if="datas.ImgId!=undefined">
        <img v-lazy="datas.ImgId" alt=""/>
      </div>
      <div class="fl" v-else>
        <img :src="datas.RefundMoney>0?  images[0]:images[1]" alt=""/>
        <!--<img src="../../img/my-award-active-icon.png" alt=""/>-->
      </div>
      <div class="fr">
        <p class="buyerName">
          <span class="fl">{{datas.TypeName}}</span>
          <span class="fr">{{ datas.IsExpend == 'True'?  '-':'+'}}{{datas.Commissioin}}元</span>
        </p>
        <p class="buyWhat">
          <span class="fl">{{datas.Date}}</span>
          <span class="fr" v-if="datas.RefundMoney != undefined && datas.RefundMoney >0">已退款{{datas.RefundMoney}}元</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      props: {
        datas: {
          type:Object,
          default: function () {
            return {}
          }
        },
        section: {
          type: Number,
          default: 0
        },
        index: {
          type: Number,
          default: 0
        }
      },
      data () {
        return {
          images:[require('../../img/my-award-inactive-icon.png'),require('../../img/my-award-active-icon.png')]
        }
      },
      mounted: function () {

      },
      methods: {
        cellCliked (index,section) {
          this.$emit('cellCliked',index,section)
        }
      }
    }
</script>
<style scoped>
  .crowdfoundingContent{
    padding-left: .3rem;
    background: #fff;
  }
  .crowdfoundingContent>div{
    overflow: hidden;
    padding: .3rem;
    padding-left: 0;
    border-top: 1px solid #DCDCDC;
  }
  .crowdfoundingContent div.fl{
    width: .84rem;
    height: .84rem;
    border-radius: .84rem;
    overflow: hidden;
  }
  .crowdfoundingContent img{
    width: 100%;
  }
  .crowdfoundingContent div.fr{
    width:5.8rem;
  }
  .crowdfoundingContent div.fr .buyWhat,.crowdfoundingContent div.fr .buyerName{
    overflow: hidden;
  }
  .crowdfoundingContent div.fr .buyerName{
    font-size: .28rem;
    font-weight: bold;
    color:#252525;
    margin-bottom: .08rem;
  }
  .crowdfoundingContent div.fr .buyerName span.fr{
    font-size: .36rem;
  }
  .crowdfoundingContent div.fr .buyWhat span.fl{
    width: 3.18rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .fristLine>div{
    border-top:0 !important;
  }
  .fristLine{
    border-top: 1px solid #DCDCDC;
  }
</style>
