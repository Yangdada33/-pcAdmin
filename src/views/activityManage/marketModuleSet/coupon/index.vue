<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="coupon-container">
        <div class="coupon-wrap">
          <el-row class="coupon-rule-wrap" type="flex" justify="space-between" align="middle">
            <el-row class="rule-wrap" type="flex" align="middle">
              <div class="rule">
                <span>现金券规则：</span>
                <el-popover
                  placement="bottom-start"
                  title="现金券规则"
                  width="200"
                  trigger="hover"
                  :content="ruleCont"
                >
                  <span slot="reference">{{ ruleCont }}</span>
                </el-popover>
              </div>
              <el-button type="primary" size="mini" @click="templateEditAction">编辑</el-button>
            </el-row>
            <div v-if="false" class="step-list">
              <el-button type="primary" size="mini" @click="prevStepAction">上一步</el-button>
              <el-button type="primary" size="mini" @click="nextStepAction">下一步</el-button>
            </div>
          </el-row>
          <div class="coupon-table clearfix">
            <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
            <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addCouponAction">新增现金券</el-button>
            <coupon-table :coupon-table-data="couponTableData" :set-path-data="setPathData" @handleDeleteAction="handleDeleteAction" />
          </div>
        </div>

        <rule-template-dialog
          :rule-type="ruleType"
          :rule-cont="ruleCont"
          :dialog-template-visible="dialogTemplateVisible"
          template-type="coupon"
          @setDialogTemplateVisible="setDialogTemplateVisible"
        />
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import CouponTable from './components/couponTable/index'
import RuleTemplateDialog from '@/components/RuleTemplateDialog/index'
import { navigatePath } from '@/router'
import { stepAction } from '../utils/index'
import { couponList, couponDelete, ruleData } from '@/api/activityManage/marketModuleSet'

export default {
  name: 'Coupon',
  components: {
    LayoutSubChild,
    CouponTable,
    RuleTemplateDialog
  },
  data() {
    return {
      routeName: 'Coupon',
      loading: false,
      ruleType: 'voucher_rule',
      dialogTemplateVisible: false,
      ruleCont: '',
      setPathData: '/activityManage/marketModuleSet/coupon/couponSet',
      couponTableData: []
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
      this.getCouponList()
    }
  },
  methods: {
    getRuleData() {
      ruleData({ activityId: this.activityData.id, ruleType: this.ruleType }).then(response => {
        this.ruleCont = response.data
      })
    },
    getCouponList() {
      couponList(this.activityData.id).then(response => {
        this.couponTableData = response.data
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
    addCouponAction() {
      navigatePath(this.setPathData)
    },
    setDialogTemplateVisible({ status, ruleCont }) {
      typeof ruleCont === 'string' && (this.ruleCont = ruleCont)
      this.dialogTemplateVisible = status
    },
    handleDeleteAction(scope) {
      couponDelete({ activityId: this.activityData.id, couponId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getCouponList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";

  .coupon-container{
    .coupon-rule-wrap{
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
    }
    .coupon-table{
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
