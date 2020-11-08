<script>
import { login } from '@/api/user'
import { setToken } from '@/utils/auth'

export default {
  name: 'LoginScanFilter',
  created() {
    const { query } = this.$route
    const { code } = query
    login({ type: 1, wxCode: code }).then(response => {
      const token = response.data.token
      this.$store.commit('user/SET_TOKEN', token)
      setToken(token)
      this.$router.replace({ path: '/' })
    }).catch(() => {
      this.$router.back()
    })
  }
}
</script>
