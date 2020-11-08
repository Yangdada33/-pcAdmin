<template>
  <div class="step-list-container">
    <div class="step-list-wrap">
      <el-form ref="form" :model="form" label-width="100px" size="small">
        <el-form-item label="活动时间：">
          <span>{{ activityData.start_time }} - {{ activityData.end_time }}</span>
          <div class="form-tip-red">注：阶段时间必须在活动时间范围内，且所有阶段时间总和为整个活动时间段</div>
        </el-form-item>
        <el-form-item v-for="(item, index) in form.stepList" :key="index" :label="`阶段${index + 1}：`" class="step-group">
          <el-form-item label="名称：" :prop="'stepList.' + index + '.name'" :rules="rules.name" label-width="80px">
            <el-input v-model="item.name" style="width: 280px;" placeholder="请输入阶段名称" />
            <el-button v-if="form.stepList.length > 1" type="default" @click="deleteStepAction(index)">删除</el-button>
            <el-button v-if="index === form.stepList.length - 1" type="primary" @click="addStepAction(index)">新增</el-button>
          </el-form-item>
          <el-form-item label="时间：" label-width="80px" style="margin-bottom: 0">
            <el-row type="flex" align="middle">
              <el-form-item :prop="'stepList.' + index + '.startTime'" :rules="rules.startTime">
                <el-date-picker
                  v-model="item.startTime"
                  :disabled="!index"
                  type="date"
                  style="width: 190px"
                  placeholder="选择开始时间"
                  @change="startTimeChange(index, $event)"
                />
              </el-form-item>
              <div class="separator"> 至 </div>
              <el-form-item :prop="'stepList.' + index + '.endTime'" :rules="rules.endTime">
                <el-date-picker
                  v-model="item.endTime"
                  :disabled="index === form.stepList.length - 1 || !item.startTime"
                  type="date"
                  style="width: 190px"
                  placeholder="选择结束时间"
                  @change="endTimeChange(index, $event)"
                />
              </el-form-item>
            </el-row>
          </el-form-item>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { navigatePath } from '@/router'
import { stepDetail, stepSet } from '@/api/activityManage/employeeManage'
import { parseTime, string2Date } from '@/utils/index'

const defaultStepItem = { name: '', startTime: '', endTime: '' }

export default {
  name: 'StepSet',
  data() {
    const validateStartTime = (rule, value, callback) => {
      if (value) {
        if (value.getTime() >= this.activityTimeData.start && value.getTime() <= this.activityTimeData.end) {
          const endTime = this.form.stepList[rule.field.split('.')[1]].endTime.getTime()
          if (value.getTime() < endTime) {
            callback()
          } else if (endTime >= this.activityTimeData.start && endTime <= this.activityTimeData.end) {
            callback(new Error('开始时间必须小于结束时间'))
          }
        } else {
          callback(new Error('开始时间必须在活动时间范围内'))
        }
      } else {
        callback(new Error('请选择开始时间'))
      }
    }
    const validateEndTime = (rule, value, callback) => {
      if (value) {
        if (value.getTime() >= this.activityTimeData.start && value.getTime() <= this.activityTimeData.end) {
          const startTime = this.form.stepList[rule.field.split('.')[1]].startTime.getTime()
          if (startTime < value.getTime()) {
            callback()
          } else if (startTime >= this.activityTimeData.start && startTime <= this.activityTimeData.end) {
            callback(new Error('结束时间必须大于开始时间'))
          }
        } else {
          callback(new Error('结束时间必须在活动时间范围内'))
        }
      } else {
        callback(new Error('请选择结束时间'))
      }
    }
    return {
      loading: false,
      activityTimeData: {
        start: '',
        end: ''
      },
      form: {
        stepList: [{ ...defaultStepItem }]
      },
      rules: {
        name: [{ required: true, message: '请输入阶段名称', trigger: 'blur' }],
        startTime: [{ required: true, validator: validateStartTime, trigger: 'blur' }],
        endTime: [{ required: true, validator: validateEndTime, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'moduleList'
    ])
  },
  created() {
    this.activityTimeData = {
      startDate: string2Date(this.activityData.start_time),
      endDate: string2Date(this.activityData.end_time),
      start: string2Date(this.activityData.start_time).getTime(),
      end: string2Date(this.activityData.end_time).getTime()
    }
    this.getStepDetail()
  },
  methods: {
    getStepDetail() {
      stepDetail(this.activityData.id).then(response => {
        if (response.data && response.data.length) {
          this.form.stepList = response.data.map(item => {
            item.startTime = string2Date(item.start_time)
            item.endTime = string2Date(item.end_time)
            return item
          })
        } else {
          const stepItem = { ...defaultStepItem }
          stepItem.startTime = this.activityTimeData.startDate
          stepItem.endTime = this.activityTimeData.endDate
          this.form.stepList = [stepItem]
        }
      })
    },
    startTimeChange(index, value) {
      if (value) {
        const stepList = this.form.stepList
        stepList[index - 1].endTime = new Date(stepList[index].startTime.getTime() - 24 * 60 * 60 * 1000)
        this.form.stepList = stepList
        this.$refs.form.validateField('stepList.' + (index - 1) + '.endTime', (errMsg) => {
          console.log(errMsg)
        })
      }
    },
    endTimeChange(index, value) {
      if (value) {
        if (index < this.form.stepList.length - 1) {
          this.form.stepList[index + 1].startTime = new Date(value.getTime() + 24 * 60 * 60 * 1000)
        }
        this.$refs.form.validateField('stepList.' + (index + 1) + '.startTime', (errMsg) => {
          console.log(errMsg)
        })
      }
    },
    addStepAction(index) {
      const stepList = this.form.stepList
      stepList.push({ ...defaultStepItem })
      const { endTime } = stepList[index]
      if (endTime.getTime() === this.activityTimeData.end) {
        stepList[index + 1].endTime = endTime
        stepList[index].endTime = ''
      } else {
        stepList[index + 1].startTime = stepList[index].endTime
      }
      this.form.stepList = stepList
    },
    deleteStepAction(index) {
      const stepList = this.form.stepList
      if (index === 0) {
        stepList[1].startTime = stepList[0].startTime
      } else if (index < stepList.length - 1) {
        stepList[index + 1].startTime = stepList[index - 1].endTime
      } else if (index === stepList.length - 1) {
        stepList[index - 1].endTime = stepList[index].endTime
      }
      stepList.splice(index, 1)
      this.form.stepList = stepList
    },
    prevStepAction() {
      let marketModuleData = ''
      let liveModuleData = ''
      this.moduleList.forEach(item => {
        if (item.path === 'marketModuleSet') {
          marketModuleData = item
        } else if (item.path === 'liveSet') {
          liveModuleData = item
        }
      })
      if (liveModuleData) {
        navigatePath('/activityManage/liveSet/liveList')
      } else if (marketModuleData) {
        navigatePath('/activityManage/marketModuleSet/' + marketModuleData.children[marketModuleData.children.length - 1])
      } else {
        navigatePath('/activityManage/baseSet/marketModuleSelect')
      }
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const stepList = this.form.stepList.map(item => {
            item.start_time = parseTime(item.startTime)
            item.end_time = parseTime(item.endTime)
            return item
          })
          this.loading = true
          stepSet({ activityId: this.activityData.id, stepList }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            navigatePath('/activityManage/employeeManage/taskList')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .step-list-container{
    .step-list-wrap{
      padding:24px 12px;
      background: #FFF;
      .step-group{
        border-bottom: 1px solid #EEE;
        .separator{
          position: relative;
          top: -10px;
          padding: 0 12px;
        }
        .el-button{
          margin-left: 12px;
        }
      }
      .action-list{
        .el-button:first-child{
          // margin-left: 180px;
          margin-left: 240px;
        }
      }
    }
  }
</style>
