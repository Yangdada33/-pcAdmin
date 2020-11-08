<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="live-table-set-container">
    <div class="live-table-set-wrap">
      <div v-if="!stepIndex" class="live-table">
        <table-page-section
          type="live"
          :back-status="backStatus"
          :table-data-clone="tableDataClone"
          :page-data-clone="pageDataClone"
          :material-type="materialType"
          :material-fn-data="materialFnData"
          @tabStepAction="tabStepAction"
          @tableDataCloneAction="tableDataCloneAction"
        >
          <template v-slot:default>
            <el-table-column
              prop="content"
              label="直播素材内容"
              min-width="160"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <div style="text-align: left">{{ scope.row.content }}</div>
              </template>
            </el-table-column>
          </template>
        </table-page-section>
      </div>
      <div v-else class="live-set">
        <form-set-section
          type="live"
          :title="'直播素材库 / ' + (form.id ? '编辑' : '新增')"
          :form="form"
          :rules="rules"
          :material-fn-data="materialFnData"
          @tabStepAction="tabStepAction"
        >
          <template v-slot:default>
            <el-form-item label="素材内容：" prop="content">
              <el-row type="flex" class="live-rule clearfix">
                <el-input v-model="form.content" :rows="5" type="textarea" style="width: 500px;" placeholder="请输入素材内容" />
                <el-button type="primary" plain @click="sponsorLeadInAction">主办方导入</el-button>
              </el-row>
            </el-form-item>
          </template>
        </form-set-section>
      </div>
    </div>

    <el-dialog :visible.sync="dialogMaterialVisible" :show-close="false">
      <div class="material-dialog">
        <div class="title">从主办方导入</div>
        <el-form ref="form" :model="materialForm" label-width="100px" size="small">
          <el-form-item label="选择主办方：">
            <el-select v-model="materialForm.sponsor" filterable placeholder="请选择主办方" @change="handleSponsorChange">
              <el-option
                v-for="item in sponsorOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="material-table">
              <pagination-section :page-data="pageData" @handleSizeChange="handleMaterialSizeChange" @handleCurrentChange="handleMaterialCurrentChange">
                <el-table
                  ref="multipleTable"
                  :data="materialTableData"
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
                    :index="indexMaterialMethod"
                  />
                  <el-table-column
                    prop="content"
                    label="素材"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column label="操作" width="150" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-button type="warning" size="mini" plain @click="materialSelectedAction(scope)">使 用</el-button>
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

<script>
import TablePageSection from '../tablePageSection/index'
import FormSetSection from '../formSetSection/index'
import PaginationSection from '@/components/PaginationSection'
import { materialList, materialAdd, materialEdit, materialDelete } from '@/api/platformSet/material'
import { sponsorListWithNoPage } from '@/api/sponsorList/index'
import { materialTypeData } from '@/utils/data'

export default {
  name: 'LiveTableSet',
  components: {
    TablePageSection,
    FormSetSection,
    PaginationSection
  },
  props: {
    materialType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      materialFnData: {
        listFn: materialList,
        addFn: materialAdd,
        editFn: materialEdit,
        deleteFn: materialDelete
      },
      stepIndex: 0, // 0-表格 1-表单
      backStatus: false, // 表单返回状态
      tableDataClone: [],
      pageDataClone: {
        index: 1,
        size: 10,
        total: 0
      },
      form: {
        content: ''
      },
      rules: {
        content: [{ required: true, message: '请输入素材内容', trigger: 'blur' }]
      },
      dialogMaterialVisible: false,
      sponsorOptions: [],
      materialForm: {
        sponsor: ''
      },
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      materialTableData: []
    }
  },
  methods: {
    tabStepAction({ stepIndex, form, backStatus }) {
      this.stepIndex = stepIndex
      if (form) {
        this.form = { ...form }
      } else {
        if (!stepIndex) {
          this.backStatus = backStatus
          this.form = { content: '' }
        }
      }
    },
    tableDataCloneAction({ list, page, backStatus }) {
      this.tableDataClone = list
      this.pageDataClone = page
      this.backStatus = backStatus
    },
    async sponsorLeadInAction() {
      if (!this.sponsorOptions.length) {
        const response = await sponsorListWithNoPage()
        if (response.data && response.data.length) {
          this.sponsorOptions = response.data
          this.dialogMaterialVisible = true
        } else {
          this.$message.warning('暂无可选素材！')
        }
      } else {
        this.dialogMaterialVisible = true
      }
    },
    getSponsorMaterialTemplateList() {
      materialList({ ...this.pageData, type: materialTypeData.live, sponsorId: this.materialForm.sponsor }).then(response => {
        const { total, data } = response.data
        this.pageData.total = total
        this.materialTableData = data
      })
    },
    handleSponsorChange(value) {
      this.getSponsorMaterialTemplateList()
    },
    indexMaterialMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    materialSelectedAction(scope) {
      this.form.content = scope.row.content
      // 重置
      this.dialogMaterialVisible = false
      this.sponsorOptions = []
      this.materialForm = {
        sponsor: ''
      }
      this.pageData = {
        index: 1,
        size: 10,
        total: 0
      }
      this.materialTableData = []
    },
    handleMaterialSizeChange(value) {
      this.pageData.size = value
      this.getSponsorMaterialTemplateList()
    },
    handleMaterialCurrentChange(value) {
      this.pageData.index = value
      this.getSponsorMaterialTemplateList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .live-table-set-container {
    .live-table-set-wrap {
      .live-set{
        .live-rule{
          .el-textarea,
          .el-button{
            float: left;
          }
          .el-textarea{
            width: calc(100% - 200px);
            min-width: 140px;
          }
          .el-button{
            height: 32px;
            margin: 4px 0 0 10px;
          }
        }
      }
    }

    .el-dialog{
      min-width:300px;
      .material-dialog{
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
            .material-table{
              padding-top: 0;
              line-height: 1;
            }
            &:last-child{
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
