<template>
  <div class="person-add-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item ref="brand" label="所属品牌：" prop="brand">
        <el-select v-model="form.brand" filterable placeholder="请选择所属品牌" @change="handleSelectChange('brand')">
          <el-option v-for="item in brandList" :key="item.id" :label="item.name" :value="item.id.toString()" />
        </el-select>
      </el-form-item>
      <el-form-item ref="shop" label="所属门店：" prop="shop">
        <el-select v-model="form.shop" :disabled="Boolean(!form.brand)" filterable placeholder="请选择所属门店" @change="handleSelectChange('shop')">
          <el-option v-for="item in shopList" :key="item.id" :label="item.name" :value="item.id.toString()" />
        </el-select>
      </el-form-item>
      <el-form-item label="员工姓名：" prop="name">
        <el-input v-model="form.name" style="width: 200px;" placeholder="请输入员工姓名" />
      </el-form-item>
      <el-form-item ref="position" label="员工职位：" prop="position">
        <el-select v-model="form.position" placeholder="请选择员工职位" @change="handleSelectChange('position')">
          <el-option v-for="(item,index) in positionList" :key="index" :label="item" :value="index.toString()" />
        </el-select>
      </el-form-item>
      <el-form-item label="员工电话：" prop="mobile">
        <el-input v-model="form.mobile" style="width: 200px;" placeholder="请输入员工电话" />
      </el-form-item>
      <el-form-item class="action-list">
        <el-button type="default" @click="formBackAction">返 回</el-button>
        <el-button :loading="loading" type="primary" @click="formSaveAction">保 存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navigatePath } from '@/router'
import { brandShopList, employeeAdd, employeeEdit } from '@/api/activityManage/baseSet'
import { positionList } from '@/utils/data'

export default {
  name: 'PersonSet',
  props: {
    activityId: {
      type: String,
      default: ''
    },
    employeeId: {
      type: String,
      default: ''
    },
    brandId: {
      type: String,
      default: ''
    },
    shopId: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    mobile: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      brandList: [],
      shopList: [],
      positionList,
      form: {
        brand: '',
        shop: '',
        name: '',
        position: '',
        mobile: ''
      },
      rules: {
        brand: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
        shop: [{ required: true, message: '请选择门店', trigger: 'blur' }],
        name: [{ required: true, message: '请输入员工名称', trigger: 'blur' }],
        position: [{ required: true, message: '请选择员工职位', trigger: 'blur' }],
        mobile: [{ required: true, message: '请选择员工电话', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getBrandShopList()
  },
  methods: {
    initEmployeeData() {
      if (this.employeeId) {
        this.form = {
          ...this.form,
          id: this.employeeId,
          brand: this.brandId || '',
          shop: this.shopId || '',
          position: this.position || '',
          name: this.name || '',
          mobile: this.mobile || ''
        }
      } else {
        this.form = {
          ...this.form,
          brand: this.brandId || '',
          shop: this.shopId || ''
        }
      }
      this.brandId && (this.shopList = this.brandList.find(item => item.id === Number(this.brandId)).cat_list)
    },
    async getBrandShopList() {
      const response = await brandShopList(this.activityId)
      if (response.data && response.data.length) {
        this.brandList = response.data
      }
      this.initEmployeeData()
    },
    handleSelectChange(type) {
      this.$refs[type].clearValidate()
      if (type === 'brand') {
        this.shopList = this.brandList.find(item => item.id === Number(this.form[type])).cat_list
        this.form.shop = ''
      }
    },
    formBackAction() {
      navigatePath({
        backStatus: true
      })
    },
    formSaveAction() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const requestName = !this.employeeId ? employeeAdd : employeeEdit
          this.loading = true
          requestName({ ...this.form, activityId: this.activityId }).then(response => {
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
  .person-add-container{
    padding:36px 12px;
    background: #FFF;
    .action-list{
      .el-button:first-child{
        margin-left: 40px;
      }
    }
  }
</style>
