const version = '/api/v1'

const hspTradeCenter =
  'http://39.100.141.76:3000/mock/102/hsp-trade-center' + version
const hspMemberCenter = '/hsp-member-center' + version
const wechatCenter = '/hsp-wechat-center' + version
const hspDataCenter = '/hsp-datastatistics-center' + version

const mockServer =
  'http://39.100.141.76:3000/mock/102/hsp-trade-center' + version

export const activityList = hspTradeCenter + '/hspGroupbuyActivitys'
// 拼团活动列表
export const activityLi = `http://39.100.141.76:3000/mock/307/activity-list`
//已有该活动拼团
export const activitySend = `${hspTradeCenter}/groupBuyActiyityDetail/readyGroup`

export const goodsDetail = id =>
  `${hspTradeCenter}/hspGroupbuyActivitys/frontDetail/${id}`

// 根据accountId 获取用户
export const accountInfo = id => `${mockServer}/hspMembers/getAccount/${id}`
// 根据code获取用户状态
export const wxAuth = code => `${wechatCenter}/wechats/login/${code}`
// 获取验证码
export const phoneCode = phone => `${mockServer}/wechats/code/${phone}`
// 绑定手机号登陆
export const wxLogin = (id, phone, code) =>
  `${mockServer}/wechats/code/${id}/${phone}/${code}`
// 获取jsapi ticket
export const jsApiTicket = `${wechatCenter}/wechats/jsapiTicket`

// 参与的个人活动列表
export const memberActivity = `${mockServer}/groupBuyActiyityDetail/joined/list`
// 下单
export const placeOrder = `${hspTradeCenter}/hspTradeOrders/placeOrder`
// 订单详情
export const orderDetail = `${hspTradeCenter}/hspTradeOrders`
// 订单列表
export const orderList = `${hspTradeCenter}/hspTradeOrders/list`
// 优惠券列表
export const couponsList = `${hspTradeCenter}/myhspCoupons/myCouponList`
// 发起拼团
export const createActivity = `${hspTradeCenter}/groupBuyActiyityDetail/joined/list`
// 参与拼团
export const joinActivity = `${hspTradeCenter}/groupBuyActiyityDetail/join`
// 支付
export const payOrder = `${hspTradeCenter}/hspTradeOrders/pay`

// 地址列表
export const addressList = `${mockServer}/hspMemberAddresses/list`
// 新增地址
export const addAddress = `${mockServer}/hspMemberAddresses`
// 默认地址
export const defaultAddress = `${mockServer}/hspMemberAddresses/default`

// 会员信息
export const memberInfo = `${mockServer}/hspMembers`

// 分享次数+1
export const shareNum = id =>
  `${hspDataCenter}/hspMemberCounts/member/addShareNum/${id}`
// 浏览次数+1
export const browseNum = id =>
  `${hspDataCenter}/hspMemberCounts/member/addLookNum/${id}`
// 参与活动+1
export const joinActivityNum = id =>
  `${hspDataCenter}/hspMemberCounts/member/addJoinNum/${id}`

// 活动访问人数+1
export const activityAccessNum = `${hspDataCenter}/hspMemberCounts/activity/addLookPersonNum`
// 活动参与人数+1
export const activityJoinNum = `${hspDataCenter}/hspMemberCounts/activity/addJoinPersonNum`
// 活动分享人数+1
export const activityShareNum = `${hspDataCenter}/hspMemberCounts/activity/addSharePersonNum`
// 添加付费金额
export const payMoney = (accountId, money) =>
  `${hspMemberCenter}/hspMemberCounts/member/addMoneyNum/${accountId}/${money}`
// 记录浏览活动时间
export const recordAccess = `${hspDataCenter}/hspMemberActivityInfos/lookCountInfo`
// 记录参与活动时间
export const recordJoin = `${hspDataCenter}/hspMemberActivityInfos/partakeCountInfo`
// 记录活动付款时间
export const recordPay = `${hspDataCenter}/hspMemberActivityInfos/paymentCountInfo`
// 记录活动分享时间
export const recordShare = `${hspDataCenter}/hspMemberActivityInfos/shareCountInfo`
// 创建分享信息
export const createShareInfoApi = `${hspDataCenter}/hspMemberShareInfos`
// 带来浏览量增加
export const browseApi = id =>
  `${hspDataCenter}/hspMemberShareInfos/add/browse/${id}`
// 生成分享id
export const createUid = `${hspDataCenter}/hspMemberUUIDs`
// 浏览记录增加
export const accessRecordApi = `${hspDataCenter}/hspMemberActivityInfos/lookCountInfo`
