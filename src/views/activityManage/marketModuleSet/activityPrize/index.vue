<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="activity-prize-container">
        <div class="activity-prize-wrap">
          <div class="activity-prize-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="small">
              <el-form-item label="抽奖消耗积分：" prop="scoreNum">
                <el-input-number v-model="form.scoreNum" :min="0" />
              </el-form-item>
              <el-form-item label="单日抽奖上限：" prop="prizeNum">
                <el-input-number v-model="form.prizeNum" :min="0" />
              </el-form-item>
              <el-form-item label="中奖总概率：" prop="probability">
                <el-input v-model.number="form.probability" style="width: 120px;" placeholder="请输入中奖概率">
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              <el-form-item label="抽奖规则：" prop="ruleCont" class="activity-prize-rule clearfix">
                <el-row type="flex">
                  <el-input v-model="form.ruleCont" :rows="4" type="textarea" style="width: 400px" placeholder="请输入抽奖规则" />
                  <el-button type="primary" plain @click="ruleTemplateDialogAction">规则模板</el-button>
                </el-row>
              </el-form-item>
              <el-form-item class="action-list">
                <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
                <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="activity-prize-table clearfix">
            <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
            <el-button class="preview-button" type="primary" size="mini" icon="el-icon-view" @click="previewPrizeAction">查看中奖概率</el-button>
            <el-button :disabled="prizeTableData.length >= 7" class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addGiftAction">新增奖品</el-button>
            <activity-prize-table
              :prize-table-data="prizeTableData"
              :set-path-data="setPathData"
              @handleDeleteAction="handleDeleteAction"
            />
          </div>
        </div>

        <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" width="40%">
          <div class="coupon-template-dialog">
            <div class="title">抽奖规则</div>
            <el-form label-width="90px" size="small">
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

        <el-dialog title="奖品中奖概率" :visible.sync="dialogPreviewVisible" width="40%">
          <el-table class="previewTableData" :data="previewTableData" size="small" border>
            <el-table-column type="index" label="序号" width="60" align="center" header-align="center" />
            <el-table-column property="name" label="奖品名称" align="center" header-align="center" show-overflow-tooltip />
            <el-table-column property="probability" label="中奖概率" width="120px" align="center" header-align="center" />
          </el-table>
        </el-dialog>
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import PaginationSection from '@/components/PaginationSection'
import ActivityPrizeTable from './components/prizeTable/index'
import { navigatePath } from '@/router'
import { stepAction } from '../utils/index'
import { exchangeAndPrizeGiftList, exchangeAndPrizeGiftDelete, prizeData, prizeSet, prizePropPreview } from '@/api/activityManage/marketModuleSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { ruleTypeData } from '@/utils/data'

export default {
  name: 'ActivityPrize',
  components: {
    LayoutSubChild,
    PaginationSection,
    ActivityPrizeTable
  },
  data() {
    return {
      routeName: 'ActivityPrize',
      loading: false,
      form: {
        scoreNum: 0,
        prizeNum: 0,
        probability: 0,
        ruleCont: ''
      },
      rules: {
        probability: [
          { required: true, message: '请输入中奖概率', trigger: 'blur' },
          { type: 'number', max: 100, message: '请输入100以内整数值', trigger: 'blur' }
        ],
        ruleCont: [{ required: true, message: '请输入领取规则', trigger: 'blur' }]
      },
      dialogTemplateVisible: false,
      templatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: [],
      setPathData: '/activityManage/marketModuleSet/activityPrize/activityPrizeSet',
      prizeTableData: [],
      dialogPreviewVisible: false,
      previewTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    if (this.$route.name === this.routeName) {
      this.getPrizeData()
      this.getGiftList()
    }
  },
  methods: {
    getPrizeData() {
      prizeData(this.activityData.id).then(response => {
        const reaultData = response.data
        if (reaultData) {
          const { id, num, times_limit, probability, des } = reaultData
          this.form = {
            id,
            scoreNum: num,
            prizeNum: times_limit,
            probability: probability * 100,
            ruleCont: des
          }
        }
      })
    },
    getGiftList() {
      exchangeAndPrizeGiftList({ activityId: this.activityData.id, giftType: 1 }).then(response => {
        const { data } = response.data
        const storageSum = data.reduce((total, item) => (total + item.storage), 0)
        this.prizeTableData = data.map(item => ({ ...item, probability: (item.storage / storageSum * this.form.probability).toFixed(2) + '%' }))
      })
    },
    previewPrizeAction() {
      prizePropPreview(this.activityData.id).then(response => {
        this.previewTableData = response.data
        this.dialogPreviewVisible = true
      })
    },
    addGiftAction() {
      navigatePath(this.setPathData)
    },
    async ruleTemplateDialogAction() {
      if (!this.templateTableData.length) {
        await this.getRuleTemplateList()
      }
      this.dialogTemplateVisible = true
    },
    prevStepAction() {
      stepAction('prev')
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          prizeSet({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.form.id = response.data.id
            // stepAction('next')
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    indexMethod(indexIndex) {
      const { index, size } = this.templatePageData
      return (index - 1) * size + (indexIndex + 1)
    },
    getRuleTemplateList() {
      return new Promise((resolve, reject) => {
        ruleTemplateList({ ...this.templatePageData, type: ruleTypeData.prize }).then(response => {
          const { data, total } = response.data
          this.templatePageData.total = total
          this.templateTableData = data
          resolve()
        }).catch(() => {
          reject()
        })
      })
    },
    handleSizeChange(value) {
      this.templatePageData.size = value
      this.getRuleTemplateList()
    },
    handleCurrentChange(value) {
      this.templatePageData.index = value
      this.getRuleTemplateList()
    },
    templateSelectedAction(scope) {
      this.form.ruleCont = scope.row.content
      this.dialogTemplateVisible = false
    },
    handleDeleteAction(scope) {
      exchangeAndPrizeGiftDelete({ activityId: this.activityData.id, giftId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getGiftList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .activity-prize-container{
    .activity-prize-wrap{
      .activity-prize-form{
        padding: 24px 12px;
        background: #FFF;
        .activity-prize-rule{
          .el-textarea,
          .el-button{
            float: left;
          }
          .el-textarea{
            width: calc(100% - 90px);
            min-width: 140px;
          }
          .el-button{
            height: 32px;
            margin: 4px 0 0 10px;
          }
        }
        .action-list{
          .el-button:first-child{
            // margin-left: 140px;
            margin-left: 180px;
          }
        }
      }
      .activity-prize-table{
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

    .el-dialog{
      min-width:300px;
      .coupon-template-dialog{
        padding: 24px 20px;
        .title{
          font-size:18px;
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
      .previewTableData{
        width: 90%;
        margin: 20px auto;
      }
    }
  }
</style>

<style lang="scss">
  .activity-prize-container{
    .el-dialog{
      .el-dialog__header{
        padding: 15px;
      }
    }
  }
</style>
