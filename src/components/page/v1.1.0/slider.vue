    <div style="min-height: 3.7rem;overflow: hidden" class="sliderDiv">
      <yd-slider autoplay="3000">
        <yd-slider-item  v-for="(subPagePic,keys) in getSubPagePics" :key="keys">
          <a @click="goDetailPage(subPagePic)">
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
          subject:''
        }
      },
      methods: {
        getIndexPic (picId) {
          return getImgs(picId)
        },
        goDetailPage (subPagePic) {
          let prdId = subPagePic.ProductId  // 获取产品Id
          let key = subPagePic.LinkTypeKey // 判断调整到哪个页面的key
          let url = subPagePic.url // 产品的链接
          let keyword= subPagePic.KeyWord // 关键字
          let title = subPagePic.Name // 所属的产品类别
          let nullId = '00000000-0000-0000-0000-000000000000'
          if( prdId === undefined && key === undefined && url=== undefined ){
            return
          } else if (prdId !== undefined && prdId !==nullId  && key === undefined && url=== undefined) {
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
                // this.$router.push({path:'/subjectAspx',query:{prdId:prdId.Id,title:title}})
                if (subPagePic.SubjectId!= nullId){
                  this.$router.push({path: '/search',query: {subjectId: subPagePic.SubjectId}})
                } else{
                  this.$router.push({path:'/subjectAspx',query:{prdId:prdId.Id,title:title}})
                }

                break
              case 4:
                //根据返回的url地址跳转
                if(url){
                  if(url.indexOf('https://')!= -1 || url.indexOf('http://') != -1 || url.indexOf('://') != -1){
                    location.href=url
                  } else {
                    location.href='//'+url
                  }
                }
                break
              default:
                break
            }
          }
        }
      }
    }
</script>
<style scoped>
</style>
