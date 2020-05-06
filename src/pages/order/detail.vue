<template>
  <div class="order-detail">
    <div class="order-detail-head white-layout">
      <p class="name">{{ address.receiverName }} {{ address.receiverPhone }}</p>
      <p class="address">
        {{
          `${address.provinceName}${address.cityName}${address.districtName}${
            address.detailAddress
          }`
        }}
      </p>
    </div>

    <div class="order-detail-member white-layout">
      <span class="title">{{ orderStatus[tradeOrder.activityStatus] }}</span>
      <div class="member-info" v-for="(val, index) in memberList" :key="index">
        <span class="tag" v-if="val.flag === 1">团长</span>
        <img width="60px" height="60px" class="avatar" :src="val.headUrl" />
        <p class="member-name">{{ val.name }}</p>
      </div>
    </div>

    <van-card
      class="white-layout"
      :title="activityProduct.name"
      :thumb="productSku.imgUrl"
    >
      <template slot="num">
        <p class="card-info">x{{ productSku.quantity }}</p>
        <p class="card-info">{{ productSku.activityMoney | price }}</p>
        <p class="card-info">合计：{{ totalPrice | price }}</p>
      </template>
    </van-card>

    <van-cell class="white-layout" title="优惠券">
      <span v-if="couponData.type === '0'"
        >满{{ couponData.useLimitAmuont }}减{{ couponData.faceValue }}</span
      >
      <span v-else>{{
        couponData.discountValue ? couponData.discountValue + '折券' : '无'
      }}</span>
    </van-cell>

    <van-cell-group class="white-layout">
      <van-cell title="商品合计">{{ tradeOrder.itemMoney | price }}</van-cell>
      <van-cell value-class="align-right"
        >实付：{{ tradeOrder.payMoney | price }}</van-cell
      >
    </van-cell-group>

    <van-cell-group>
      <van-cell title="订单信息"></van-cell>
      <van-cell>
        <p
          class="order-num"
          v-for="(item, index) in OREDER_DETAIL"
          :key="index"
        >
          {{ item }}：{{
            index == 'createdAt' || index == 'paidAt'
              ? formatDate(payMent[index], 'YYYY-MM-DD HH:mm:ss')
              : payMent[index]
          }}
        </p>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import {Card} from 'vant'
import order from '@/mixins/order'
import {orderDetail} from '@/const/api'
import {formatDate} from '@/const/filter'

const OREDER_DETAIL = {
  tradeOrderId: '订单编号',
  payOrderNo: '支付单号',
  createdAt: '创建时间',
  paidAt: '支付时间'
}

const ORDER_STATUS_SEARCH = {
  ACTIVITY_COMPLETED: '拼团成功',
  ACTIVITY_TOBEPAID_TO_COMPLETE: '待支付',
  ACTIVITY_PAID_TO_COMPLETE: '拼团成功',
  ACTIVITY_CANNELLED: '拼团已取消'
}

export default {
  name: 'order-detail',
  head() {
    return {
      title: '订单详情'
    }
  },
  mixins: [order],
  components: {
    'van-card': Card
  },
  data() {
    return {
      OREDER_DETAIL,
      orderStatus: ORDER_STATUS_SEARCH,
      formatDate,
      productImg:
        '//deepexi-moby.oss-cn-shenzhen.aliyuncs.com/WechatIMG1-1551345530370.jpeg'
    }
  }
}
</script>
<style lang="less">
.order-detail {
  background: #f6f8fa;
  padding-top: 10px;

  .align-right {
    text-align: right;
  }

  .white-layout {
    background: #fff;
    margin-bottom: 10px;
  }

  &-head {
    padding: 5px 10px;

    .name,
    .address {
      margin: 5px 0;
    }
  }

  &-member {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;

    .avatar {
      border-radius: 50%;
    }

    .title {
      position: absolute;
      top: 10px;
      left: 10px;
      margin: 0;
    }

    .member-info {
      position: relative;
      margin: 20px;
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

    .member-name {
      margin: 5px;
    }
  }

  .van-card {
    padding: 10px 12px;
    font-size: 14px;

    .card-info {
      margin: 0;
      text-align: right;
    }
  }

  .order-num {
    margin: 0;
    color: #666;
  }

  .avatar {
    border-radius: 50%;
  }
}
</style>
