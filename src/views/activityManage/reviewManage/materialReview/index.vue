<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="MaterialReview">
    <template v-slot:default>
      <div class="material-review-container">
        <div class="material-review-wrap">
          <div class="material-table clearfix">
            <el-button class="collect-button" type="primary" size="mini" @click="allSelect">
              <svg-icon icon-class="table_action_collect" />
              <span>批量收藏</span>
            </el-button>
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
                    prop="user_info"
                    label="申请用户"
                    min-width="160"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <el-row type="flex" justify="left" align="middle">
                        <el-avatar style="margin-left: 20px" :src="scope.row.user_info.avatar" />
                        <span style="margin-left: 12px">{{ scope.row.user_info.name }}</span>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="content"
                    label="素材文字"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <div class="title">{{ scope.row.title }}</div>
                      <div class="content">{{ scope.row.content }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="resource_ids"
                    label="素材图片和视频"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <el-row type="flex" justify="center">
                        <template v-for="item in scope.row.resource_ids">
                          <el-popover
                            v-if="validateImageSuffix(item.url)"
                            :key="item.id"
                            placement="right-end"
                            width="360"
                            trigger="hover"
                          >
                            <el-image fit="cover" :src="item.url" />
                            <el-image slot="reference" class="wechat-image" fit="cover" :src="item.url" />
                          </el-popover>
                          <el-popover
                            v-if="validateVideoSuffix(item.url)"
                            :key="item.id"
                            placement="right-end"
                            height="400"
                            trigger="hover"
                          >
                            <video :src="item.url" controls style="height: 400px;" />
                            <video slot="reference" class="wechat-video" :src="item.url" />
                          </el-popover>
                        </template>
                      </el-row>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="created_at"
                    label="提交时间"
                    width="160"
                    align="center"
                    header-align="center"
                  />
                  <el-table-column
                    prop="updated_at"
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
                      <el-link v-else-if="scope.row.status === 2" type="danger" :underline="false">已拒绝</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="collect"
                    label="收藏状态"
                    width="100"
                    align="center"
                    header-align="center"
                  >
                    <template slot-scope="scope">
                      <el-link v-if="scope.row.collect === 0" type="primary" :underline="false">未收藏</el-link>
                      <el-link v-else-if="scope.row.collect === 1" type="success" :underline="false">已收藏</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-dropdown v-if="!scope.row.reviewStatus" v-show="show">
                        <el-button type="primary" plain size="mini" style="margin-bottom: 0">
                          <span>审核</span>
                          <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleAdd(scope.$index,scope.row)">通过</el-dropdown-item>
                          <el-dropdown-item @click.native="handleDel(scope.$index,scope.row)">拒绝</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                      <el-dropdown v-if="!scope.row.reviewStatus">
                        <el-button type="primary" plain size="mini" style="margin-bottom: 0">
                          <span>收藏</span>
                          <i class="el-icon-arrow-down el-icon--right" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="isCollect(scope.$index,scope.row)">是</el-dropdown-item>
                          <el-dropdown-item @click.native="noCollect(scope.$index,scope.row)">否</el-dropdown-item>
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
import { examineList,checkRawMaterial,collectRawMaterial } from '@/api/activityManage/reviewManage'
import { formatTime } from '@/utils'
import { imageSuffixList, videoSuffixList } from '@/utils/data'
import { validateSuffix } from '@/utils/validate'

export default {
  name: 'MaterialReview',
  components: {
    LayoutSubChild,
    DataFilter,
    PaginationSection
  },
  data() {
    return {
      allid:[],
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
      commstatus:1,
      tableData: [],
      multipleSelection: [],
      show:true,
      loading:false
    }
  },
  created(){
    this.getTableData()
  },
  methods: {
    validateImageSuffix(url) {
      return validateSuffix(url, imageSuffixList)
    },
    validateVideoSuffix(url) {
      return validateSuffix(url, videoSuffixList)
    },
    dateFormat:function(row,column){
          var date = row[column.property]; 
          if (date == undefined) { 
            return ""; 
          } 
          var moment = require("moment");
          return moment(date).format("YYYY-MM-DD HH:mm:ss"); 
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getTableData()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getTableData()
    },
    getTableData(){
      this.loading = true
      //列表
      var activityId = window.localStorage.getItem('activityId');
      examineList({
        activity_id:activityId,
        status:this.typeIndex,
        page:this.pageData.index,
        limit: this.pageData.size,
        source:'users'
      }).then(response => {
        this.tableData= response.data.data

        this.tableData.forEach((val,index)=>{
          //待审核时 审核时间不显示
          if(val.status == 0){
           this.tableData[index].updated_at = null
          }
        })

        this.pageData.index=response.data.current_page
        this.pageData.total=response.data.total
        this.loading = false
      })
    },
    handleAdd (index, row) {
      var activityId = window.localStorage.getItem('activityId');
      checkRawMaterial({
        activity_id:activityId,
        ids:[row.id],
        action:1
      }).then(response => {
        this.$message.success('通过')
        this.getTableData()
      })
    },
    handleDel(index, row) {
      var activityId = window.localStorage.getItem('activityId');
      checkRawMaterial({
        activity_id:activityId,
        ids:[row.id],
        action:2
      }).then(response => {
        this.$message.success('未通过')
        this.getTableData()
      })
    },
    dataFilterType(typeIndex) {

      if(typeIndex === 0){
        this.typeIndex = typeIndex
        this.show = true
        this.getTableData()
      }

      if(typeIndex === 1){
        this.typeIndex = typeIndex
        this.show = false
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
      // for()
       var activityId = window.localStorage.getItem('activityId');
      checkRawMaterial({
        activity_id:activityId,
        ids:this.allid,
        action:this.commstatus
      }).then(response => {
        this.$message.success('操作成功')
        this.getTableData()
      })
    },
    // 收藏-> 是
    isCollect (index, row) {
      var activityId = window.localStorage.getItem('activityId');
      collectRawMaterial({
        activity_id:activityId,
        ids:[row.id],
        action:1
      }).then(response => {
        this.$message.success('收藏')
        this.getTableData()
      })
    },
    // 收藏-> 否
    noCollect (index, row) {
      var activityId = window.localStorage.getItem('activityId');
      collectRawMaterial({
        activity_id:activityId,
        ids:[row.id],
        action:0
      }).then(response => {
        this.$message.success('取消收藏')
        this.getTableData()
      })
    },
    //批量收藏
    allSelect(){
       var activityId = window.localStorage.getItem('activityId');
      collectRawMaterial({
        activity_id:activityId,
        ids:this.allid,
        action:1
      }).then(response => {
        this.$message.success('收藏')
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .material-review-container {
    .material-review-wrap {
      .material-table{
        padding: 12px 0;
        background: #FFF;
        .wechat-image,
        .wechat-video{
          display:block;
          width: 50px;
          height: 50px;
          margin: 2px;
        }
        .el-button{
          margin: 2px 0 12px 12px;
          span{
            padding-left: 4px;
          }
        }
        .collect-button{
          float: left;
          margin-left: 12px;
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
          .collect_button{
            margin-left: 12px;
          }
          .el-link{
            cursor: default;
          }
        }
      }
    }
  }
</style>
