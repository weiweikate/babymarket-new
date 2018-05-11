<template>
  <!-- 新建收货地址-->
  <div style="padding-top: .9rem">
    <!-- 地址填写部分-->
    <div class="newAddress" v-show="show">
      <v-topbar :title="titleAttr">
        <span class="opt" @click.prevent="toSaveAddr">保存</span>
      </v-topbar>
      <div class="writeAddr scrollViewDiv" >
        <yd-cell-group>
          <yd-cell-item>
            <span slot="left">
              <!--<span class="Required">*</span>-->
              收货人：</span>
            <yd-input slot="right"  v-model="receiver"  placeholder="请输入收货人姓名"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">手机号：</span>
            <yd-input slot="right"  v-model="phone"  placeholder="请输入手机号码"></yd-input>
          </yd-cell-item>
          <yd-cell-item>
            <span slot="left">身份证号：</span>
            <yd-input slot="right" v-model="IDcard"  placeholder="购买跨境商品时，必须需正确填写"></yd-input>
          </yd-cell-item>
          <yd-cell-item @click.native="chooseArea">
            <span slot="left">所在地区：</span>
            <yd-input slot="right"  v-model="area"  placeholder="请选择所在地址" readonly></yd-input>
          </yd-cell-item>
          <yd-cell-item >
            <span slot="left" class="mainAddr">详细地址：</span>
            <yd-input slot="right"  v-model="receivingAddress"  placeholder="请输入详细收货地址" ></yd-input>
          </yd-cell-item>
          <!--<yd-cell-item>-->
            <!--<yd-textarea slot="right" v-model="receivingAddress" placeholder="" maxlength="100"></yd-textarea>-->
          <!--</yd-cell-item>-->
        </yd-cell-group>
      </div>
    </div>
    <!-- 省份-->
    <div v-show="showArea[0]">
      <v-topbar :title="titleAttr2">
        <span class="opt" @click.prevent="cancel()">取消</span>
      </v-topbar>
      <yd-cell-group>
        <yd-cell-item v-for="(provinceList,index) in provinceLists" :key="index" arrow @click.native="getCity(provinceList.Id,provinceList.ZJS,provinceList.Name,1)" >
          <span slot="left">{{provinceList.Name}}</span>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <!-- 城市-->
    <div v-show="showArea[1]" class="title">
      <v-topbar :title="cityTitle">
        <img class="prev" src="../../../img/jiantou.png" alt=""  @click.prevent="prevAddr(0)"/>
        <span class="opt" @click.prevent="cancel()">取消</span>
      </v-topbar>
      <yd-cell-group>
        <yd-cell-item v-for="(cityList,index) in cityLists" :key="index" arrow @click.native="getCity(cityList.Id,cityList.ZJS,cityList.Name,2)" >
          <span slot="left">{{cityList.Name}}</span>
        </yd-cell-item>
      </yd-cell-group>
    </div>
    <!-- 区域-->
    <div v-show="showArea[2]" class="title">
      <v-topbar :title="cityTitle">
        <img class="prev" src="../../../img/jiantou.png" alt="" @click.prevent="prevAddr(1)"/>
        <span class="opt" @click.prevent="cancel()">取消</span>
      </v-topbar>
      <yd-cell-group>
        <yd-cell-item v-for="(districtList,index) in districtLists" :key="index" arrow @click.native="cancel(districtList.Name,districtList.Id)" >
          <span slot="left">{{districtList.Name}}</span>
        </yd-cell-item>
      </yd-cell-group>
    </div>
  </div>
</template>

<script>
  import VTopbar from '../../base/topBar.vue'
  import { _readURL, _writeURL,_addAddress, _queryArea, _modifyAddress } from '../../../common/request.js'
  import { isLogin, reqUrl, IdentityCodeValid, isEmpty, validateMobile,getUUID } from '../../../common/index.js'
  import { mapState, mapMutations } from 'vuex'
  export default {
    data () {
      return {
        titleAttr: {'isShow': true, 'name': '新建收货地址'},
        titleAttr2: {'isShow': false, 'name': '地址选择'},
        cityTitle: {'isShow': false, 'name': ''},
        userInfos: '',
        writeUrl:'',
        receiver:'', // 收货人
        phone: '', // 手机号码
        area:'', //收货区域
        areaLists:[],
        receivingAddress: '', // 收货地址
        IDcard:'', // 身份证号码
        provinceLists:[], // 省份
        cityLists:[], // 城市
        districtLists:[], // 区域
        DistrictId:'', // 保存省市区的id 请求时候要用
        show:true,// 判断手贱信息输入框是否显示  默认显示
        showArea:[false,false,false], // 判断省市区是否显示 默认全部不显示
        addressId:'',
        addTimes:'' // 保存次数 避免网络卡顿多次保存产生数据
      }
    },
    components: {
      VTopbar
    },
    computed: {
      ...mapState({
          recevingInfoLists: state => state.recevingInfoLists
      })
    },
    mounted: function () {
      this.getIsEntry()
      // 判断是否是修改地址 并的得到vux里面存储的数据
      if(this.$route.query.num  && window.sessionStorage.recevingInfo && !this.recevingInfoLists ){
        this.refRecevingInfo(JSON.parse(unescape(window.sessionStorage.getItem('recevingInfo'))))

      }
      if (this.recevingInfoLists ){
        // 渲染dom
        this.getQueryAddrInfos()
      }

    },
    methods: {
      ...mapMutations({
        refRecevingInfo: 'refRecevingInfo'
      }),
      getIsEntry (){
        // 判断是否登录 并获取session 和读取接口
        this.userInfos= isLogin(_readURL)
        if(this.userInfos.login){
          this.writeUrl = reqUrl(_writeURL,this.userInfos.session)
        } else {
          this.$router.push({path: '/userCenter'})
        }
      },
      queryAddr () {
        if(this.regxMes()) {
          this.$dialog.loading.open('正在修改中')
          let url = this.writeUrl
          let _this = this
          let defaultAddr = this.recevingInfoLists.Default
          this.axios.post(url,{"Items":[{"Data":{"EntityName":"Delivery_address","Items":{"Address":this.area+this.receivingAddress,"Address1":this.receivingAddress,"Card":this.IDcard,"Consignee": this.receiver,"Default":defaultAddr ,"Delete":"False","DistrictId":this.DistrictId,"FullName":this.area,"Id":this.addressId,"MemberId":this.userInfos.userId,"Mobile":this.phone,"Name":"未指定"},"Status":"Existed"},"ModifyOperationId":_modifyAddress}]}).then((res) => {
            if(JSON.stringify(res.data) == "{}"){
              this.$dialog.loading.close()
              window.sessionStorage.removeItem('recevingInfo')
              _this.$dialog.alert({mes: '修改成功',callback:() => {
                //_this.$router.push({path:'/receivingAddress'})
                _this.$router.go(-1)
              }});
            }
          }).catch((err) => {
            _this.$dialog.loading.close()
            _this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
          })
        }
      },
      addAddr () {
        // 新增加地址
        if(this.regxMes()) {
          this.$dialog.loading.open('正在保存中')
          let url = this.writeUrl
          let _this = this
          let addrId = getUUID()
          this.axios.post(url,{"Items":[{"AddOperationId": _addAddress,"Data":{"EntityName":"Delivery_address","Items":{"Address": this.area+this.receivingAddress,"Address1":this.receivingAddress,"Card":this.IDcard,"Consignee":this.receiver,"Default":"False","DistrictId":this.DistrictId,"FullName":this.area,"Id":addrId,"MemberId": this.userInfos.userId,"Mobile":this.phone,"Name":"未指定"},"Status":"New"}}]}).then((res) => {
            if(JSON.stringify(res.data) == "{}"){
              _this.$dialog.loading.close()
              _this.$dialog.alert({mes: '设置成功',callback:() => {
                _this.$router.push({path:'/receivingAddress'})
              }});
            }
          }).catch((err) => {
            _this.addTimes = ''
            _this.$dialog.loading.close()
            _this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
          })
        }
      },
      regxMes () {
        // 验证填写信息的准确性
        if (isEmpty(this.receiver)) {
          this.$dialog.toast({mes: '请输入您的姓名', timeout: 1500})
          this.addTimes = ''
          return false
        } else if (!validateMobile(this.phone).statu) {
          this.$dialog.toast({mes: validateMobile(this.phone).mes, timeout: 1500})
          this.addTimes = ''
          return false
        } else if (!isEmpty(this.IDcard)&&!IdentityCodeValid(this.IDcard)){
          this.$dialog.toast({mes:'身份证格式不正确', timeout: 1500})
          this.addTimes = ''
          return false
        } else if (isEmpty(this.area)){
          this.$dialog.toast({mes:'请选择省市区', timeout: 1500})
          this.addTimes = ''
          return false
        }  else if (isEmpty(this.receivingAddress)){
          this.$dialog.toast({mes:'请填写详细的收货地址', timeout: 1500})
          this.addTimes = ''
          return false
        }
        return true
      },
      toSaveAddr () {
        if ( this.addressId) {
          // 请求修改地址的原内容
          this.queryAddr()
        } else {
          // 新增加地址
          if (!this.addTimes){
            this.addTimes = 1
            this.addAddr()
          }
        }
      },
      getQueryAddrInfos () {
        this.receiver = this.recevingInfoLists.Consignee
        this.phone = this.recevingInfoLists.Mobile
        let areaArr = this.recevingInfoLists.Address.split(" ")
        areaArr.pop()
        this.area = areaArr.join(" ")
        this.IDcard = this.recevingInfoLists.Card
        this.receivingAddress = this.recevingInfoLists.Address1
        this.addressId = this.recevingInfoLists.Id
      },
      getCity(id,num,addr,key) {
        this.DistrictId = id
        if(this.putArea(num,addr)) return
        this.cityTitle.name = this.areaLists.join(' ')
        this.showArea =[false,false,false]
        this.cityLists =[]
        this.districtLists = []
        this.showArea[key] = true
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${ParentId} == '"+id+"'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","Name","FullName","ZJS"],"MaxCount":num,"Operation":_queryArea}).then((res) => {
          if (key ==1 ){
            this.cityLists = res.data.Datas
          } else {
            this.districtLists = res.data.Datas
          }

        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      getProvince () {
        this.areaLists =[]
        let url = this.userInfos.reqUrl
        this.axios.post(url,{"AppendixesFormatType":1,"Condition":"${CJS} == '1'","IsIncludeSubtables":false,"IsReturnTotal":true,"Items":["Id","Name","FullName","ZJS"],"MaxCount":"40","Operation":_queryArea}).then((res) => {
          this.provinceLists = res.data.Datas
        }).catch((err) => {
          this.$dialog.toast({mes: '操作失败,请重试', timeout: 1500})
        })
      },
      chooseArea () {
        // 开始选择省份
        this.getProvince()
        this.show = false
        this.showArea[0] = true
      },
      putArea (num,addr) {
        // 拼接地址
        this.areaLists.push(addr)
        if (Number(num) == 0) {
          this.area = this.areaLists.join(' ')
          this.showArea =[false,false,false]
          this.show = true
          return true
        } else {
          return false
        }
      },
      cancel(district,id) {
        // 取消页面和地址选择最后一步
        if(district === undefined){
          this.areaLists =[]
        } else {
          this.areaLists.push(district)
          this.area = this.areaLists.join(' ')
          this.DistrictId = id
        }
        this.showArea =[false,false,false]
        this.show = true
      },
      prevAddr (index) {
        //返回上一页地址选择
        this.showArea =[false,false,false]
        this.showArea[index] = true
        this.areaLists.pop()
        this.cityTitle.name = this.areaLists.join(' ')
      }
    }
  }
</script>
<style>
  .writeAddr .yd-cell{
    background: transparent;
  }
</style>
<style scoped>
  .writeAddr .yd-cell-box{
    margin-bottom:0
  }
  .Required{
    color: #7697c6;
    margin-right: 0.15rem;
  }
  .writeAddr .yd-textarea{
    padding:0 .15rem;
  }
  .title{
    position: relative;
  }
  .prev{
    height: 0.4rem;
    vertical-align: middle;
    position: absolute;
    left: 0.1rem;
    top:.25rem;
  }
  .writeAddr .yd-cell-item{
    background: #fff;
  }
  .writeAddr .yd-cell-item:nth-child(4){
    margin-top: .2rem;
  }
</style>

