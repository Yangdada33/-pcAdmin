<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="recharge-list-container">
    <div class="recharge-header">
      <breadcrumb />
    </div>
    <div class="recharge-main">
      <div class="main-header">流量充值明细</div>
      <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
        <template v-slot:default>
          <el-table
            :data="tableData"
            style="width: 100%"
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
              prop="recharge_sn"
              label="充值编号"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="activity_info.name"
              label="所属活动"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="liveTime"
              label="直播时间"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.live_info">{{ scope.row.live_info.start_time + '-' + scope.row.live_info.end_time }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="amount"
              label="预存流量"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="useFlow"
              label="实际使用"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="balance"
              label="结算"
              width="120"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="created_at"
              label="充值日期"
              width="160"
              align="center"
              header-align="center"
            />
          </el-table>
        </template>
      </pagination-section>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
import PaginationSection from '@/components/PaginationSection'
import { rechargeList } from '@/api/liveFlow/index'
import { rechargeTypeData } from '@/utils/data'

export default {
  name: 'RechargeList',
  components: {
    Breadcrumb,
    PaginationSection
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
  created() {
    this.getRechargeList()
  },
  methods: {
    getRechargeList() {
      rechargeList({ ...this.pageData, type: rechargeTypeData.live }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.tableData = data
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getRechargeList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getRechargeList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .recharge-list-container{
    .recharge-main{
      background: #FFF;
      .main-header{
        padding: 16px 12px;
        font-size:16px;
        font-weight:500;
        color:rgba(51,51,51,1);
      }
      .el-table{
        border-top: 1px solid #EBEEF5;
      }
    }
  }
</style>
