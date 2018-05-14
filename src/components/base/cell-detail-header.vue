<template>
  <div class="cellDetailHeader">
    <p :style="'backgroundImage:url('+queryString.imgId+')'">{{queryString.typeName}}</p>
    <div>
      <div class="raiseContent">
        <p class="raiseCommission clearFloat">
          <span class="fl">{{queryString.type ==2?  '提现金额':'付款金额'}}</span>
          <span class="fr">¥ {{queryString.commissioin}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      props: {
        queryString: {
          type:Object,
          default: function () {
            return {}
          }
        }
      },
      data () {
        return {

        }
      },
      mounted: function () {

      },
      methods: {

      }
    }
</script>
<style scoped>
  .cellDetailHeader{
    text-align: left;
    font-size: .26rem;
    color: #979797;
  }
  .cellDetailHeader>p,.raiseCommission span.fr{
    color:#252525 ;
    font-weight: bold;
  }
  .cellDetailHeader>p{
    height:1.04rem;
    line-height: .6rem;
    padding:.28rem;
    padding-left:1rem ;
    font-size:.34rem;
    background: url("../../img/award.png") no-repeat .28rem .2rem;
    background-size:.62rem .62rem;
    border-bottom: 1px solid #DCDCDC;
  }
  .cellDetailHeader>div{
    background:#F6F6F6;
    padding-top: .4rem;
  }
  .raiseContent{
    background: #fff;
    border-top: 1px solid #DCDCDC;
    padding-left: .3rem;
  }
  .raiseCommission{
    padding: .34rem .3rem .3rem 0;
    font-size: .3rem;
    /*margin-bottom: .15rem;*/
    border-bottom: .01rem solid #DCDCDC;
  }
  .raiseCommission span.fr{
    font-size: .46rem;
  }
</style>
