<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="table-page-section-container clearfix">
    <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addMaterialAction">新增素材</el-button>
    <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      <template v-slot:default>
        <el-table
          ref="multipleTable"
          :data="tableData"
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
          <slot />
          <el-table-column label="操作" width="150" align="center" header-align="center">
            <template slot-scope="scope">
              <slot name="action" :row="scope.row" :$index="scope.$index" />
              <el-tooltip v-if="!hideEditAction" class="item" effect="dark" content="编辑" placement="top">
                <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
              </el-tooltip>
              <!-- sponsor_id为0时，表示为平台素材， 不可删除 -->
              <el-tooltip v-if="type !== 'music' || type === 'music' && scope.row.sponsor_id" class="item" effect="dark" content="删除" placement="top">
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
</template>

<script>
import PaginationSection from '@/components/PaginationSection'
import { materialTypeData } from '@/utils/data'

export default {
  name: 'TablePageSection',
  components: {
    PaginationSection
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    backStatus: {
      type: Boolean,
      default: false
    },
    tableDataClone: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageDataClone: {
      type: Object,
      default: () => {
        return { index: 1, size: 10, total: 0 }
      }
    },
    materialType: {
      type: String,
      default: ''
    },
    materialFnData: {
      type: Object,
      default: () => {
        return { listFn: '', addFn: '', editFn: '', deleteFn: '' }
      }
    },
    hideEditAction: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      tableData: []
    }
  },
  watch: {
    materialType: {
      handler(newValue, oldValue) {
        if (!this.backStatus) {
          newValue === this.type && this.getMaterialList()
        } else {
          this.tableData = this.tableDataClone
          this.pageData = this.pageDataClone
        }
      },
      immediate: true
    }
  },
  methods: {
    getMaterialList() {
      this.materialFnData.listFn({
        ...this.pageData,
        type: materialTypeData[this.type]
      }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
        this.$emit('tableDataCloneAction', { list: data, page: { ...this.pageData }, backStatus: true })
      })
    },
    addMaterialAction() {
      this.$emit('tabStepAction', { stepIndex: 1 })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleEditAction(scope) {
      this.$emit('tabStepAction', { stepIndex: 1, form: scope.row })
    },
    handleDeleteAction(scope) {
      this.$emit('deleteExtraAction')
      this.materialFnData.deleteFn({ id: scope.row.id }).then(response => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-page-section-container{
    padding-top: 12px;
    background: #FFF;
    .el-button{
      margin: 0 12px 12px;
    }
    .add-button{
      float: right;
    }
    .el-table{
      border-top: 1px solid #EBEEF5;
      .table-action{
        margin: 0 10px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
</style>
