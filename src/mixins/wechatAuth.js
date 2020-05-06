/**
 * Created by levy on 2018/9/19.
 */
import qs from 'qs'

const AUTHED = 'htua'
const REDIRECTED = 'redirected'

/**
 * 用于分享的外链 到微信auth2.0 认证, 再重定向回来
 * url格式为: ?auth=1&path=${path}&k=v
 * auth=1必传
 * path为页面相对路径
 * k=v为额外参数, 可以多个
 */
export default {
  created() {
    // 对外的query, 一律遵循url规范, 放在pathname后面, 而不是因为这是hash模式的SPA, 就放在#后面
    let params = qs.parse(location.search, {ignoreQueryPrefix: true})

    if (params.auth) {
      // 白屏, 防止出现首页内容
      // next('/auth')

      let wxAuthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${
        process.env.wechatAppId
      }&redirect_uri=`

      // 带参数重定向回首页

      // hash模式, 访问可以是: domain/path/#/
      // 也可以是: domain/path/index.html#/
      let redirectUrl = location.origin + location.pathname

      // 防止auth回来又auth: 死循环
      // 不能带#号
      let query =
        location.search.replace('auth', AUTHED).replace(/&/g, ',') +
        `&response_type=code&scope=snsapi_userinfo&state=${
          params.state
        }#wechat_redirect`

      // TODO 应该replace?
      // console.log(wxAuthUrl + redirectUrl + query)
      location.href = wxAuthUrl + redirectUrl + query
    }

    if (
      !sessionStorage.getItem(REDIRECTED) &&
      location.href.indexOf(AUTHED) > -1
    ) {
      sessionStorage.setItem(REDIRECTED, 1)

      let search = location.search

      // 把微信重定向带来的code与state去掉
      // 只有?后面第一个参数是开发者定义的, 后面&的参数是微信的
      if (search.indexOf('&') > -1)
        search = search.slice(0, search.indexOf('&'))

      params = qs.parse(search, {delimiter: ',', ignoreQueryPrefix: true})

      this.$store.commit('update', {
        tenantId: params.state
      })
      sessionStorage.setItem('tenantId', params.state)

      setTimeout(() => {
        this.$router.push({
          path: params.path,
          query: params
        })
      }, 1000)
    }
  }
}
