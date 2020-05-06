import Vue from 'vue'
import cookie from 'js-cookie'
import qs from 'qs'

const NULL = 'null'

export default function(context) {
  let {$axios, store, app, redirect} = context

  let index = location.href.indexOf('?')
  let params = qs.parse(location.href.slice(index), {
    ignoreQueryPrefix: true
  })

  let token = sessionStorage.getItem('token')
  let userId = sessionStorage.getItem('userId')
  let memberId = sessionStorage.getItem('memberId')
  let tenantId = sessionStorage.getItem('tenantId') || params.state
  if (tenantId && tenantId.indexOf('#') > -1)
    tenantId = tenantId.slice(0, tenantId.indexOf('#'))

  // 刷新后的token和userId重新存入store
  if (token && store.state.token !== NULL) {
    store.commit('update', {
      token,
      userId,
      memberId,
      tenantId
    })
  }

  $axios.onRequest(config => {
    let url = config.url
    let token = store.state.token || sessionStorage.getItem('token')
    let tenantCode = store.state.tenantId || tenantId

    url += url.indexOf('?') > -1 ? '&' : '?'
    url += `token=${token}&userId=${
      store.state.userId
    }&_=${new Date().getTime()}&tenantId=${tenantCode}`

    config.url = url

    return config
  })

  $axios.onError(error => {
    if (process.client) {
      // axios 数据结构
      let resp = error.response
      let data = resp.data

      if (resp.status == 401) {
        let path = app.router.options.base
        cookie.remove('token', {path})
        cookie.remove('userId', {path})
        cookie.remove('tenantId', {path})
        redirect('/login')
      }
    }
    // TODO asyncData 的错误 需要日志监控
    else console.log('error', error)
  })
}
