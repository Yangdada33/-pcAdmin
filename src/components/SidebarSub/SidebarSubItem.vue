<template>
  <div class="sidebar-sub-item-container">
    <template v-if="validateRouteStatus">
      <router-link :to="resolvePath(route.path)">
        <el-menu-item :index="resolvePath(route.path)">
          <span slot="title">{{ route.meta.title }}</span>
        </el-menu-item>
      </router-link>
    </template>

    <template v-else>
      <el-submenu ref="subMenu" :index="resolvePath(route.path)">
        <template slot="title">
          <svg-icon class="title-icon" :icon-class="route.meta.icon" style="margin-right: 4px" />
          <span class="title-text">{{ route.meta.title }}</span>
        </template>
        <sidebar-sub-item v-for="item in route.children" :key="item.path" :route="item" :base-path="resolvePath(route.path)" />
      </el-submenu>
    </template>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import FixiOSBug from '@/layout/components/Sidebar/FixiOSBug'

export default {
  name: 'SidebarSubItem',
  mixins: [FixiOSBug],
  props: {
    route: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  computed: {
    validateRouteStatus() {
      if (!this.route.children) {
        return true
      } else {
        return !this.route.children.reduce((total, item) => (item.meta.subStatus ? (total + 1) : total), 0)
      }
    }
  },
  methods: {
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

<style lang="scss">
  @import "~@/styles/variables.scss";

  .el-submenu.is-active > .el-submenu__title{
    svg, span, i{
      color: $themeColor!important;
    }
  }
  .el-submenu > .el-submenu__title .el-submenu__icon-arrow{
    display: block!important;
  }
</style>
