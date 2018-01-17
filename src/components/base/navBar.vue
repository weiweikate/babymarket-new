<template>
    <div class="nav" ref="nav" >
        <yd-tabbar slot="tabbar" >
            <yd-tabbar-item title="大码头" link="/index">
                <yd-icon slot="icon" name="index" size="0rem"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="专题" link="/topic">
                <yd-icon slot="icon" size="0rem" name="topic"></yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="购物车" link="/shoppingCare" >
                <yd-icon slot="icon" size="0rem" name="shoppingCar">

                </yd-icon>
            </yd-tabbar-item>
            <yd-tabbar-item title="我的" link="/userCenter">
                <yd-icon slot="icon" size="0rem" name="userCenter">

                </yd-icon>
            </yd-tabbar-item>
        </yd-tabbar>
    </div>
</template>

<script>

</script>

<style scoped>
    .nav{
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 999;
    }
   .yd-tabbar{
       position: absolute;
       bottom: 0;
       width: 100%;
       z-index: 9999;
   }
    .router-link-active{
        color: #b38a36 !important;
    }
    .yd-icon-index:before,.yd-icon-topic:before,.yd-icon-shoppingCar:before,.yd-icon-userCenter:before{
        content:" ";
        display: inline-block;
        width: 0.5rem;
        height: 0.5rem;
        background: url("../../img/matou-c.png") no-repeat center center;
        background-size:0.5rem ;
    }
   .yd-icon-topic:before{
       background: url("../../img/tm.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .yd-icon-shoppingCar:before{
       background: url("../../img/gwc.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .yd-icon-userCenter:before{
       background: url("../../img/wd.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .router-link-active .yd-icon-index:before{
       background: url("../../img/matou.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .router-link-active .yd-icon-topic:before{
       background: url("../../img/tm-c.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .router-link-active .yd-icon-shoppingCar:before{
       background: url("../../img/gwc-c.png") no-repeat center center;
       background-size:0.5rem ;
   }
   .router-link-active .yd-icon-userCenter:before{
       background: url("../../img/wd-c.png") no-repeat center center;
       background-size:0.5rem ;
   }
</style>
