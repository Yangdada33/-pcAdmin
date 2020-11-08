<template>
  <div class="challenge-table-container">
    <el-table
      ref="multipleTable"
      :data="challengeTableData"
      style="width: 100%;"
      size="small"
    >
      <!-- @selection-change="handleSelectionChange" -->
      <el-table-column
        v-if="false"
        type="selection"
        width="60"
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
        prop="type"
        label="挑战类型"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatPkType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="period_name"
        label="挑战阶段"
        align="center"
        header-align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="time"
        label="挑战时间"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }} - {{ scope.row.end_time }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="projectList"
        label="挑战项目"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ formatProjectList(scope.row.levels) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="挑战级别"
        align="center"
        header-align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.levels" :key="index">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pay_money"
        label="挑战本金"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.levels" :key="index">{{ item.pay_money }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="reward_money"
        label="挑战奖金"
        width="100"
        align="center"
        header-align="center"
      >
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.levels" :key="index">{{ item.reward_money }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" header-align="center">
        <template slot-scope="scope">
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
</template>

<script>
import { navigatePath } from '@/router'

export default {
  name: 'ChallengeTable',
  props: {
    challengeTableData: {
      type: Array,
      default: function() {
        return []
      }
    },
    multipleSelection: {
      type: Array,
      default: function() {
        return []
      }
    },
    setPathData: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    formatPkType(value) {
      const typeList = [
        { id: 1, name: '品牌' },
        { id: 2, name: '门店' },
        { id: 10, name: '个人' }
      ]
      const typeData = typeList.find(item => item.id === value)
      return typeData ? typeData.name : ''
    },
    formatProjectList(value) {
      if (value && value[0] && value[0].content && value[0].content.length) {
        return value[0].content.map(item => item.title).join('、')
      } else {
        return ''
      }
    },
    handleSelectionChange(value) {
      this.$emit('handleSelectionChange', value)
    },
    handleEditAction(scope) {
      if (this.setPathData) {
        this.$store.commit('activity/setChallengeData', scope.row)
        navigatePath(this.setPathData + '?id=' + scope.row.id)
      } else {
        console.log('设置页面编辑!')
      }
    },
    handleDeleteAction(scope) {
      this.$emit('handleDeleteAction', scope)
    }
  }
}
</script>

<style lang="scss" scoped>
  .challenge-table-container{
    .el-table{
      border-top: 1px solid #EBEEF5;
      .table-action{
        margin: 0 8px;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
</style>
