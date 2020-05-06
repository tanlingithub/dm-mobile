import Vue from 'vue'

const API_SERVER = process.env.apiServer || ''

// 授权地址
const AUTH_API = API_SERVER + '/wxAuth'

const TICKET_KEY = 'jsapi_ticket'

/**
 * jsApiTicket地址
 */
const jsApiTicket =
  process.env.WECHAT_CENTER ||
  `${API_SERVER}/wx/api/v1/mp/js_ticket?account=${process.env.wechatAccount}`

/**
 * 微信环境
 *
 * @returns {Boolean}
 */
export const isWeChat = () => /MicroMessenger/i.test(navigator.userAgent)

/**
 * 微信授权认证
 *
 * @param {String} [referer] 回调地址
 * @param {String} [api] 授权接口
 */
export function auth(referer = location.href, api = AUTH_API) {
  const redirectUrl = encodeURIComponent(referer)
  const authUrl = `${api}?tenantId=showyu&referer=${redirectUrl}#wechat_redirect`
  // location.replace(authUrl)
  console.log('授权地址' + authUrl)
}

/**
 * 初始化JSSDK
 *
 * @params {Vue} app
 * @params {*} route 当前路由
 */
export async function initSDK(app, route) {
  let ticket = sessionStorage.getItem(TICKET_KEY)

  try {
    if (!ticket) {
      let resp = await app.$axios.$get(jsApiTicket)
      ticket = resp.payload

      sessionStorage.setItem(TICKET_KEY, ticket)
    }

    let timestamp = new Date().getTime(),
      nonceStr = 'nonceStr',
      url = location.href.split('#')[0]

    let str = `${TICKET_KEY}=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`,
      signature = sha1(str)

    // 配置菜单
    wx.config({
      // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: process.env.wechatAppId, // 必填，公众号的唯一标识
      timestamp, // 必填，生成签名的时间戳
      nonceStr, // 必填，生成签名的随机串
      signature, // 必填，签名，见附录1
      jsApiList: [
        'hideAllNonBaseMenuItem',
        'showMenuItems',
        'scanQRCode',
        'chooseWXPay',
        'closeWindow',
        'onMenuShareTimeline',
        'onMenuShareAppMessage'
      ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })

    wx.ready(function() {
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
      // config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。
      // 对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

      // 隐藏所有传播菜单, 不能复制链接等, 只能刷新
      wx.hideAllNonBaseMenuItem()
      // 分享到朋友圈、分享给朋友
      wx.showMenuItems({
        menuList: ['menuItem:share:appMessage', 'menuItem:share:timeline'] // 要显示的菜单项，所有menu项见附录3
      })
    })
  } catch (e) {
    console.error('wechat sdk config error : ', e)
  }
}

// export plugin
Vue.prototype.$wechat || (Vue.prototype.$wechat = {})
Vue.prototype.$wechat.auth = auth
Vue.prototype.$wechat.initSDK = initSDK
