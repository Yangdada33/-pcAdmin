<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="pk-list-container">
        <el-row v-if="false" class="pk-list-wrap clearfix">
          <div class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
        </el-row>
        <div class="pk-table clearfix">
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addPkAction">新增PK</el-button>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <template v-slot:default>
              <pk-table
                :pk-table-data="pkTableData"
                :page-data="pageData"
                :set-path-data="setPathData"
                @handleDeleteAction="handleDeleteAction"
              />
            </template>
          </pagination-section>
        </div>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import PkTable from './components/pkTable/index'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { pkList, pkDelete } from '@/api/activityManage/employeeManage'

export default {
  name: 'PkList',
  components: {
    LayoutSubChild,
    PkTable,
    PaginationSection
  },
  data() {
    return {
      routeName: 'PkList',
      setPathData: '/activityManage/employeeManage/pkList/pkSet',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      pkTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getPkList()
    }
  },
  methods: {
    getPkList() {
      pkList({ ...this.pageData, activityId: this.activityData.id }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.pkTableData = data
      })
    },
    prevStepAction() {
      navigatePath('/activityManage/employeeManage/taskList')
    },
    nextStepAction() {
      navigatePath('/activityManage/employeeManage/challengeList')
    },
    addPkAction() {
      navigatePath(this.setPathData)
    },
    handleDeleteAction(scope) {
      pkDelete({ activityId: this.activityData.id, pkId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getPkList()
      })
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getPkList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getPkList()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .pk-list-container{
    .pk-list-wrap{
      padding: 12px;
      background: #FFF;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      .step-list{
        float: right;
      }
    }
    .pk-table{
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
