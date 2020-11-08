<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <div class="expense-set-container">
        <div class="expense-wrap">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
            <el-form-item label="短信资费：" prop="notePrice">
              <el-input v-model="form.notePrice" style="width: 160px;" placeholder="请输入金额">
                <template slot="append">元/条</template>
              </el-input>
            </el-form-item>
            <el-form-item label="短信预警值：" prop="noteNum">
              <el-input-number v-model="form.noteNum" :min="0" />
            </el-form-item>
            <el-form-item label="活动预警值：" prop="activityPrice">
              <el-input v-model="form.activityPrice" style="width: 160px;" placeholder="请输入金额">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="action-list">
              <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import { expenseDetail, expenseSet } from '@/api/platformSet/expenseSet'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'ExpenseSet',
  components: {
    BreadcrumbHeader
  },
  data() {
    return {
      loading: false,
      form: {
        notePrice: '',
        noteNum: 1,
        activityPrice: ''
      },
      rules: {
        notePrice: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        activityPrice: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getExpenseDetail()
  },
  methods: {
    getExpenseDetail() {
      expenseDetail().then(response => {
        const { sms_fee, SMS_warning_value, activity_warning_value } = response.data
        this.form = {
          notePrice: sms_fee,
          noteNum: SMS_warning_value,
          activityPrice: activity_warning_value
        }
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          expenseSet(this.form).then(response => {
            this.$message.success(response.msg)
            this.loading = false
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
  .expense-set-container{
    .expense-wrap{
      padding:24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 50px;
        }
      }
    }
  }
</style>
