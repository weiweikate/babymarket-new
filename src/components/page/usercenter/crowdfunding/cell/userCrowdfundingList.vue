<template>
  <div class="userCrowdfundingList" @click="goDetail(crowdfoundingData)">
    <div>
      <div class="fl">
        <img v-lazy="getPic(crowdfoundingData.ImgId)" alt=""/>
      </div>
      <div class="fr">
        <h5>{{crowdfoundingData.Name}}</h5>
        <p>
          <span class="fl">认筹金额：{{crowdfoundingData.Money}}</span>
          <span class="fr">{{crowdfoundingData.Date.slice(0,10)}}</span>
        </p>
        <yd-progressbar type="line" :progress="crowdfoundingData.SaleQnty/crowdfoundingData.RaiseQnty" trail-width="5" trail-color="#FA7F82"></yd-progressbar>
        <ul>
          <li>
            <p>{{crowdfoundingData.Balance}}</p>
            <span>余额/元</span>
          </li>
          <li>
            <p>{{crowdfoundingData.SaleQnty}}</p>
            <span>卖出/件</span>
          </li>
          <li>
            <p>{{crowdfoundingData.InvQnty}}</p>
            <span>剩余/件</span>
          </li>
        </ul>
        <div class="seeDel">
          <div class="fl">
            <span>总回报</span> <br/>
            <span>¥ {{crowdfoundingData.TotalReceive}}</span>
          </div>
          <div v-if="inList" class="fr">
            <span class="sBtn Btn">查看详情</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getImgs } from '../../../../../common/index.js'
  export default {
    props: {
      crowdfoundingData: {
        type: Object,
        default: function () {
          return {}
        }
      },
      inList:{
        type: Boolean,
        default:false
      }
    },
    data () {
      return {

      }
    },
    mounted: function () {

    },
    methods: {
      getPic(id){
        return getImgs(id)
      },
      goDetail(item){
        if(this.inList){
          this.$router.push({path: '/userCrowdfundingDetail', query: {json: JSON.stringify(item)}})
        }
      }
    }
  }
</script>
<style>
  .userCrowdfundingList .yd-progressbar>svg{
    border-radius: 1rem;
  }
</style>
<style scoped>
  .userCrowdfundingList{
    padding-top: .2rem;
    text-align: left;
    color:#979797;
  }
  .userCrowdfundingList>div{
    padding: .1rem;
    background: #fff;
    overflow: hidden;
  }
  .userCrowdfundingList>div>div.fl{
    width:3.2rem;
    height:3.2rem;
  }
  .userCrowdfundingList>div>div.fl img{
    width: 100%;
  }
  .userCrowdfundingList>div>div.fr{
    width: 4rem;
    box-sizing: border-box;
    padding:0 .1rem;
  }
  .userCrowdfundingList>div h5{
    font-size: .28rem;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    margin-top: .2rem;
    color:#515151;
  }
  .userCrowdfundingList>div>div.fr>p{
    padding-top: .08rem;
    padding-bottom: .2rem;
    overflow: hidden;
    font-size: .2rem;
  }
  .userCrowdfundingList ul{
    overflow: hidden;
    margin-top: .1rem;
  }
  .userCrowdfundingList ul li{
    float: left;
    width: 33.3%;
    box-sizing: border-box;
  }
  .userCrowdfundingList ul li p{
    font-size: .26rem;
  }
  .userCrowdfundingList ul li span{
    color: #515151;
    font-size: .22rem;
  }
  .seeDel{
    padding-top: .15rem;
    color: #AF383A;
    font-size: .22rem;
    overflow: hidden;
  }
  .seeDel>div{
    vertical-align: middle;
  }
  .seeDel .sBtn{
    color: #AF383A;
    border-color:#AF383A;
  }
</style>
