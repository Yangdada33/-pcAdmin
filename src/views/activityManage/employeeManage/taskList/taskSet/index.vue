<template>
  <div class="task-set-container">
    <div class="task-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="所属阶段：" prop="step">
          <el-select v-model="form.step" style="width: 240px;" placeholder="请选择任务类型">
            <el-option v-for="item in stepList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型：" prop="type">
          <el-select v-model="form.type" style="width: 240px;" placeholder="请选择任务类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="任务奖金：" prop="prize">
          <el-input v-model="form.prize" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="任务项目：" prop="projectList">
          <el-select v-model="form.projectList" multiple style="width: 240px;" placeholder="请选择任务项目" @change="projectSelectAction">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="project-table-wrap">
            <div class="form-tip">项目说明：</div>
            <el-table
              :data="form.projectTableData"
              style="width: 400px;margin: 10px 0 0 16px"
              border
              size="mini"
            >
              <el-table-column
                prop="name"
                label="项目"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="target"
                label="目标"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <!--<el-form-item :prop="'projectTableData.' + scope.$index + '.target'" :rules="rules.target">-->
                  <el-form-item style="margin-bottom: 0">
                    <el-input v-model="scope.row.target" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="fine"
                label="未完成扣罚"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <!--<el-form-item :prop="'projectTableData.' + scope.$index + '.fine'" :rules="rules.fine">-->
                  <el-form-item style="margin-bottom: 0">
                    <el-input v-model="scope.row.fine" placeholder="请输入" />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="taskTableData.length" class="task-table-wrap">
      <task-table :task-table-data="taskTableData" @handleDeleteAction="handleDeleteAction" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskTable from '../components/taskTable/index'
import { navigatePath } from '@/router'
import { stepDetail, taskAdd, taskEdit, taskDelete, projectList } from '@/api/activityManage/employeeManage'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'TaskSet',
  components: {
    TaskTable
  },
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateProjectList = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请选择任务项目'))
      }
    }
    return {
      loading: false,
      taskTableData: [],
      stepList: [],
      typeList: [
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ],
      projectOptions: [],
      form: {
        step: '',
        type: '',
        prize: '',
        projectList: [],
        projectTableData: []
      },
      rules: {
        step: [{ required: true, message: '请选择所属阶段', trigger: 'blur' }],
        type: [{ required: true, message: '请选择任务类型', trigger: 'blur' }],
        prize: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        projectList: [{ required: true, validator: validateProjectList, trigger: 'blur' }],
        target: [{ required: true, message: '请输入目标值', trigger: 'blur' }],
        fine: [{ required: true, message: '请输入扣罚值', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'taskData'
    ])
  },
  created() {
    this.getStepList()
    this.getProjectList()
    this.taskId && this.getTaskData()
  },
  methods: {
    getTaskData() {
      const { id, period_id, level, reward, content } = this.taskData
      const projectList = []
      const projectTableData = []
      content && content.forEach(item => {
        projectList.push(item.project_id)
        projectTableData.push(({ id: item.project_id, name: item.name, target: item.times, fine: item.punishment }))
      })
      this.form = {
        id,
        step: period_id,
        type: level,
        prize: reward,
        projectList,
        projectTableData
      }
    },
    getStepList() {
      stepDetail(this.activityData.id, 'all').then(response => {
        this.stepList = response.data
      })
    },
    getProjectList() {
      projectList(this.activityData.id).then(response => {
        this.projectOptions = response.data
      })
    },
    projectSelectAction(value) {
      const projectTableData = this.form.projectTableData
      const projectOptions = this.projectOptions
      this.form.projectTableData = value.reduce((total, item, index) => {
        const findTableItem = projectTableData.find(itemItem => itemItem.id === item)
        if (!findTableItem) {
          const { id, name } = projectOptions.find(itemVal => itemVal.id === item)
          total[index] = { id, name, target: 100, fine: 0 }
        } else {
          total[index] = { ...findTableItem }
        }
        return total
      }, [])
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.taskId ? taskAdd : taskEdit
          this.loading = true
          const projectList = this.form.projectTableData.map(item => ({ project_id: item.id, times: item.target, punishment: item.fine }))
          requestName({
            activityId: this.activityData.id,
            ...this.form,
            projectList
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
            this.form = {
              step: '',
              type: '',
              prize: '',
              projectList: [],
              projectTableData: []
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleDeleteAction(scope) {
      taskDelete({ activityId: this.activityData.id, idList: [scope.row.id] }).then(response => {
        this.$message.success(response.msg)
        this.taskTableData.splice(scope.$index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .task-set-container{
    .task-form-wrap{
      padding:24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 160px;
        }
      }
    }
    .task-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
