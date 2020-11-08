<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="note-order-container">
    <div class="note-order-wrap">
      <sponsor-search @searchAction="SearchAction" @timeTypeList="timeTypeList" />
      <div class="note-table clearfix">
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
                prop="created_at"
                label="日期"
                width="160"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="des"
                label="收支项目"
                min-width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="type"
                label="收支类型"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="price"
                label="变动金额"
                width="120"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="mobile"
                label="手机号码"
                width="120"
                align="center"
                header-align="center"
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
  name: 'NoteOrder',
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
        export_id:1010,
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
        export_id:1010,
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
  .note-order-container{
    .note-order-wrap{
      .note-table{
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
