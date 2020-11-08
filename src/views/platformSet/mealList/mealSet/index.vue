<template>
  <div class="meal-set-container">
    <div class="meal-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
        <el-form-item label="套餐类型：" prop="type">
          <el-radio-group v-model="form.type" :disabled="Boolean(form.id)">
            <el-radio :label="0">按次数</el-radio>
            <el-radio :label="1">按时间</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="!form.type ? '套餐次数：' : '套餐月数：'" prop="times">
          <el-input-number v-model="form.times" :min="0" />
        </el-form-item>
        <el-form-item label="套餐价格：" prop="price">
          <el-input v-model="form.price" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="套餐说明：" prop="remark">
          <el-input v-model="form.remark" :rows="4" type="textarea" style="width: 500px;" placeholder="请输入套餐说明" />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返 回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="mealTableData.length" class="meal-table-wrap">
      <meal-table :meal-table-data="mealTableData" @initFormData="initFormData" />
    </div>
  </div>
</template>

<script>
import MealTable from '../components/mealTable/index'
import { navigatePath } from '@/router'
import { mealDetail, mealAdd, mealEdit } from '@/api/platformSet/mealList'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'MealSet',
  components: {
    MealTable
  },
  props: {
    mealId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      form: {
        type: 0, // 0-按次数 1-按时间
        times: 0,
        price: '',
        remark: ''
      },
      rules: {
        price: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入套餐说明', trigger: 'blur' }]
      },
      mealTableData: []
    }
  },
  created() {
    this.getMealData()
  },
  methods: {
    getMealData() {
      this.mealId && mealDetail(this.mealId).then(response => {
        this.form = response.data
      })
    },
    initFormData(data) {
      this.$refs.form.clearValidate()
      if (data.type === 'add') {
        this.form = { type: 0, times: 0, price: '', remark: '' }
      } else if (data.type === 'edit') {
        this.form = { ...data.form }
      } else if (data.type === 'delete') {
        const deleteId = data.idList.find(item => item === this.form.id)
        deleteId && (this.form = { type: 0, times: 0, price: '', remark: '' })
      }
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          if (!this.form.id) {
            mealAdd(this.form).then(response => {
              this.$message.success(response.msg)
              this.loading = false
              this.form = { type: 0, times: 0, price: '', remark: '' }
              this.mealTableData.push({ ...response.data })
            }).catch(() => {
              this.loading = false
            })
          } else {
            mealEdit(this.form).then(response => {
              this.$message.success(response.msg)
              this.loading = false
              if (!this.mealTableData.length) {
                this.formBackAction()
              } else {
                this.mealTableData.splice(this.form.index, 1, {
                  ...this.mealTableData[this.form.index],
                  ...this.form
                })
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .meal-set-container{
    .meal-form-wrap{
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 160px;
        }
      }
    }
    .meal-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
