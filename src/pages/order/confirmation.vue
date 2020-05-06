<template>
  <div class="confirmation">
    <!-- 地址模块 -->
    <van-cell-group>
      <van-cell
        v-if="!address"
        title="请选择收货地址"
        is-link
        icon="location-o"
        @click="$router.push('/address/list')"
      ></van-cell>
      <van-cell v-else @click="$router.push('/address/list')">
        <p class="confirmation-address-info confirmation-address-name">
          {{ address.name }} {{ address.mobile }}
        </p>
        <p class="confirmation-address-info">{{ address.location }}</p>
      </van-cell>
    </van-cell-group>
    <!-- 活动商品模块 -->
    <van-cell-group class="confirmation-cell-group confirmation-goods">
      <van-card
        :title="product.name"
        :thumb="product.imageUrl"
        :num="product.count"
      >
        <div slot="price">
          <span class="confirmation-price"
            >拼团价 {{ product.activityPrice | price }}</span
          >
        </div>
        <div slot="confirmation-origin-price">
          {{ product.activityPrice | price }}
        </div>
        <div slot="origin-price">
          {{ product.salePrice | price }}
        </div>
      </van-card>
    </van-cell-group>
    <!-- 优惠券 -->
    <van-cell-group class="confirmation-cell-group">
      <van-cell
        title="优惠券"
        is-link
        :value="coupon ? coupon.couponName : '请选择'"
        @click="
          $router.push(`/coupons?total=${totalPrice}&skuId=${product.skuId}`)
        "
      ></van-cell>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="商品合计">
        <div class="confirmation-total-price">{{ totalPrice | price }}</div>
      </van-cell>
      <van-cell>
        <div style="text-align:right">小计：{{ discountPrice | price }}</div>
      </van-cell>
    </van-cell-group>
    <van-submit-bar button-text="提交订单" @submit="onSubmit">
      <p class="confirmation-total">
        共{{ product.count }}件，
        <span>应付：{{ discountPrice | price }}</span>
      </p>
    </van-submit-bar>
  </div>
</template>

<script>
import {Card, SubmitBar} from 'vant'
import {
  placeOrder,
  createActivity,
  joinActivity,
  payOrder,
  joinActivityNum,
  activityJoinNum,
  recordJoin,
  recordPay,
  defaultAddress
} from '@/const/api'

const PAY_TYPE = 'TEST'
const ACTIVITY = '0'

export default {
  head() {
    return {
      title: '确认订单'
    }
  },
  components: {
    'van-card': Card,
    'van-submit-bar': SubmitBar
  },
  data() {
    return {
      product: {},
      address: '',
      coupon: ''
    }
  },
  computed: {
    // 原价总计
    totalPrice() {
      return this.product.activityPrice * this.product.count || 0
    },
    // 优惠后的价钱
    discountPrice() {
      let price = this.coupon
        ? this.coupon.type === ACTIVITY
          ? this.totalPrice - this.discount
          : this.totalPrice * (this.coupon.discountValue / 10)
        : this.totalPrice
      return price < 0 ? 0 : price
    },
    groupId() {
      return this.$route.query.groupId
    },
    hspRecordId() {
      return this.$route.query.hspRecordId
    },
    discount() {
      return this.coupon.type === ACTIVITY
        ? this.coupon.faceValue
        : this.coupon.discountValue || 10
    }
  },
  mounted() {
    let product = JSON.parse(sessionStorage.getItem('product')) || {}
    let coupon = sessionStorage.getItem('coupon')
    if (product)
      this.product = Object.assign({}, product, {
        imageUrl: product.imageUrl && product.imageUrl[0]
      })
    if (coupon) this.coupon = JSON.parse(coupon)
    if (sessionStorage.getItem('address')) {
      this.address = JSON.parse(sessionStorage.getItem('address'))
    } else {
      this.getDefaultAddress()
    }
  },
  methods: {
    //获取默认地址
    getDefaultAddress() {
      this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })
      this.$axios
        .$get(`${defaultAddress}/${this.$route.query.id}`)
        .then(res => {
          if (res.code != '0') {
            this.$toast.fail(res.msg)
            return
          }

          this.address = res.payload.id ? res.payload : false
          sessionStorage.setItem('address', JSON.stringify(this.address))
        })
        .finally(() => {
          this.$toast.clear()
        })
    },
    // 下单
    async onSubmit() {
      this.$toast.loading({
        duration: 0,
        message: '订单生成中'
      })

      // 必须选择地址
      if (!this.address) {
        this.$toast.fail('请选择地址')
        return
      }

      // 商品sku
      let hspSku = {skuid: this.product.skuId, count: this.product.count}
      // 收货地址
      let address = {
        provinceName: this.address.provinces,
        cityName: this.address.city,
        districtName: this.address.district,
        detailAddress: this.address.location,
        receiverName: this.address.name,
        receiverPhone: this.address.mobile
      }
      // 组装数据
      let data = {
        activityId: this.product.activityId,
        couponId: this.coupon.id,
        flag: this.groupId ? 0 : 1,
        groupId: this.groupId,
        hspSkuDtos: [hspSku],
        hspDeliveryAddress: address
      }

      try {
        // await this.$axios.$put(joinActivityNum(this.$store.state.userId))
        // this.$axios.$put(activityJoinNum, {
        //   countTypeEnum: ACTIVITY,
        //   id: this.$route.query.id
        // })
        let record = {
          time: Date.now(),
          id: this.hspRecordId
        }
        let resp = await this.$axios.$put(placeOrder, data)
        // 下单失败的处理

        if (resp.code !== '0') {
          this.$toast.fail(resp.msg)
          return
        }
        // 参与更新记录
        // this.$axios.$put(
        //   recordJoin,
        //   Object.assign({orderId: resp.payload.id}, record)
        // )
        let payResp = await this.$axios.$put(payOrder, {
          payType: PAY_TYPE,
          payChannel: '200',
          tradeOrderId: resp.payload.id,
          summaryOrderId: resp.payload.orderSummaryId
        })
        // 支付更新记录
        // this.$axios.$put(
        //   recordPay,
        //   Object.assign({orderId: payResp.payload.id}, record)
        // )
        this.clearStore()
        this.$toast.success('拼单成功')
        this.$router.replace(`/group/success?id=${resp.payload.id}`)
      } catch (e) {
        console.log(e)
        this.$toast.fail('操作失败')
        return
      }
    },
    // 清除缓存数据
    clearStore() {
      sessionStorage.removeItem('product')
      sessionStorage.removeItem('address')
      sessionStorage.removeItem('coupon')
    }
  }
}
</script>

<style lang="less">
.confirmation {
  &-total {
    padding-left: 10px;

    span {
      color: #b4282d;
    }
  }

  &-goods {
    background-color: #fff;

    .van-card {
      background-color: #fff;
      padding: 15px;
    }

    .van-card__title {
      font-size: 14px;
      color: #333;
      font-weight: 400;
    }

    .van-card__content {
      justify-content: space-between;
    }
  }

  &-price {
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }

  &-cell-group {
    margin: 15px 0;
  }

  .van-button--danger {
    background-color: #b3282d;
  }

  &-total-price {
    color: #333;
  }

  &-address {
    width: 100%;
    height: 100%;
  }

  &-address-info {
    line-height: 22px;
    margin: 0;
  }

  &-address-name {
    font-weight: 500;
  }
}
</style>
