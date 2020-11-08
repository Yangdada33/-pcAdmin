<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="task-list-container">
        <el-row v-if="false" class="task-list-wrap clearfix">
          <div class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
        </el-row>
        <div class="task-table clearfix">
          <el-button :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteTaskAction">批量删除</el-button>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addTaskAction">新增任务</el-button>
          <task-table
            :task-table-data="taskTableData"
            :multiple-selection="multipleSelection"
            :set-path-data="setPathData"
            @handleSelectionChange="handleSelectionChange"
            @handleDeleteAction="handleDeleteAction"
          />
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import TaskTable from './components/taskTable/index'
import { navigatePath } from '@/router'
import { taskList, taskDelete } from '@/api/activityManage/employeeManage'

export default {
  name: 'TaskList',
  components: {
    LayoutSubChild,
    TaskTable
  },
  data() {
    return {
      routeName: 'TaskList',
      setPathData: '/activityManage/employeeManage/taskList/taskSet',
      taskTableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getTaskList()
    }
  },
  methods: {
    getTaskList() {
      taskList(this.activityData.id).then(response => {
        this.taskTableData = response.data
      })
    },
    prevStepAction() {
      navigatePath('/activityManage/employeeManage/stepList')
    },
    nextStepAction() {
      navigatePath('/activityManage/employeeManage/pkList')
    },
    deleteCommonFn(idList) {
      taskDelete({ activityId: this.activityData.id, idList }).then(response => {
        this.$message.success(response.msg)
        this.getTaskList()
      })
    },
    batchDeleteTaskAction() {
      this.deleteCommonFn(this.multipleSelection.map(item => item.id))
    },
    addTaskAction() {
      navigatePath(this.setPathData)
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleDeleteAction(scope) {
      this.deleteCommonFn([scope.row.id])
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .task-list-container{
    .task-list-wrap{
      padding: 12px;
      background: #FFF;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      .step-list{
        float: right;
      }
    }
    .task-table{
      margin-top: 12px;
      padding: 12px 0;
      background: #FFF;
      .el-button{
        margin: 0 12px 12px;
      }
      .delete-button{
        float: left;
      }
      .add-button{
        float: right;
      }
    }
  }
</style>
