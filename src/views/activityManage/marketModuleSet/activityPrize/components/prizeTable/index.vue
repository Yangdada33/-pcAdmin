<template>
  <div class="activity-prize-table-container">
    <el-table
      ref="multipleTable"
      :data="prizeTableData"
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
        prop="goods_name"
        label="奖品名称"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="img.url"
        label="奖品图片"
        width="120"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <el-popover
            placement="right-end"
            width="200"
            trigger="hover"
          >
            <el-image
              style="display: block;max-width: 360px; max-height: 360px"
              fit="cover"
              :src="scope.row.img.url"
            />
            <el-image
              slot="reference"
              style="display:block;width: 32px; height: 32px;margin: auto;"
              fit="cover"
              :src="scope.row.img.url"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="storage"
        label="奖品库存"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column
        v-if="false"
        prop="probability"
        label="中奖概率"
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
  name: 'ActivityPrizeTable',
  props: {
    prizeTableData: {
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
  .activity-prize-table-container{
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
