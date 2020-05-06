<template>
  <div>
    <van-cell-group class="login">
      <van-field
        v-model="form.mobile"
        type="number"
        center
        clearable
        placeholder="请输入手机号"
      >
        <van-button
          slot="button"
          size="small"
          @click="sendCode"
          :disabled="!form.mobile || isSend"
          class="send-code"
        >
          <count-down
            v-if="isSend"
            :tipTextEnd="''"
            :isMinutes="false"
            :startTime="Date.now()"
            :endTime="new Date().getTime() + 59000"
            :secondsTxt="'S'"
            @end_callback="endCallFn"
          />
          <span v-else>获取验证码</span>
        </van-button>
      </van-field>
      <van-field
        v-model="form.code"
        center
        clearable
        type="number"
        placeholder="请输入验证码"
      ></van-field>
    </van-cell-group>

    <van-button
      class="login-button"
      @click="login"
      :disabled="!form.mobile || !form.code"
    >
      登录
    </van-button>
  </div>
</template>

<script>
import {wxLogin, phoneCode} from '@/const/api'
import CountDown from '@/components/count-down'
import {cellPhone} from '@levy9527/pattern-js'

const SHARE = 'SHARE'

export default {
  layout: 'login',
  name: 'login',
  components: {
    CountDown
  },
  data() {
    return {
      form: {
        mobile: '',
        code: ''
      },
      isSend: false
    }
  },
  methods: {
    sendCode() {
      if (!cellPhone.test(this.form.mobile)) {
        this.$notify('手机号码格式错误')
        return
      }
      this.isSend = true
      this.$axios
        .$get(phoneCode(this.form.mobile))
        .then(resp => {
          if (resp.code !== '0') {
            this.$notify(resp.msg)
            return
          }
          this.$notify('发送成功')
        })
        .catch(e => {
          this.$notify('操作失败')
        })
    },
    endCallFn() {
      this.isSend = false
    },
    login() {
      this.$toast.loading('登录中')
      this.$axios
        .$post(
          wxLogin(
            this.$store.state.userId || 1,
            this.form.mobile,
            this.form.code
          ),
          {
            sourceType: SHARE,
            sourceId: this.$route.query.shareId
          }
        )
        .then(resp => {
          if (resp.code !== '0') {
            this.$notify(resp.msg)
            return
          }
          sessionStorage.setItem('token', resp.payload.token)
          this.$store.commit('update', {
            token: resp.payload.token,
            userId: resp.payload.accountId
          })
          this.$notify('登录成功')
          this.$router.back()
        })
        .catch(e => this.$notify('操作失败'))
    }
  }
}
</script>
<style lang="less">
@import '~assets/var.less';

.login {
  &-button {
    width: calc(100% - 30px);
    height: 44px;
    margin: 12px 15px;
    border: 0;
    border-radius: 4px;
    color: #fff;
    background: @primary-color;
  }

  .send-code {
    background: transparent !important;
    height: 35px;
    line-height: 35px;
    border: none;
    border-left: 1px solid #e8e8e8;
    padding: 0 10px;
    color: @primary-color;

    &.van-button--disabled {
      color: #999999;
    }
  }
}
</style>
