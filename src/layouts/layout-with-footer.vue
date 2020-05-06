<template>
  <div class="layout-with-footer">
    <nuxt></nuxt>
    <div class="fixed-box">
      <van-tabbar fixed v-model="active" active-color="#C53439">
        <van-tabbar-item
          v-for="(item, i) in footerTab"
          :key="i"
          @click="changeTab(item)"
          :icon="active == i ? item.iconActive : item.icon"
        >
          {{ item.title }}
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import {Tabbar, TabbarItem} from 'vant'
import init from '@/mixins/init.js'

const MY = '/my'
const NULL = 'null'

export default {
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem
  },
  mixins: [init],
  data() {
    return {
      active: 0,
      footerTab: [
        {
          title: '首页',
          url: '/',
          icon:
            'https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/tabbar-icon/activity.svg',
          iconActive:
            'https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/tabbar-icon/activity-active.svg'
        },
        {
          title: '我的',
          url: '/my',
          icon:
            'https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/tabbar-icon/my.svg',
          iconActive:
            'https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/tabbar-icon/my-active.svg'
        }
      ]
    }
  },
  watch: {
    // 监听路由变化，底部菜单才能高亮
    $route(to) {
      this.handleActive(to.path)
    }
  },
  mounted() {
    // 获取path然后让底部菜单高亮
    this.handleActive(this.$route.path)
  },
  methods: {
    changeTab(val) {
      if (
        (val.url === MY && !this.$store.state.token) ||
        this.$store.state.token === NULL
      ) {
        this.$router.push('/login')
        return
      }

      this.$router.push(val.url)
    },
    handleActive(path) {
      // 底部菜单高亮
      this.footerTab.forEach((item, i) => {
        if (path == item.url) {
          this.active = i
        }
      })
    }
  }
}
</script>

<style lang="less">
@import '~assets/var.less';

.layout-with-footer {
  height: 100vh;
  background-color: @bg-color;
}
</style>
