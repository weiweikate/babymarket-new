<template>
    <div style="min-height: 4.23rem;overflow: hidden" class="sliderDiv">
      <yd-slider autoplay="3000">
        <yd-slider-item  v-for="(subPagePic,keys) in getSubPagePics" :key="keys">
          <a @click="goDetailPage(subPagePic.ProductId,subPagePic.LinkTypeKey,subPagePic.url,subPagePic.KeyWord,subPagePic.Name)">
            <img :src="getIndexPic(subPagePic.ImgId)" alt=""/>
          </a>
        </yd-slider-item>
      </yd-slider>
    </div>
</template>

<script>
    import { getImgs } from '../../common/index.js'
    export default {
      name:"slider",
      props: {
        getSubPagePics: {
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
      methods: {
        getIndexPic (picId) {
          return getImgs(picId)
        },
        goDetailPage (prdId,key,url,keyword,title) {
          if( prdId === undefined && key === undefined && url=== undefined ){
            return
          } else if (prdId !== undefined && key === undefined && url=== undefined) {
            this.$router.push({path: '/prdDetail', query: {prdId: prdId}})
          } else {
            let n =parseInt(key)
            switch (n) {
              case 1:
                //跳转到搜索页面 searchResultsPage
                this.$router.push({path: '/search',query: {keyword: keyword}})
                break
              case 2:
                //跳转到详情页
                this.$router.push({path: '/prdDetail', query: {prdId: prdId}})
                break;
              case 3:
                //跳转到专业页面
                // location.href ='http://www.babymarkt.com.cn/Subject.aspx?Id='+prd
                this.$router.push({path:'/subjectAspx',query:{prdId:prdId.Id,title:title}})
                break
              case 4:
                //根据返回的url地址跳转
                location.href=url
            }
          }
        },
      }
    }
</script>
<style scoped>
</style>
