<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <div class="live-pay-container">
        <el-form ref="form" :model="form" label-width="0" size="small">
          <el-form-item v-for="(item, index) in form.payList" :key="index" label-width="0">
            <el-form-item :label="`预付款${index + 1}：`" :prop="'payList.' + index + '.value'" :rules="rules.payValue" label-width="120px">
              <el-row type="flex">
                <el-input v-model="item.value" style="width: 160px;" placeholder="请输入金额">
                  <template slot="append">元</template>
                </el-input>
                <div class="button-list">
                  <el-button v-if="form.payList.length > 1" type="default" @click="deletePriceAction(index)">删除</el-button>
                  <el-button v-if="index === form.payList.length - 1" type="primary" @click="addPriceAction">新增</el-button>
                </div>
              </el-row>
            </el-form-item>
            <el-form-item style="margin-bottom: 0" label-width="120px">
              <el-input v-model="item.content" style="width: 290px;" placeholder="请输入预付说明" />
            </el-form-item>
          </el-form-item>
          <el-form-item :rules="rules.remark" label="预付说明：" label-width="120px" prop="remark">
            <el-input v-model="form.remark" :rows="5" type="textarea" style="width: 500px;" placeholder="请输入流量说明" />
          </el-form-item>
          <el-form-item class="action-list">
            <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import { livePayDetail, livePaySet } from '@/api/platformSet/livePay'
import { validateMoney } from '@/utils/validate'

export default {
  name: 'LivePay',
  components: {
    BreadcrumbHeader
  },
  data() {
    return {
      loading: false,
      form: {
        payList: [{ value: '', content: '' }],
        remark: ''
      },
      rules: {
        payValue: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        remark: [{ required: true, message: '请输入预付说明', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getLivePayDetail()
  },
  methods: {
    getLivePayDetail() {
      livePayDetail().then(response => {
        const { fee, remark } = response.data
        this.form = {
          payList: fee,
          remark
        }
      })
    },
    addPriceAction() {
      this.form.payList.push({ value: '', content: '' })
    },
    deletePriceAction(index) {
      this.form.payList.splice(index, 1)
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          livePaySet(this.form).then(response => {
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
  .live-pay-container{
    padding: 24px 12px;
    background: #FFF;
    .button-list{
      margin-left: 12px;
    }
    .action-list{
      .el-button:first-child{
        margin-left: 200px;
      }
    }
  }
</style>
