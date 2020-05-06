<template>
  <section class="my">
    <div class="my-head">
      <img class="my-head-img" :src="memberInfo.headImg" />
      <p>{{ memberInfo.nickName }}</p>
    </div>

    <data-list ref="dataList" :url="url" :saveQuery="false">
      <div slot-scope="props" v-if="props.list.length > 0">
        <p class="title">已参与活动</p>
        <van-cell
          v-for="(item, index) in props.list"
          :key="index"
          :title="item.activityName"
          :label="formatDate(item.createdAt, 'YYYY-MM-DD')"
          @click="go2Detail(item)"
        >
          <span class="red">{{ STATUS_TYPE[item.status] }}</span
          ><br />
          <span class="list-link">查看详情 ></span>
        </van-cell>
      </div>
      <div slot="no-results">
        <no-data>
          <span class="my-no-data">未参加任何活动</span>
          <van-button
            class="my-no-data-button"
            size="small"
            round
            type="danger"
            @click="$router.push({path: '/'})"
            >前往参与</van-button
          >
        </no-data>
      </div>
    </data-list>
  </section>
</template>

<script>
import NoData from '@/components/no-data'
import DataList from '@femessage/data-list'
import {memberInfo, accountInfo, memberActivity} from '@/const/api'
import {formatDate} from '@/const/filter'
const STATUS_TYPE = {
  '1': '待成团',
  '2': '已成团',
  '3': '已取消'
}
const CAN_ACTIVE = '2'
export default {
  layout: 'layout-with-footer',
  head() {
    return {
      title: '我的'
    }
  },
  components: {
    NoData,
    DataList
  },
  data() {
    return {
      STATUS_TYPE,
      url: '',
      memberInfo: {},
      activityList: [],
      formatDate
    }
  },
  async mounted() {
    let accountResp = await this.getAccountInfo()

    if (accountResp.code !== '0') {
      this.$toast.fail(accountResp.msg)
      return
    }
    this.url = `${memberActivity}?joinMemberId=${accountResp.payload}`
    this.getMemberInfo()
  },
  methods: {
    async getAccountInfo() {
      return await this.$axios.$get(accountInfo(this.$store.state.userId))
    },
    getMemberInfo(id) {
      this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })

      this.$axios
        .$get(`${memberInfo}/${this.$store.state.memberId}`)
        .then(resp => {
          this.memberInfo = resp.payload.hspMember
        })
        .finally(() => this.$toast.clear())
    },
    // 跳转订单详情
    go2Detail(item) {
      let path = item.status != CAN_ACTIVE ? '/group/success' : '/order/detail'
      this.$router.push({
        path,
        query: {
          id: item.orderId
        }
      })
    }
  }
}
</script>

<style lang="less">
.my {
  background-color: #f6f8fa;

  &-no-data {
    color: #999;
    margin-bottom: 18px;

    &-button {
      background-color: #c53439;
      padding: 0 25px;
    }
  }

  &-head {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fff;

    &-img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50%;
    }
  }

  .title {
    padding: 12px;
    margin: 0;
  }

  .red {
    color: #c53439;
  }

  .list-link {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}
</style>
