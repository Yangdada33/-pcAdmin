<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <layout-sub-child :route-name="routeName">
    <template v-slot:default>
      <div class="coupon-package-container">
        <div class="coupon-package-wrap">
          <div class="coupon-package-form">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
              <el-form-item label="购券价格：" prop="price">
                <el-input v-model="form.price" style="width: 150px" placeholder="请输入">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="购券佣金：" prop="redPackage">
                <el-input v-model="form.redPackage" style="width: 150px" placeholder="请输入">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="库存：" prop="storage">
                <el-input-number v-model="form.storage" :min="0" />
              </el-form-item>
              <el-form-item label="活动规则：" prop="ruleCont" class="coupon-package-rule clearfix">
                <el-row type="flex">
                  <el-input v-model="form.ruleCont" :rows="4" type="textarea" style="width: 400px" placeholder="请输入活动规则" />
                  <el-button type="primary" plain @click="ruleTemplateDialogAction">规则模板</el-button>
                </el-row>
              </el-form-item>
              <el-form-item class="action-list">
                <el-button v-if="false" type="default" @click="prevStepAction">上一步</el-button>
                <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="coupon-package-table clearfix">
            <el-button v-if="false" class="delete-button" type="primary" size="mini" icon="el-icon-delete">批量删除</el-button>
            <el-button class="add-button" type="primary" size="mini" icon="el-icon-plus" @click="addCouponAction">新增现金券</el-button>
            <coupon-package-table :coupon-table-data="couponTableData" :set-path-data="setPathData" @handleDeleteAction="handleDeleteAction" />
          </div>
        </div>

        <el-dialog :visible.sync="dialogTemplateVisible" :show-close="false" width="40%">
          <div class="coupon-template-dialog">
            <div class="title">现金券活动规则</div>
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
      </div>
    </template>
  </layout-sub-child>
</template>

<script>
import { mapGetters } from 'vuex'
import LayoutSubChild from '@/layout/indexSubChild'
import PaginationSection from '@/components/PaginationSection'
import CouponPackageTable from './components/couponPackageTable/index'
import { navigatePath } from '@/router'
import { stepAction } from '../utils/index'
import { couponList, couponDelete, couponPackageData, couponPackageSet } from '@/api/activityManage/marketModuleSet'
import { ruleTemplateList } from '@/api/platformSet/ruleTemplate'
import { validateMoney } from '@/utils/validate'
import { ruleTypeData } from '@/utils/data'

export default {
  name: 'CouponPackage',
  components: {
    LayoutSubChild,
    PaginationSection,
    CouponPackageTable
  },
  data() {
    return {
      routeName: 'CouponPackage',
      loading: false,
      form: {
        price: '',
        redPackage: '',
        storage: 0,
        ruleCont: ''
      },
      rules: {
        price: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        redPackage: [{ required: true, validator: validateMoney, trigger: 'blur' }],
        ruleCont: [{ required: true, message: '请输入活动规则', trigger: 'blur' }]
      },
      dialogTemplateVisible: false,
      templatePageData: {
        index: 1,
        size: 10,
        total: 0
      },
      templateTableData: [],
      setPathData: '/activityManage/marketModuleSet/couponPackage/couponPackageSet',
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
      this.getCouponPackageData()
      this.getCouponList()
    }
  },
  methods: {
    getCouponPackageData() {
      couponPackageData(this.activityData.id).then(response => {
        const { id, price, commission, storage, voucher_rule } = response.data
        this.form = {
          id,
          price,
          redPackage: commission,
          storage,
          ruleCont: voucher_rule
        }
      })
    },
    getCouponList() {
      couponList(this.activityData.id, 1).then(response => {
        this.couponTableData = response.data
      })
    },
    addCouponAction() {
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
          couponPackageSet({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
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
        ruleTemplateList({ ...this.templatePageData, type: ruleTypeData.couponPackage }).then(response => {
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
      couponDelete({ activityId: this.activityData.id, couponId: scope.row.id }).then(response => {
        this.$message.success(response.msg)
        this.getCouponList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon-package-container{
    .coupon-package-wrap{
      .coupon-package-form{
        padding: 24px 12px;
        background: #FFF;
        .coupon-package-rule{
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
            margin-left: 120px;
          }
        }
      }
      .coupon-package-table{
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
    }
  }
</style>
