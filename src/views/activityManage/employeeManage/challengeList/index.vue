<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child route-name="ChallengeList">
    <template v-slot:default>
      <div class="challenge-list-container">
        <el-row v-if="false" class="challenge-list-wrap clearfix">
          <div class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
          </div>
        </el-row>
        <div class="challenge-table clearfix">
          <el-button v-if="false" :disabled="!multipleSelection.length" class="delete-button" type="primary" size="mini" icon="el-icon-delete" @click="batchDeleteChallengeAction">批量删除</el-button>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addChallengeAction">新增挑战</el-button>
          <challenge-table
            :challenge-table-data="challengeTableData"
            :multiple-selection="multipleSelection"
            :set-path-data="setPathData"
            @handleSelectionChange="handleSelectionChange"
            @handleDeleteAction="handleDeleteAction"
          />
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import ChallengeTable from './components/challengeTable/index'
import { navigatePath } from '@/router'
import { challengeList, challengeDelete } from '@/api/activityManage/employeeManage'

export default {
  name: 'PkList',
  components: {
    LayoutSubChild,
    ChallengeTable
  },
  data() {
    return {
      setPathData: '/activityManage/employeeManage/challengeList/challengeSet',
      challengeTableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getChallengeList()
  },
  methods: {
    getChallengeList() {
      challengeList(this.activityData.id).then(response => {
        this.challengeTableData = response.data
      })
    },
    prevStepAction() {
      navigatePath('/activityManage/employeeManage/challengeList')
    },
    nextStepAction() {
      console.log('set over')
    },
    batchDeleteChallengeAction() {},
    addChallengeAction() {
      navigatePath(this.setPathData)
    },
    handleSelectionChange(value) {
      this.multipleSelection = value
    },
    handleDeleteAction(scope) {
      challengeDelete({ activityId: this.activityData.id, ...scope.row }).then(response => {
        this.$message.success(response.msg)
        this.getChallengeList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .challenge-list-container{
    .challenge-list-wrap{
      padding: 12px;
      background: #FFF;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      .step-list{
        float: right;
      }
    }
    .challenge-table{
      margin-top: 12px;
      padding: 12px 0;
      background: #FFF;
      .el-button{
        margin: 0 12px 12px;
      }
      .delete-button{
        float: left;
      }
      .add-button{
        float: right;
      }
    }
  }
</style>
