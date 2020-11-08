<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="sponsor-list-container">
    <data-section left-side-bg="#2786DF" title="主办方列表">
      <template v-slot:default>
        <div class="sponsor-list-wrap">
          <sponsor-search :placeholder="placeholder" @searchAction="SearchAction" @timeTypeList="timeTypeList" />
          <div class="sponsor-table clearfix">
            <el-button class="export-button" type="primary" size="mini" @click="dataExport">
              <svg-icon icon-class="export" />
              <span class="export">导出</span>
            </el-button>
            <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
              <template v-slot:default>
                <el-table
                  ref="multipleTable"
                  :data="sponsorTableData"
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
                    prop="name"
                    label="名称"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="mobile"
                    label="联系方式"
                    width="150"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="account"
                    label="已发布次数"
                    width="150"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="left_times"
                    label="剩余次数"
                    width="150"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="end_time"
                    label="到期时间"
                    width="150"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column label="操作" width="200" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-link type="primary" @click="previewDataAction(scope)">查看总览 &gt;</el-link>
                      <el-link type="primary" @click="previewActivityAction(scope)">查看活动 &gt;</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </pagination-section>
          </div>
        </div>
      </template>
    </data-section>
  </div>
</template>

<script>
import DataSection from '@/components/DataSection'
import SponsorSearch from '@/components/SponsorSearch'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { sponsorList, hosterExport } from '@/api/sponsorList'

export default {
  name: 'SponsorList',
  components: {
    DataSection,
    SponsorSearch,
    PaginationSection
  },
  data() {
    return {
      searchData: {
        startTime: '',
        endTime: '',
        keyword: ''
      },
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      sponsorTableData: [],
      placeholder: '请输入主办方名称'
    }
  },
  created() {
    this.getSponsorList()
  },
  methods: {
    getSponsorList() {
      sponsorList({ ...this.pageData, ...this.searchData }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.sponsorTableData = data
      })
    },
    timeTypeList(value) {
      const { timeList: [startTime, endTime], keyword } = value
      this.searchData = { startTime, endTime, keyword }
      this.getSponsorList()
    },
    SearchAction(searchData) {
      const { timeList: [startTime, endTime], keyword } = searchData
      this.searchData = { startTime, endTime, keyword }
      this.pageData.index = 1
      this.getSponsorList()
    },
    indexMethod(indexIndex) {
      const { index, size } = this.pageData
      return (index - 1) * size + (indexIndex + 1)
    },
    previewDataAction(scope) {
      this.$store.commit('sponsor/SET_SPONSOR_DATA', scope.row)
      navigatePath('/sponsorList/previewData?id=' + scope.row.id + '&name=' + scope.row.name)
    },
    previewActivityAction(scope) {
      this.$store.commit('sponsor/SET_SPONSOR_DATA', scope.row)
      navigatePath('/sponsorList/previewActivity?id=' + scope.row.id + '&name=' + scope.row.name)
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getSponsorList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getSponsorList()
    },
    // 导出
    dataExport() {
      hosterExport({
        keyword: this.searchData.keyword,
        start_time: this.searchData.startTime,
        end_time: this.searchData.endTime
      }).then(res => {
        const dataPath = res.data.path
        const dataPathExport = 'https://' + dataPath.slice(13, 27) + dataPath.slice(34)
        this.download(dataPathExport)
      })
    },
    download(data) {
      const aLink = document.createElement('a')
      aLink.href = data
      aLink.click()
    }

  }
}
</script>

<style lang="scss" scoped>
  .sponsor-list-container{
    .sponsor-list-wrap{
      .sponsor-table{
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
