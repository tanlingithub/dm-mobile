<template>
  <div class="count-down">
    <span v-if="countDown.show">
      <!--<span v-if="tipShow">{{tipText}}:</span>-->
      <span v-if="!tipShow">{{ tipTextEnd }}</span>
      <span v-if="countDown.day > 0"
        ><span>{{ countDown.day }}</span
        ><span>{{ dayTxt }}</span></span
      >
      <span v-if="countDown.hour > 0"
        >{{ countDown.hour }}<span>{{ hourTxt }}</span></span
      >
      <span v-if="isMinutes"
        >{{ countDown.minutes }}<span>{{ minutesTxt }}</span></span
      >
      <span
        >{{ countDown.seconds }} <span>{{ secondsTxt }}</span></span
      >
    </span>
    <!--<p v-if="!countDown.show">{{endText}}</p>-->
  </div>
</template>
<script>
export default {
  name: 'count-down',
  data() {
    return {
      tipShow: true,
      countDown: {
        // 倒计时数值
        show: false, // 倒计时状态
        day: '', // 天
        hour: '', // 小时
        minutes: '', // 分钟
        seconds: '' // 秒
      },
      star: '', // 活动开始时间
      end: '', // 活动结束时间
      current: '' // 当前时间
    }
  },
  watch: {
    currentTime(val, oldval) {
      this.gogogo()
    }
  },
  props: {
    //距离开始提示文字
    tipText: {
      type: String
    },
    //距离结束提示文字
    tipTextEnd: {
      type: String,
      default: '距离结束'
    },
    //时间控件ID
    id: {
      type: String,
      default: '1'
    },
    //当前时间
    currentTime: {
      type: Number
    },
    // 活动开始时间
    startTime: {
      type: Number
    },
    // 活动结束时间
    endTime: {
      type: Number
    },
    // 倒计时结束显示文本
    endText: {
      type: String,
      default: '已结束'
    },
    //自定义显示文字:天
    dayTxt: {
      type: String,
      default: ':'
    },
    //自定义显示文字:时
    hourTxt: {
      type: String,
      default: ':'
    },
    //自定义显示文字:分
    minutesTxt: {
      type: String,
      default: ':'
    },
    //自定义显示文字:分
    secondsTxt: {
      type: String,
      default: 's'
    },
    // 是否显示分钟
    isMinutes: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    this.gogogo()
  },
  methods: {
    gogogo() {
      //判断是秒还是毫秒
      this.startTime.toString().length == 10
        ? (this.star = this.startTime * 1000)
        : (this.star = this.startTime)
      this.endTime.toString().length == 10
        ? (this.end = this.endTime * 1000)
        : (this.end = this.endTime)
      if (this.currentTime) {
        this.currentTime.toString().length == 10
          ? (this.current = this.currentTime * 1000)
          : (this.current = this.currentTime)
      } else {
        this.current = new Date().getTime()
      }
      if (this.end < this.current) {
        /**
         * 结束时间小于当前时间 活动已结束
         */
        this.countDown.show = false
        this.end_message()
      } else if (this.current < this.star) {
        /**
         * 当前时间小于开始时间 活动尚未开始
         */
        this.$set(this, 'tipShow', true)
        setTimeout(() => {
          this.runTime(this.star, this.current, this.start_message)
        }, 1)
      } else if (
        (this.end > this.current && this.star < this.current) ||
        this.star == this.current
      ) {
        /**
         * 结束时间大于当前并且开始时间小于当前时间，执行活动开始倒计时
         */
        this.$set(this, 'tipShow', false)
        this.countDown.show = true
        this.$emit('start_callback', this.countDown.show)
        setTimeout(() => {
          this.runTime(this.end, this.star, this.end_message, true)
        }, 1)
      }
    },
    runTime(startTime, endTime, callFun, type) {
      let countDown = this.countDown
      let timeDistance = startTime - endTime
      if (timeDistance > 0) {
        this.countDown.show = true
        countDown.day = Math.floor(timeDistance / 86400000)
        timeDistance -= countDown.day * 86400000
        countDown.hour = Math.floor(timeDistance / 3600000)
        timeDistance -= countDown.hour * 3600000
        countDown.minutes = Math.floor(timeDistance / 60000)
        timeDistance -= countDown.minutes * 60000
        //是否开启秒表倒计,未完成
        //                    this.secondsFixed ? countDown.seconds = new Number(timeDistance / 1000).toFixed(2) : countDown.seconds = Math.floor( timeDistance / 1000 ).toFixed(0)
        countDown.seconds = Math.floor(timeDistance / 1000).toFixed(0)
        timeDistance -= countDown.seconds * 1000
        if (countDown.hour < 10) {
          countDown.hour = '0' + countDown.hour
        }
        if (countDown.minutes < 10) {
          countDown.minutes = '0' + countDown.minutes
        }
        if (countDown.seconds < 10) {
          countDown.seconds = '0' + countDown.seconds
        }
        let _s = Date.now()
        let _e = Date.now()
        let diffPerFunc = _e - _s
        setTimeout(() => {
          if (type) {
            this.runTime(this.end, (endTime += 1000), callFun, true)
          } else {
            this.runTime(this.star, (endTime += 1000), callFun)
          }
        }, 1000 - diffPerFunc)
      } else {
        callFun()
      }
    },
    start_message() {
      this.$set(this, 'tipShow', false)
      this.$emit('start_callback', this.countDown.show)
      setTimeout(() => {
        this.runTime(this.end, this.star, this.end_message, true)
      }, 1)
    },
    end_message() {
      // this.countDown.show = false
      if (this.currentTime <= 0) {
        return
      }
      this.$emit('end_callback', this.countDown.show)
    }
  }
}
</script>
<style lang="less" scoped>
.count-down {
  display: inline-block;
}
</style>
