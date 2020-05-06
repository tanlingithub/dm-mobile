<template>
  <div class="no-data">
    <p class="no-data-img">
      <img
        src="https://deepexi.oss-cn-shenzhen.aliyuncs.com/handshake-plan/mobile/common/no-data.svg"
      />
    </p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'no-data'
}
</script>

<style lang="less">
.no-data {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-img {
    margin: 40% 0 20px;
    text-align: center;
    img {
      width: 50%;
    }
  }
}
</style>
