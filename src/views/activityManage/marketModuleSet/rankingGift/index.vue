<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="ranking-gift-container">
        <el-row class="ranking-gift-wrap" type="flex" justify="space-between" align="middle">
          <el-row class="rule-wrap" type="flex" align="middle">
            <div class="rule">
              <span>积分礼品规则：</span>
              <el-popover
                placement="bottom-start"
                title="礼品规则"
                width="600"
                trigger="hover"
                :content="ruleCont"
              >
                <span slot="reference" style="cursor: default">{{ ruleCont }}</span>
              </el-popover>
            </div>
            <el-button type="primary" size="small" @click="templateEditAction">编辑</el-button>
          </el-row>
          <div v-if="false" class="step-list">
            <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
            <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
          </div>
        </el-row>
        <div class="ranking-table clearfix">
          <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
          <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addGiftAction">新增礼品</el-button>
          <pagination-section :page-data="pageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
            <ranking-gift-table
              :gift-table-data="giftTableData"
              :page-data="pageData"
              :set-path-data="setPathData"
              @handleDeleteAction="handleDeleteAction"
            />
          </pagination-section>
        </div>

        <rule-template-dialog
          :rule-type="ruleType"
          :rule-cont="ruleCont"
          template-type="rankingGift"
          :dialog-template-visible="dialogTemplateVisible"
          @setDialogTemplateVisible="setDialogTemplateVisible"
        />
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import PaginationSection from '@/components/PaginationSection'
import RankingGiftTable from './components/giftTable/index'
import RuleTemplateDialog from '@/components/RuleTemplateDialog/index'
import { navigatePath } from '@/router'
import { stepAction } from '../utils/index'
import { ruleData, rankingGiftList, rankingGiftDelete } from '@/api/activityManage/marketModuleSet'

export default {
  name: 'RankingGift',
  components: {
    LayoutSubChild,
    PaginationSection,
    RankingGiftTable,
    RuleTemplateDialog
  },
  data() {
    return {
      routeName: 'RankingGift',
      loading: false,
      ruleType: 'point_goods_rule',
      dialogTemplateVisible: false,
      ruleCont: '',
      setPathData: '/activityManage/marketModuleSet/rankingGift/giftSet',
      pageData: {
        index: 1,
        size: 10,
        total: 0
      },
      giftTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getRuleData()
      this.getGiftList()
    }
  },
  methods: {
    getRuleData() {
      ruleData({ activityId: this.activityData.id, ruleType: this.ruleType }).then(response => {
        this.ruleCont = response.data
      })
    },
    getGiftList() {
      rankingGiftList({ ...this.pageData, activityId: this.activityData.id }).then(response => {
        const { data, total } = response.data
        this.pageData.total = total
        this.giftTableData = data
      })
    },
    templateEditAction() {
      this.dialogTemplateVisible = true
    },
    prevStepAction() {
      stepAction('prev')
    },
    nextStepAction() {
      stepAction('next')
    },
    addGiftAction() {
      navigatePath(this.setPathData)
    },
    handleSizeChange(value) {
      this.pageData.size = value
      this.getGiftList()
    },
    handleCurrentChange(value) {
      this.pageData.index = value
      this.getGiftList()
    },
    setDialogTemplateVisible({ status, ruleCont }) {
      typeof ruleCont === 'string' && (this.ruleCont = ruleCont)
      this.dialogTemplateVisible = status
    },
    handleDeleteAction(scope) {
      rankingGiftDelete({ activityId: this.activityData.id, giftId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getGiftList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .ranking-gift-container{
    .ranking-gift-wrap{
      padding: 12px;
      background: #FFF;
      font-size:14px;
      font-weight:400;
      color:rgba(0,0,0,1);
      .rule-wrap{
        width: calc(100% - 240px);
        min-width: 240px;
        .rule{
          @include ellipsis;
          max-width: calc(100% - 80px);
          &+.el-button{
            margin-left: 12px;
          }
        }
      }
      .step-list{
        float: right;
      }
    }
    .ranking-table{
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
