<template>
  <section class="group-success">
    <van-card :title="activityProduct.name" :thumb="productSku.imgUrl">
      <div slot="desc">
        <span class="group-success-tag"
          >{{ activityProduct.completePersonCount }}人团</span
        >{{ activityProduct.activityPrice | price }}
        <span class="group-success-discount">{{
          productSku.priceMoney | price
        }}</span>
      </div>
    </van-card>

    <div class="group-success-member">
      <div class="flex-layout">
        <div
          class="member-info"
          v-for="(val, index) in memberList"
          :key="index"
        >
          <span class="tag" v-if="val.flag === 1">团长</span>
          <img width="65px" height="65px" class="avatar" :src="val.headUrl" />
        </div>
      </div>

      <!-- 拼团成功 -->
      <template v-if="remainNum === 0 && inOrder">
        <p class="time">恭喜你拼团成功</p>
        <button class="invite-button" @click="toDetail">
          查看订单详情
        </button>
      </template>
      <!-- 拼团已成团 -->
      <template v-else-if="remainNum === 0 && !inOrder">
        <p class="time">您来晚了，去看看其他活动吧</p>
        <button class="invite-button" @click="$router.push('/')">
          我也要发起拼团
        </button>
      </template>
      <!-- 拼团状态异常「结束/到期」 -->
      <template
        v-else-if="
          endTime - new Date().getTime() <= 0 || activityProduct.status != '2'
        "
      >
        {{ endTime - new Date().getTime() <= 0 }}{{ activityProduct.status }}
        <p class="time">您来晚了，活动已取消</p>
        <button class="invite-button" @click="$router.push('/')">
          去看看其他活动
        </button>
      </template>
      <!-- 参团 -->
      <template v-else>
        <div class="time">
          还差{{ remainNum }}人，距离活动结束还剩
          <count-down
            :tipTextEnd="''"
            :startTime="Date.now()"
            :endTime="endTime"
            :secondsTxt="''"
          >
          </count-down>
        </div>
        <button class="invite-button" v-if="inOrder" @click="shareOrder">
          邀请好友拼团
        </button>
        <button class="invite-button" v-else @click="confirmOrder">
          立即参与拼团
        </button>
      </template>
    </div>

    <van-cell-group class="group-success-step cell-group step-group">
      <van-cell title="拼团流程"></van-cell>
      <div class="course">
        <div class="course-item">
          <div class="course-step">
            <span>1</span>
          </div>
          <p>1.发起/参与</p>
        </div>
        <div class="course-item">
          <div class="course-step">
            <span>2</span>
          </div>
          <p>2.邀请好友</p>
        </div>
        <div class="course-item">
          <div class="course-step">
            <span>3</span>
          </div>
          <p>3.人满成团</p>
        </div>
        <div class="course-line"></div>
      </div>
      <p class="align-right">注：拼团失败，全额退款</p>
    </van-cell-group>
  </section>
</template>

<script>
import {Card} from 'vant'
import order from '@/mixins/order'
import {orderDetail} from '@/const/api'
import CountDown from '@/components/count-down'

const NULL = 'null'

export default {
  name: 'group-success',
  head() {
    return {
      title: '开团成功'
    }
  },
  mixins: [order],
  components: {
    'van-card': Card,
    CountDown
  },
  data() {
    return {}
  },
  computed: {
    remainNum() {
      return 1
      return (
        this.activityProduct.completePersonCount - this.linkOrders.length - 1 ||
        0
      )
    },
    // 结束倒计时
    endTime() {
      return 1571068800000
      const hours = 1000 * 60 * 60
      return (
        this.activityProduct.effectiveTime * hours +
          this.tradeOrder.createdAt || 0
      )
    }
  },
  methods: {
    // 确认订单
    confirmOrder() {
      return this.toDetail()
      if (!this.$store.state.token || this.$store.state.token === NULL) {
        this.$router.push({
          path: '/login',
          query: {
            shareId: this.$route.query.shareId
          }
        })
        return
      }

      let goods = {
        skuId: this.activityProduct.productId,
        activityId: this.activityProduct.id,
        name: this.activityProduct.name,
        activityPrice: this.activityProduct.activityPrice,
        salePrice: this.activityProduct.salePrice,
        imageUrl: this.productSku.imgUrl.split(','), //为了统一变成数组
        completePersonCount: this.activityProduct.completePersonCount,
        purchaseLimitCount: this.activityProduct.purchaseLimitCount
      }
      //物品数
      let data = JSON.stringify(Object.assign({count: '1'}, goods))
      sessionStorage.setItem('product', data)
      this.$router.push({
        path: '/order/confirmation',
        query: {
          flag: 0,
          groupId: this.tradeOrder.groupId
        }
      })
    },
    toDetail() {
      let id = this.$route.query.id
      if (
        this.totalOrder.hspTradeOrder.memberId != this.$store.state.memberId &&
        this.inOrder
      ) {
        id = this.totalOrder.linkOrders.find(res => {
          return this.$store.state.memberId == res.hspTradeOrder.memberId
        }).hspTradeOrder.id
      }
      this.$router.push(`/order/detail?id=${id}`)
    },
    // 邀请好友
    shareOrder() {
      this.$dialog.alert({
        message: '点击右上角，发送给朋友或者朋友圈'
      })
    },
    // 分享
    setupShare() {
      let title = this.activityProduct.name,
        desc = '快来加入我们吧',
        imgUrl = this.productSku.imgUrl,
        link =
          location.origin +
          location.pathname +
          `?auth=1&path=group/success&state=${this.$store.state.tenantId}&id=${
            this.$route.query.id
          }`

      wx.onMenuShareTimeline({
        title, // 分享标题
        desc,
        imgUrl, // 分享图标
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        success: function() {
          // 用户点击了分享后执行的回调函数
        }
      })

      wx.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        imgUrl, // 分享图标
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户点击了分享后执行的回调函数
        }
      })
    }
  }
}
</script>

<style lang="less">
.group-success {
  padding: 12px;

  .align-right {
    color: #999;
    text-align: right;
    margin-right: 20px;
  }

  .van-card {
    padding: 15px;
    border-radius: 6px;
    font-size: 14px;
    background: #fff;

    .van-card__title {
      font-weight: 0;
      margin: 6px 0 15px 0;
    }
  }

  .flex-layout {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &-tag {
    display: inline-block;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    background: #c53439;
  }

  &-discount {
    color: #999;
    text-decoration: line-through;
  }

  &-member {
    border-radius: 6px;
    padding: 0px 15px 15px;
    margin-top: 10px;
    text-align: center;
    background: #fff;

    .member-info {
      position: relative;
      margin: 15px 20px 10px 20px;
    }

    .avatar {
      border-radius: 50%;
    }

    .tag {
      position: absolute;
      top: 0;
      left: -20px;
      display: inline-block;
      padding: 1px 6px;
      border-radius: 2px;
      font-size: 12px;
      color: #fff;
      background: #c53439;
    }

    .time {
      margin: 5px 0 10px 0;
    }

    .invite-button {
      width: 80%;
      padding: 8px 0;
      color: #fff;
      background: #c53439;
      border: none;
      border-radius: 20px;
    }
  }

  &-step {
    margin-top: 10px;
    background: #fff;
    border-radius: 6px;
    padding: 5px 2px 20px 2px;

    .title {
      margin: 0 8px;
    }
  }

  .course {
    display: flex;
    padding: 15px 15px 0;
    position: relative;

    &-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      z-index: 1;
    }

    &-step {
      width: 32px;
      height: 32px;
      border: 2px solid #d59081;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;

      span {
        display: block;
        width: 90%;
        height: 90%;
        border-radius: 50%;
        background-color: #e36844;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }

    &-line {
      width: 90%;
      height: 2px;
      background-color: #d59081;
      position: absolute;
      left: 18px;
      top: 31px;
      z-index: 0;
    }
  }
}
</style>
