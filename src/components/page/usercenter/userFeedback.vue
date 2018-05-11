<template>
  <div style="height: 100%">
    <yd-layout>
      <v-topbar :title="titleAttr" slot="navbar" ref="topBar"></v-topbar>
      <div class="feedBackPage scrollViewDiv">
        <div class="feedBackContent">
          <p>请选择您要反馈的问题类型（必填）</p>
          <ul>
            <li v-for="(item,index) in items" :key="index" @click.prevent="chooseType(index)" :class="activeIndex===index? 'active':''">
              {{item}}
            </li>
          </ul>
          <p>您的建议（必填）</p>
          <div>
            <yd-textarea slot="right" placeholder="在这里输入哦~" maxlength="200" v-model="content"></yd-textarea>
          </div>
          <p>联系方式 (选填)</p>
          <div>
            <input type="text" class="phoneInput" v-model="phone" placeholder="请填写有效的手机号码"/>
          </div>
          <div class="warn">
            <p>如果您填写了有效的联系方式，码头将在48小时内根据您反馈的内容以邮件、短信或者电话的方式进行回复。</p>
            <p>紧急问题请直接联系客服： 400-6286-698</p>
          </div>
        </div>
      </div>
      <div class="subBtnDiv" slot="tabbar">
        <span class="subBtn" @click.prevent="putUserFeedBack">提交</span>
      </div>
    </yd-layout>
  </div>

</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _userReport, _writeURL } from '../../../common/request.js'
  import { isLogin, reqUrl, getUUID, validateMobile, formatTime } from '../../../common/index.js'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '建议与反馈'},
        items:['商品咨询','订单问题','物流问题','售后服务','投诉与建议','红包/优惠卷'],
        writeUrl:'',
        userInfos:'',
        phone:'',
        content:'',
        activeIndex:''
      }
    },
    components: {
      VTopbar
    },
    mounted: function () {
      this.getIsEntry()
    },
    methods: {
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login) {
          this.phone = this.userInfos.Mobile
        }
        this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
      },
      chooseType (index) {
        this.activeIndex = index
      },
      putUserFeedBack () {
        let url = this.writeUrl
        if (this.activeIndex === ''){
          this.$dialog.toast({mes: '请选择反馈的问题类型', timeout: 1500})
          return
        }
        if (!this.content){
          this.$dialog.toast({mes: '请填写您的建议', timeout: 1500})
          return
        }
        if(this.phone&&!validateMobile(this.phone).statu) {
          this.$dialog.toast({mes: validateMobile(this.phone).mes, timeout: 1500})
          return
        }
        this.$dialog.loading.open('正在提交您的建议')
        let user = this.userInfos.userId? this.userInfos.userId:''
        this.axios.post(url,{"Items":[{"AddOperationId": _userReport,"Data":{"EntityName":"UserReport","Items":{"Id":"","Type_Name":this.items[this.activeIndex],"Contact":this.phone,"Content":this.content,"MemberId":user,'Platform':'web/pc','Datetime':formatTime()},"Status":"New"}}]})
            .then((res) => {
          if(JSON.stringify(res.data) == "{}"){
            this.$dialog.loading.close()
            this.$dialog.toast({mes: '感谢您的反馈', timeout: 1500,callback: () => {
              this.$router.push({path:'/userCenter'})
            }})
            //this.show = !this.show
          }
        }).catch((err) => {
          this.$dialog.loading.close()
          this.$dialog.toast({mes: '加入购物车失败,请重试', timeout: 1500})
        })
      }
    }
  }
</script>
<style>
  .feedBackContent .yd-textarea{
    background-color:#dbdbdb ;
    padding-left: .2rem;
    padding-right: .2rem;
    margin:.36rem 0;
    border-radius: .08rem;
  }
</style>
<style scoped>
  .feedBackPage .subBtn{
    background: #fff;
    border:1px solid #715329;
    color:#715329;
    padding-bottom: 1.15rem;
  }
  .feedBackPage{
    padding-top:.4rem;
    padding-bottom: .3rem;
    text-align: left;
    font-size: .3rem;
  }
  .feedBackPage ul>li{
    float: left;
    width: 2.2rem;
    height: .7rem;
    line-height: .7rem;
    border: 1px solid #acadaa;
    color:#acadaa;
    margin-left: .22rem;
    margin-bottom: .15rem;
    border-radius: .1rem;
    text-align: center;
  }
  .feedBackPage ul>li.active{
    border: 1px solid #715329;
    color:#715329;
  }
  .feedBackPage ul{
    overflow: hidden;
    margin: .3rem 0;
  }
  .feedBackContent>p,.feedBackContent>div{
    padding:0 .22rem;
  }
  .phoneInput{
    height: .72rem;
    width: 100%;
    background-color:#dbdbdb ;
    padding:0 .2rem;
    box-sizing: border-box;
    border-radius: .08rem;
    margin:.36rem 0;
  }
  .warn{
    color:#acadaa ;
    font-size: .28rem;
    margin-bottom:.5rem ;
  }
  .warn>p:first-child{
    margin-bottom:.3rem ;
  }
  .subBtnDiv{
    width: 100%;
    position: fixed;
    padding-bottom:.3rem;
    bottom:0;
    left: 0;
    text-align: center;
    background: #ffffff;
  }
</style>
