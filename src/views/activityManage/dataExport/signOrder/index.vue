<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="sign-order-container">
    <div class="sign-order-wrap">
      <sponsor-search @searchAction="SearchAction" @timeTypeList="timeTypeList" />
      <div class="order-table clearfix">
        <el-button class="export-button" type="primary" size="mini" @click="dataExport">
          <svg-icon icon-class="export" />
          <span class="export">导出</span>
        </el-button>
        <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
          <template v-slot:default>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%"
              size="small"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                width="50"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="activity_name"
                label="所属活动"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="order_sn"
                label="订单号"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="pay_time"
                label="签单时间"
                width="160"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="client_name"
                label="业主姓名"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="location"
                label="业主地址"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="client_phone"
                label="业主电话"
                width="120"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="price"
                label="收款金额"
                width="100"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="card_num"
                label="购现金券(张)"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="live_num"
                label="直播订单(单)"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="service_admin_name"
                label="签单人姓名"
                min-width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="service_admin_cat_name"
                label="签单人所属商户"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="top_admin_name"
                label="带单人姓名"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="admin_cat_name"
                label="带单人所属商户"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
            </el-table>
          </template>
        </pagination-section>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import SponsorSearch from '@/components/SponsorSearch'
import PaginationSection from '@/components/PaginationSection'
import { tableDataList,dataExport } from '@/api/activityManage/dataExport'

export default {
  name: 'SignOrder',
  components: {
    SponsorSearch,
    PaginationSection
  },
  data() {
    return {
      tableData: [],
      searchData: {
        startTime: '',
        endTime: '',
        keyword: ''
      },
      multipleSelection: [],
      pageData:{ 
        index: 1,
        size: 10,
        total: 0 
      }
    }
  },
  created(){
    this.getTableList()
  },
  methods: {
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    dataExport(){
      var activityId = window.localStorage.getItem('activityId');
      dataExport({
        search:this.searchData.keyword,
        startTime:this.searchData.startTime,
        endTime:this.searchData.endTime,
        export_id:1006,
        activityId:activityId
        //  activity_id, start_time, end_time,search,expotr_id
      }).then(response => {
        const dataPath = response.data.path
        const dataPathExport = 'https://' + dataPath.slice(13, 27) + dataPath.slice(34)
        this.download(dataPathExport)
      })
    },
     download(data) {
      const aLink = document.createElement('a')
      aLink.href = data
      aLink.click()
    },
    timeTypeList(value) {
      const { timeList: [startTime, endTime], keyword } = value
      this.searchData = { startTime, endTime, keyword }
      this.getTableList()
    },
    SearchAction(searchData) {
      const { timeList: [startTime, endTime], keyword } = searchData
      this.searchData = { startTime, endTime, keyword }
  
      this.getTableList()
    },
    getTableList() {
      var activityId = window.localStorage.getItem('activityId');

      tableDataList({
        search:this.searchData.keyword,
        startTime:this.searchData.startTime,
        endTime:this.searchData.endTime,
        export_id:1006,
        activityId:activityId,
        page:this.pageData.index,
        limit:this.pageData.size
        //  activity_id, start_time, end_time,search,expotr_id
      }).then(response => {
        const data = response.data
        this.pageData.total = data.total
        this.tableData = data.list
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getTableList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getTableList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .sign-order-container{
    .sign-order-wrap{
      .order-table{
        margin-top: 12px;
        padding: 12px 0;
        background: #FFF;
        .export-button{
          float: right;
          margin: 0 12px 12px 0;
          .export{
            margin-left: 4px;
          }
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .el-link{
            margin: 0 8px;
          }
        }
      }
    }
  }
</style>
