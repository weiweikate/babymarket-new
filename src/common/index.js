import { _attatchmentURL, _session,_topic  } from './request.js'

//  url
const reqUrl = function (api,session) {
  return  api+'?_SESSION_='+session
}

//判断是否登录
const isLogin = function (url) {
  //判断是否登录 并获取拼接请求的url
  let infos = window.sessionStorage.userInfos
  // let userId = window.sessionStorage.userId
  if (infos) {
    infos = JSON.parse(unescape(infos))
    //console.log(infos)
     //let session = window.sessionStorage.getItem('session_application')
    return infos
  } else {
    // 游客 session
    return { 'login': false, 'reqUrl':reqUrl(url,_session),'session':_session }
  }
}

// 获取图片
const getImgs = function (imgId) {
  if (imgId === undefined){
    return false
  } else if(isLogin().login) {
    return  _attatchmentURL+ '?Id=' + imgId + '&_SESSION_=' + isLogin().session
  } else {
    return _attatchmentURL+ '?Id=' + imgId+ '&_SESSION_='+ _session
  }
}

// 获取会员等级
const userPrice = function (info,levelPriceArr) {
  let prices =levelPriceArr.map(function(levelPrice){
    if (info.MemberTypeKey == 0) {
      return levelPrice.LYPrice
    } else if (levelPrice.ShopLevelPrice.length>0 || levelPrice.ShopLevelPrice!= null || levelPrice.ShopLevelPrice != undefined) {
      for (let i= 0;i<levelPrice.ShopLevelPrice.length; i++) {
        console.log(levelPrice.ShopLevelPrice[i].ShopLevelKey,info.LevelKey)
        if (levelPrice.ShopLevelPrice[i].ShopLevelKey == info.LevelKey ) {
          return levelPrice.ShopLevelPrice[i].Price2
        } else if (info.Inside == "True") {
           return levelPrice.PriceInside
        }else {
          return levelPrice.Price
        }
      }
    }
  })
  return prices
}

// 判断是否为空
const isEmpty = function (obj) {
  let object = Trim(obj)
  if (object === null || object === undefined || object.length === 0) {
    return true
  }else{
    return false
  }
}

// 生成UUID
const getUUID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

// 生成当前时间戳

const getTimes = function () {
  return String(new Date().getTime())
}

// 判断身份证是否符合要求
const IdentityCodeValid = function (num) {
  num = num.toUpperCase();
  //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))) {
    // alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
    return false
  }
  //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
  //下面分别分析出生日期和校验位
  var len, re;
  len = num.length;
  if (len == 15) {
    re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
    var arrSplit = num.match(re);
    //检查生日日期是否正确
    var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
    var bGoodDay;
    bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2]))
    && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
    && (dtmBirth.getDate() == Number(arrSplit[4]))
    if (!bGoodDay) {
      // alert('输入的身份证号里出生日期不对！')
      return false
    } else {
      //将15位身份证转成18位
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0, i;
      num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i];
      }
      num += arrCh[nTemp % 11];
      return num
    }
  }
  if (len == 18) {
    re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
    var arrSplit = num.match(re)
    //检查生日日期是否正确
    var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
    var bGoodDay;
    bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2]))
    && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3]))
    && (dtmBirth.getDate() == Number(arrSplit[4]));
    if (!bGoodDay) {
      // alert(dtmBirth.getYear());
      //alert(arrSplit[2]);
      //alert('输入的身份证号里出生日期不对！');
      return false
    } else {
      //检验18位身份证的校验码是否正确。
      //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
      var valnum;
      var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      var nTemp = 0, i;
      for (i = 0; i < 17; i++) {
        nTemp += num.substr(i, 1) * arrInt[i]
      }
      valnum = arrCh[nTemp % 11];
      if (valnum != num.substr(17, 1)) {
        //alert('18位身份证的校验码不正确！应该为：' + valnum);
        return false
      }
      return num
    }
  }
  return false
}
// 验证手机号码
const validateMobile = function (mobile) {
  if (Trim(mobile) == '') {
    return {statu:false,mes:'请输入手机号码'}
  } else if (!(new RegExp(/^0?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9])[0-9]{8}$/).test(Trim(mobile)))) {
    return {statu:false,mes:'手机格式不正确'}
  } else {
    return {statu:true}
  }
}
// 验证密码格式
const validatePwd = function (pwd) {
  let password = Trim(pwd)
  if (password.length == 0) {
    return {statu:false,mes:'密码不能为空'}
  } else if (password.length < 6) {
    return {statu:false,mes:'密码长度必须大于6位'}
  } else if (password.length > 16) {
    return {statu:false,mes:'密码长度必须小于16位'}
  }
  // else {
  //  if (!new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/).test(password)) {
  //    return {statu:false,mes:'密码格式不正确'}
  //  }
  // }
  return {statu:true}
}
// 验证重复密码格式
const validateRpwd = function (pwd,rpwd) {
  var password = Trim(pwd)
  var rpassword = Trim(rpwd)
  if (!rpassword) {
    return {statu:false,mes:'请再次输入密码'}
  } else if (rpassword != password) {
    return {statu:false,mes:'两次输入密码不一致'}
  }
  return {statu:true}
}
//去掉空格
const Trim = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
// cookie 增删改查
const addCookie = function (name, value, expiresHours) {
  let cookieString = name + '=' + value
  // 判断是否设置过期时间,0代表关闭浏览器时失效
  if (expiresHours > 0) {
    let date = new Date()
    date.setTime(date.getTime() + expiresHours * 24*60*60*1000)
    cookieString = cookieString + ';expires=' + date.toUTCString()
  }
  document.cookie = cookieString
}

const editCookie = function (name, value, expiresHours) {
  let cookieString = name + '=' + escape(value)
  if (expiresHours > 0) {
    let date = new Date()
    date.setTime(date.getTime() + expiresHours * 1000)
    cookieString = cookieString + ';expires=' + date.toGMTString()
  }
  document.cookie = cookieString
}

const getCookieValue = function (name) {
  let arr = ''
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  if (arr) {
    return arr[2]
  } else {
    return ''
  }
}
// 判断订单状态
const ordersStatus = function (num) {
  let n = Number(num)
  let orderStatus =""
  switch (n) {
    case 0:
      orderStatus ='待付款'
      break
    case 1:
      orderStatus = '待发货'
      break;
    case 2:
      orderStatus = '待收货'
      break
    case 3:
      orderStatus = '待分享'
      break
    case 4:
      orderStatus = '已评价'
      break
    case 5:
      orderStatus = '交易成功'
      break
    case 6:
      orderStatus = '交易关闭'
      break
    case 7:
      orderStatus = '退款中'
      break
    case 8:
      orderStatus = '退款成功'
      break
    case 9:
      orderStatus = '退款失败'
  }
  return orderStatus
}
// 格式化时间
const formatTime = function () {
  Date.prototype.Format = function (fmt) {
    var o = {
      "M+" : this.getMonth()+1, //月份
      "d+" : this.getDate(), //日
      "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
      "H+" : this.getHours(), //小时
      "m+" : this.getMinutes(), //分
      "s+" : this.getSeconds(), //秒
      "q+" : Math.floor((this.getMonth()+3)/3), //季度
      "S" : this.getMilliseconds() //毫秒
    };
    var week = {
      "0" : "/u65e5",
      "1" : "/u4e00",
      "2" : "/u4e8c",
      "3" : "/u4e09",
      "4" : "/u56db",
      "5" : "/u4e94",
      "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
      fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt
  }
  return  new Date().Format("yyyy-MM-dd HH:mm:ss")
}
// 判断是不是pc端
const browserRedirect = function () {
  //let sUserAgent = navigator.userAgent.toLowerCase()
  //let bIsIpad = sUserAgent.match(/ipad/i) == "ipad"
  //let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os"
  //let bIsMidp = sUserAgent.match(/midp/i) == "midp"
  //let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4"
  //let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb"
  //let bIsAndroid = sUserAgent.match(/android/i) == "android"
  //let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce"
  //let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile"
  //if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
  //  return {isPhone:false,width:'500'}
  //} else {
  //  return {isPhone:true,width:'100%'}
  //}
  let ua = navigator.userAgent.toLowerCase()
  let btypeInfo = (ua.match( /firefox|chrome|safari|opera/g ) || "other")[ 0 ]
  let size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
  if( (ua.match( /msie|trident/g ) || [] )[ 0 ] ) {
    btypeInfo = "msie"
  }
  let pc = ""
  let prefix = ""
  let plat = ""
  //如果没有触摸事件 判定为PC
  let isTocuh = ("ontouchstart" in window) || (ua.indexOf( "touch" ) !== -1) || (ua.indexOf( "mobile" ) !== -1)
  if( isTocuh ) {
    if( ua.indexOf( "ipad" ) !== -1 ) {
      pc = "pad"
    } else if( ua.indexOf( "mobile" ) !== -1 ) {
      pc = "mobile"
    } else if( ua.indexOf( "android" ) !== -1 ) {
      pc = "androidPad"
    } else {
      pc = "pc"
    }
  } else {
    pc = "pc"
  }
  switch( btypeInfo ) {
    case "chrome":
    case "safari":
    case "mobile":
      prefix = "webkit"
      break;
    case "msie":
      prefix = "ms"
      break;
    case "firefox":
      prefix = "Moz"
      break;
    case "opera":
      prefix = "O"
      break
    default:
      prefix = "webkit"
      break
  }
  plat = (ua.indexOf( "android" ) > 0) ? "android" : navigator.platform.toLowerCase()
  return {
    width:500,
    version: (ua.match( /[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[ 1 ],     //版本
    plat: plat,                   //系统
    type: btypeInfo,              //浏览器
    pc: pc,
    prefix: prefix,                //前缀
    isMobile: (pc == "pc") ? false : true,            //是否是移动端
    smallscreen: size.indexOf('smallscreen') > -1  // 判断是否是小屏幕或者是平板
  }
}

// 判断移动端
const browser = function () {
  var u = navigator.userAgent, app = navigator.appVersion;
  var size = window.getComputedStyle(document.body,':after').getPropertyValue('content');
  return {//移动终端浏览器版本信息
    trident: u.indexOf('Trident') > -1, //IE内核
    presto: u.indexOf('Presto') > -1, //opera内核
    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux')> -1 || u.indexOf('UCBrowser') > -1, //android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, //是否iPad
    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, //是否微信
    qq: u.match(/\sQQ/i) == " qq", //是否QQ，
    smallscreen: size.indexOf('smallscreen') !=-1  // 判断是否是小屏幕或者是平板
  }
}
// 地铁定位
const myMixinLyMap = {
  methods: {
    getAdress(callBack) {
      // 百度地图获取地理定位
      if(!window.sessionStorage.address) {
        let _this  = this
        let geolocation = new BMap.Geolocation()
        let gc = new BMap.Geocoder()
        geolocation.getCurrentPosition(function (r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            let pt = r.point
            gc.getLocation(pt, function (rs) {
              let addComp = rs.addressComponents
              let address = {province:addComp.province, city:addComp.city, area:addComp.district }
              if(arguments.length>0){
                _this.province = address.province
                callBack
              }
              window.sessionStorage.address = JSON.stringify(address)
            })
          }else{
            alert('GPS信号弱')
          }
        }, { enableHighAccuracy: true })
      }
    }
  }
}
// 判断页面点击跳转
const myMixinClickedJump = {
  methods: {
    getIndexPic (picId) {
      return getImgs(picId)
    },
    clickedJumpPage (subPagePic) {
      let prdId = subPagePic.ProductId  // 获取产品Id
      let key = subPagePic.LinkTypeKey // 判断调整到哪个页面的key
      let url = subPagePic.url // 产品的链接
      let keyword= subPagePic.KeyWord // 关键字
      let title = subPagePic.Name // 所属的产品类别
      console.log(prdId,key,url,keyword,title)
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

export { myMixinClickedJump, myMixinLyMap,browserRedirect, formatTime,Trim, addCookie, editCookie, getCookieValue, reqUrl, isLogin, isEmpty, getImgs, goToDeltailPages, getUUID,userPrice,getTimes, IdentityCodeValid, validateMobile, validatePwd, validateRpwd, ordersStatus }


