<template>
  <section class="address-list">
    <div
      class="address-item"
      v-for="item in list"
      :key="item.id"
      @click="selectAddress(item)"
    >
      <div class="info">
        <span class="name">{{ item.name }}</span> {{ item.mobile }}
        <span v-if="item.defaultAddress" class="default-tag">默认</span>
      </div>
      <div>{{ item.location }}</div>
      <van-icon
        name="edit"
        class="edit-icon"
        @click.stop="go2Edit(item)"
      ></van-icon>
    </div>

    <div class="fixed-box">
      <van-button class="fixed-btn" @click="onAdd" size="large" type="danger"
        >新增地址</van-button
      >
    </div>
  </section>
</template>

<script>
import {AddressList} from 'vant'
import {addressList} from '@/const/api'
export default {
  head() {
    return {
      title: '收货地址'
    }
  },
  components: {
    'van-address-list': AddressList
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.getAddressList()
  },
  methods: {
    // 获取地址列表

    getAddressList() {
      this.$toast.loading({
        mask: true,
        duration: 0,
        forbidClick: true,
        message: '加载中...'
      })
      this.$axios
        .$get(addressList)
        .then(resp => {
          this.list = resp.payload || []
        })
        .catch(e => console.log(e))
        .finally(() => {
          this.$toast.clear()
        })
    },
    // 选择地址
    selectAddress(val) {
      sessionStorage.setItem('address', JSON.stringify(val))
      this.$router.back()
    },
    onAdd() {
      this.$router.push({
        path: '/address/edit',
        query: {
          state: 'add'
        }
      })
    },
    go2Edit(item) {
      this.$router.push({
        path: '/address/edit',
        query: {id: item.id}
      })
    }
  }
}
</script>

<style lang="less">
.address-list {
  .fixed-button {
    position: relative;

    .btn {
      position: fixed;
      bottom: 0;
      left: 0;
    }

    .van-button--danger {
      background: #c53439;
    }
  }

  .address-item {
    position: relative;
    padding: 12px;
    text-align: left;
    padding-right: 34px;
    color: #333;
    background: #fff;
    border-bottom: 1px solid #eee;

    .info {
      width: 100%;
      line-height: 20px;
      margin-bottom: 5px;
    }

    .name {
      margin-right: 15px;
    }

    .default-tag {
      border: 1px solid #c53439;
      padding: 0 6px;
      color: #c53439;
      border-radius: 4px;
    }
  }

  .edit-icon {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    right: 15px;
    font-size: 18px;
  }
}
</style>
