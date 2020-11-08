<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="live-list-container">
        <div class="live-list-wrap">
          <div v-if="false" class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
          <div class="live-table clearfix">
            <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
            <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addLiveAction">新增直播</el-button>
            <el-table
              ref="multipleTable"
              :data="tableData"
              style="width: 100%;"
              size="small"
            >
              <!-- @selection-change="handleSelectionChange" -->
              <el-table-column
                v-if="false"
                type="selection"
                width="50"
                align="center"
                header-align="center"
              />
              <el-table-column
                type="index"
                label="序号"
                width="60"
                align="center"
                header-align="center"
              />
              <el-table-column
                prop="name"
                label="直播主題"
                min-width="120"
                align="center"
                header-align="center"
                show-overflow-tooltip
              />
              <el-table-column
                prop="liveTime"
                label="直播时间"
                min-width="160"
                align="center"
                header-align="center"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.start_time }} - {{ scope.row.end_time }}
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="100"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <el-link v-if="scope.row.live_status === 0" :underline="false" type="primary" style="cursor: default">未开始</el-link>
                  <el-link v-else-if="scope.row.live_status === 1" :underline="false" type="warning" style="cursor: default">直播中</el-link>
                  <el-link v-else-if="scope.row.live_status === 2" :underline="false" type="info" style="cursor: default">已结束</el-link>
                </template>
              </el-table-column>
              <el-table-column
                prop="entry"
                label="直播入口"
                width="100"
                align="center"
                header-align="center"
              >
                <template slot-scope="scope">
                  <svg-icon v-if="scope.row.live_status === 1" icon-class="table_live_active" class="live-entry active" @click="navigateLiveHomeAction(scope)" />
                  <svg-icon v-else icon-class="table_live_default" class="live-entry" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" align="center" header-align="center">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="复制" placement="top">
                    <el-popconfirm title="确定复制吗？" @onConfirm="handleCopyAction(scope)">
                      <svg-icon slot="reference" icon-class="table_icon_copy" class-name="table-action" />
                    </el-popconfirm>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                    <svg-icon icon-class="table_icon_edit" class-name="table-action" @click="handleEditAction(scope)" />
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                    <el-popconfirm title="确定删除吗？" @onConfirm="handleDeleteAction(scope)">
                      <svg-icon slot="reference" icon-class="table_icon_delete" class-name="table-action" />
                    </el-popconfirm>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import { navigatePath } from '@/router'
import { liveList, liveDelete, liveCopy } from '@/api/activityManage/liveSet'

export default {
  name: 'LiveList',
  components: {
    LayoutSubChild
  },
  data() {
    return {
      routeName: 'LiveList',
      setPathData: '/activityManage/liveSet/liveList/liveSet',
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getLiveList()
    }
  },
  methods: {
    getLiveList() {
      liveList(this.activityData.id).then(response => {
        this.tableData = response.data
      })
    },
    prevStepAction() {
      navigatePath('/activityManage/liveSet/liveGoods')
    },
    nextStepAction() {
      navigatePath('/activityManage/employeeManage/stepSet')
    },
    addLiveAction() {
      navigatePath(this.setPathData)
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    navigateLiveHomeAction(scope) {
      navigatePath('/activityManage/liveSet/liveList/liveHome?id=' + scope.row.id)
    },
    handleCopyAction(scope) {
      liveCopy({ activityId: this.activityData.id, liveId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getLiveList()
      })
    },
    handleEditAction(scope) {
      this.$store.commit('live/SET_LIVE_DATA', scope.row)
      navigatePath(this.setPathData + '?id=' + scope.row.id)
    },
    handleDeleteAction(scope) {
      liveDelete({ activityId: this.activityData.id, liveId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getLiveList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .live-list-container{
    .live-list-wrap{
      &>div{
        padding: 12px 0;
        background: #FFF;
      }
      .step-list{
        text-align: right;
        .el-button:last-child{
          margin-right: 12px;
        }
      }
      .live-table{
        margin-top: 12px;
        .el-button{
          margin: 0 12px 12px;
        }
        .delete-button{
          float: left;
        }
        .add-button{
          float: right;
        }
        .el-table{
          border-top: 1px solid #EBEEF5;
          .live-entry{
            font-size: 20px;
            &.active{
              cursor: pointer;
            }
          }
          .table-action{
            margin: 0 8px;
            font-size: 18px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
