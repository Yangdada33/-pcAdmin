<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="HotGoods">
    <template v-slot:default>
      <div class="hot-goods-container">
        <goods-filter>
          <div v-if="false" class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
        </goods-filter>
        <div class="hot-table clearfix">
          <div class="button-list">
            <el-button v-if="false" :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteGoodsAction">批量删除</el-button>
            <el-button v-if="false" class="filter-button" type="primary" size="mini" icon="button_icon_filter">
              <svg-icon icon-class="button_icon_filter" class-name="filter-icon" />
              <span>筛选</span>
            </el-button>
          </div>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addGoodsAction">新增商品</el-button>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <hot-goods-table
              goods-type="hot"
              :multiple-selection="multipleSelection"
              :page-data="pageData"
              :set-path-data="setPathData"
              @onTablePageAction="onTablePageAction"
              @handleSelectionChange="handleSelectionChange"
              @handleDeleteAction="handleDeleteAction"
            />
          </pagination-section>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import GoodsFilter from '@/components/goodsSection/goodsFilter'
import HotGoodsTable from '@/components/goodsSection/goodsTable'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { goodsDelete } from '@/api/activityManage/marketModuleSet'
import { stepAction } from '../utils/index'
import { EventBus } from '@/utils/eventBus'

export default {
  name: 'HotGoods',
  components: {
    LayoutSubChild,
    GoodsFilter,
    HotGoodsTable,
    PaginationSection
  },
  data() {
    return {
      setPathData: '/activityManage/marketModuleSet/hotGoods/goodsSet',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  methods: {
    prevStepAction() {
      stepAction('prev')
    },
    nextStepAction() {
      stepAction('next')
    },
    batchDeleteGoodsAction() {},
    addGoodsAction() {
      navigatePath(this.setPathData)
    },
    onTablePageAction(pageData) {
      this.pageData = pageData
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleDeleteAction(scope) {
      goodsDelete({
        goodsId: scope.row.id,
        activityId: this.activityData.id
      }).then(response => {
        this.$message.success(response.msg)
        EventBus.$emit('onTableDataAction')
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      EventBus.$emit('onTableDataAction')
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      EventBus.$emit('onTableDataAction')
    }
  }
}
</script>

<style lang="scss" scoped>
  .hot-goods-container{
    .hot-table{
      margin-top: 12px;
      padding: 12px 0;
      background: #FFF;
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
  }
</style>
