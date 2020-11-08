<template>
  <div class="goods-time-container">
    <div v-if="false" class="step-list">
      <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
      <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="秒杀商品" name="goods">
        <goods-filter />
        <div class="goods-table clearfix">
          <div class="button-list">
            <el-button v-if="false" :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteGoodsAction">批量删除</el-button>
            <el-button v-if="false" class="filter-button" type="primary" size="mini" icon="button_icon_filter">
              <svg-icon icon-class="button_icon_filter" class-name="filter-icon" />
              <span>筛选</span>
            </el-button>
          </div>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addGoodsAction">新增商品</el-button>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <second-point-goods-table
              :goods-type="goodsType"
              :multiple-selection="multipleSelection"
              :page-data="pageData"
              :set-path-data="formatSetPathData"
              @onTablePageAction="onTablePageAction"
              @handleSelectionChange="handleSelectionChange"
              @handleDeleteAction="handleDeleteAction"
            />
          </pagination-section>
        </div>
      </el-tab-pane>
      <el-tab-pane label="秒杀时间" name="time">
        <div class="goods-table clearfix">
          <div class="button-list">
            <el-button v-if="false" :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteGoodsAction">批量删除</el-button>
            <el-button v-if="false" class="filter-button" type="primary" size="mini" icon="button_icon_filter">
              <svg-icon icon-class="button_icon_filter" class-name="filter-icon" />
              <span>筛选</span>
            </el-button>
          </div>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addTimeAction">新增时间</el-button>
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
              width="80"
              align="center"
              header-align="center"
            />
            <el-table-column
              v-if="goodsType === 'second'"
              prop="time"
              label="秒杀时间"
              min-width="180"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span>{{ scope.row.start_time }} - {{ scope.row.end_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              v-if="goodsType === 'point'"
              prop="start_time"
              label="秒杀开始时间"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="goodsType === 'point'"
              prop="keep"
              label="秒杀持续时间"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="num"
              label="已绑定商品数量"
              align="center"
              header-align="center"
            />
            <el-table-column label="操作" width="120" align="center" header-align="center">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                  <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleTimeEditAction(scope)" />
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <el-popconfirm title="确定删除吗？" @onConfirm="handleTimeDeleteAction(scope)">
                    <svg-icon slot="reference" icon-class="table_icon_delete" class-name="table-action" />
                  </el-popconfirm>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GoodsFilter from '@/components/goodsSection/goodsFilter'
import SecondPointGoodsTable from '@/components/goodsSection/goodsTable'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { goodsDelete, goodsTimeList, goodsTimeDelete } from '@/api/activityManage/marketModuleSet'
import { EventBus } from '@/utils/eventBus'
import { goodsTypeData } from '@/utils/data'

export default {
  name: 'GoodsTime',
  components: {
    GoodsFilter,
    SecondPointGoodsTable,
    PaginationSection
  },
  props: {
    goodsType: {
      type: String,
      default: ''
    },
    stepAction: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      activeName: 'goods',
      setPathData: '',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ]),
    formatSetPathData() {
      const urlData = {
        SecondGoods: '/activityManage/marketModuleSet/secondGoods/goodsSet',
        PointGoods: '/activityManage/marketModuleSet/pointGoods/goodsSet'
      }
      return urlData[this.$route.name]
    },
    formatTimeSetPath() {
      const urlData = {
        SecondGoods: '/activityManage/marketModuleSet/secondGoods/timeSet',
        PointGoods: '/activityManage/marketModuleSet/pointGoods/timeSet'
      }
      return urlData[this.$route.name]
    }
  },
  methods: {
    getGoodsTimeList() {
      goodsTimeList({ activityId: this.activityData.id, timeType: goodsTypeData[this.goodsType] }).then(response => {
        const resultData = response.data
        resultData && resultData.length && (this.tableData = resultData)
      })
    },
    prevStepAction() {
      this.stepAction('prev')
    },
    nextStepAction() {
      this.stepAction('next')
    },
    handleClick(tab, event) {
      // console.log(tab, event)
      switch (this.activeName) {
        case 'goods':
          break
        case 'time':
          !this.tableData.length && this.getGoodsTimeList()
          break
      }
    },
    batchDeleteGoodsAction() {},
    addGoodsAction() {
      navigatePath(this.formatSetPathData)
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
    },
    addTimeAction() {
      navigatePath(this.formatTimeSetPath)
    },
    handleTimeEditAction(scope) {
      this.$store.commit('activity/setGoodsTimeData', scope.row)
      navigatePath(this.formatTimeSetPath + '?id=' + scope.row.id)
    },
    handleTimeDeleteAction(scope) {
      goodsTimeDelete(scope.row.id).then(response => {
        this.$message.success(response.msg)
        this.getGoodsTimeList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .goods-time-container{
    position: relative;
    .step-list{
      position: absolute;
      right: 12px;
      top: 5px;
      z-index: 9;
    }
    @media screen and (max-width: 578px) {
      .step-list {
        position: relative;
        margin-left: 12px;
      }
    }
    .goods-table{
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
