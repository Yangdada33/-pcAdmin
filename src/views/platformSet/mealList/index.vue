<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <layout-sub-child :route-name="routeName">
        <template v-slot:default>
          <div class="meal-list-container">
            <meal-table :meal-table-data="mealTableData" :set-path-data="setPathData" @reloadMealList="getMealList" />
          </div>
        </template>
      </layout-sub-child>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import LayoutSubChild from '@/layout/indexSubChild'
import MealTable from './components/mealTable/index'
import { mealList } from '@/api/platformSet/mealList'

export default {
  name: 'MealList',
  components: {
    BreadcrumbHeader,
    LayoutSubChild,
    MealTable
  },
  data() {
    return {
      routeName: 'MealList',
      setPathData: '/platformSet/mealList/mealSet',
      mealTableData: []
    }
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getMealList()
    }
  },
  methods: {
    getMealList() {
      mealList().then((response) => {
        this.mealTableData = response.data.reduce((total, item) => (item.list.length ? [...total, ...item.list] : total), [])
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
