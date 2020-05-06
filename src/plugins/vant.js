import Vue from 'vue'

import {Button, Notify} from 'vant'

Vue.use(Button)
Vue.use(Notify)

Notify.setDefaultOptions({
  background: 'rgba(0,0,0, 0.4)',
  color: '#FFFFFF'
})

Vue.prototype.$notify = Notify
