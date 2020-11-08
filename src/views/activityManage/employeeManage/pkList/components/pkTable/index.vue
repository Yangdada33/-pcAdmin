<template>
  <div class="pk-table-container">
    <el-table
      ref="multipleTable"
      :data="pkTableData"
      style="width: 100%;"
      size="small"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        header-align="center"
        :index="indexMethod"
      />
      <el-table-column
        prop="type"
        label="pk类型"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatPkType(scope.row.level) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="object"
        label="pk对象"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.u_user_info.name }} VS {{ scope.row.b_user_info.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="step"
        label="pk阶段"
        width="160"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.period_info.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="pk时间"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }} - {{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="project"
        label="pk项目"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatPkProjectList(scope.row.project_list) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        label="pk金额"
        width="100"
        align="center"
        header-align="center"
      />
      <el-table-column label="操作" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="false" class="item" effect="dark" content="编辑" placement="top">
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
  name: 'PkTable',
  props: {
    pkTableData: {
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
    return {}
  },
  methods: {
    formatPkType(value) {
      const typeList = [
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ]
      const typeData = typeList.find(item => item.id === value)
      return typeData ? typeData.name : ''
    },
    formatPkProjectList(value) {
      return value.map(item => item.name).join('、')
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
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
  .pk-table-container{
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
