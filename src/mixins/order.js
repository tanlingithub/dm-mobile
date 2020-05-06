import {orderDetail, accountInfo} from '@/const/api'
const PAY_OK = 'paid'
const PATH = '/order/detail'
export default {
  data() {
    return {
      totalOrder: {}
    }
  },
  computed: {
    address() {
      return this.totalOrder.hspDeliveryAddress || {}
    },
    // 总计金额
    totalPrice() {
      return +this.productSku.activityMoney * +this.productSku.quantity
    },
    // 优惠券信息
    couponData() {
      return this.totalOrder.hspCoupon || {}
    },
    // 活动商品
    activityProduct() {
      return this.totalOrder.hspGroupbuyActivity || {}
    },
    // 产品规格
    productSku() {
      return (
        (this.totalOrder.hspTradeOrderSkus &&
          this.totalOrder.hspTradeOrderSkus.pop()) ||
        {}
      )
    },
    // 用户列表
    memberList() {
      let currentMember = {
        id: this.tradeOrder.memberId,
        name: this.tradeOrder.memberName,
        headUrl: this.tradeOrder.memberHeadUrl,
        flag: this.tradeOrder.flag,
        createdAt: this.tradeOrder.createdAt
      }

      let linkMember = this.linkOrders.map(val => {
        let order = val.hspTradeOrder
        return {
          id: order.memberId,
          name: order.memberName,
          headUrl: order.memberHeadUrl,
          flag: order.flag,
          createdAt: order.createdAt
        }
      })
      //按照下单顺序排序
      return linkMember.concat(currentMember).sort(function(a, b) {
        return a.createdAt - b.createdAt
      })
    },
    // 订单信息
    tradeOrder() {
      return this.totalOrder.hspTradeOrder || {}
    },
    //支付信息
    payMent() {
      let hspOrderPayments = this.totalOrder.hspOrderPayments || []
      return (
        hspOrderPayments.find(item => {
          return item.payStatus === PAY_OK
        }) || {}
      )
    },
    // 关联订单
    linkOrders() {
      return this.totalOrder.linkOrders || []
    },
    inOrder() {
      let orderMember =
        this.linkOrders
          .map(item => {
            let order = item.hspTradeOrder || {}
            return order.memberId
          })
          .concat(this.tradeOrder.memberId) || []
      return (
        orderMember.includes(this.$store.state.memberId) ||
        this.tradeOrder.memberId == this.$store.state.memberId
      )
    }
  },
  mounted() {
    this.getOrderDetail()
  },
  methods: {
    getOrderDetail() {
      this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })
      this.$axios
        .$get(`${orderDetail}/${this.$route.query.id}`)
        .then(resp => {
          this.totalOrder = resp.payload || {}
          if (this.$route.path !== PATH) this.setupShare()
        })
        .catch(e => {
          console.log(e)
          this.$toast.fail('网络异常')
        })
        .finally(() => this.$toast.clear())
    }
  }
}
