<template>
  <div class="userCommissioin">
    <p>{{items.Month}}</p>
    <p>收益：{{items.Commissioin}}</p>
  </div>
</template>

<script>
    export default {
      props: {
        items: {
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
//        cellCliked (index,section) {
//          this.$emit('cellCliked',index,section)
//        }
      }
    }
</script>
<style scoped>
  .userCommissioin{
    height: 1.18rem;
    box-sizing: border-box;
    padding: .25rem .3rem;
    border-top: 1px solid #DCDCDC;
  }
  .userCommissioin p:first-child{
    color:#252525;
    font-weight: bold;
    font-size: .28rem;
  }
</style>
