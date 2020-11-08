<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="ChallengeReview">
    <template v-slot:default>
      <div class="challenge-review-container">
        <div class="challenge-review-wrap">
          <div class="challenge-table clearfix">
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
                >
                  <el-table-column
                    type="selection"
                    width="50"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="admin_cat_name"
                    label="挑战对象"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="mobile"
                    label="联系方式"
                    width="120"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="type"
                    label="挑战类型"
                    width="120"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="period_name"
                    label="挑战阶段"
                    width="120"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="name"
                    label="挑战级别"
                    width="120"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="pay_money"
                    label="挑战本金"
                    width="100"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="reward_money"
                    label="挑战奖金"
                    width="100"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="time"
                    label="发起时间"
                    width="160"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="check_time"
                    label="审核时间"
                    width="160"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="status"
                    label="审核状态"
                    width="100"
                    align="center"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      <el-link v-if="scope.row.status === 0" type="primary" :underline="false">待审核</el-link>
                      <el-link v-else-if="scope.row.status === 1" type="success" :underline="false">已通过</el-link>
                      <el-link v-else-if="scope.row.status === 2" type="danger" :underline="false">不通过</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="operationShow === 0" label="操作" width="120" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-dropdown v-if="!scope.row.reviewStatus">
                        <el-button type="primary" plain size="mini" style="margin-bottom: 0">
                          <span>审核</span>
                          <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item class="status" @click.native="resolve(scope.$index,scope.row)">通过</el-dropdown-item>
                          <el-dropdown-item class="status" @click.native="reject(scope.$index,scope.row)">不通过</el-dropdown-item>
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

<script>
/* eslint-disable */
import LayoutSubChild from '@/layout/indexSubChild'
import DataFilter from '@/components/DataFilter'
import PaginationSection from '@/components/PaginationSection'
import {challengeList,checkChallenge} from '@/api/activityManage/reviewManage'
export default {
  name: 'ChallengeReview',
  components: {
    LayoutSubChild,
    DataFilter,
    PaginationSection
  },
  data() {
    return {
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      typeList: [
        { value: 0, label: '待审核' },
        { value: 1, label: '已审核' },
      ],
      tableData: [],
      multipleSelection: [],
      commandStutas:1,
      typeIndex:0,
      operationShow:0,
      loading:false
    }
  },
  created(){
    this.getTableData()
  },
  methods: {
    getTableData(){
      this.loading = true
      //列表
      let activityId = window.localStorage.getItem('activityId');
      challengeList({
        activity_id:activityId,
        page:this.pageData.index,
        is_check:this.typeIndex,
        limit: this.pageData.size
      }).then(response => {
        this.tableData = response.data.list

        this.tableData.forEach((val,index)=>{
          if(val.status == 0){
           this.tableData[index].check_time = null
          }
        })
        this.pageData.index=response.data.current_page
        this.pageData.total=response.data.total
        this.loading = false
      })
    },
    //通过
    resolve (index, row) {
      let activityId = window.localStorage.getItem('activityId');
      checkChallenge({
        activity_id:activityId,
        id:[row.id],
        action:1
      }).then(response => {
        this.$message.success('通过')
        this.getTableData()
      })
    },
    //不通过
    reject(index, row) {
      let activityId = window.localStorage.getItem('activityId');
      checkChallenge({
        activity_id:activityId,
        id:[row.id],
        action:2
      }).then(response => {
        this.$message.error('不通过')
        this.getTableData()
      })
    },
    // 显示数据状态
    dataFilterType(typeIndex) {
       this.tableData = []
      if(typeIndex === 0){
        this.typeIndex =  typeIndex
        this.operationShow = 0
        this.getTableData()
      }

      if(typeIndex === 1){
        this.typeIndex = typeIndex
        this.operationShow = 1
        this.getTableData()
      }
    },
    //每页条数
    handleSizeChange(value) {
      this.pageData.size = value
      this.getTableData()
    },
    //当前页
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getTableData()
    }
  },
  mounted(){}
}
</script>

<style lang="scss" scoped>
  .challenge-review-container {
    .challenge-review-wrap {
      .challenge-table{
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

  .status{
    font-size: 12px;
    text-align: center;
  }
</style>
