<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="department-manage-container">
        <div class="department-template">
          <el-form ref="form" label-width="90px" size="small">
            <el-form-item label="组织架构：">
              <el-row type="flex" align="middle">
                <el-input v-model="form.fileName" :disabled="!form.fileName" style="width:200px;" placeholder="组织架构" />
                <el-upload
                  class="upload-template"
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :http-request="fileUploadAction"
                >
                  <el-button type="primary" icon="el-icon-upload">上传文件</el-button>
                </el-upload>
                <el-button type="default" icon="el-icon-download" @click="downloadTemplateAction">下载模板</el-button>
              </el-row>
            </el-form-item>
          </el-form>
          <div v-if="false" class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
        </div>
        <div class="department-table clearfix">
          <div class="form-tip-red delete-button">注：品牌下必须至少设置一个门店</div>
          <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
          <div class="button-list">
            <el-button class="add-brand" type="primary" size="mini" icon="el-icon-plus" @click="addBrandAction">新增品牌</el-button>
            <el-button class="add-shop" type="primary" size="mini" icon="el-icon-plus" @click="addShopAction">新增门店</el-button>
          </div>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <template v-slot:default>
              <el-table
                ref="multipleTable"
                :data="tableData"
                style="width: 100%;"
                size="small"
                row-key="id"
                :default-expand-all="false"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <!-- @selection-change="handleSelectionChange" -->
                <el-table-column
                  v-if="false"
                  type="selection"
                  width="50"
                  align="center"
                  header-align="center"
                />
                <el-table-column
                  prop="name"
                  label="品牌 - 门店名称"
                  min-width="120"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="logo.url"
                  label="品牌logo"
                  width="120"
                  align="center"
                  header-align="center"
                >
                  <template slot-scope="scope">
                    <el-popover
                      v-if="scope.row.logo.url"
                      placement="right-end"
                      width="200"
                      trigger="hover"
                    >
                      <el-image
                        style="display: block;max-width: 360px; max-height: 360px"
                        fit="cover"
                        :src="scope.row.logo.url"
                      />
                      <el-image
                        slot="reference"
                        style="display:block;width: 32px; height: 32px;margin: auto;"
                        fit="cover"
                        :src="scope.row.logo.url"
                      />
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="门店地址"
                  align="center"
                  min-width="120"
                  header-align="center"
                  show-overflow-tooltip
                />
                <el-table-column
                  prop="mobile"
                  label="门店电话"
                  width="120"
                  align="center"
                  header-align="center"
                />
                <el-table-column
                  prop="charge_user_info.name"
                  label="负责人"
                  width="120"
                  align="center"
                  header-align="center"
                  show-overflow-tooltip
                />
                <el-table-column label="操作" width="150" align="center" header-align="center">
                  <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.level === 1" class="item" effect="dark" content="新增门店" placement="top">
                      <svg-icon icon-class="table_icon_shop" class-name="table-action" @click="addShopAction(scope)" />
                    </el-tooltip>
                    <el-tooltip v-if="scope.row.level === 2" class="item" effect="dark" content="查看员工" placement="top">
                      <svg-icon icon-class="table_icon_person" class-name="table-action" @click="handlePersonAction(scope)" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="'编辑' + levelList[scope.row.level]" placement="top">
                      <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
                    </el-tooltip>
                    <el-tooltip v-if="false" class="item" effect="dark" :content="'删除' + levelList[scope.row.level]" placement="top">
                      <svg-icon icon-class="table_icon_delete" class-name="table-action" @click="handleDeleteAction(scope)" />
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </pagination-section>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { departmentLeadIn, departmentList } from '@/api/activityManage/baseSet'
import { templateUrl } from '@/utils/data'

export default {
  name: 'DepartmentManage',
  components: {
    LayoutSubChild,
    PaginationSection
  },
  data() {
    return {
      routeName: 'DepartmentManage',
      levelList: ['主办方', '品牌', '门店'],
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      form: {
        fileName: ''
      },
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getDepartmentList()
    }
  },
  methods: {
    getDepartmentList() {
      departmentList({ ...this.pageData, activityId: this.activityData.id }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
      })
    },
    beforeAvatarUpload(file) {
      const isExcel = file.name.endsWith('.xls')
      if (!isExcel) {
        this.$message.error('请上传excel文件!')
      }
      return isExcel
    },
    fileUploadAction(options) {
      departmentLeadIn({ file: options.file, activityId: this.activityData.id }).then(response => {
        this.$message.success(response.msg)
        this.getDepartmentList()
      })
    },
    downloadTemplateAction() {
      window.location.href = templateUrl + 'group.xls'
    },
    prevStepAction() {
      navigatePath('/activityManage/baseSet/contentSet')
    },
    nextStepAction() {
      navigatePath('/activityManage/baseSet/prizeSet')
    },
    addBrandAction() {
      navigatePath('/activityManage/baseSet/departmentManage/brandSet?activityId=' + this.activityData.id)
    },
    addShopAction(scope) {
      const brandId = scope.row ? scope.row.id : 0
      navigatePath('/activityManage/baseSet/departmentManage/shopSet?activityId=' + this.activityData.id + '&brandId=' + brandId)
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handlePersonAction(scope) {
      const { id, parent_cat_info: { id: brandId }} = scope.row
      navigatePath('/activityManage/baseSet/departmentManage/personManage?activityId=' + this.activityData.id + '&brandId=' + brandId + '&shopId=' + id)
    },
    handleEditAction(scope) {
      if (scope.row.level === 1) {
        navigatePath('/activityManage/baseSet/departmentManage/brandSet?brandId=' + scope.row.id + '&activityId=' + this.activityData.id)
      } else if (scope.row.level === 2) {
        navigatePath('/activityManage/baseSet/departmentManage/shopSet?shopId=' + scope.row.id + '&activityId=' + this.activityData.id)
      }
    },
    handleDeleteAction(scope) {
      console.log(scope)
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getDepartmentList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getDepartmentList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .department-manage-container{
    &>div{
      padding: 12px 0;
      background: #FFF;
    }
    .department-template{
      position: relative;
      overflow: hidden;
      .el-form{
        .el-form-item{
          margin-bottom: 0;
          .el-input ~ .el-button,
          .upload-template{
            margin-left: 12px;
          }
        }
      }
      .step-list{
        position: absolute;
        top: 14px;
        right: 12px;
      }
      @media screen and (max-width: 1000px) {
        .step-list {
          position: relative;
          top: 0;
          margin: 4px 0 0 20px;
        }
      }
    }
    .department-table{
      margin-top: 12px;
      .el-button{
        margin: 0 12px 12px 0;
      }
      .delete-button{
        float: left;
        margin-left: 12px;
      }
      .button-list{
        float: right;
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
  }
</style>
