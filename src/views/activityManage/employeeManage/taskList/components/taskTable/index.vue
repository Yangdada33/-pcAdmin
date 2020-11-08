<template>
  <div class="task-table-container">
    <el-table
      ref="multipleTable"
      :data="taskTableData"
      style="width: 100%;"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="60"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="type"
        label="任务类型"
        width="160"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ formatTaskType(scope.row.level) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="step"
        label="所属阶段"
        width="160"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.period_info.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="range"
        label="任务时间"
        min-width="180"
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
        label="任务项目"
        min-width="120"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatTaskProject(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="reward"
        label="奖金池"
        width="120"
        align="center"
        header-align="center"
      />
      <el-table-column label="操作" width="120" align="center" header-align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="setPathData" class="item" effect="dark" content="编辑" placement="top">
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
  name: 'TaskTable',
  props: {
    taskTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    multipleSelection: {
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
    return {}
  },
  methods: {
    formatTaskType(value) {
      const typeList = [
        { id: 0, name: '主办方' },
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ]
      const typeData = typeList.find(item => item.id === value)
      return typeData ? typeData.name : ''
    },
    formatTaskProject(value) {
      return value.map(item => item.name).join('、')
    },
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value)
    },
    handleEditAction(scope) {
      if (this.setPathData) {
        this.$store.commit('activity/setTaskData', scope.row)
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
  .task-table-container{
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
