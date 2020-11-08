<template>
  <div class="pk-set-container">
    <div class="pk-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="pk类型：" prop="step">
          <el-select v-model="form.type" style="width: 240px;" placeholder="请选择任务类型" @change="handlePkTypeChange">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="PK对象：" prop="object">
          <el-row type="flex">
            <el-form-item style="margin-bottom: 0">
              <el-cascader v-model="form.object.left" :disabled="!form.type" :options="objectList" :props="objectProps" placeholder="请选择挑战对象" />
            </el-form-item>
            <span class="separator"> VS </span>
            <el-form-item style="margin-bottom: 0">
              <el-cascader v-model="form.object.right" :disabled="!form.type || !form.object.left" :options="objectList" :props="objectProps" placeholder="请选择被挑战对象" />
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item label="PK阶段：" prop="step">
          <el-select v-model="form.step" style="width: 240px;" placeholder="请选择PK阶段">
            <el-option v-for="item in stepList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="PK项目：" prop="projectList">
          <el-select v-model="form.projectList" multiple style="width: 240px;" placeholder="请选择PK项目">
            <el-option
              v-for="item in projectOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="PK金额：" prop="money">
          <el-input v-model="form.money" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="pkTableData.length" class="pk-table-wrap">
      <pk-table :pk-table-data="pkTableData" @handleDeleteAction="handleDeleteAction" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PkTable from '../components/pkTable/index'
import { navigatePath } from '@/router'
import { stepDetail, projectList, pkAdd, pkDelete, pkObjectList } from '@/api/activityManage/employeeManage'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'PkSet',
  components: {
    PkTable
  },
  props: {
    pkId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateObject = (rule, value, callback) => {
      const { left, right } = this.form.object
      if (!left.length) {
        callback(new Error('请选择挑战对象'))
      } else if (!right.length) {
        callback(new Error('请选择被挑战对象'))
      } else {
        if (left.length === right.length && left[left.length - 1] === right[right.length - 1]) {
          callback(new Error('请选择不同的挑战对象'))
        } else {
          callback()
        }
      }
    }
    const validateProjectList = (rule, value, callback) => {
      if (Array.isArray(value) && value.length) {
        callback()
      } else {
        callback(new Error('请选择pk项目'))
      }
    }
    return {
      loading: false,
      pkTableData: [],
      typeList: [
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ],
      objectList: [],
      objectProps: {
        value: 'id',
        label: 'name',
        children: 'cat_list'
      },
      stepList: [],
      projectOptions: [],
      form: {
        type: '',
        object: {
          left: [],
          right: []
        },
        step: '',
        projectList: [],
        money: ''
      },
      rules: {
        type: [{ required: true, message: '请选择pk类型', trigger: 'blur' }],
        step: [{ required: true, message: '请选择pk阶段', trigger: 'blur' }],
        object: [{ required: true, validator: validateObject, trigger: 'blur' }],
        projectList: [{ required: true, validator: validateProjectList, trigger: 'blur' }],
        money: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getStepList()
    this.getProjectList()
  },
  methods: {
    getPkObjectList() {
      pkObjectList(this.activityData.id, this.form.type).then(response => {
        this.objectList = response.data
      })
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
    handlePkTypeChange(value) {
      this.form.object = { left: [], right: [] }
      this.getPkObjectList()
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        console.log(this.form)
        if (valid) {
          const requestName = !this.pkId ? pkAdd : ''
          this.loading = true
          requestName({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
            this.form = {
              type: '',
              object: {
                left: [],
                right: []
              },
              step: '',
              projectList: [],
              money: ''
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
      pkDelete({ activityId: this.activityData.id, pkId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.pkTableData.splice(scope.$index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .pk-set-container{
    .pk-form-wrap{
      padding:24px 12px;
      background: #FFF;
      .separator{
        padding: 0 12px;
      }
      .action-list{
        .el-button:first-child{
          margin-left: 120px;
        }
      }
    }
    .pk-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
