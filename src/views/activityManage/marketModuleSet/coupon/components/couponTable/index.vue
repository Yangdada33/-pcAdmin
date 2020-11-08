<template>
  <div class="coupon-table-container">
    <el-table
      ref="multipleTable"
      :data="couponTableData"
      style="width: 100%;"
      size="small"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <el-table-column
        v-if="false"
        type="selection"
        width="80"
        align="center"
        header-align="center"
      />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="brand_name"
        label="所属品牌"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="price"
        label="券额面值"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="sell_price"
        label="购券价格"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="num"
        label="库存"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="user_limit"
        label="限购"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="commission"
        label="佣金"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="80"
        align="center"
        header-align="center"
      />
      <el-table-column label="操作" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-popconfirm title="确定删除吗？" @onConfirm="handleDeleteAction(scope)">
              <svg-icon slot="reference" icon-class="table_icon_delete" class-name="table-action" />
            </el-popconfirm>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { navigatePath } from '@/router'

export default {
  name: 'CouponTable',
  props: {
    couponTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    setPathData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      multipleSelection: []
    }
  },
  methods: {
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleEditAction(scope) {
      if (this.setPathData) {
        navigatePath(this.setPathData + '?id=' + scope.row.id)
      } else {
        console.log('设置页面编辑!')
      }
    },
    handleDeleteAction(scope) {
      this.$emit('handleDeleteAction', scope)
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon-table-container{
    .el-table{
      border-top: 1px solid #EBEEF5;
      .table-action{
        margin: 0 8px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
</style>
