<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <div class="rule-template-container">
        <div class="rule-template-wrap">
          <el-form class="rule-type" label-width="120px" size="small">
            <el-form-item label="选择规则类型：">
              <el-select v-model="form.type" :disabled="Boolean(stepIndex)" filterable style="width:200px;" placeholder="请选择类型" @change="ruleTypeChangeAction">
                <el-option v-for="(item,index) in ruleTypeList" :key="index" :label="item" :value="index" />
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="!stepIndex" class="rule-table clearfix">
            <el-row type="flex" justify="end" align="middle">
              <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addRuleAction">新增</el-button>
            </el-row>
            <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
              <template v-slot:default>
                <el-table
                  ref="multipleTable"
                  :data="templateTableData"
                  style="width: 100%;"
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
                    label="规则模板内容"
                    min-width="160"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="created_at"
                    label="创建时间"
                    width="160"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column label="操作" width="120" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" content="编辑" placement="top">
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
              </template>
            </pagination-section>
          </div>

          <div v-else class="rule-set">
            <el-row class="rule-header" type="flex" justify="space-between" align="middle">
              <span>{{ ruleTypeList[form.type] }} / {{ templateForm.id ? '编辑' : '新增' }}</span>
            </el-row>
            <div class="rule-main">
              <el-form ref="form" :model="templateForm" :rules="templateRules" label-width="120px" size="small">
                <el-form-item label="规则内容：" class="template-rule clearfix" prop="content">
                  <el-row type="flex">
                    <el-input v-model="templateForm.content" :rows="5" type="textarea" style="width: 500px;" placeholder="请输入规则内容" />
                    <el-button type="primary" plain @click="sponsorLeadInAction">主办方导入</el-button>
                  </el-row>
                </el-form-item>
                <el-form-item class="action-list">
                  <el-button type="default" @click="formBackAction">返 回</el-button>
                  <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>

        <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false">
          <div class="rule-template-dialog">
            <div class="title">主办方导入</div>
            <el-form ref="form" :model="sponsorTemplateForm" label-width="100px" size="small">
              <el-form-item label="选择主办方：">
                <el-select v-model="sponsorTemplateForm.sponsor" filterable placeholder="请选择主办方" @change="handleSponsorChange">
                  <el-option
                    v-for="item in sponsorOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label-width="0">
                <div class="template-table">
                  <pagination-section :page-data="sponsorTemplatePageData" @handleSizeChange="handleSponsorSizeChange" @handleCurrentChange="handleSponsorCurrentChange">
                    <el-table
                      ref="multipleTable"
                      :data="sponsorTemplateTableData"
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
                        :index="indexSponsorMethod"
                      />
                      <el-table-column
                        prop="content"
                        label="模板"
                        min-width="120"
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
            </el-form>
          </div>
        </el-dialog>
      </div>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import PaginationSection from '@/components/PaginationSection'
import { ruleTypeList, ruleTemplateList, ruleTemplateAdd, ruleTemplateEdit, ruleTemplateDelete } from '@/api/platformSet/ruleTemplate'
import { sponsorListWithNoPage } from '@/api/sponsorList/index'

export default {
  name: 'RuleTemplate',
  components: {
    BreadcrumbHeader,
    PaginationSection
  },
  data() {
    return {
      ruleTypeList: [],
      stepIndex: 0, // 0-表格 1-设置表单
      form: {
        type: ''
      },
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: [],
      setPathData: '/platformSet/ruleTemplate/ruleSet',
      loading: false,
      templateForm: {
        content: ''
      },
      templateRules: {
        content: [{ required: true, message: '请输入规则内容', trigger: 'blur' }]
      },
      dialogTemplateVisible: false,
      sponsorOptions: [],
      sponsorTemplateForm: {
        sponsor: ''
      },
      sponsorTemplatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      sponsorTemplateTableData: []
    }
  },
  created() {
    this.getRuleTypeList()
  },
  methods: {
    getRuleTypeList() {
      ruleTypeList().then(response => {
        this.ruleTypeList = response.data
        if (response.data.length) {
          this.form.type = 0
          this.getRuleTemplateList()
        }
      })
    },
    ruleTypeChangeAction(value) {
      this.getRuleTemplateList()
    },
    getRuleTemplateList() {
      ruleTemplateList({ ...this.pageData, ...this.form }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.templateTableData = data
      })
    },
    addRuleAction() {
      this.stepIndex = 1
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleEditAction(scope) {
      this.templateForm = { ...scope.row }
      this.addRuleAction()
    },
    handleDeleteAction(scope) {
      ruleTemplateDelete(scope.row.id).then(response => {
        this.$message.success(response.msg)
        this.getRuleTemplateList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getRuleTemplateList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getRuleTemplateList()
    },
    async sponsorLeadInAction() {
      if (!this.sponsorOptions.length) {
        const response = await sponsorListWithNoPage()
        if (response.data && response.data.length) {
          this.sponsorOptions = response.data
          this.dialogTemplateVisible = true
        } else {
          this.$message.warning('暂无可选模板！')
        }
      } else {
        this.dialogTemplateVisible = true
      }
    },
    formBackAction() {
      this.stepIndex = 0
      this.templateForm = {
        content: ''
      }
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const requestName = !this.templateForm.id ? ruleTemplateAdd : ruleTemplateEdit
          requestName({ type: this.form.type, ...this.templateForm }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.getRuleTemplateList()
            this.formBackAction()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getSponsorRuleTemplateList() {
      ruleTemplateList({ ...this.pageData, type: this.form.type, sponsorId: this.sponsorTemplateForm.sponsor }).then(response => {
        const { data, total } = response.data
        this.sponsorTemplatePageData.total = total
        this.sponsorTemplateTableData = data
      })
    },
    handleSponsorChange(value) {
      this.getSponsorRuleTemplateList()
    },
    indexSponsorMethod(indexIndex) {
      const { index, size } = this.sponsorTemplatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    templateSelectedAction(scope) {
      this.templateForm.content = scope.row.content
      // 重置
      this.dialogTemplateVisible = false
      this.sponsorOptions = []
      this.sponsorTemplateForm = {
        sponsor: ''
      }
      this.sponsorTemplatePageData = {
        index: 1,
        size: 10,
        total: 0
      }
      this.sponsorTemplateTableData = []
    },
    handleSponsorSizeChange(value) {
      this.sponsorTemplatePageData.size = value
      this.getSponsorRuleTemplateList()
    },
    handleSponsorCurrentChange(value) {
      this.sponsorTemplatePageData.index = value
      this.getSponsorRuleTemplateList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .rule-template-container{
    .rule-template-wrap{
      .rule-type{
        padding: 12px;
        background: #FFF;
        .el-form-item{
          margin-bottom: 0;
        }
      }
      .rule-table{
        margin-top: 12px;
        padding: 12px 0;
        background: #FFF;
        .el-button{
          margin: 0 12px 12px 0;
        }
        .add-button{
          margin-right: 12px;
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .table-action{
            margin: 0 8px;
            font-size: 18px;
            cursor: pointer;
          }
        }
      }

      .rule-set{
        margin-top: 12px;
        padding: 16px 0;
        background: #FFF;
        .rule-header{
          border-bottom: 1px solid #EEE;
          span{
            margin-left: 12px;
            padding-bottom: 16px;
            font-size:16px;
            font-weight:500;
            color:rgba(51,51,51,1);
          }
        }
        .rule-main{
          padding-top: 16px;
          .template-rule{
            .el-textarea,
            .el-button{
              float: left;
            }
            .el-textarea{
              width: calc(100% - 120px);
              min-width: 140px;
            }
            .el-button{
              height: 32px;
              margin: 4px 0 0 10px;
            }
          }
          .action-list{
            .el-button:first-child{
              margin-left: 16%;
            }
          }
        }
      }
    }

    .el-dialog{
      min-width:300px;
      .rule-template-dialog{
        padding: 24px 20px 12px;
        .title{
          padding-bottom: 10px;
          font-size:16px;
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
  }
</style>

