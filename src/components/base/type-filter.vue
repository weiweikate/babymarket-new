<template>
  <div class="model-view-bg">
    <div class="my-award-filter zoom-in">
      <div class="title" catchtap=""><div>选择类型</div></div>
      <div class="sep-line"></div>
      <div class="content">
          <div class="thumb" v-for="(item,keys) in datas" :key="keys" @click="typeClicked(keys)"><div>{{item.Name}}</div></div>
      </div>
      <div style="height:.14rem;width:100%;background:#E9E9EB;border:0"></div>
      <div class="cancel" @click="showFilter"><div>取消</div></div>
    </div>
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
        showFilter(){
          this.$emit('showFilter',false)
        },
        typeClicked(index){
          this.$emit('typeClicked',index)
        }
      }
    }
</script>
<style scoped>
  /* pages/my/my-award/filter-view/my-award-filter.wxss */

  /*模态背景框，半透明黑色，全屏*/
  .model-view-bg {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10002;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.5);
  }

  .title{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    width: 100%;
    color: #252525;
    font-size: .28rem;
    background-color: white;
  }

  .cancel{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    width: 100%;
    color: #252525;
    font-size: .28rem;
    background-color: #F4F4F4;
  }

  .content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 7.5rem;
    height: auto;
    background-color: #F4F4F4;
    padding:.40rem .24rem;
  }
  .thumb{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: white;
    font-size: .28rem;
    border-radius: .16rem;
    height: 1.20rem;
    width: 2.22rem;
    margin: 0 .12rem .12rem 0;
  }



</style>
