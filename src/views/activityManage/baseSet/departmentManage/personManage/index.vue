<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="person-manage-container">
        <div class="person-table clearfix">
          <el-button class="delete-button" type="primary" size="mini" icon="el-icon-delete" :disabled="!multipleSelection.length" @click="batchDeleteAction">批量删除</el-button>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addPersonAction">新增员工</el-button>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%;"
              size="small"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="80"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="name"
                label="姓名"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="type"
                label="职位"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <span>{{ positionList[scope.row.type] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="mobile"
                label="手机"
                align="center"
                header-align="center"
              />
              <el-table-column label="操作" width="150" align="center" header-align="center">
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
          </pagination-section>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import LayoutSubChild from '@/layout/indexSubChild'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { employeeList, employeeDelete } from '@/api/activityManage/baseSet'
import { positionList } from '@/utils/data'

export default {
  name: 'PersonManage',
  components: {
    LayoutSubChild,
    PaginationSection
  },
  props: {
    activityId: {
      type: String,
      default: ''
    },
    brandId: {
      type: String,
      default: ''
    },
    shopId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      routeName: 'PersonManage',
      positionList,
      pageData: {
        index: 1,
        size: 10,
        total: 10
      },
      tableData: [],
      multipleSelection: []
    }
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getEmployeeList()
    }
  },
  methods: {
    getEmployeeList() {
      employeeList({ ...this.pageData, activityId: this.activityId, shopId: this.shopId }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
      })
    },
    deleteCommonFn(idList) {
      employeeDelete({ activityId: this.activityId, idList }).then(response => {
        this.$message.success(response.msg)
        this.getEmployeeList()
      })
    },
    batchDeleteAction() {
      this.deleteCommonFn(this.multipleSelection.map(item => item.id))
    },
    addPersonAction() {
      navigatePath('/activityManage/baseSet/departmentManage/personManage/personSet?activityId=' + this.activityId +
        '&brandId=' + this.brandId +
        '&shopId=' + this.shopId
      )
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleEditAction(scope) {
      const { id, brand_id, cat_id, type, name, mobile } = scope.row
      navigatePath('/activityManage/baseSet/departmentManage/personManage/personSet?activityId=' + this.activityId +
        '&employeeId=' + id +
        '&brandId=' + brand_id +
        '&shopId=' + cat_id +
        '&position=' + type +
        '&name=' + name +
        '&mobile=' + mobile
      )
    },
    handleDeleteAction(scope) {
      this.deleteCommonFn([scope.row.id])
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getEmployeeList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getEmployeeList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .person-manage-container{
    .person-table{
      margin-top: 12px;
      padding: 12px 0;
      background: #FFF;
      .el-button{
        margin: 0 12px 12px;
      }
      .delete-button{
        float: left;
      }
      .add-button{
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
