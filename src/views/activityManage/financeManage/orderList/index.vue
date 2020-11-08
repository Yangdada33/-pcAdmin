<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div class="title">交易明细</div>
    <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        :data="tableData"
        style="width: 100%"
        size="small"
      >
        <el-table-column
          prop="activity_info.name"
          label="所属活动"
          min-width="160"
          align="center"
          header-align="center"
          show-overflow-tooltip
        />
        <!-- <el-table-column
          prop=""
          label="交易单号"
          width="160"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop=""
          label="所属阶段"
          width="160"
          align="center"
          header-align="center"
        /> -->
        <el-table-column
          prop="type"
          label="收支项目"
          min-width="160"
          align="center"
          header-align="center"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="showName == true"
          prop="user_info.name"
          label="收支对象姓名"
          width="160"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="amount"
          label="变动金额"
          width="160"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="created_at"
          label="交易时间"
          width="260"
          align="center"
          header-align="center"
        />

      </el-table>
    </pagination-section>

  </div>
</template>

<script>
import PaginationSection from '@/components/PaginationSection'
import { financeDetail } from '@/api/activityManage/withdrawDeposit'
export default {
  name: 'OrderList',
  components: {
    PaginationSection
  },
  data() {
    return {
      tableData: [],
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showName: true
    }
  },
  computed: {},
  created() {
    this.getTableList()
  },
  methods: {
    handleSizeChange(value) {
      this.pageData.size = value
      this.getTableList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getTableList()
    },
    getTableList() {
      this.loading = true
      var activityId = window.localStorage.getItem('activityId')
      financeDetail({
        activity_id: activityId,
        page: this.pageData.index,
        limit: this.pageData.size
      }).then(res => {
        // console.log('res:', res)
        this.tableData = res.data.data

        this.pageData.index = res.data.current_page
        this.pageData.total = res.data.total

        this.loading = false

        this.tableData.forEach(value => {
          if (value.user_info == null) {
            this.showName = false
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .title{
    height: 60px;
    line-height: 60px;
    color: #333333;
    background-color: #fff;
    border-bottom: 1px solid #EBEEF5;
    padding-left: 36px;
    font-size: 24px;
  }
</style>

<style>
  .pagination-wrap[data-v-d3092aa4]{
    background-color: #fff;
  }
</style>

