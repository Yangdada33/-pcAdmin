<template>
  <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" :close-on-click-modal="false" width="40%">
    <div class="rule-dialog">
      <div class="title">{{ ruleTypeData[ruleType] }}</div>
      <el-form ref="form" :model="form" :rules="rules" label-width="90px" size="small">
        <el-form-item label-width="0" prop="ruleCont">
          <el-input v-model="form.ruleCont" :rows="4" type="textarea" :placeholder="`请输入${ruleTypeData[ruleType]}`" />
        </el-form-item>
        <el-form-item label-width="0">
          <div class="rule-table">
            <pagination-section :page-data="templatePageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
              <el-table
                ref="multipleTable"
                :data="templateTableData"
                style="width: 100%"
                max-height="240px"
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
                  prop="content"
                  label="模板"
                  align="center"
                  header-align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="150" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-button type="warning" size="mini" plain @click="templateSelectedAction(scope)">选 择</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </pagination-section>
          </div>
        </el-form-item>
        <el-form-item class="action-list" label-width="0">
          <el-button type="default" @click="formCancelAction">取消</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import { ruleSet } from '@/api/activityManage/marketModuleSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { ruleTypeData } from '@/utils/data'

export default {
  name: 'RuleTemplateDialog',
  components: {
    PaginationSection
  },
  props: {
    ruleType: {
      type: String,
      default: ''
    },
    ruleCont: {
      type: String,
      default: ''
    },
    dialogTemplateVisible: {
      type: Boolean,
      default: false
    },
    templateType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      ruleTypeData: {
        point_lotto_rule: '积分抽奖规则',
        voucher_rule: '现金券规则',
        point_goods_rule: '积分礼品规则',
        point_shop_rule: '积分商城规则',
        free_gift_rule: '免费领好礼规则',
        shopbadge_rule: '逛店章规则',
        livebadge_rule: '直播章规则'
      },
      form: {
        ruleCont: ''
      },
      rules: {
        ruleCont: [{ required: true, message: '请输入或选择规格', trigger: 'blur' }]
      },
      templatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  watch: {
    dialogTemplateVisible(newVal, oldVal) {
      newVal && (this.form.ruleCont = this.ruleCont)
    }
  },
  created() {
    this.getRuleTemplateList()
  },
  methods: {
    getRuleTemplateList() {
      ruleTemplateList({ ...this.templatePageData, type: ruleTypeData[this.templateType] }).then(response => {
        const { data, total } = response.data
        this.templatePageData.total = total
        this.templateTableData = data
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.templatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    templateSelectedAction(scope) {
      this.form.ruleCont = scope.row.content
    },
    handleSizeChange(value) {
      this.templatePageData.size = value
      this.getRuleTemplateList()
    },
    handleCurrentChange(value) {
      this.templatePageData.index = value
      this.getRuleTemplateList()
    },
    formCancelAction(ruleCont) {
      this.$emit('setDialogTemplateVisible', { status: false, ruleCont })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          ruleSet({ activityId: this.activityData.id, ruleType: this.ruleType, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formCancelAction(this.form.ruleCont)
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
  .el-dialog{
    min-width:300px;
    .rule-dialog{
      padding: 24px 20px;
      .title{
        font-size:18px;
        font-weight:500;
        color:rgba(51,51,51,1);
        text-align: center;
      }
      .el-form{
        margin-top: 20px;
        .el-form-item{
          &:last-child{
            text-align: center;
          }
        }
      }
    }
  }
</style>
