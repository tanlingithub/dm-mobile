import cookie from 'js-cookie'
import {PLAIN_PAGE} from '@/const/path'
import * as WeChat from '@/plugins/wechat'

const TOKEN_KEY = 'token'

/**
 * @deprecated
 *
 * 1. 认证拦截:
 *    - 验证token, 否则跳转微信认证
 *    - 认证时页面重定向至空白页
 * 2. 开发环境：
 *    - 开发环境跳过微信授权
 *    - getDevToken获取token
 * 3. 更新用户信息
 * 4. 非微信环境：
 *    - 跳转空白页（暂时）
 * 5. 停服控制
 * 6. 微信二次跳转
 *
 */
export default async function({app, route, redirect, store, isDev, isServer}) {
  if (isServer) return // 跳过server

  if (route.path === PLAIN_PAGE) return // 跳过空白页

  const hasToken = !!cookie.get(TOKEN_KEY)
  const isWeChat = WeChat.isWeChat()

  // 微信跳转认证
  if (isWeChat && !hasToken) {
    WeChat.auth()
    return //redirect(PLAIN_PAGE, {title: '认证授权中...'})
  }

  // 配置SDK
  if (isWeChat) {
    WeChat.initSDK(app, route)
  }

  // 更新用户信息（非强制刷新）
  // if (hasToken) {
  //   await store.dispatch('getUserInfo')
  // }
}
