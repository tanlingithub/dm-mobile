<template>
  <div class="index">
    <data-list v-bind="listConfig">
      <div slot-scope="props">
        <div v-for="(good, index) in props.list" :key="index">
          <!-- v-if="good.status === '2'" -->
          <van-card
            :title="good.activityName"
            centered
            :thumb="good.commodity.imgUri[0]"
            @click.native="goDetail(good)"
          >
            <div slot="tags">
              <van-tag color="#C53439" type="danger">{{ good.participantsNumber }}人团</van-tag>
            </div>
            <div slot="price">
              <span class="list-price">拼团价&nbsp;&nbsp;{{ good.activityPrice | price }}</span>
            </div>
            <div slot="origin-price">{{ good.commodity.retailPrice | price }}</div>
            <div slot="num">
              <van-button class="list-button" round size="small">去拼团</van-button>
            </div>
          </van-card>
        </div>
      </div>
      <div slot="no-results">
        <no-data>
          <span class="list-no-data">暂无可参加活动</span>
        </no-data>
      </div>
    </data-list>
  </div>
</template>

<script>
import {Card, Tag} from 'vant'
import NoData from '@/components/no-data'
import wechatAuth from '@/mixins/wechatAuth'
import {activityLi} from '@/const/api'

import getList from '@/graphql/getList.gql'

export default {
  layout: 'layout-with-footer',
  name: 'index',
  // mixins: [wechatAuth],
  components: {
    NoData,
    'van-card': Card,
    'van-tag': Tag
  },
  head() {
    return {
      title: '活动列表'
    }
  },
  mounted() {
    // this.$apollo
    //   .query({
    //     query: getList,
    //     variables: {}
    //   })
    //   .then(res => {
    //     this.loading = false
    //   })
    //   .catch(e => {
    //     this.loading = false
    //   })
  },
  data() {
    return {
      listConfig: {
        saveQuery: false,
        url: activityLi,
        useGraphql: false
      }
    }
  },
  methods: {
    goDetail(v) {
      this.$router.push({
        path: '/goods-detail',
        query: {
          id: v.id
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~assets/var.less';

.index {
  padding: 8px 10px;
  background-color: @bg-color;

  .list-price {
    color: @black;
    line-height: 30px;
  }

  .list-button {
    background-color: @primary-color;
    color: #fff;
  }

  .list-no-data {
    color: #999;
  }

  .van-card__content--centered {
    justify-content: space-between;
  }

  .van-card {
    background-color: #fff;
    padding: 12px 10px;
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .van-card__title {
    color: #333;
    font-weight: 400;

    .text-overflow();
  }

  .van-card__price {
    font-weight: 400;
  }
}
</style>
