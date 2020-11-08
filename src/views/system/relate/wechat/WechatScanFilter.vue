<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import { wechatRelateSetWidthCode } from '@/api/system/relate'

export default {
  name: 'WechatScanFilter',
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    const { query } = this.$route
    const { code } = query
    wechatRelateSetWidthCode(code).then(response => {
      const { name, avatar } = response.data
      this.$store.commit('user/SET_NAME', name)
      this.$store.commit('user/SET_AVATAR', avatar)
      this.$store.commit('user/SET_USER_INFO', {
        ...this.userInfo,
        user_info: { name, avatar }
      })
      navigatePath({
        targetUrl: '/relate/wechat',
        type: 'replace'
      })
    })
  }
}
</script>
