<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="cooperate-record-container">
    <div class="record-header">
      <breadcrumb />
    </div>
    <div class="record-main clearfix">
      <div class="main-header">客户留言列表</div>
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
              prop="name"
              label="客户名称"
              width="180"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="mobile"
              label="联系方式"
              width="180"
              align="center"
              header-align="center"
            />
            <el-table-column
              prop="model"
              label="组织模式"
              width="240"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.cooperation_type_info.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="des"
              label="留言内容"
              min-width="120"
              align="center"
              header-align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="created_at"
              label="留言时间"
              width="200"
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
import { recordList } from '@/api/cooperate/index'

export default {
  name: 'CooperateRecord',
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
    this.getRecordList()
  },
  methods: {
    getRecordList() {
      recordList(this.pageData).then(response => {
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
      this.getRecordList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getRecordList()
    }
  }
}
</script>

<style lang="scss">
  .cooperate-record-container{
    .record-main{
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
