<template>
  <div class="navbar" ref="topBar">
       <span class="back" @click="back" v-if='title.isShow'>
           <img  src="../../img/jiantou.png" alt=""/>
       </span>
       <div v-if=" prdLabel">{{prdLabel}}</div>
       <div v-else>{{title.name}}</div>
        <!-- 插槽中放具体项目中需要内容         -->
        <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: Object,
        default: function () {
          return {isShow: false, name: '老友码头'}
        }
      }
    },
    computed :{
      prdLabel () {
        if ( this.$route.name === 'prdDetail') {
          return
        } else {
          return this.$route.query.name
        }
      }
    },
    mounted: function () {
    },
    methods: {
      back (){
       this.$router.go(-1)
      }
    }
  }
</script>
<style scoped>
  .navbar{
    background: #715329;
    height: 0.9rem;
    line-height: 0.9rem;
    color: #fff;
    font-size: 0.4rem;
    text-align: center;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
  }
  .navbar>div{
    width:70%;
    margin: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-align: center;
  }
</style>
