<template>
  <div class="prize-set-container">
    <div class="prize-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px" size="small">
        <div class="group-wrap score-set-wrap" style="width: 80%;min-width: 580px;max-width: 750px">
          <div class="group-title">积分设置(分)：</div>
          <el-form-item class="group-list" label-width="12px">
            <el-form-item v-for="item in scoreTypeList" :key="item.id" :label="`${item.title}：`">
              <el-input-number v-model="form[item.name]" :min="0" />
            </el-form-item>
            <el-form-item label="积分规则：" class="score-rule" prop="ruleCont">
              <el-row type="flex">
                <el-input v-model="form.ruleCont" :rows="5" type="textarea" placeholder="请输入积分规则" />
                <el-button type="primary" plain @click="templateLeadInAction">从规则库导入</el-button>
              </el-row>
            </el-form-item>
          </el-form-item>
        </div>
        <div class="group-wrap red-package-set-wrap" style="width: 600px;">
          <div class="group-title">红包设置(分)：</div>
          <el-form-item class="group-list" label-width="12px">
            <el-form-item v-for="item in rePackageList" :key="item.id" :label="`${item.title}：`">
              <el-row type="flex">
                <el-form-item class="number-item" :prop="item.name + '.min'">
                  <el-input v-model="form[item.name].min" style="width: 160px" placeholder="请输入金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <span class="separate"> - </span>
                <el-form-item class="number-item" :prop="item.name + '.max'">
                  <el-input v-model="form[item.name].max" style="width: 160px" placeholder="请输入金额">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </el-row>
            </el-form-item>
          </el-form-item>
          <el-form-item label="裂变人数：" style="margin-bottom: 30px">
            <el-input-number v-model="form.fissionPerson" :min="0" />
          </el-form-item>
        </div>
        <el-form-item class="action-list">
          <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false">
      <div class="rule-template-dialog">
        <div class="title">积分规则模板库</div>
        <el-form label-width="100px" size="small">
          <el-form-item label-width="0">
            <div class="template-table">
              <pagination-section :page-data="templatePageData" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange">
                <el-table
                  ref="multipleTable"
                  :data="templateTableData"
                  style="width: 100%"
                  max-height="240px"
                  size="small"
                >
                  <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    align="center"
                    header-align="center"
                    :index="indexMethod"
                  />
                  <el-table-column
                    prop="content"
                    label="模板"
                    min-width="120"
                    align="center"
                    header-align="center"
                    show-overflow-tooltip
                  />
                  <el-table-column label="操作" width="150" align="center" header-align="center">
                    <template slot-scope="scope">
                      <el-button type="warning" size="mini" plain @click="templateSelectedAction(scope)">选 择</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </pagination-section>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import PaginationSection from '@/components/PaginationSection'
import { navigatePath } from '@/router'
import { prizeDetail, prizeSet } from '@/api/activityManage/baseSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { validateMoney } from '@/utils/validate'
import { ruleTypeData } from '@/utils/data'

export default {
  name: 'PrizeSet',
  components: {
    PaginationSection
  },
  data() {
    return {
      loading: false,
      scoreTypeList: [
        { id: 1, title: '浏览积分', name: 'lookNum' },
        { id: 2, title: '裂变积分', name: 'fissionNum' },
        { id: 3, title: '分享积分', name: 'shareNum' },
        { id: 4, title: '报名积分', name: 'signNum' },
        { id: 5, title: '售卡积分', name: 'saleNum' },
        { id: 6, title: '下单积分', name: 'orderNum' },
        { id: 7, title: '进直播间积分', name: 'liveEnterNum' },
        { id: 8, title: '直播下单积分', name: 'liveOrderNum' },
        { id: 9, title: '单日有效分享次数', name: 'dayShareNum' }
      ],
      rePackageList: [
        { id: 1, title: '浏览红包金额', name: 'lookMoney' },
        { id: 2, title: '裂变红包金额', name: 'fissionMoney' }
      ],
      form: {
        lookNum: 10,
        fissionNum: 10,
        shareNum: 10,
        signNum: 10,
        saleNum: 10,
        orderNum: 10,
        liveEnterNum: 10,
        liveOrderNum: 10,
        dayShareNum: 10,
        ruleCont: '',
        lookMoney: { min: '0.01', max: '0.05' },
        fissionMoney: { min: '0.01', max: '0.05' },
        fissionPerson: 10
      },
      rules: {
        ruleCont: [{ required: true, message: '请输入积分规则！', trigger: 'blur' }],
        money: [{ required: true, validator: validateMoney, trigger: 'blur' }]
      },
      dialogTemplateVisible: false,
      templatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.getPrizeData()
  },
  methods: {
    getPrizeData() {
      prizeDetail(this.activityData.id).then(response => {
        if (response.data) {
          const {
            point_view, point_fission, point_share, point_sign, point_buy_card, point_order, point_live, point_live_order, share_limit,
            reward_rule, view_redpacket_max, view_redpacket_min, fission_redpacket_max, fission_redpacket_min, fission_redpacket_num
          } = response.data
          this.form = {
            ...response.data,
            lookNum: point_view,
            fissionNum: point_fission,
            shareNum: point_share,
            signNum: point_sign,
            saleNum: point_buy_card,
            orderNum: point_order,
            liveEnterNum: point_live,
            liveOrderNum: point_live_order,
            dayShareNum: share_limit,
            ruleCont: reward_rule,
            lookMoney: { min: view_redpacket_min, max: view_redpacket_max },
            fissionMoney: { min: fission_redpacket_min, max: fission_redpacket_max },
            fissionPerson: fission_redpacket_num
          }
        }
      })
    },
    templateLeadInAction() {
      if (!this.templateTableData.length) {
        this.getRuleTemplateList()
      } else {
        this.dialogTemplateVisible = true
      }
    },
    prevStepAction() {
      navigatePath('/activityManage/baseSet/departmentManage')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const { lookNum, fissionNum, shareNum, signNum, saleNum, orderNum, liveEnterNum, liveOrderNum, dayShareNum, ruleCont, lookMoney, fissionMoney, fissionPerson } = this.form
          prizeSet({
            activity_id: this.activityData.id,
            point_view: lookNum,
            point_fission: fissionNum,
            point_share: shareNum,
            point_sign: signNum,
            point_buy_card: saleNum,
            point_order: orderNum,
            point_live: liveEnterNum,
            point_live_order: liveOrderNum,
            share_limit: dayShareNum,
            view_redpacket_max: lookMoney.max,
            view_redpacket_min: lookMoney.min,
            fission_redpacket_max: fissionMoney.max,
            fission_redpacket_min: fissionMoney.min,
            fission_redpacket_num: fissionPerson,
            reward_rule: ruleCont
          }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            navigatePath('/activityManage/baseSet/marketModuleSelect')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getRuleTemplateList() {
      ruleTemplateList({ ...this.templatePageData, type: ruleTypeData.score }).then(response => {
        const { data, total } = response.data
        this.templatePageData.total = total
        this.templateTableData = data
        this.dialogTemplateVisible = true
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.templatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    templateSelectedAction(scope) {
      this.form.ruleCont = scope.row.content
      // 重置
      this.dialogTemplateVisible = false
      this.templatePageData = {
        index: 1,
        size: 10,
        total: 0
      }
      this.templateTableData = []
    },
    handleSizeChange(value) {
      this.templatePageData.size = value
      this.getRuleTemplateList()
    },
    handleCurrentChange(value) {
      this.templatePageData.index = value
      this.getRuleTemplateList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .prize-set-container{
    .prize-wrap {
      padding: 24px 12px;
      background: #FFF;
      .score-set-wrap{
        &>.el-form-item{
          margin-bottom: 0;
        }
        .score-rule{
          .el-textarea,
          .el-button{
            float: left;
          }
          .el-textarea{
            width: calc(100% - 120px);
            min-width: 140px;
          }
          .el-button{
            height: 32px;
            margin-left: 10px;
          }
        }
      }
      .red-package-set-wrap{
        & .el-form-item{
          margin-bottom: 0;
          .number-item{
            margin-bottom: 18px;
          }
        }
        .separate{
          padding: 0 8px;
        }
      }
      .action-list{
        .el-button:first-child{
          // margin-left: 120px;
          margin-left: 180px;
        }
      }
    }

    .el-dialog{
      min-width:300px;
      .rule-template-dialog{
        padding: 24px 20px 12px;
        .title{
          padding-bottom: 10px;
          font-size:16px;
          font-weight:500;
          color:rgba(51,51,51,1);
          text-align: center;
        }
        .el-form{
          margin-top: 20px;
          .el-form-item{
            &:last-child{
              text-align: center;
            }
          }
        }
      }
    }
  }
</style>
