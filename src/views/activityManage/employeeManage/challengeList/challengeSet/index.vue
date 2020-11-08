<template>
  <div class="challenge-set-container">
    <div class="challenge-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="挑战类型：" prop="type">
          <el-select v-model="form.type" style="width: 240px;" placeholder="请选择挑战类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="挑战阶段：" prop="step">
          <el-select v-model="form.step" style="width: 240px;" placeholder="请选择挑战阶段">
            <el-option v-for="item in stepList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="挑战项目：" prop="projectList">
          <el-select v-model="form.projectList" multiple style="width: 240px;" placeholder="请选择挑战项目" @change="projectSelectAction">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item, index) in form.levelList" :key="index" :label="`级别${index + 1}：`" class="level-group">
          <el-row type="flex">
            <div class="level-wrap">
              <el-row class="level-project-list" type="flex">
                <div class="project-item">
                  <div class="item-title">项目</div>
                  <div class="item-value">目标</div>
                </div>
                <div v-for="(itemVal, indexVal) in item.tableData" :key="index + '-' + indexVal + '-' + itemVal.id" class="project-item">
                  <div class="item-title">{{ itemVal.title }}</div>
                  <div class="item-value">
                    <el-input
                      v-if="itemVal.id"
                      :key="index + '-' + indexVal + '-' + itemVal.id"
                      v-model="itemVal.value"
                      size="mini"
                      placeholder="请输入"
                    />
                    <span v-else>{{ itemVal.value }}</span>
                  </div>
                </div>
              </el-row>
              <el-form-item label="挑战本金：" :prop="'levelList.' + index + '.money'" :rules="rules.money">
                <el-input :key="index" v-model="item.money" style="width: 160px;" placeholder="请输入本金">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="挑战奖金：" :prop="'levelList.' + index + '.prize'" :rules="rules.prize">
                <el-input :key="index" v-model="item.prize" style="width: 160px;" placeholder="请输入奖金">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </div>
            <div class="button-list">
              <el-button v-if="form.levelList.length > 1" @click="deleteLevelAction(index)">删除</el-button>
              <el-button v-if="index === form.levelList.length - 1" :disabled="!form.projectList.length" type="primary" @click="addLevelAction">新增</el-button>
            </div>
          </el-row>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button type="primary" @click="formSaveAction">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="challengeTableData.length" class="challenge-table-wrap">
      <challenge-table :challenge-table-data="challengeTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ChallengeTable from '../components/challengeTable/index'
import { navigatePath } from '@/router'
import { stepDetail, projectList, challengeAdd, challengeEdit } from '@/api/activityManage/employeeManage'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'PkSet',
  components: {
    ChallengeTable
  },
  props: {
    challengeId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateProjectList = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请选择挑战项目'))
      }
    }
    return {
      loading: false,
      challengeTableData: [],
      typeList: [
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ],
      stepList: [],
      projectOptions: [],
      form: {
        type: '',
        step: '',
        projectList: [],
        levelList: [{ tableData: [{ id: 0, name: 'no', title: '暂无', value: '暂无' }], money: '', prize: '' }]
      },
      rules: {
        type: [{ required: true, message: '请选择pk类型', trigger: 'blur' }],
        step: [{ required: true, message: '请选择pk阶段', trigger: 'blur' }],
        projectList: [{ required: true, validator: validateProjectList, trigger: 'blur' }],
        money: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        prize: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData',
      'challengeData'
    ])
  },
  watch: {
    'form.projectList'(newVal, oldVal) {
      if (!newVal.length) {
        this.form.levelList = [{ tableData: [{ id: 0, name: 'no', title: '暂无', value: '暂无' }], money: '', prize: '' }]
      }
    }
  },
  created() {
    this.challengeId && this.getChallengeData()
    this.getStepList()
    this.getProjectList()
  },
  methods: {
    getChallengeData() {
      const { id, type, period_id, levels } = this.challengeData
      let projectList = []
      let levelList = [{ tableData: [{ id: 0, name: 'no', title: '暂无', value: '暂无' }], money: '', prize: '' }]
      if (levels && levels.length && levels[0].content && levels[0].content.length) {
        projectList = levels[0].content.map(item => item.id)
        levelList = levels.map(item => ({
          id: item.id,
          money: item.pay_money,
          prize: item.reward_money,
          tableData: item.content.map(itemVal => ({ id: itemVal.id, name: itemVal.name, title: itemVal.title, value: itemVal.times }))
        }))
      }
      this.form = { id, type, step: period_id, projectList, levelList }
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
      const projectOptions = this.projectOptions
      this.form.levelList.forEach((item, index) => {
        const projectTableData = item.tableData
        item.tableData = value.reduce((total, item, index) => {
          const findTableItem = projectTableData.find(itemItem => itemItem.id === item)
          if (!findTableItem) {
            const { id, name, tag } = projectOptions.find(itemVal => itemVal.id === item)
            total[index] = { id, name: tag, title: name, value: 0 }
          } else {
            total[index] = { ...findTableItem }
          }
          return total
        }, [])
      })
    },
    addLevelAction() {
      const projectOptions = this.projectOptions
      const tableData = this.form.projectList.map(item => {
        const { id, name, tag } = projectOptions.find(itemVal => itemVal.id === item)
        return { id, name: tag, title: name, value: 0 }
      })
      this.form.levelList.push({
        tableData,
        money: '',
        prize: ''
      })
    },
    deleteLevelAction(index) {
      this.form.levelList.splice(index, 1)
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.challengeId ? challengeAdd : challengeEdit
          this.loading = true
          const { id, type, step, levelList } = this.form
          const levelListClone = levelList.map((item, index) => ({
            ...item,
            name: '级别' + (index + 1),
            pay_money: item.money,
            reward_money: item.prize,
            content: item.tableData.map(itemVal => ({ ...itemVal, project_id: itemVal.id, times: itemVal.value }))
          }))
          requestName({ activityId: this.activityData.id, id, type, step, levelList: levelListClone }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
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
  .challenge-set-container{
    .challenge-form-wrap{
      padding:24px 12px;
      background: #FFF;
      .level-group{
        border-bottom: 1px solid #EEE;
        .level-project-list{
          margin-bottom: 8px;
          border-left: 1px solid #EEE;
          .project-item{
            border-top: 1px solid #EEE;
            .item-title,
            .item-value {
              width: 80px;
              padding: 2px 10px;
              border-right: 1px solid #EEE;
              border-bottom: 1px solid #EEE;
              color: #606266;
              text-align: center;
            }
            .item-title{
              line-height: 28px;
            }
            &:first-child{
              &>div{
                width: 60px;
              }
            }
          }
        }
      }
      .button-list{
        margin-left: 12px;
      }
      .action-list{
        .el-button:first-child{
          margin-left: 120px;
        }
      }
    }
    .challenge-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
