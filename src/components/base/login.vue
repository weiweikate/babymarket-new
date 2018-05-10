<template>
  <div class="login">
    <!--登录弹框-->
    <yd-popup v-model="show" position="bottom" height="5.5rem">
      <div class="loginDiv">
        <div class="g-form-input">
          <input input type="text" v-model.lazy="usernameModel" placeholder="请输入用户名"/>
        </div>
        <div class="g-form-input">
          <input type="password" v-model.lazy="passwordModel" placeholder="请输入密码">
        </div>
        <div class="g-form-input">
          <a class="button" @click="login">登录</a>
        </div>
        <div class="g-form-input">
          <router-link :to="{path:'/resetPassword'}">
            <span  class="fl btnA" >忘记密码</span>
          </router-link>
          <router-link :to="{path:'/register'}">
            <span class="fr btnA" >我要注册</span>
          </router-link>
        </div>
      </div>
    </yd-popup>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { _loginURL, _userLevel, _readURL,  _recevingAddress } from '../../common/request.js'
  import { reqUrl } from '../../common/index.js'
  export default {
    data () {
      return {
        usernameModel: '',
        passwordModel: '',
        show: false,
        userInfos:{},
        readUrl:''
      }
    },
    methods: {
      ...mapMutations({
        refLogin: 'refLogin'
      }),
      toLogin () {
        this.show = true
        this.usernameModel = ''
        this.passwordModel = ''
      },
      login () {

        if (!this.usernameModel) {
          this.$dialog.alert({mes: '用户名不能为空'})
        } else if (!this.passwordModel) {
          this.$dialog.alert({mes: '密码不能为空'})
        } else {
          let url = _loginURL
          this.axios.post(url, {'LoginName': this.usernameModel, 'Password': this.passwordModel, 'Medium': 'App'})
            .then((res) => {
              let infos = res.data
              if (infos.Session) {
                this.userInfos = {name:infos.PersonName,userId:infos.Person.Key.slice(7),session:infos.Session,login_name_application:this.usernameModel,login:true}
                this.show = false
                this.userName = infos.PersonName
                this.readUrl = reqUrl(_readURL,infos.Session)
                this.userLevel()
              } else {
                this.$dialog.toast({
                  mes: '用户名或密码错误！',
                  timeout: 1500,
                  icon: 'error'
                })
                this.passwordModel = ''
              }
            }).catch((err) => {
              alert(err)
            })
        }
      },
      userLevel () {
        let url = this.readUrl
        this.axios.post(url, {"AppendixesFormatType":1,"Condition":"${Id} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"MaxCount":"1","Operation":_userLevel}
        ).then((res) => {
            let level = res.data.Datas[0]
            console.log(level)
            this.userInfos.MemberTypeKey = level.MemberTypeKey
            this.userInfos.LevelKey = level.LevelKey
            this.userInfos.Inside = level.Inside
            this.userInfos.reqUrl = this.readUrl
            this.userInfos.name = level.Name
            this.userInfos.Mobile = level.Mobile
            this.userInfos.PictureId = level.PictureId
            this.getAddress ()
            //window.sessionStorage.userInfos = escape(JSON.stringify(this.userInfos))
            //this.$router.go(0)
          }).catch((err) => {
            alert(err)
          })
      },
      getAddress () {
        let url = this.readUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${MemberId} == '"+this.userInfos.userId+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Operation": _recevingAddress,"Order":"${Default} DESC"})
            .then((res) => {
          if (res.data.Datas.length>0 && res.data.Datas[0].Default =='True') {
            this.userInfos.addressId = res.data.Datas[0].Id
          } else {
            this.userInfos.addressId = '00000000-0000-0000-0000-000000000000'
          }
          window.sessionStorage.userInfos = escape(JSON.stringify(this.userInfos))
          this.refLogin(this.userInfos)
          //this.$router.go(0)
          if(this.$route.query.redirect){
            // 登录以后 设置首页不缓存 使之刷新出现会员信息
            this.$router.push({path:this.$route.query.redirect})
            this.$router.options.routes[1].meta.keepAlive = false
          } else {
            window.location.reload()
          }
        }).catch((err) => {
          alert(err)
        })
      },
    }
  }
</script>

<style scoped>
  .loginDiv{
    padding: 0.5rem 0.25rem ;
  }
  .btnA{
    padding:0 4px ;
    color: #454950;
    font-size: 13px;
  }
</style>
