<template>
  <div class="pagination-section-container">
    <slot />
    <el-row class="pagination-wrap" type="flex" justify="end">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageData.index"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageData.size"
        :total="pageData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'PaginationSection',
  props: {
    pageData: {
      type: Object,
      default: () => {
        return { index: 1, size: 10, total: 0 }
      }
    }
  },
  data() {
    return {
      currentPage: 2
    }
  },
  methods: {
    handleSizeChange(value) {
      this.$emit('handleSizeChange', value)
    },
    handleCurrentChange(value) {
      this.$emit('handleCurrentChange', value)
    }
  }
}
</script>

<style lang="scss" scoped>
  .pagination-wrap{
    padding: 20px 12px 10px;
    .el-pagination{
      overflow-x: auto;
    }
  }
</style>
