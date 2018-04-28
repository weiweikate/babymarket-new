<template>
  <div class="icon">
    <!--登录弹框-->
    <div>
      <yd-grids-group :rows="rows">
        <yd-grids-item v-for="(item,index) in icons" :key="index" type="link" :link=item.link>
          <img slot="icon" :src="getPic(item.IconId)">
          <span slot="text">{{item.Name }}</span>
        </yd-grids-item>
      </yd-grids-group>
      <!--<ul>-->
        <!--<li v-for="(item,index) in icons" :key="index">-->
          <!--<img :src="getPic(item.IconId)" alt=""/>-->
          <!--{{item.Name}}-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </div>
</template>

<script>
  import { _loginURL } from '../../common/request.js'
  import { getImgs } from '../../common/index.js'
  export default {
    props: {
      icons: {
        type:Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        showMoreAtrr:{isLogin:false,type:'',show:false},
      }
    },
    mounted: function () {

    },
    computed: {
      rows () {
        let length = this.icons.length
        if (length % 3 == 0) {
          return 3
        } else {
          return 4
        }
        //return this.icons.length
      }
    },
    methods: {
      getPic (picId) {
        return getImgs(picId)
      },
      iconClick (index){
        this.showMoreAtrr.isLogin = this.userInfos.login
        this.showMoreAtrr.type = this.userInfos.MemberTypeKey
        this.showMoreAtrr.show = false
      }
    }
  }
</script>

<style>
  .icon .yd-grids-icon img{
    height:100%;
    background: #F1F1F1;
    border-radius: 100rem;
  }
  .icon .yd-grids-item:after, .icon .yd-grids-4:before,.icon .yd-grids-3:before{
    border-bottom: 0px
  }
  .icon .yd-grids-4 .yd-grids-item:not(:nth-child(4n)):before,.icon .yd-grids-3 .yd-grids-item:not(:nth-child(3n)):before{
    border-right:0
  }
</style>
<style scop  ed>

</style>
