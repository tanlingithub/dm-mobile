// 埋点mixins
import {
  createUid,
  createShareInfoApi,
  accessRecordApi,
  browseApi
} from '@/const/api'

const ACTIVITY = '0'

export default {
  data() {
    return {
      recordId: ''
    }
  },
  methods: {
    // 创建分享id
    async createUid() {
      return await this.$axios.$get(createUid)
    },
    // 创建分享信息
    async createdShareInfo(data) {
      await this.$axios.$post(createShareInfoApi, data)
    },
    // 增加浏览记录
    addAccessRecords(activityName) {
      this.$axios
        .$post(accessRecordApi, {
          name: activityName,
          countTypeEnum: ACTIVITY,
          lookTime: Date.now(),
          accountId: this.accountId,
          activityTypeEnum: ACTIVITY,
          typeId: this.$route.query.id
        })
        .then(resp => {
          this.recordId = resp.payload
        })
        .catch(e => console.log(e))
    },
    // 带来浏览量+1
    addBrowse(id) {
      this.$axios.$put(browseApi(id))
    }
  }
}
