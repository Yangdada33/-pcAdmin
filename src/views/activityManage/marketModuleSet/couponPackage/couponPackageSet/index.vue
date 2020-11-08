<template>
  <div class="coupon-package-set-container">
    <div class="coupon-package-form-wrap">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
        <el-form-item label="所属品牌：" prop="brand">
          <el-select v-model="form.brand" style="width: 240px;" filterable placeholder="请选择所属品牌">
            <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="券额面值：" prop="equalPrice">
          <el-input v-model="form.equalPrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
          <div class="form-tip">注：面值为整数值</div>
        </el-form-item>
        <el-form-item label="限用金额：" prop="limitPrice">
          <el-input v-model="form.limitPrice" style="width: 160px;" placeholder="请输入金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input-number v-model="form.sort" :min="0" />
          <div class="form-tip">注：以10、20、30等为基础数值，数值越大排序越靠前，中间可插，比如12，就介于10、20之间</div>
        </el-form-item>
        <el-form-item label="使用条件：" prop="useCondition">
          <el-input v-model="form.useCondition" :rows="5" type="textarea" style="width: 480px;" placeholder="请输入使用条件" />
        </el-form-item>
        <el-form-item class="action-list">
          <el-button type="default" @click="formBackAction">返 回</el-button>
          <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="couponTableData.length" class="coupon-package-table-wrap">
      <coupon-package-table :coupon-table-data="couponTableData" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CouponPackageTable from '../components/couponPackageTable/index'
import { navigatePath } from '@/router'
import { brandList, couponDetail, couponPackageCouponSet } from '@/api/activityManage/marketModuleSet'
import { validateMoneyWithZero, validateIntegerMoney } from '@/utils/validate'

export default {
  name: 'CouponPackageSet',
  components: {
    CouponPackageTable
  },
  props: {
    couponId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      brandList: [],
      form: {
        brand: '',
        equalPrice: '',
        limitPrice: '',
        sort: 0,
        useCondition: ''
      },
      rules: {
        brand: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        equalPrice: [{ required: true, validator: validateIntegerMoney, trigger: 'blur' }],
        limitPrice: [{ validator: validateMoneyWithZero, trigger: 'blur' }],
        useCondition: [{ required: true, message: '请输入使用条件', trigger: 'blur' }]
      },
      couponTableData: []
    }
  },
  computed: {
    ...mapGetters([
      'activityData'
    ])
  },
  created() {
    this.couponId && this.getCouponData()
    this.getBrandList()
  },
  methods: {
    getCouponData() {
      couponDetail({ activityId: this.activityData.id, couponId: this.couponId }).then(response => {
        const { cat_id, price, price_limit, sort, des } = response.data
        this.form = {
          id: this.couponId,
          brand: cat_id,
          equalPrice: price,
          limitPrice: price_limit,
          sort,
          useCondition: des
        }
      })
    },
    getBrandList() {
      brandList(this.activityData.id).then(response => {
        this.brandList = response.data
      })
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          couponPackageCouponSet({ activityId: this.activityData.id, ...this.form }).then(response => {
            this.$message.success(response.msg)
            this.loading = false
            this.formBackAction()
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .coupon-package-set-container{
    .coupon-package-form-wrap{
      padding: 24px 12px;
      background: #FFF;
      .action-list{
        .el-button:first-child{
          margin-left: 160px;
        }
      }
    }
    .coupon-package-table-wrap{
      margin: 12px 0 60px;
      background: #FFF;
    }
  }
</style>
