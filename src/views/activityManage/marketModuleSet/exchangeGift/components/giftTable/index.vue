<template>
  <div class="exchange-gift-table-container">
    <el-table
      ref="multipleTable"
      :data="giftTableData"
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
        :index="indexMethod"
      />
      <el-table-column
        prop="goods_name"
        label="礼品名称"
        min-width="160"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="img"
        label="礼品图片"
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
        label="礼品数量"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="point"
        label="兑换积分"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="goods_limit"
        label="限兑次数"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="price"
        label="兑换现金"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="sort"
        label="展示顺序"
        width="120"
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
  name: 'ExchangeGiftTable',
  props: {
    giftTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    pageData: {
      type: Object,
      default: function() {
        return { index: 1, size: 10, total: 0 }
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
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
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
  .exchange-gift-table-container{
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
