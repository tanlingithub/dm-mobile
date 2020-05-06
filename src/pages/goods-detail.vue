<template>
  <div class="goods-detail">
    <van-swipe class="swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods.imageUrl" :key="thumb">
        <img :src="thumb" />
      </van-swipe-item>
    </van-swipe>

    <div class="goods-detail-title">
      <p class="activity-title">限时抢购</p>
      <!-- <div v-if="isFail" class="goods-detail-date">活动已失效</div> -->
      <div v-if="isEnd" class="goods-detail-date">活动已结束</div>
      <div v-else-if="isStart" class="goods-detail-date">
        <span>
          距离活动开始：
        </span>
        <count-down
          :seconds="startTimeDiff"
          format="dd天 hh时mm分ss秒"
        />
      </div>
      <div v-else class="goods-detail-date">
        <span>
          距离活动结束：01天 12时00分30秒"
        </span>
        <count-down
          :seconds="endTimeDiff"
          format="dd天 hh时mm分ss秒"
        />
      </div>
    </div>
    <van-cell-group>
      <van-cell>
        <div class="price">
          <van-tag color="#C53439" type="danger">
            {{ goods.completePersonCount }}人团
          </van-tag>
          {{ goods.activityPrice | price }}
          <span class="price-origin">
            {{ goods.salePrice | price }}
          </span>
        </div>
        <div class="title">{{ goods.name }}</div>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="cell-group step-group">
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
      <p>注：拼团失败，全额退款</p>
    </van-cell-group>

    <!-- 暂时隐藏 -->
    <van-cell-group class="cell-group user-group" v-if="sends.length > 0">
      <van-cell title="以下小伙伴正在发起拼团，直接参与"></van-cell>
      <van-cell v-for="(item, index) in sends" :key="index">
        <div slot="title" class="user-item">
          <div class="user-item-img">
            <img :src="item.joinMemberHeadUrl" />
          </div>
          <p>{{ item.joinMemberNickName }}</p>
        </div>
        <div class="user-group-content">
          <div class="user-group-date">
            <p>
              还差<span class="num">{{ item.remainNumber }}</span
              >人成团
            </p>
            <p>
              仅剩
              <count-down
                :seconds="item.endTime / 1000"
                format="hh:mm:ss"
              />
            </p>
          </div>
          <div class="user-group-button">
            <van-button
              class="user-group-button-item"
              round
              size="small"
              @click="toOtherActive(item)"
              >去参团</van-button
            >
          </div>
        </div>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="cell-group detail-content">
      <van-cell title="图文详情"></van-cell>
      <div title="图文详情" v-html="goods.description"></div>
    </van-cell-group>

    <van-goods-action>
      <van-goods-action-big-btn
        class="goods-detail-button"
        :disabled="isStart || isEnd"
        primary
        @click="createActivity"
      >
        发起拼团
      </van-goods-action-big-btn>
    </van-goods-action>

    <van-actionsheet v-model="showActionsheet" :title="title">
      <van-card :title="goods.name" :thumb="goods.imageUrl[0]">
        <div slot="price">
          <span class="actionsheet-price">
            {{ goods.activityPrice | price }}</span
          >
        </div>
        <div slot="origin-price">
          {{ goods.salePrice | price }}
        </div>
      </van-card>
      <dir class="goods-quantity">
        <div class="goods-quantity-title">购买数量</div>
        <van-stepper
          v-show="isLimit"
          v-model="num"
          :max="goods.purchaseLimitCount"
        />
        <van-stepper v-show="!isLimit" v-model="num" :max="goods.stockCount" />
      </dir>
      <van-goods-action-big-btn
        class="goods-detail-button"
        @click="goOrderConfirmation"
      >
        立即购买
      </van-goods-action-big-btn>
    </van-actionsheet>
  </div>
</template>

<script>
import {
  Tag,
  Swipe,
  SwipeItem,
  GoodsAction,
  GoodsActionBigBtn,
  Actionsheet,
  Card,
  Stepper
} from 'vant'
import {
  activitySend,
  goodsDetail,
  shareNum,
  activityShareNum,
  browseNum,
  activityAccessNum,
  recordAccess,
  recordShare
} from '@/const/api'
import CountDown from '@femessage/count-down'
import point from '@/mixins/buried-point'
import dayjs from 'dayjs'

const ACTIVITY = 0
const LIMIT = 1
const NULL = 'null'
const ACTIVE_END = '1'
const ACTIVE_STOP = '4'

export default {
  head() {
    return {
      title: '拼团活动'
    }
  },
  mixins: [point],
  components: {
    'van-tag': Tag,
    'van-swipe': Swipe,
    'van-swipe-item': SwipeItem,
    'van-goods-action': GoodsAction,
    'van-goods-action-big-btn': GoodsActionBigBtn,
    'van-actionsheet': Actionsheet,
    'van-card': Card,
    'van-stepper': Stepper,
    CountDown
  },
  data() {
    return {
      showActionsheet: false,
      num: 1,
      title: ' ',
      purchaseLimitFlag: 0,
      goods: {
        name: '',
        activityPrice: '',
        salePrice: '',
        imageUrl: [
          'https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/common/mode-banner.png'
        ],
        completePersonCount: '',
        purchaseLimitCount: 2,
        description: ''
      },
      sends: [],
      detailData: {},
      shareId: '',
      isPlay: false
    }
  },
  computed: {
    isLimit() {
      return this.purchaseLimitFlag == LIMIT
    },
    hspRecordId() {
      return this.$route.query.hspRecordId
    },
    accountId() {
      return this.$store.state.userId
    },
    groupActivity() {
      return this.detailData.hspGroupbuyActivity || {}
    },
    // 活动开始时间差
    startTimeDiff() {
      return (this.groupActivity.startTime - Date.now() || 0) / 1000
    },
    // 活动结束时间差
    endTimeDiff() {
      return (this.groupActivity.endTime - Date.now() || 0) / 1000
    },
    // 活动开始
    isStart() {
      return this.groupActivity.startTime > Date.now()
    },
    isEnd() {
      return (
        this.groupActivity.status == ACTIVE_END ||
        this.groupActivity.status == ACTIVE_STOP
      )
    }
  },
  watch: {
    $route() {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
    // 添加访问量
    // this.$axios.$put(activityAccessNum, {
    //   countTypeEnum: ACTIVITY,
    //   id: this.$route.query.id
    // })
    // 更新记录时间
    // if (this.hspRecordId)
    //   this.$axios.$put(recordAccess, {
    //     time: Date.now(),
    //     id: this.hspRecordId
    //   })
    // 用户访问记录
    // if (this.accountId) this.$axios.$put(browseNum(this.accountId))
    // 分享跳转增加的浏览量
    // if (this.$route.query.shareId) this.addBrowse(this.$route.query.shareId)
  },
  methods: {
    //去参团
    toOtherActive(data) {
      let path = '/group/success'
      this.$router.push({
        path,
        query: {
          id: data.orderId
        }
      })
    },
    //获取正发起的该活动拼团
    async getAtivitySend(id) {
      let res = await this.$axios.$get(activitySend, {
        params: {activityId: id}
      })
      this.sends = res.payload || []
      // const hours = 1000 * 60 * 60
      // this.sends = this.sends
      //   .filter(item => {
      //     //处理活动结束不显示
      //     return item.effectiveTime * hours + item.createdAt - Date.now() > 0
      //   })
      //   .map(item => {
      //     return Object.assign(
      //       {
      //         endTime:
      //           item.effectiveTime * hours + item.createdAt - Date.now() || 0
      //       },
      //       item
      //     )
      //   })
    },
    // 记录活动分享埋点
    recordActivity() {
      this.$axios.$put(recordShare, {
        time: Date.now(),
        id: this.hspRecordId
      })
    },
    // 活动分享埋点
    activityShare() {
      this.$axios.$put(activityShareNum, {
        countTypeEnum: ACTIVITY,
        id: this.$route.query.id
      })
    },
    // 会员分享活动埋点
    memberShare() {
      this.$axios.$put(shareNum(this.$store.state.userId))
    },
    fetchData() {
      this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })
      let req = [
        this.getActiviDetail(),
        this.getAtivitySend(this.$route.query.id)
      ]
      Promise.all(req).finally(() => {
        // 配置微信分享
        // this.setupShare()
        // this.addAccessRecords(this.goods.name)
        this.$toast.clear()
      })
    },
    //获取拼团详情
    async getActiviDetail() {
      let resp = await this.$axios(goodsDetail(this.$route.query.id))
      let data = resp.data.payload
      this.detailData = data
      this.goods = {
        skuId: data.hspGroupbuyActivity.productId,
        activityId: data.hspGroupbuyActivity.id,
        name: data.hspGroupbuyActivity.name,
        activityPrice: data.hspGroupbuyActivity.activityPrice,
        salePrice: data.hspActiveProduct.salePrice,
        imageUrl: data.hspActiveProduct.imageUrl.split(','), //统一数组
        completePersonCount: data.hspGroupbuyActivity.completePersonCount,
        purchaseLimitCount: data.hspGroupbuyActivity.purchaseLimitCount,
        stockCount: data.hspGroupbuyActivity.stockCount,
        description: data.hspActiveProduct.description
      }
      this.purchaseLimitFlag = data.hspGroupbuyActivity.purchaseLimitFlag
      this.isPlay = true
    },
    // 发起拼团
    createActivity() {
      // 未注册的用户需要进行登陆
      // TODO: 先隐藏登录逻辑
      // if (!this.$store.state.token || this.$store.state.token === NULL) {
      //   this.$router.push({
      //     path: '/login',
      //     query: {
      //       shareId: this.$route.query.shareId
      //     }
      //   })
      //   return
      // }
      this.showActionsheet = true
    },
    // 确认订单
    goOrderConfirmation() {
      let data = JSON.stringify(Object.assign({count: this.num}, this.goods))
      sessionStorage.setItem('product', data)
      sessionStorage.removeItem('address')
      sessionStorage.removeItem('coupon')
      this.$router.push({
        path: '/order/confirmation',
        query: Object.assign(
          {hspRecordId: this.hspRecordId || this.recordId},
          this.$route.query
        )
      })
    },
    // 分享埋点集合
    sharePoint(title) {
      this.activityShare()
      if (this.hspRecordId) this.recordActivity()
      if (this.accountId) this.memberShare()
      this.createdShareInfo({
        id: this.shareId,
        typeId: this.$route.query.id,
        title,
        shareChannelEnum: '0',
        countTypeEnum: '0',
        beShareId: this.$route.query.shareId
      })
    },
    // 微信分享
    async setupShare() {
      let resp = await this.createUid()
      this.shareId = resp.payload
      let title = this.goods.name,
        desc = '快来加入我们吧',
        imgUrl = this.goods.imageUrl[0],
        link =
          location.origin +
          location.pathname +
          `?auth=1&path=goods-detail&state=${
            this.$store.state.tenantId
          }&shareId=${this.shareId}&id=${this.$route.query.id}`

      wx.onMenuShareTimeline({
        title, // 分享标题
        desc,
        imgUrl, // 分享图标
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        success: () => {
          this.sharePoint(title)
        }
      })

      wx.onMenuShareAppMessage({
        title, // 分享标题
        desc, // 分享描述
        imgUrl, // 分享图标
        link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: () => {
          this.sharePoint(title)
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~assets/var.less';

.goods-detail {
  padding-bottom: 50px;
  background-color: #f6f8fa;

  .swipe {
    height: 375px;

    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  &-title {
    height: 64px;
    background-color: #b3282d;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  &-button {
    background-color: #c53439;
  }

  &-date {
    display: flex;
    flex-direction: column;

    span {
      font-weight: 400;
    }
  }

  .goods-detail-title {
    .activity-title {
      font-size: 16px;
    }

    .goods-detail-date {
      font-size: 16px;
    }
  }

  .goods-detail-button {
    border: none;
  }

  .title {
    font-size: 14px;
    color: #333;
  }

  .price {
    color: @black;
    .van-tag {
      font-size: 12px;
    }

    &-origin {
      display: inline-block;
      margin-left: 5px;
      font-size: 12px;
      color: #7d7e80;
      text-decoration: line-through;
    }
  }

  .course {
    display: flex;
    padding: 10px 15px 0;
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
      top: 26px;
      z-index: 0;
    }
  }

  .step-group {
    > p {
      text-align: right;
      margin: 0;
      padding: 0 26px 12px;
      line-height: 32px;
      font-size: 12px;
      color: #999;
    }

    .van-cell:not(:last-child)::after {
      border: none;
    }
  }

  .user-group {
    .user-item {
      display: flex;

      &-img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        overflow: hidden;
        margin-right: 5px;

        img {
          width: 100%;
          height: 100%;
        }
      }

      p {
        margin: 0;
        display: flex;
        align-items: center;
        font-size: 14px;
      }
    }

    &-content {
      display: flex;
      justify-content: flex-end;

      p {
        margin: 0;
      }
    }

    &-date {
      margin-right: 10px;
      font-size: 12px;
      color: #333;

      .num {
        color: #c7353a;
      }

      > :last-child {
        color: #999;
      }
    }

    &-button {
      display: flex;
      align-items: center;

      &-item {
        background-color: #c53439;
        color: #fff;
      }
    }
  }

  .cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  .detail-content {
    padding: 15px;

    .van-cell {
      padding-left: 0;
      margin-bottom: 10px;
    }

    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    ul,
    li {
      margin: 0;
    }

    img {
      width: 100%;
    }
  }

  .tag {
    margin-left: 5px;
  }

  .van-goods-action {
    z-index: 2;
  }

  .van-actionsheet__header {
    height: 44px;
  }

  .van-card {
    background: #ffffff;
  }

  .van-card__title {
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }

  .van-card__title {
    margin-bottom: 15px;
  }

  .actionsheet-price {
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }

  .van-card__origin-price {
    font-size: 12px;
  }

  .goods-quantity {
    display: flex;
    margin: 0;
    padding: 15px;
    justify-content: space-between;

    &-title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
