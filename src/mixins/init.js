import qs from 'qs'
import {wxAuth} from '@/const/api'

const WECHAT_TOKEN_TICKET = 'token'
const USER_ID = 'userId'
const MEMBER_ID = 'memberId'
const NULL = 'null'
const TENANT_ID = 'tenantId'

export default {
  created() {
    let index = location.href.indexOf('?')
    let params = qs.parse(location.href.slice(index), {
      ignoreQueryPrefix: true
    })

    let token = sessionStorage.getItem(WECHAT_TOKEN_TICKET) || params.token
    let userId = sessionStorage.getItem(USER_ID)
    let memberId = sessionStorage.getItem(MEMBER_ID)
    let tenantId = sessionStorage.getItem(TENANT_ID) || params.state
    if (tenantId && tenantId.indexOf('#') > -1)
      tenantId = tenantId.slice(0, tenantId.indexOf('#'))

    // 刷新后的token和userId重新存入store
    if (token && this.$store.state.token !== NULL) {
      this.$store.commit('update', {
        token,
        userId,
        memberId,
        tenantId
      })
    } else {
      // 如果是授权页面并且缺少code
      if (!params.code || !params.state) {
        return
      }

      // 提交code 获取token
      this.$axios
        .post(wxAuth(params.code), {
          tenantId
        })
        .then(({data}) => {
          let payload = data.payload
          token = payload.token

          // store存入token
          this.$store.commit('update', {
            token,
            userId: payload.accountId,
            memberId: payload.memberId,
            tenantId
          })

          sessionStorage.setItem(WECHAT_TOKEN_TICKET, token)
          sessionStorage.setItem(USER_ID, payload.accountId)
          sessionStorage.setItem(MEMBER_ID, payload.memberId)
          sessionStorage.setItem(TENANT_ID, tenantId)

          return token
        })
        .catch(e => {
          this.$toast.fail({
            message: '微信验证失败, 请退出重试'
          })
        })
    }
  }
}
