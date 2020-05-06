/**
 * Created by levy on 2018/7/22.
 */
import cookie from 'js-cookie'

// 客户端鉴权
export default {
  async created() {
    if (process.env.NO_LOGIN > 0) return

    let token = cookie.get('token')
    let userId = cookie.get('userId')
    let tenantId = cookie.get('tenantId')

    // 未登录
    if (!userId || !token) {
      this.$router.replace('/login')
    }
    // 已登录但因为刷新, 状态丢失
    else if (!this.$store.state.userId) {
      this.$store.commit('update', {
        token,
        userId,
        tenantId
      })
    }
  }
}
