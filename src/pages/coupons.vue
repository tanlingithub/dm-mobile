<template>
  <section class="coupons-list">
    <data-list :url="url" :save-query="saveQuery">
      <div slot-scope="props">
        <div
          class="coupons-list-item"
          @click="selectCoupon(item)"
          v-for="item in props.list"
          :key="item.id"
        >
          <div
            class="coupons-head"
            :class="[couponValid(item) ? 'red' : 'gray']"
          >
            <p class="content">
              {{
                item.type === '0'
                  ? `¥${item.faceValue}`
                  : `${item.discountValue}折券`
              }}
            </p>
            <p class="desc">{{ item.couponName }}</p>
          </div>
          <div class="coupons-body">
            <p>
              有效时间：
              <template v-if="item.useLimitTimeFlag === '0'">
                无限制
              </template>
              <template v-else
                >{{ formatDate(item.useLimitStartTime, 'YYYY-MM-DD') }}-{{
                  formatDate(item.useLimitEndTime, 'YYYY-MM-DD')
                }}</template
              >
            </p>
            <p>
              使用条件：{{
                item.useLimitAmountFlag === '0'
                  ? '无限制'
                  : `订单金额满${item.useLimitAmount || 0}元`
              }}
            </p>
            <p>适用商品：全部商品</p>
          </div>
        </div>
      </div>
    </data-list>
  </section>
</template>

<script>
import DataList from '@femessage/data-list'
import {couponsList} from '@/const/api'
import {formatDate} from '@/const/filter'

const ALL = '0'
const ALL_PRODUCT = '1'

export default {
  name: 'coupons-list',
  components: {
    DataList
  },
  data() {
    return {
      url: couponsList,
      saveQuery: false,
      formatDate
    }
  },
  computed: {
    skuId() {
      return this.$route.query.skuId
    }
  },
  methods: {
    // 优惠券校验条件
    couponValid(val) {
      let money =
        val.useLimitAmountFlag === ALL ||
        +this.$route.query.total >= (val.useLimitAmount || 0)
      let suitableParms = val.suitableParms || ''
      let enableProduct =
        (val.suitableType === '2') & (suitableParms.indexOf(this.skuId) > -1)
      let disabledProduct =
        (val.suitableType === '3') & (suitableParms.indexOf(this.skuId) === -1)
      let product =
        val.suitableType === ALL_PRODUCT || enableProduct || disabledProduct
      return money && product
    },
    // 选择优惠券
    selectCoupon(val) {
      if (!this.couponValid(val)) {
        this.$toast.fail('优惠券使用条件不足')
        return
      }

      let couponData = JSON.stringify(val)
      sessionStorage.setItem('coupon', couponData)
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
.coupons-list {
  padding: 12px;

  .gray {
    background: #666;
  }

  .red {
    background: #c53439;
  }

  &-item {
    display: flex;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  }

  .coupons-head {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 110px;
    height: 110px;
    text-align: center;
    color: #fff;
    border-radius: 4px 0 0 4px;

    &:after,
    &:before {
      position: absolute;
      right: -10px;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f6f8fa;
    }

    &:after {
      top: -10px;
    }

    &:before {
      bottom: -10px;
    }

    .content {
      margin: 0;
      font-size: 25px;
    }

    .desc {
      margin: 0;
      font-size: 12px;
      font-weight: 200;
    }
  }

  .coupons-body {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px 12px;
    width: calc(100vw - 158px);
    border-radius: 0 4px 4px 0;
    height: 80px;

    &:after {
      position: absolute;
      top: 10px;
      left: -2px;
      content: '';
      height: 90px;
      border-left: 2px dashed #fff;
    }

    > p {
      margin: 0;
    }
  }
}
</style>
