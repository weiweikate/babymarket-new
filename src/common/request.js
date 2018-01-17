/**
 * Created by lenovo on 2017/11/21.
 */
// baseUrl
// let baseUrl = 'http://www.babymarkt.com.cn'
let baseUrl = 'http://202.91.250.138/bbmt'
export const _baseUrl = baseUrl
// 物流查询地址和key
export const _logisticsKey = '68b36abf923b43d8294cfa09482c945a'
export const _logisticsCompanyUrl = 'http://v.juhe.cn/exp/index'
// 默认图片地址
export const imgdefualt = require('../img/defualt_loading_square_bg.png')
// 游客session
export const _session = '7e865860-3e52-4b59-a261-a53600a4f6dd'
// 登录接口
export const _loginURL = '/Libra.Web.Authentication.GetSession.aspx'
// 读取接口
export const _readURL = '/Libra.Web.AppSync.AppSyncBatchReadData2.aspx'
// 写入
export const _writeURL = '/Libra.Web.Api.ApiBatchWrite.aspx'
// 附件
export let _attatchmentURL = baseUrl+ '/Libra.Web.Businesses.Attachments.GetFile.aspx'
// 图文详情页面
export const _productWebUrl = '/productwebdetail.aspx?Id='
// 专题详情页
export const _subjectWebUrl = '/Subject.aspx?Id='
// 轮播图片和展示图片
export const _picBelowShow = 'b412ff1c-c19b-4250-b479-a61e0085a868'
// 码头快报
export const _LYnotice ='48d1e8a7-43a8-0ddd-1f68-3f50003c646b'
// 产品分类 一级标题和二级标题
export const _prdType = '4293f401-3425-4d6b-bf67-a618018b764a'
// 产品标签 如：老友爆款
export const _prdLabel ='9880c3ed-124e-4703-9c67-a6500127ed09'
// 标签相关产品
export const _prdTarget ='74bd6fa2-3de3-028e-197e-3f5201d5e08b'
// 详情页的轮播图片
export const _detailPicBelowShow = '7eba4898-2f70-05b4-0b17-009a002e71ad'
//详情页的商品表
export const _prdInfo = 'de9362a8-395e-09a4-087d-3c1701f9da63'
// 查询运费
export const _freight = '91972a34-2e32-0928-156f-3c3501e55857'
// 产品规格组
export const _specificationGroup = '41222433-4d44-089d-3ca0-3c6800f1d60a'
//产品规格值
export const  _specificationKey  = '7b1f99fa-4d0e-08e8-1868-3c6800f15f6e'
// 产品规格
export const  _specification = '3b61a23d-e130-00cd-320f-3c6800fbe982'
// 是否被收藏  传用户id
export const  _collection = 'ad5b7994-a09c-0aa9-35fe-3c3b0004d9af'
// 新增收藏  用户id 产品id
export const  _addCollection = '23183844-883f-04c2-0a27-3c3501c7be16'
// 取消收藏   用户id 产品id
export const  _deleteCollection = '6ad78ca1-4b32-038b-3f48-3c3601d52a16'
// 新增购物车 this.prdInfos.StoreId
export const  _addShoppingCarts = '84cd955f-202c-02c8-339a-3c270191d122'
//删除购物车
export const  _deleteShoppingCarts = 'cd0221ba-e321-0581-06f5-3c2401834522'
// 请求购物车页面数据 请求仓库列表
export const  _shoppingCart = '0a8ed48f-088f-0ca3-0c43-3c290052b69b'
//修改购物车的数量
export const  _changeShoppingCarts = '137c1d5c-dc35-0114-0b27-3c240045510e'
// 生成订单
export const  _newOrder = 'c65c46b6-b12e-0e57-28fe-3c1900223872'
// 生成订单明细
export const  _newOrderDetails = '6a5ba01b-d63c-0e45-230f-3c19005015b1'
// 获取会员等级
export const _userLevel = 'b83b9dc9-5568-0c67-1926-3c1701fb385b'
// 查询收货地址
export const _recevingAddress = '881d520d-bb5d-04e2-29a8-3c29005a359b'
// 删除-收货地址 修改-设置收货地址：
export const _modifyAddress = '91ef9bde-6fe7-0955-2ecc-3c24004dd20e'
// 新增-收货地址
export const _addAddress = '065e13dd-93fe-0a89-1671-3c2701995222'
// 查询-地区(省级):
export const _queryArea = '7e179d1c-ab1c-0352-0a44-393c01c0abf4'
// 获取专题信息
export const _topic = '1120e650-629e-4af0-ab39-a650012db775'
// 热门关键词查询
export const _hotKeyWords = 'c8abee85-11ab-0bba-1bcd-3c4701ec76cb'
// 查询-搜索关键词商品
export const _searchKeyWords = 'de9362a8-395e-09a4-087d-3c1701f9da63'
// 新增-搜索记录
export const _addSearchKeyWords = '46e8af55-3908-05d1-2414-3c49002f1172'
// 确认订单查询
export const _comfrimOrder = '481f0766-998d-003c-1727-3c1701e15fcb'
//  修改订单
export const _modifyOrder = '51edceb5-4d37-0d8b-1043-3c1a01f6b85e'
// 查询全部订单
export const _userOrders = 'd194441f-fb19-494e-bce3-a7d7009acd4d'
// 按条件查询全部订单
export const _userOrdersCondition = '481f0766-998d-003c-1727-3c1701e15fcb'
// 查询订单明细
export const _orderDetail = 'e418e1cb-fe9f-002e-1cd6-3c1701937208'
// 取消订单
export const _cancelOrder = 'b96606a7-0df7-42b6-91df-a53800bb5f31'
// 删除订单
export const _deleteOrder = '8f93f253-7223-091e-1d91-3c1a0030ac72'
// 确认到货
export const _arrivalOrder = 'ec6a46f0-130c-4b40-97e9-a53800bad3bd'
// 申请退款
export const _addAppliyRefund = 'a6998041-52b6-0a29-30cf-3e7800b26949'
// 退款订单明细
export const _refundDetail = 'aa9ec158-e856-4432-ac9c-a84f0179ad8e'
// 修改或者取消退款
export const _appliyRefund = '88c79a35-f915-473d-b8c3-a77500185b8c'
// 查询退款原因
export const _refundReason = 'd8f2d996-53f4-0d49-2b4a-3e7601740c18'
// 优惠卷查询
export const _coupons= 'ac4b38e9-45ce-0626-2fc2-3c3b000e731f'
// 验证码
export const _addCode = '47d7a940-ab9e-04dc-2029-3c2701c073ba'
// 查询验证
export const _checkCode = 'c994e890-833d-0ab7-1ff0-3c2900031403'
// 重置密码或者忘记密码
export const _passwordRetake = 'f22aaf89-0539-0bf4-3142-3c4a01a6748f'
// 注册会员
export const _register = '3678dc19-7dcb-020c-26ff-3c1900385fe2'
// 已省金额
export const _savedAmount = 'def432e0-c6b8-4bef-8ed3-a75c009c3aed'
// 我的奖励
export const _commissionLog = '82f1f24c-e796-4d4c-8afb-a75c009c282d'
// 我的资产
export const _balanceLog = 'a0d1c6cb-0618-008d-3073-3e5e0059b80b'
// 用户反馈
export const _userReport = 'e4295a73-e8eb-0877-0e3f-3c3501ceb312'
// 我的收藏
export const _userFavorite = 'ad5b7994-a09c-0aa9-35fe-3c3b0004d9af'
