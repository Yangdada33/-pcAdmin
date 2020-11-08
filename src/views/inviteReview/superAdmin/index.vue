<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <breadcrumb-header>
    <template v-slot:default>
      <layout-sub-child route-name="SuperAdmin">
        <template v-slot:default>
          <div class="super-admin-container">
            <div class="super-admin-wrap">
              <div class="admin-table clearfix">
                <data-filter class="data-filter" :type-list="typeList" :type-index="typeIndex" :search-time-type="1" @dataFilterType="dataFilterType" />
                <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
                  <template v-slot:default>
                    <el-table
                      ref="multipleTable"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      :data="tableData"
                      style="width: 100%;"
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
                        prop="true_name"
                        label="姓名"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="user_info.avatar"
                        label="头像"
                        width="120"
                        align="center"
                        header-align="center"
                      >
                        <template slot-scope="scope">
                          <el-avatar :src="scope.row.user_info.avatar" />
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="created_at"
                        label="申请时间"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="updated_at"
                        label="审核时间"
                        align="center"
                        header-align="center"
                        show-overflow-tooltip
                      />
                      <el-table-column
                        prop="status"
                        label="审核状态"
                        align="center"
                        header-align="center"
                      >
                        <template slot-scope="scope">
                          <el-link v-if="scope.row.status === 0" type="primary" :underline="false">待审核</el-link>
                          <el-link v-else-if="scope.row.status === 1" type="success" :underline="false">已通过</el-link>
                          <el-link v-else-if="scope.row.status === 2" type="danger" :underline="false">不通过</el-link>
                        </template>
                      </el-table-column>
                      <el-table-column v-if="operationShow === 0" label="操作" width="150" align="center" header-align="center">
                        <template slot-scope="scope">
                          <el-dropdown v-if="!scope.row.reviewStatus">
                            <el-button type="primary" plain size="mini" style="margin-bottom: 0">
                              <span>审核</span>
                              <i class="el-icon-arrow-down el-icon--right" />
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item @click.native="resolve(scope.$index,scope.row)">通过</el-dropdown-item>
                              <el-dropdown-item @click.native="reject(scope.$index,scope.row)">拒绝</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </pagination-section>
              </div>
            </div>
          </div>
        </template>
      </layout-sub-child>
    </template>
  </breadcrumb-header>
</template>

<script>
import BreadcrumbHeader from '@/components/BreadcrumbHeader'
import LayoutSubChild from '@/layout/indexSubChild'
import DataFilter from '@/components/DataFilter'
import PaginationSection from '@/components/PaginationSection'
import { getApplyUserManager, doApplyUserManager } from '@/api/inviteReview/index'
import { mapGetters } from 'vuex'

export default {
  name: 'SuperAdmin',
  components: {
    BreadcrumbHeader,
    LayoutSubChild,
    DataFilter,
    PaginationSection
  },
  data() {
    return {
      typeList: [
        { value: 0, label: '待审核' },
        { value: 1, label: '已审核' }
      ],
      tableData: [],
      multipleSelection: [],
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      typeIndex: 0,
      activityId: [],
      operationShow: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    this.getTableData()
    console.log('==>', this.userInfo)
  },
  methods: {
    // 列表
    getTableData() {
      this.loading = true
      getApplyUserManager({
        role_id: 7,
        status: this.typeIndex,
        page: this.pageData.index,
        limit: this.pageData.size,
        hoster_id: this.userInfo.hoster_id
      }).then(res => {
        this.tableData = res.data.data
        this.pageData.total = res.data.total
        this.pageData.index = res.data.current_page

        this.tableData.forEach((val, index) => {
          if (val.status === 0) {
            this.tableData[index].updated_at = null
          }
        })

        const newArr = []
        res.data.data.forEach(val => {
          newArr.push(val.activity_id)
        })

        this.activityId = newArr

        this.loading = false
      })
    },
    // 查看状态
    dataFilterType(typeIndex) {
      this.tableData = []
      if (typeIndex === 0) {
        this.typeIndex = typeIndex
        this.operationShow = 0
        this.getTableData()
      }

      if (typeIndex === 1) {
        this.typeIndex = typeIndex
        this.operationShow = 1
        this.getTableData()
      }
    },
    // 通过
    resolve(index, row) {
      doApplyUserManager({
        activity_id: this.activityId[index],
        id: row.id,
        status: 1
      }).then(response => {
        this.$message.success('通过')
        this.getTableData()
      })
    },
    // 不通过
    reject(index, row) {
      doApplyUserManager({
        activity_id: this.activityId[index],
        id: row.id,
        status: 2
      }).then(response => {
        this.$message.success('不通过')
        this.getTableData()
      })
    },
    // 每页条数
    handleSizeChange(value) {
      this.pageData.size = value
      this.getTableData()
    },
    // 当前页
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getTableData()
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    }
  }
}
</script>

<style lang="scss" scoped>
  .super-admin-container {
    .super-admin-wrap {
      .admin-table{
        padding: 12px 0;
        background: #FFF;
        .el-button{
          margin: 2px 0 12px 12px;
          span{
            padding-left: 4px;
          }
        }
        .review-button{
          float: left;
        }
        .data-filter{
          float: right;
          margin-right: 8px;
          margin-bottom: 11px;
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .el-icon-arrow-down {
            margin-left: 2px;
            font-size: 12px;
          }
          .el-link{
            cursor: default;
          }
        }
      }
    }
  }
</style>
