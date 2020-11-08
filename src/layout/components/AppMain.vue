<template>
  <el-row class="app-main" type="flex">
    <transition name="sub-fade-transform" mode="out-in">
      <sidebar-sub class="sidebar-sub-container" />
    </transition>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" class="section-content-container" />
    </transition>
  </el-row>
</template>

<script>
import SidebarSub from '@/components/SidebarSub'

export default {
  name: 'AppMain',
  components: {
    SidebarSub
  },
  computed: {
    key() {
      const { matched, meta } = this.$route
      if (meta.subStatus) {
        return matched[1].path
      }
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */;
  // min-height: calc(100vh - 50px);
  min-width: 850px;
  height: 100vh;
  padding: 0 0 15px;
  position: relative;
  background: #F7F7F7;
  overflow: hidden;
  .sidebar-sub-container{
    width: 200px;
    height: calc(100vh - 50px);
    margin-left: 10px;
    background: #FFF;
    .scrollbar-wrapper{
      height: 100%;
    }
  }
  .section-content-container{
    flex: 1;
    height: calc(100vh - 50px);
    padding: 0 12px;
    overflow: auto;
  }
}

.fixed-header+.app-main {
  padding-top: 50px;
}
</style>
