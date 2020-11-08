<template>
  <div class="meal-table-container clearfix">
    <div class="button-list">
      <el-button class="delete-button" type="primary" size="mini" icon="el-icon-delete" :disabled="!multipleSelection.length" @click="batchDeleteMealAction">批量删除</el-button>
      <el-button v-if="false" class="filter-button" type="primary" size="mini" icon="button_icon_filter">
        <svg-icon icon-class="button_icon_filter" class-name="filter-icon" />
        <span>筛选</span>
      </el-button>
    </div>
    <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addMealAction">新增套餐</el-button>
    <el-table
      ref="multipleTable"
      :data="mealTableData"
      style="width: 100%;"
      size="small"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="60"
        align="center"
        header-align="center"
      />
      <el-table-column
        type="index"
        label="序号"
        width="60"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="num"
        label="按次数"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ !scope.row.type ? scope.row.times + '次' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="time"
        label="按时间"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.type ? scope.row.times + '个月' : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="套餐价格"
        align="center"
        header-align="center"
      />
      <el-table-column
        prop="remark"
        label="套餐说明"
        min-width="120"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="created_at"
        label="创建时间"
        align="center"
        header-align="center"
        show-overflow-tooltip
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
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { mealDelete } from '@/api/platformSet/mealList'

export default {
  name: 'MealTable',
  props: {
    mealTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    setPathData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      multipleSelection: []
    }
  },
  methods: {
    deleteCommonFn(idList, scope) {
      mealDelete(idList).then((response) => {
        this.$message.success(response.msg)
        if (this.setPathData) {
          this.$emit('reloadMealList')
        } else {
          scope && this.mealTableData.splice(scope.$index, 1)
          this.$emit('initFormData', { type: 'delete', idList: idList })
        }
      })
    },
    batchDeleteMealAction() {
      const idList = this.multipleSelection.map(item => item.id)
      this.deleteCommonFn(idList)
    },
    addMealAction() {
      if (this.setPathData) {
        navigatePath(this.setPathData)
      } else {
        this.$emit('initFormData', { type: 'add' })
      }
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleEditAction(scope) {
      if (this.setPathData) {
        navigatePath(this.setPathData + '?id=' + scope.row.id)
      } else {
        this.$emit('initFormData', { type: 'edit', form: { ...scope.row, index: scope.$index }})
      }
    },
    handleDeleteAction(scope) {
      this.deleteCommonFn([scope.row.id], scope)
    }
  }
}
</script>

<style lang="scss" scoped>
  .meal-table-container{
    padding: 12px 0;
    background: #FFF;
    .on-line{
      color: #FF7300;
    }
    .el-button{
      margin: 0 0 12px 12px;
      .filter-icon{
        margin-right: 4px;
      }
    }
    .button-list{
      float: left;
    }
    .add-button{
      float: right;
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
</style>
