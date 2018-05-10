<template>
  <div class="lineDiv" v-if="datas.length>0">
    <p class="line" v-for="(item,index) in datas" :key="index" >
      <span class="fl">{{item.title}}</span>
      <span class="fr">{{item.content}}</span>
    </p>
  </div>
</template>

<script>
    export default {
      props: {
        datas: {
          type:Array,
          default: function () {
            return []
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
  .lineDiv{
    border-bottom: 1px solid #DCDCDC;
    margin-top: 0 !important;
    padding-top:.2rem;
  }
  .line{
    overflow: hidden;
    color: #979797;
    font-size: .26rem;
    padding-left: .3rem;
    margin-bottom: .18rem;
  }
  .line span.fr{
    width:3.75rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: right;
    padding-right:.3rem;
  }
</style>
