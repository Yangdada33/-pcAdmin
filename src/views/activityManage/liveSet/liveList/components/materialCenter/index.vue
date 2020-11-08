<template>
  <div class="material-center-container">
    <div class="material-wrap">
      <div class="material-table clearfix">
        <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
        <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addMaterialAction">新增素材</el-button>
        <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
          <el-table
            ref="multipleTable"
            :data="tableData"
            style="width: 100%;"
            size="small"
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
              type="index"
              label="序号"
              width="60"
              align="center"
              header-align="center"
              :index="indexMethod"
            />
            <el-table-column
              prop="content"
              label="素材"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="false"
              prop="collectStatus"
              label="收藏状态"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-link v-if="!scope.row.collectStatus" type="warning" :underline="false">未收藏</el-link>
                <el-link v-else type="success" :underline="false">已收藏</el-link>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center" header-align="center">
              <template slot-scope="scope">
                <el-tooltip v-if="false" class="item" effect="dark" content="收藏" placement="top">
                  <svg-icon icon-class="table_icon_collect" class-name="table-action" @click="handleCollectAction(scope)" />
                </el-tooltip>
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

    <material-template-dialog
      :live-id="liveId"
      material-type="live"
      :material-data="materialData"
      :dialog-template-visible="dialogTemplateVisible"
      @setDialogTemplateVisible="setDialogTemplateVisible"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import MaterialTemplateDialog from '@/components/MaterialTemplateDialog'
import { materialList, materialDelete } from '@/api/platformSet/material'
import { materialTypeData } from '@/utils/data'

export default {
  name: 'LiveMaterialCenter',
  components: {
    PaginationSection,
    MaterialTemplateDialog
  },
  props: {
    liveId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      ruleType: 'voucher_rule',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: [],
      materialData: {},
      dialogTemplateVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getMaterialList()
  },
  methods: {
    getMaterialList() {
      materialList({
        ...this.pageData,
        type: materialTypeData.live,
        activityId: this.activityData.id,
        liveId: this.liveId
      }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
      })
    },
    addMaterialAction() {
      this.dialogTemplateVisible = true
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleCollectAction(scope) {
      console.log(scope)
    },
    handleEditAction(scope) {
      this.materialData = scope.row
      this.addMaterialAction()
    },
    handleDeleteAction(scope) {
      materialDelete({ activityId: this.activityData.id, liveId: this.liveId, id: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getMaterialList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getMaterialList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getMaterialList()
    },
    setDialogTemplateVisible({ status, content }) {
      this.dialogTemplateVisible = status
      if (typeof content === 'string') {
        this.getMaterialList()
      } else {
        this.materialData = {}
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .material-center-container{
    .material-wrap{
      padding: 12px 0;
      background: #FFF;
      .material-table{
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
  }
</style>
