<template>
  <!-- 日期筛选-->
 <span class="timeDiv">
     <yd-datetime v-model="datetime.date" slot="right" type="month" :end-date="datetime.endDate" :callback="choose"></yd-datetime>
 </span>
</template>

<script>
    export default {
      props: {
        datetime: {
          type:Object,
          default: function () {
            return {endDate:'2018-04',date:''}
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
        choose () {
          this.$emit('choose',this.datetime.date)
        }
      }
    }
</script>
<style>
  .timeDiv .yd-datetime-input{
    height: .5rem;
    font-size: 0px;
  }
</style>
<style scoped>
  .timeDiv{
    width: .5rem;
    height: .5rem;
    background: url("../../img/rili.png") no-repeat left top;
    background-size:100% ;
    position: absolute;
    right: .3rem;
    top: .35rem;
  }
</style>
