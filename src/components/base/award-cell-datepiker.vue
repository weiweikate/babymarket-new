<template>
  <!-- 日期筛选-->
 <span class="timeDiv">
     <yd-datetime v-model="date" slot="right" type="month"  :callback="choose"></yd-datetime>
 </span>
</template>

<script>
    export default {
      data () {
        return {
          date:'2008-01'
        }
      },
      mounted: function () {

      },
      methods: {
        choose () {
          if(this.date == '2008-01'){
            let date = new Date()
            let month = date.getMonth()+1+''
            month = month.length==1? '0'+month: month
            this.date = date.getFullYear() + '-' + month
          }
          this.$emit('choose',this.date)
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
