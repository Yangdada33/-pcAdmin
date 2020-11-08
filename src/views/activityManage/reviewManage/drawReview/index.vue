<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="DrawReview">
    <template v-slot:default>
      <div class="draw-review-container">
        <div class="draw-review-wrap">
          <div class="draw-table clearfix">
            <el-dropdown class="review-button" @command="handleCommand">
              <el-button type="primary" size="mini">
                <svg-icon icon-class="table_action_review" />
                <span>批量审核</span>
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="resolve">通过</el-dropdown-item>
                <el-dropdown-item command="reject">拒绝</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
                    prop="name"
                    label="提现员工"
                    align="center"
                    min-width="120"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column
                    prop="mobile"
                    label="联系方式"
                    width="160"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="money"
                    label="提现金额"
                    width="120"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="time"
                    label="提现时间"
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
                      <el-link v-else-if="scope.row.status === 2" type="danger" :underline="false">已拒绝</el-link>
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
                          <el-dropdown-item @click.native="handleAdd(scope.$index,scope.row)">通过</el-dropdown-item>
                          <el-dropdown-item @click.native="handleDel(scope.$index,scope.row)">拒绝</el-dropdown-item>
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
import {withdrawalList,checkWithdrawal} from '@/api/activityManage/reviewManage'
import { formatTime } from '@/utils'
import { string } from 'clipboard'
export default {
  name: 'DrawReview',
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
      typeIndex:0,
      typeList: [
        { value: 0, label: '待审核' },
        { value: 1, label: '已审核' }
      ],
      tableData: [],
      multipleSelection: [],
      allid:[],
      commstatus:1,
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
      var activityId = window.localStorage.getItem('activityId');
      withdrawalList({
        activity_id:activityId,
        status:this.typeIndex,
        page:this.pageData.index,
        limit: this.pageData.size
      }).then(response => {
        this.tableData= response.data.data
        this.pageData.index=response.data.current_page
        this.pageData.total=response.data.total
        this.loading = false
      })
    },
    handleAdd (index, row) {
      var activityId = window.localStorage.getItem('activityId');
      checkWithdrawal({
        activity_id:activityId,
        ids:[row.id],
        act:1
      }).then(response => {
        this.$message.success('通过')
        this.getTableData()
      })
    },
    handleDel(index, row) {
      var activityId = window.localStorage.getItem('activityId');
      checkWithdrawal({
        activity_id:activityId,
        ids:[row.id],
        act:2
      }).then(response => {
        this.$message.success('拒绝')
        this.getTableData()
      })
    },
    dataFilterType(typeIndex) {
      this.tableData = []
      if(typeIndex === 0){
        this.typeIndex = typeIndex
        this.operationShow = 0
        this.getTableData()
      }

      if(typeIndex === 1){
        this.typeIndex = typeIndex
        this.operationShow = 1
        this.getTableData()
      }
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
      var newArray2 = [];
       for (var i = 0; i < this.multipleSelection.length; i++) {
          var newObject = {};
          newObject.id = this.multipleSelection[i].id;
          newArray2.push(newObject);
      }
      var newArray3 = []
      newArray2.forEach((item,index)=>{
        newArray3.push(item.id)
      })
      this.allid = newArray3
    },
    handleCommand(command) {
       //批量审核
      if(command=='resolve'){
        this.commstatus=1
      }else if(command=='reject'){
        this.commstatus=2
      }
       var activityId = window.localStorage.getItem('activityId');
      checkWithdrawal({
        activity_id:activityId,
        ids:this.allid,
        act:this.commstatus
      }).then(response => {
        this.$message.success('操作成功')
        this.getTableData()
      })
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
  }
}
</script>

<style lang="scss" scoped>
  .draw-review-container {
    .draw-review-wrap {
      .draw-table{
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
