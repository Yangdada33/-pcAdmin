<template>
  <el-scrollbar v-if="validateMenuStatus" wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :unique-opened="true"
      text-color="#939393"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-sub-item v-for="item in menuList" :key="item.path" :route="item" :base-path="parentPath" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarSubItem from '@/components/SidebarSub/SidebarSubItem'
import variables from '@/styles/variables.scss'
import { deepClone } from '@/utils/index'

export default {
  name: 'SidebarSub',
  components: {
    SidebarSubItem
  },
  data() {
    return {
      variables,
      menuSubStatus: false,
      menuList: [],
      parentPath: ''
    }
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'moduleList'
    ]),
    validateMenuStatus() {
      const { meta } = this.$route
      if (meta.subStatus || meta.subStatus === false) {
        if (this.moduleList && this.moduleList.length) {
          const modulePathList = this.moduleList.map(item => item.path)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.parentPath = '/' + this.$route.path.split('/')[1]
          const totalMenuList = deepClone(this.permission_routes.find(item => item.path === this.parentPath).children)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.menuList = totalMenuList.filter(item => {
            const itemIndex = modulePathList.findIndex(pathItem => pathItem === item.path)
            if (itemIndex > -1 && this.moduleList[itemIndex].children) {
              item.children = item.children.filter(itemItem => {
                return this.moduleList[itemIndex].children.includes(itemItem.path)
              })
            }
            return itemIndex > -1
          })
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    activeMenu() {
      const { meta, path } = this.$route
      return meta.activeSubMenu || path
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-scrollbar{
    height: 100vh;
    .el-menu{
      border-right: none;
    }
  }
</style>
