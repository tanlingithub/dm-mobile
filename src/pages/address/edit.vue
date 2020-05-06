<template>
  <div class="address-edit">
    <van-cell-group>
      <van-field
        v-model="form.name"
        label-align="right"
        label="收货人："
      ></van-field>
      <van-field
        v-model="form.mobile"
        label-align="right"
        type="number"
        label="手机电话："
      ></van-field>
      <van-cell
        title="所在地区："
        value-class="area-value"
        @click="areaShow = true"
      >
        {{ form.provinces }} {{ form.city }} {{ form.district }}
      </van-cell>
      <van-field
        v-model="form.location"
        label-align="right"
        label="详细地址："
      ></van-field>

      <van-popup v-model="areaShow" position="bottom">
        <van-area
          :area-list="areaList"
          @confirm="selectArea"
          @cancel="areaShow = false"
        />
      </van-popup>
    </van-cell-group>

    <van-switch-cell
      v-model="form.defaultAddress"
      class="mt-1"
      active-color="#c53439"
      title="默认地址:"
      title-class="address-switch"
    />
    <div class="address-delete mt-1" @click="deleteAddress">
      <div class="mt-1"><van-icon name="delete" />删除地址</div>
    </div>

    <div class="fixed-box">
      <van-button
        class="fixed-btn"
        size="large"
        type="danger"
        @click="saveAddress"
        >保存</van-button
      >
    </div>
  </div>
</template>

<script>
import areaList from '@/const/area'
import {Area, SwitchCell} from 'vant'
import {addAddress, defaultAddress} from '@/const/api'

const area = {
  0: 'provinces',
  1: 'city',
  2: 'district'
}
export default {
  name: 'address-edit',
  head() {
    return {
      title: this.title
    }
  },
  components: {
    'van-area': Area,
    'van-switch-cell': SwitchCell
  },
  data() {
    return {
      title: this.$route.query.id ? '编辑收货地址' : '新增收货地址',
      areaList,
      form: {
        name: '',
        mobile: '',
        provinces: '',
        city: '',
        district: '',
        location: '',
        defaultAddress: false
      },
      areaShow: false,
      loading: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  mounted() {
    if (this.$route.query.id) this.getAddressDetail()
  },
  methods: {
    // 选择地址
    selectArea(val) {
      val.forEach((item, i) => {
        let key = area[i]
        this.form[key] = item.name
      })
      this.areaShow = false
    },
    // 获取地址详情
    getAddressDetail() {
      this.loading = true
      this.$axios
        .$get(`${addAddress}/${this.id}`)
        .then(resp => {
          this.loading = false
          Object.keys(this.form).forEach(key => {
            this.form[key] = resp.payload[key]
          })
        })
        .catch(() => {
          this.loading = false
          this.$toast.fail('网络异常')
        })
    },
    // 保存地址
    async saveAddress() {
      let vaild = Object.keys(this.form).some(item => {
        if (item !== 'defaultAddress') return !this.form[item]
      })

      if (vaild) {
        this.$toast.fail('信息填写不完善')
        return
      }
      if (this.form.name.length > 30) {
        this.$toast.fail('收货人请输入30个字符以内')
        return
      }
      if (!/^1[34578]\d{9}$/.test(this.form.mobile)) {
        this.$toast.fail('请输入正确手机格式')
        return
      }
      if (this.form.location.length > 80) {
        this.$toast.fail('详细地址请输入80个字符以内')
        return
      }
      this.$toast.loading('加载中')

      const method = this.id ? '$put' : '$post'
      const addressUrl = this.id ? `${addAddress}/${this.id}` : addAddress

      try {
        await this.$axios[method](addressUrl, this.form)
        this.$toast.success('保存成功')
        this.$router.back()
      } catch (e) {
        this.$toast.fail('操作失败')
      }
    },
    // 删除地址
    deleteAddress() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '确认删除？'
        })
        .then(() => {
          this.$toast.loading('删除中')
          this.$axios
            .$delete(`${addAddress}/${this.id}`)
            .then(resp => {
              this.$toast.success('删除成功')
              this.$router.back()
            })
            .catch(e => this.$toast.fail('操作失败'))
        })
    }
  }
}
</script>

<style lang="less">
.address-edit {
  .van-cell__title {
    max-width: 70px;
  }

  .address-switch {
    max-width: 60px;
    text-align: right;
  }

  .address-delete {
    display: inline-block;
    float: right;
    padding-right: 15px;
    color: #666;

    > .mt-1 {
      margin-top: 20px;
    }

    .van-icon-delete {
      vertical-align: top;
      margin: 2px 5px 0 0;
    }
  }

  .area-value {
    text-align: left;
  }

  .fixed-box {
    top: 50px;
  }
}
</style>
